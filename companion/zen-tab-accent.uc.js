// Runs in browser chrome through the bundled AutoConfig loader or a userChromeJS loader.
(() => {
  if (location.href !== "chrome://browser/content/browser.xhtml") return;
  window.zenTabAccentCleanup?.();
  // Let native window restoration finish before entering macOS fullscreen.
  const fullscreenTimer = window.setTimeout(() => {
    if (window.zenTabAccentStartupHandled) return;
    window.zenTabAccentStartupHandled = true;
    if (!Services.prefs.getBoolPref("mod.ztap.auto-fullscreen", true)) return;
    if (getComputedStyle(document.documentElement).getPropertyValue("--ztap-enabled").trim() !== "1") return;
    if (window.toolbar.visible && !window.fullScreen) window.fullScreen = true;
  }, 700);
  const busy = new WeakSet();
  async function onDoubleClick(event) {
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return;
    if (!Services.prefs.getBoolPref("mod.ztap.double-click", true)) return;
    const target = event.target;
    if (target.closest?.("button, toolbarbutton, input, textarea, [contenteditable], .tab-close-button, .tab-icon-overlay, .tab-reset-button")) return;
    const tab = target.closest?.("tab.tabbrowser-tab");
    if (!tab || !tab.pinned || tab.hasAttribute("zen-essential") || tab.closing) return;
    // Only read computed style for a relevant pin, not every double-click in the UI.
    if (getComputedStyle(document.documentElement).getPropertyValue("--ztap-enabled").trim() !== "1") return;
    if (typeof window.gZenPinnedTabManager?.onCloseTabShortcut !== "function") return;
    event.preventDefault();
    event.stopImmediatePropagation();
    if (busy.has(tab)) return;
    busy.add(tab);
    try {
      await gZenPinnedTabManager.onCloseTabShortcut(event, tab, {
        behavior: "unload-switch", noClose: true, closeIfPending: false,
      });
    } catch (error) {
      console.error("Zen Tab Accent Plus: unload failed", error);
    } finally {
      busy.delete(tab);
    }
  }
  // Capture before Zen's rename / default double-click handlers.
  window.addEventListener("dblclick", onDoubleClick, true);
  window.zenTabAccentCleanup = () => {
    window.clearTimeout(fullscreenTimer);
    window.removeEventListener("dblclick", onDoubleClick, true);
    window.removeEventListener("unload", window.zenTabAccentCleanup);
    delete window.zenTabAccentCleanup;
  };
  window.addEventListener("unload", window.zenTabAccentCleanup, { once: true });
})();
