#!/usr/bin/env python3
"""Install a local Zen Mod while Zen is fully closed. No third-party dependencies."""
import argparse
from datetime import datetime
import json
from pathlib import Path
import shutil
import tempfile

ROOT = Path(__file__).resolve().parent
ORIGINAL = 'd8b79d4a-6cba-4495-9ff6-d6d30b0e94fe'


def install(profile, app_resources=None):
    profile = Path(profile).expanduser().resolve()
    if not (profile / 'prefs.js').is_file():
        raise ValueError('Not a Zen profile: prefs.js is missing.')
    if any((profile / name).exists() or (profile / name).is_symlink()
           for name in ('parent.lock', 'lock')):
        raise ValueError('Profile lock exists. Quit Zen completely before installing.')
    # Unix Firefox keeps .parentlock on disk after quitting; check its OS lock.
    if (profile / '.parentlock').exists():
        import fcntl
        with (profile / '.parentlock').open('r+') as lock:
            try:
                fcntl.lockf(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
            except BlockingIOError:
                raise ValueError('Zen is running. Quit it completely before installing.')
    registry = profile / 'zen-themes.json' 
    mods = json.loads(registry.read_text()) if registry.exists() else {}
    if not isinstance(mods, dict):
        raise ValueError('Invalid zen-themes.json; nothing was changed.')
    meta = json.loads((ROOT / 'theme.json').read_text())
    folder = profile / 'chrome' / 'zen-themes' / meta['id']
    resources = Path(app_resources).expanduser().resolve() if app_resources else None
    if resources:
        if not (resources / 'application.ini').is_file():
            raise ValueError('Expected Zen Resources folder containing application.ini.')
        pref_dir = resources / 'defaults' / 'pref'
        for path in pref_dir.glob('*.js'):
            if 'general.config.filename' in path.read_text(errors='replace') and path.name != 'zen-tab-accent.js':
                raise ValueError('Existing AutoConfig found. Use your existing JS loader; refusing to overwrite it.')
    backup = profile / 'zen-tab-accent-backups' / datetime.now().strftime('%Y%m%d-%H%M%S-%f')
    backup.mkdir(parents=True)
    if registry.exists(): shutil.copy2(registry, backup / registry.name)
    if folder.exists(): shutil.copytree(folder, backup / 'mod')
    companion = profile / 'chrome' / 'zen-tab-accent.uc.js'
    if companion.exists(): shutil.copy2(companion, backup / companion.name)
    folder.mkdir(parents=True, exist_ok=True)
    for name in ('chrome.css', 'preferences.json', 'theme.json', 'README.md'):
        shutil.copy2(ROOT / name, folder / name)
    # Local metadata: Zen reads assets from the UUID folder, not these URLs.
    meta.update(enabled=True, preferences=(folder / 'preferences.json').as_uri())
    mods[meta['id']] = meta
    if ORIGINAL in mods: mods[ORIGINAL]['enabled'] = False
    if resources:
        pref_dir.mkdir(parents=True, exist_ok=True)
        for source, destination in (
            (ROOT / 'companion' / 'zen-tab-accent.cfg', resources / 'zen-tab-accent.cfg'),
            (ROOT / 'companion' / 'zen-tab-accent.js', pref_dir / 'zen-tab-accent.js'),
            (ROOT / 'companion' / 'zen-tab-accent.uc.js', companion),
        ):
            if destination.exists(): shutil.copy2(destination, backup / destination.name)
            shutil.copy2(source, destination)
    with tempfile.NamedTemporaryFile(mode='w', dir=profile, delete=False) as output:
        json.dump(mods, output, indent=2)
        output.write('\n')
    Path(output.name).replace(registry)
    return backup


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--profile', required=True, help='Profile Folder from about:support')
    parser.add_argument('--app-resources', help='Optional: install double-click loader into Zen Resources directory')
    args = parser.parse_args()
    try:
        backup = install(args.profile, args.app_resources)
        print(f'Installed Zen Tab Accent Plus. Backup: {backup}')
        print('Start Zen → Settings → Zen Mods → toggle Zen Tab Accent Plus OFF then ON once to rebuild CSS/defaults. Disable conflicting custom userChrome indicators if present.')
        if not args.app_resources: print('CSS only. Double-click requires the companion loader; see README.md.')
    except (ValueError, OSError, json.JSONDecodeError) as error:
        parser.exit(1, f'Installation failed: {error}\n')
