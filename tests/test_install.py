import importlib.util
import json
from pathlib import Path
import tempfile
import unittest

spec = importlib.util.spec_from_file_location('installer', Path(__file__).parents[1] / 'install.py')
installer = importlib.util.module_from_spec(spec)
spec.loader.exec_module(installer)


class InstallTests(unittest.TestCase):
    def test_preserves_registry_backs_up_and_disables_old_mod(self):
        with tempfile.TemporaryDirectory() as tmp:
            p = Path(tmp)
            (p / 'prefs.js').touch()
            before = {'other': {'enabled': True}, installer.ORIGINAL: {'enabled': True}}
            (p / 'zen-themes.json').write_text(json.dumps(before))
            backup = installer.install(p)
            after = json.loads((p / 'zen-themes.json').read_text())
            self.assertEqual(after['other'], before['other'])
            self.assertFalse(after[installer.ORIGINAL]['enabled'])
            self.assertEqual(json.loads((backup / 'zen-themes.json').read_text()), before)
            self.assertEqual(len(after), 3)

    def test_locked_profile_unchanged(self):
        with tempfile.TemporaryDirectory() as tmp:
            p = Path(tmp)
            (p / 'prefs.js').touch()
            (p / 'parent.lock').touch()
            with self.assertRaises(ValueError): installer.install(p)
            self.assertFalse((p / 'zen-themes.json').exists())

    def test_existing_autoconfig_not_overwritten(self):
        with tempfile.TemporaryDirectory() as tmp:
            p = Path(tmp) / 'profile'
            p.mkdir()
            (p / 'prefs.js').touch()
            app = Path(tmp) / 'resources'
            prefs = app / 'defaults' / 'pref'
            prefs.mkdir(parents=True)
            (app / 'application.ini').touch()
            (prefs / 'existing.js').write_text('pref("general.config.filename", "existing.cfg");')
            with self.assertRaises(ValueError): installer.install(p, app)
            self.assertFalse((p / 'zen-themes.json').exists())
