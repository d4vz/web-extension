
const createPopup = (inject_document, data) => {
  const popup = document.createElement('div');
  popup.innerHTML = data;
  popup.id = 'myExtensionPopup';
  popup.style.position = 'fixed';
  popup.style.bottom = '0';
  popup.style.zIndex = '9000000000000000000';
  popup.style.width = '100%';
  popup.style.display = 'flex';
  popup.style.justifyContent = 'space-between';
  popup.style.alignItems = 'center';
  popup.style.backgroundColor = "#0C0A09";
  popup.style.padding = '16px';
  inject_document.body.appendChild(popup);
  return popup;
}

const createRegisterButton = (popup) => {
  const registerButton = document.createElement('button');
  registerButton.textContent = 'Registrar';
  registerButton.style.backgroundColor = '#E11D4B';
  registerButton.style.color = '#fff';
  registerButton.style.padding = '8px 16px';
  registerButton.style.border = 'none';
  registerButton.style.borderRadius = '4px';
  registerButton.style.cursor = 'pointer';
  registerButton.style.display = 'block';
  registerButton.style.fontWeight = 'bold';
  registerButton.style.fontSize = '16px';
  popup.appendChild(registerButton);
  return registerButton;
}

const hideSliderAndSearchButton = (inject_document) => {
  const slider = inject_document.getElementById('slider');
  const sliderValue = inject_document.getElementById('slider-value');
  const searchButton = inject_document.getElementById('search-button');
  slider.style.display = 'none';
  sliderValue.style.display = 'none';
  searchButton.style.display = 'none';
}

const getContainerParent = (span) => {
  return span.parentElement.parentElement.parentElement.parentNode.parentNode.parentNode.parentNode.parentNode;
}

const getAdsHeaders = (inject_document) => {
  const spans = inject_document.querySelectorAll('span');
  const spansArray = Array.from(spans);
  return spansArray.filter(span => span.textContent.toLowerCase().includes('identificação'));
}

const clickInMoreButton = (inject_document) => {
  const buttonMore = inject_document.querySelectorAll('a[href="#"][role="button"]');
  buttonMore.forEach(button => {
    button.click();
  })
}

const omitHeadings = (inject_document) => {
  const headings = inject_document.querySelectorAll('div[role="heading"]');
  headings.forEach(heading => {
    const valid = heading.textContent.toLowerCase().includes('em');
    if (valid) {
      heading.parentNode.parentNode.parentNode.parentNode.style.display = 'none';
    }
  });
}

const operate = (inject_document) => {
  const adsHeaders = getAdsHeaders(inject_document);
  clickInMoreButton(inject_document)
  omitHeadings(inject_document)

  adsHeaders.forEach(header => {
    const container = getContainerParent(header);
    const regex = /(\d+)\s*(?:an[úu]ncios?|anuncios?)/i;

    const adsText = container.querySelector('span strong');
    const adOwner = container.querySelector('a span');


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

    const sliderValue = inject_document.getElementById('slider').value;

    if (number < Number(sliderValue)) {
      container.style.display = 'none';
      return;
    }


    adsText.style.color = '#E11D4B';
    container.style.display = 'block';
    container.style.padding = '0px'
    container.style.overflow = 'hidden'
    container.firstChild.style.height = '480px'
    container.firstChild.style.overflow = 'hidden'
    container.firstChild.style.border = '2px solid #E11D4B'
  });
};

fetch(chrome.runtime.getURL('popup.html'))
  .then(response => response.text())
  .then(data => {
    const popupDiv = createPopup(document, data);
    const urlSearchParams = new URLSearchParams(window.location.search);
    const viewAllPageId = urlSearchParams.get('view_all_page_id');
    let buttonIsClicked = false;
    let observer = null;

    if (viewAllPageId) {
      hideSliderAndSearchButton(document);
      const registerButton = createRegisterButton(popupDiv);
      registerButton.addEventListener('click', () => {
        const allUrl = window.location.href;
        const url = encodeURIComponent(allUrl);
        window.open(`https://app.spyron.io/miner?addKeyword=true&keyword=${url}`, '_blank');
      })
      return;
    }

    const startObservation = () => {
      const observerConfig = {
        attributes: true,
        childList: true,
        subtree: true
      };
      observer = new MutationObserver(() => operate(document));
      observer.observe(document.body, observerConfig);
    };

    document.getElementById('slider').addEventListener('input', (event) => {
      const sliderValue = event.target.value;
      document.getElementById('slider-value').textContent = sliderValue;
    });

    document.getElementById('search-button').addEventListener('click', () => {
      const searchButton = document.getElementById('search-button');
      buttonIsClicked = !buttonIsClicked;

      if (!buttonIsClicked) {
        searchButton.textContent = "Iniciar Busca";
        searchButton.style.backgroundColor = '#E11D4B';

        if (observer) {
          observer.disconnect();
        }

        window.scrollTo(0, 0);
        operate(document);
        return;
      }

      searchButton.textContent = "Parar";
      searchButton.style.backgroundColor = 'orange';
      startObservation();
      operate(document);
    });
  });
