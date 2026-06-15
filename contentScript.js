chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "getUrl") {
        sendResponse({ url: window.location.href })
    }
})