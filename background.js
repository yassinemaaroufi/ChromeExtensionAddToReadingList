// Create the context menu item when installed
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "addLinkToReadingList",
    title: "Add link to Reading List",
    contexts: ["link"]
  });
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "addPageToReadingList",
    title: "Add page to Reading List",
    contexts: ["page"]
  });
});

// Listen for clicks on the context menu
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "addLinkToReadingList") {
    addEntry(tab.id, info.selectionText || info.linkUrl, info.linkUrl)
  }

  if (info.menuItemId === "addPageToReadingList") {
    addEntry(tab.id, tab.title, tab.url);
  }
});

chrome.action.onClicked.addListener((tab) => {
  addEntry(tab.id, tab.title, tab.url);
});


/*chrome.scripting.executeScript({
  target: { tabId: tab.id },
  files: ["content.js"]
});*/

async function addEntry(tabId, title, url){
  try {
    const existing = await chrome.readingList.query({ url });
    if (existing && existing.length > 0) {
      sendToast(tabId, "Already in Reading List");
      return;
    }

    await chrome.readingList.addEntry({
      title: title,
      url: url,
      hasBeenRead: false
    });
    sendToast(tabId, "Added to Reading List");
  } catch (error) {
    sendToast(tabId, "Error");
  }
}

function sendToast(tabId, message) {
  chrome.tabs.sendMessage(tabId, {
    type: "SHOW_TOAST",
    message
  }, (response) => {
    if (chrome.runtime.lastError) {
      chrome.scripting.executeScript({
        target: { tabId },
        files: ["content.js"]
      }, () => {
        if (chrome.runtime.lastError) {
          console.warn("Unable to inject content script for toast:", chrome.runtime.lastError.message);
          return;
        }

        chrome.tabs.sendMessage(tabId, {
          type: "SHOW_TOAST",
          message
        }, () => {
          if (chrome.runtime.lastError) {
            console.warn("Toast message failed after injection:", chrome.runtime.lastError.message);
          }
        });
      });
    }
  });
}