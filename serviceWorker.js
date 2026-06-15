chrome.runtime.onInstalled.addListener(() => {
  chrome.action.disable();
  chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
    const rules = [
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { schemes: ["http", "https"] },
          }),
        ],
        actions: [new chrome.declarativeContent.ShowAction()],
      },
    ];
    chrome.declarativeContent.onPageChanged.addRules(rules);
  });
});

chrome.tabs.onUpdated.addListener((id, info, tab) => {
  if (info?.status === "complete") {
    chrome.tabs.sendMessage(id, { action: "getUrl" }).then((data) => {
      const url = data.url;
      const urlParams = new URL(url);
      const { origin } = urlParams;
      chrome.contentSettings.sound
        ?.get({ primaryUrl: origin })
        .then((properties) => {
          chrome.tabs.update(id, { muted: properties.setting === "block" })
        })
    })
  }
})
