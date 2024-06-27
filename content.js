function hideAdsWithCount(replies) {
  // let element = document.querySelector('span strong')
  const facebookAds = document.querySelector('span strong')
  console.log("Facebook Ads:", facebookAds);

  return 0
}

function observeDOMChanges(replies) {
  console.log("Observing DOM changes with replies:", replies);

  const observer = new MutationObserver(() => {
    hideTweetsWithReplies(replies);
  });

  observer.observe(document, { childList: true, subtree: true });
}

chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
  console.log("Message received in content script:", message);


  if (message.action === 'hide-ads') {
    const value = message.value;
    console.log("Hide ads with value:", value);
    const count = hideAdsWithCount(value);
    observeDOMChanges(value);
    sendResponse({ count });
  }
});

console.log("Content script loaded");