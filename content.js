var popupDiv = document.createElement('div');
popupDiv.id = 'myExtensionPopup';

// HTMLSpanElement
/**
 * Retrieves the container parent element of a given span element.
 *
 * @param {HTMLSpanElement} span - The span element for which to find the container parent.
 * @returns {HTMLElement} - The container parent element.
 */
const getContainerParent = (span) => {
  return span.parentElement.parentElement.parentElement.parentNode.parentNode.parentNode.parentNode.parentNode;
}

fetch(chrome.runtime.getURL('popup.html'))
  .then(response => response.text())
  .then(data => {
    popupDiv.innerHTML = data;
    popupDiv.style.position = 'fixed';
    popupDiv.style.bottom = '0';
    popupDiv.style.zIndex = '9000000000000000000';
    popupDiv.style.width = '100%';
    popupDiv.style.display = 'flex';
    popupDiv.style.justifyContent = 'space-between';
    popupDiv.style.alignItems = 'center';
    popupDiv.style.backgroundColor = "#0C0A09";
    popupDiv.style.padding = '16px';
    document.body.appendChild(popupDiv);
    let buttonIsClicked = false;
    let interval = null;

    document.getElementById('search-button').addEventListener('click', () => {
      const searchButton = document.getElementById('search-button');
      buttonIsClicked = !buttonIsClicked;

      if (!buttonIsClicked) {
        searchButton.textContent = "Iniciar Busca";
        searchButton.style.backgroundColor = '#E11D4B';
        clearInterval(interval);
        return;
      }

      searchButton.textContent = "Parar";
      searchButton.style.backgroundColor = 'orange';
      const sliderValue = document.getElementById('slider')?.value;

      const operate = () => {
        const spans = document.querySelectorAll('span');
        const spansArray = Array.from(spans);
        // const buttonMore = document.querySelectorAll('a[href="#"][role="button"]');
        const heading = document.querySelectorAll('div[role="heading"]');

        heading.forEach(header => {
          header.parentNode.parentNode.parentNode.parentNode.style.display = 'none';
        });

        const adsHeaders = spansArray.filter(span => span.textContent.toLowerCase().includes('identificação'));
        adsHeaders.forEach(header => {
          const container = getContainerParent(header);
          const regex = /(\d+)\s*(?:an[úu]ncios?|anuncios?)/i;

          const adsText = container.querySelector('span strong');

          if (!adsText) {
            container.style.display = 'none';
            return;
          }

          const isValid = regex.test(adsText.textContent);

          if (!isValid) {
            container.style.display = 'none';
            return;
          }

          const adsCountResult = adsText.textContent.match(regex);

          if (!adsCountResult) {
            container.style.display = 'none';
            return;
          }

          const adsCount = adsCountResult[1];

          if (!adsCount) {
            container.style.display = 'none';
            return;
          }

          const number = parseInt(adsCount);

          if (isNaN(number)) {
            container.style.display = 'none';
            return;
          }

          if (number < Number(sliderValue)) {
            container.style.display = 'none';
            return;
          }

          adsText.style.color = '#E11D4B';
          container.style.display = 'block';
          container.style.padding = '0px'
          container.style.overflow = 'hidden'

          container.firstChild.style.maxHeight = '480px'
          container.firstChild.style.overflow = 'hidden'
          container.firstChild.style.border = '2px solid #E11D4B'
        });
      }

      interval = setInterval(operate, 1000);
    });

    document.getElementById('slider').addEventListener('input', (event) => {
      const sliderValue = event.target.value;
      document.getElementById('slider-value').textContent = sliderValue;
    });
  });
