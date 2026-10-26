# Verification — 2026-10-26

## Version 1.2.0

Verified in disposable Zen 1.23.4b using computed styles:

- Two loaded pinned tabs both show the accent while a separate regular tab is selected.
- Pending pinned tab has no indicator with hide-unloaded enabled; Essential has no unloaded indicator.
- Enabling hide-loaded hides both pin accents; disabling hide-unloaded restores a white indicator only on the pending pin.
- Enabling hide-active hides the selected regular tab indicator independently of the pin options.
- The existing zoom-hide rule is now controlled by hide-zoom. Double-click companion is unchanged from 1.1.0.

## Version 1.1.0

Verified in a disposable Zen 1.23.4b profile with the updated stylesheet and companion:

- Active and unloaded-pin indicators: box-shadow none, border 0px, outline none.
- Unloaded pin: white indicator. Unloaded Essential: no indicator.
- Double-click handler calls the native unload function only for a pinned, non-Essential tab; Essential and regular tab events do not call it.
- Native pinned-tab unload leaves the tab connected, pinned and pending.
- Address-bar zoom badge computes display none; no zoom setting is changed.

## Initial version 1.0.0 (historical)

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

Follow-up installation verification: AutoConfig startup was tested successfully in the disposable profile after installing the loader into Zen.app. The loader uses the built-in Services global and loadSubScriptWithOptions with allowUnsafeURL restricted to the fixed local companion file. The cleanup function is present after a fresh browser launch, confirming the companion loaded automatically.

Not verified: actual physical mouse events, all third-party theme combinations, full Essential creation through its UI, Glance/Split View edge cases, and Windows/Linux. Initial behavior tests loaded the companion directly; the follow-up above verifies startup loading.

The companion uses a Zen internal API which can change in future releases. It checks for that API and otherwise does nothing. No production browsing data was used or published.
