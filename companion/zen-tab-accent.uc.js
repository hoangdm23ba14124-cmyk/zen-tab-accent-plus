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
  // Store presentation with the tab session, not its URL or browsing history.
  const layoutKey = "ztap-normal-pin";
  const tabEvents = ["TabOpen", "TabPinned", "SSTabRestoring", "SSTabRestored"];
  const contextMenu = document.getElementById("tabContextMenu");
  const layoutItem = document.createXULElement("menuitem");
  layoutItem.id = "ztap-normal-pin-menu";
  layoutItem.setAttribute("type", "checkbox");
  layoutItem.setAttribute("label", "Hiển thị pin dạng hàng");
  function syncLayout(tab) {
    if (!tab?.matches?.("tab.tabbrowser-tab")) return;
    try {
      tab.toggleAttribute("ztap-normal-pin", SessionStore.getCustomTabValue(tab, layoutKey) === "true");
    } catch (error) {
      console.error("Zen Tab Accent Plus: restore pin layout failed", error);
    }
  }
  function onTabLayout(event) { syncLayout(event.target); }
  function onLayoutPopup(event) {
    if (event.target !== contextMenu) return;
    const tab = window.TabContextMenu?.contextTab;
    layoutItem.hidden = !tab?.pinned || tab.hasAttribute("zen-essential") ||
      tab.hasAttribute("zen-glance-tab") ||
      getComputedStyle(document.documentElement).getPropertyValue("--ztap-enabled").trim() !== "1";
    layoutItem.setAttribute("checked", String(!!tab?.hasAttribute("ztap-normal-pin")));
  }
  function onLayoutCommand() {
    const tab = window.TabContextMenu?.contextTab;
    if (!tab?.pinned || tab.hasAttribute("zen-essential") || tab.hasAttribute("zen-glance-tab")) return;
    try {
      if (tab.hasAttribute("ztap-normal-pin")) SessionStore.deleteCustomTabValue(tab, layoutKey);
      else SessionStore.setCustomTabValue(tab, layoutKey, "true");
      syncLayout(tab);
    } catch (error) {
      console.error("Zen Tab Accent Plus: save pin layout failed", error);
    }
  }
  contextMenu?.append(layoutItem);
  contextMenu?.addEventListener("popupshowing", onLayoutPopup);
  layoutItem.addEventListener("command", onLayoutCommand);
  for (const name of tabEvents) gBrowser.tabContainer.addEventListener(name, onTabLayout);
  for (const tab of gBrowser.tabs) syncLayout(tab);
  const rowsPref = "mod.ztap.pin-rows";
  const folderRowsPref = "mod.ztap.folder-rows";
  const rowPrefs = [rowsPref, folderRowsPref, "mod.ztap.pin-columns", "mod.ztap.folder-columns", "mod.ztap.fill-row"];
  let rowsFrame = 0;
  function updateRows() {
    rowsFrame = 0;
    const fillRow = Services.prefs.getBoolPref("mod.ztap.fill-row", true);
    const readPattern = (pref, columnsPref) => {
      const raw = Services.prefs.getStringPref(pref, "").trim();
      if (/^[1-6](\s*,\s*[1-6]){0,49}$/.test(raw)) return raw.split(",").map(Number);
      const columns = Services.prefs.getStringPref(columnsPref, "3");
      return fillRow && /^[1-6]$/.test(columns) ? [Number(columns)] : [];
    };
    const pinPattern = readPattern(rowsPref, "mod.ztap.pin-columns");
    const folderPattern = readPattern(folderRowsPref, "mod.ztap.folder-columns");
    for (const parent of document.querySelectorAll("[ztap-custom-row-group]")) parent.removeAttribute("ztap-custom-row-group");
    for (const tab of gBrowser.tabs) {
      tab.removeAttribute("ztap-row-size");
      tab.removeAttribute("ztap-row-start");
    }
    const parents = document.querySelectorAll(
      ".zen-workspace-pinned-tabs-section, .zen-workspace-pinned-tabs-section zen-folder > .tab-group-container"
    );
    for (const parent of parents) {
      const pattern = parent.matches(".zen-workspace-pinned-tabs-section") ? pinPattern : folderPattern;
      if (!pattern.length) continue;
      parent.setAttribute("ztap-custom-row-group", "");
      let row = 0;
      let pending = [];
      const flushRow = () => {
        if (!pending.length) return;
        const count = fillRow ? pending.length : pattern[Math.min(row, pattern.length - 1)];
        pending.forEach((tab, index) => {
          tab.setAttribute("ztap-row-size", String(count));
          tab.toggleAttribute("ztap-row-start", index === 0);
        });
        pending = [];
        row++;
      };
      for (const tab of parent.children) {
        if (tab.hidden || tab.getAttribute("aria-hidden") === "true" || tab.hasAttribute("zen-empty-tab") || tab.closing) continue;
        if (!tab.matches(".tabbrowser-tab[pinned]:not([zen-essential]):not([zen-glance-tab])")) {
          if (tab.matches("zen-folder, tab-group")) flushRow();
          continue;
        }
        if (tab.hasAttribute("ztap-normal-pin")) { flushRow(); continue; }
        const count = pattern[Math.min(row, pattern.length - 1)];
        pending.push(tab);
        if (pending.length === count) flushRow();
      }
      flushRow();
    }
  }
  function queueRows() {
    if (!rowsFrame) rowsFrame = window.requestAnimationFrame(updateRows);
  }
  const rowsObserver = new MutationObserver(records => {
    if (records.some(record => record.type === "attributes" ||
        [...record.addedNodes, ...record.removedNodes].some(node =>
          node.nodeType === 1 && (node.matches("tab, zen-folder, tab-group") || node.querySelector("tab[pinned]"))))) queueRows();
  });
  rowsObserver.observe(gBrowser.tabContainer, {
    subtree: true, childList: true, attributes: true,
    attributeFilter: ["pinned", "hidden", "aria-hidden", "ztap-normal-pin", "closing"],
  });
  for (const pref of rowPrefs) Services.prefs.addObserver(pref, queueRows);
  updateRows();
  async function onDoubleClick(event) {
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return;
    if (!Services.prefs.getBoolPref("mod.ztap.double-click", true)) return;
    const target = event.target;
    if (target.closest?.("button, toolbarbutton, input, textarea, [contenteditable], .tab-close-button, .tab-icon-overlay, .tab-reset-button")) return;
    const tab = target.closest?.("tab.tabbrowser-tab");
    if (!tab || !tab.pinned || tab.hasAttribute("zen-essential") || tab.closing) return;
    // Let Zen's native title editor receive double-clicks on row-pin labels.
    if (tab.hasAttribute("ztap-normal-pin") && target.closest(".tab-label-container")) return;
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
    rowsObserver.disconnect();
    for (const pref of rowPrefs) Services.prefs.removeObserver(pref, queueRows);
    window.cancelAnimationFrame(rowsFrame);
    document.documentElement.removeAttribute("ztap-custom-rows");
    for (const parent of document.querySelectorAll("[ztap-custom-row-group]")) parent.removeAttribute("ztap-custom-row-group");
    for (const tab of gBrowser.tabs) {
      tab.removeAttribute("ztap-row-size");
      tab.removeAttribute("ztap-row-start");
    }
    contextMenu?.removeEventListener("popupshowing", onLayoutPopup);
    layoutItem.removeEventListener("command", onLayoutCommand);
    layoutItem.remove();
    for (const name of tabEvents) gBrowser.tabContainer.removeEventListener(name, onTabLayout);
    window.clearTimeout(fullscreenTimer);
    window.removeEventListener("dblclick", onDoubleClick, true);
    window.removeEventListener("unload", window.zenTabAccentCleanup);
    delete window.zenTabAccentCleanup;
  };
  window.addEventListener("unload", window.zenTabAccentCleanup, { once: true });
})();
