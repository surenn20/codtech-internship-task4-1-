let activeTab = null;
let startTime = Date.now();

chrome.tabs.onActivated.addListener(async (info) => {
  saveTime();
  const tab = await chrome.tabs.get(info.tabId);
  activeTab = tab.url;
  startTime = Date.now();
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    saveTime();
    activeTab = tab.url;
    startTime = Date.now();
  }
});

function saveTime() {
  if (!activeTab) return;

  const timeSpent = Math.floor((Date.now() - startTime) / 1000);

  chrome.storage.local.get(["usage"], (res) => {
    const usage = res.usage || {};
    usage[activeTab] = (usage[activeTab] || 0) + timeSpent;
    chrome.storage.local.set({ usage });
  });
}