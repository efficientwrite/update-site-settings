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
