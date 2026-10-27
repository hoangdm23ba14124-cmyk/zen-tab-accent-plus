# Verification — 2026-10-26

## Version 1.6.0 — 2026-10-27

- In the SuperPins grid, the selected pin, background pin and changed-URL pin favicon centers differ from their cell centers by less than 0.01px horizontally and 0px vertically.
- Opened a real Glance and set audio-playing state: both 14px badges sit above the favicon, inside the same pin, and do not overlap. Inspected the resulting screenshot.
- Reproduced the orange right-hand stripe using a real userContextId=2 tab: native .tab-context-line, rgb(255,159,0), 3px wide. Preserved it as requested.
- Reordered double-click filtering so computed styles are read only for eligible pinned tabs.
- Reloaded the companion 25 times: exactly one mod double-click listener and one mod unload listener remain. Cleanup now removes its previous unload listener too.
- Six alternating enabled/disabled samples with 21 blank tabs are documented in PERFORMANCE.md; this is not a long-duration leak test or a real-website workload benchmark.

## Version 1.5.0 — 2026-10-27

- Opened a real about:blank Glance through ZenGlanceManager on a pinned tab in the SuperPins grid.
- Checked Glance tab, stack, background, content and favicon bounds: all remain inside the parent pin, including a narrow 49px pin and zen-pinned-changed state. Badge is 14px and favicon 12px.
- Parent audio badge and Glance badge are both 14px and do not overlap. Nested Glance has no inherited accent pseudo-element.
- Switching to a regular tab and back preserves the attached Glance. Visually inspected an actual browser screenshot.
- Profile isolation within one window is not implemented; no profile/container data migration was performed.

## Version 1.4.0 — 2026-10-27

Verified in a fresh Zen 1.23.4b profile with the user's enabled mod CSS and SuperPins preferences, without browsing data:

- Reproduced the separate audio button next to the icon in the SuperPins grid.
- Native audio overlay is 14×14px, positioned inside its own pin; separate audio button is hidden.
- With three pins and zen-pinned-changed enabled, the icon stack remains the positioning anchor and badge stays inside its tab.
- Clicking the native overlay sets both the tab's muted attribute and linkedBrowser.audioMuted.
- A real Essential created with addToEssentials keeps its filled background while another tab is selected. Setting pending removes that fill.
- Both new preferences restore native styling when disabled.
- Visually inspected a browser screenshot with an inactive loaded Essential, selected pin and audio badge in light color scheme. Dark-scheme computed fill was checked as well.
- Pending-state styling was exercised directly; live media playback and automatic memory-pressure unloading were not exercised.

## Version 1.3.0

Verified on macOS in disposable Zen 1.23.4b with the actual AutoConfig startup loader:

- With auto-fullscreen enabled (default), a fresh launch reports window.fullScreen true and the one-time startup handler completed.
- With auto-fullscreen disabled, a fresh launch reports window.fullScreen false and the startup handler completed without entering fullscreen.
- Installer regression tests pass. Existing pin/double-click behavior is unchanged.
- Fullscreen is requested once per normal browser window, after a 700ms restoration delay. Popup windows without a toolbar are excluded by the handler; popup behavior was not separately exercised.

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
