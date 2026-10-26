# Verification — 2026-10-26

Tested on the locally installed Zen **1.23.4b / Firefox 158.0.1**, using a separate disposable profile. No personal browser profile was edited.

Verified through browser-chrome Marionette execution:

- CSS parses and computes a 5px indicator at `left: 0px`, active color `rgb(0, 71, 255)`.
- Double-click on a selected pinned tab calls the native unload implementation. After completion: `pinned=true`, `isConnected=true`, `pending=true`, `selected=false`.
- Unloaded pin computes `rgb(255, 255, 255)` for its indicator.
- Repeated with the `zen-essential` attribute: pin retained and tab unloaded.
- Disabling the double-click preference leaves the selected tab loaded.
- Removing the stylesheet (equivalent to the mod's CSS no longer applying) leaves the selected tab loaded on double-click.
- Local installer registers the mod. Zen initializes defaults and loads CSS after triggering the normal mods rebuild. Zen startup uses cached `zen-themes.css`, so the README requires one OFF/ON toggle after installation.
- Installer unit tests pass: registry preservation, backup, old indicator disable, locked profile refusal, existing AutoConfig refusal.

Not verified: actual physical mouse events, all third-party theme combinations, full Essential creation through its UI, Glance/Split View edge cases, Windows/Linux, and AutoConfig at app startup. The companion was loaded into browser chrome directly for behavior tests; the app bundle of the user's Zen was not modified.

The companion uses a Zen internal API which can change in future releases. It checks for that API and otherwise does nothing. No production browsing data was used or published.
