# Performance check — 1.6.0, 2026-10-27

The mod has a small measured cost in this test, not zero cost. The native orange container stripe was preserved. No extensions, container isolation, page loading, memory-unloading policy or browser security settings were changed by this update.

## Method

Zen 1.23.4b, macOS, separate headless profile with the user's other enabled mod CSS and SuperPins preferences. 21 about:blank tabs remained open in the same process. No personal browsing data was copied.

Six samples in OFF, ON, ON, OFF, OFF, ON order. OFF disables the mod's stylesheet and removes the companion's listeners; ON enables CSS and loads the companion. Other mods remain enabled. Each sample waits one second after the CSS update and asks Firefox's memory reporter to minimize memory usage before reading parent-process resident and allocated-heap bytes.

The tab-switch microbenchmark changes between two already-open blank tabs 60 times, forcing tab geometry calculation after each switch. It measures synchronous tab-selection/layout work, not complete presented frames or website responsiveness. Samples use the same process, so caches, warm-up and normal browser activity can affect results.

## Results (median of three samples per state)

| Metric | Mod off | Mod on | Difference |
| --- | ---: | ---: | ---: |
| Parent-process resident RAM | 526.08 MiB | 526.58 MiB | +0.50 MiB |
| Parent-process allocated heap | 175.63 MiB | 175.88 MiB | +0.25 MiB |
| 60 synchronous tab switches | 44.61 ms | 51.19 ms | +6.58 ms total, about 0.11 ms/switch |

Raw samples: [performance-results.json](performance-results.json).

These differences are observations from a small sample, not an exact measurement of memory owned exclusively by the mod. Resident memory covers only the parent process, not the sum of content/GPU processes. This does not establish long-term memory stability, battery impact, performance with hundreds of tabs, or responsiveness on heavy websites.

## Changes and resource use

The following measurements and implementation notes describe version 1.6.0. Version 1.12.1 also includes per-tab layout persistence, a context-menu entry, preference observers, and a filtered MutationObserver with requestAnimationFrame batching. Its complete resource usage has not been benchmarked here.

- Centering, badges and highlights are CSS-only. No per-tab JavaScript loops, MutationObservers or recurring polling were added.
- The companion uses one delegated double-click listener, one unload cleanup listener, and a one-shot fullscreen timer on startup. The WeakSet tracks only in-progress unload calls.
- Double-clicks outside eligible pins now return before requesting computed styles.
- Cleanup removes both the double-click listener and its own unload listener. After 25 consecutive script reloads, the measured mod listener count remains exactly one of each; the old code could retain unload callbacks during repeated manual reloads.
- No promise that arbitrary third-party themes will never conflict. The checks cover the installed SuperPins grid, Glance, audio badges and this mod's options.
