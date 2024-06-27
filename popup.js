


function hideByCount(count) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: (count) => {
        const operate = () => {
          const spans = document.querySelectorAll('span')
          const adsHeaders = Array.from(spans).filter(span => span.textContent.toLowerCase().includes('identificação'))
          adsHeaders.forEach(header => {
            const container = header.parentElement.parentElement.parentElement.parentNode.parentNode.parentNode.parentNode.parentNode

            const numberRegex = /\d+/g
            const adsText = container.querySelector('span strong')

            if (!adsText) {
              container.style.display = 'none'
              return
            }

            const adsCount = adsText?.textContent.match(numberRegex)?.[0]
            const number = parseInt(adsCount)

            if (isNaN(number)) {
              container.style.display = 'none'
              return
            }

            if (number >= count) {
              container.style.display = 'block'
              return;
            }

            container.style.display = 'none'
            console.log("Hiding container with ads count:", number)
          })
        }

        const observer = new MutationObserver(() => {
          operate()
        })

        observer.observe(document, { childList: true, subtree: true });

        operate()
      },
      args: [count],
    });
  });
}


function saveSliderValue(value) {
  chrome.storage.local.set({ sliderValue: value });
}

function loadSliderValue(callback) {
  chrome.storage.local.get(['sliderValue'], (result) => {
    const value = result.sliderValue || 1;
    callback(value);
  });
}

loadSliderValue((value) => {
  document.getElementById('slider').value = value;
  document.getElementById('slider-value').textContent = value;
});

document.getElementById('search-button').addEventListener('click', () => {
  const sliderValue = document.getElementById('slider')?.value;
  hideByCount(sliderValue);
});

document.getElementById('slider').addEventListener('input', (event) => {
  const sliderValue = event.target.value;
  document.getElementById('slider-value').textContent = sliderValue;
  saveSliderValue(sliderValue);
});
