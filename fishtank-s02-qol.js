// ==UserScript==
// @name         fishtank-s02 QoL
// @description  Adds some quality of life features for Fishtank season 2 site
// @namespace    http://tampermonkey.net/
// @version      2023-12-21
// @author       barrettotte
// @match        *://*.fishtank.live/*
// @run-at       document-idle
// @grant        none
// ==/UserScript==

const leftPanelClass = '.secondary-panel_secondary-panel__vUc65';

const cameras = [
  'ATTIC', 'BAR', 'BEDROOM 1', 'BEDROOM 2', 'BEDROOM 3', 'DOG HOUSE', 'DOWNSTAIRS BATHROOM', 'HALLWAY DOWNSTAIRS', 
  'HALLWAY UPSTAIRS', 'KITCHEN', 'LIVING ROOM', 'LOUNGE', 'MASTER BATHROOM', 'THE BUNK', 'UPSTAIRS BATHROOM',
];

// ripped from https://stackoverflow.com/questions/5525071/how-to-wait-until-an-element-exists
function waitForElm(selector) {
  return new Promise(resolve => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    const observer = new MutationObserver(mutations => {
      if (document.querySelector(selector)) {
        observer.disconnect();
        resolve(document.querySelector(selector));
      }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
  });
}

function newScrew(pos) {
  const screw = document.createElement('div');
  screw.className = `screws_screw__t_1iY screws_${pos}__` + {
    'top-left': '8K2_Q',
    'top-right': 'kdqNC',
    'bottom-left': 'Kz1OJ',
    'bottom-right': 'ebrGH'
  }[pos];

  const screwImg = document.createElement('img');
  screwImg.src = `https://cdn.fishtank.live/images/slices/screw-${pos}.png`;
  screwImg.width = '24';
  screwImg.height = '24';
  screw.appendChild(screwImg);

  return screw;
}

function fishtankSound(sound) {
  const a = document.createElement('audio');
  a.volume = 0.5;
  a.src = `https://www.fishtank.live/sounds/${sound}`;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.onended = () => a.remove();
  a.play();
}

function switchCamera(camera) {
  // close out of camera if currently watching
  const closeBtn = document.querySelector('.close-button_md__9Ad2o');
  if (closeBtn != null) {
    closeBtn.click();
  }

  setTimeout(() => {
    const camID = camera.toLowerCase().replace(/ /g, '-');
    waitForElm(`#${camID}`).then((elm) => elm.click());
  }, 100);
}

function newButton(btnTxt) {
  const btn = document.createElement('button');
  btn.className = 'color-button_color-button__cW61T undefined color-button_md__GaczN';
  btn.style.width = '100%';

  const img = document.createElement('img');
  img.src = 'https://cdn.fishtank.live/images/slices/console-button-long-gray-3.png'
  img.width = '373';
  img.height = '75';
  btn.appendChild(img);

  const text = document.createElement('div');
  text.className = 'color-button_text__3OQAq';
  text.innerHTML = btnTxt;
  btn.appendChild(text);

  return btn;
}

function appendToLeftPanel(el) {
  const leftPanel = document.querySelector(leftPanelClass);

  if (leftPanel != null) {
    // add element before footer
    leftPanel.insertBefore(el, leftPanel.querySelector('.footer_footer__Mnt6p'));
  } else {
    console.error(`Left panel not loaded yet, cannot append element ${el}`);
  }
}

function addCameraButtonPanel() {
  const camListPanel = document.createElement('div');
  camListPanel.id = 'camera-list';
  camListPanel.className = 'desktop-nav-panel_desktop-nav-panel__4TPzk'; // taken from first panel on left side
  camListPanel.style.display = 'flex';
  camListPanel.style.padding = '4px 2px 24px';
  camListPanel.style.position = 'relative';
  camListPanel.style.background = 'linear-gradient(90deg,#88868b,#a7a2a6 10%,#a09b9f 50%,#8f8d93 75%,#625f60 90%)';
  camListPanel.style.borderRadius = '4px';
  camListPanel.style.border = '3px outset hsla(300,5%,79%,.75)';
  camListPanel.style.outline = '2px solid rgba(0,0,0,.5)';
  camListPanel.style.boxShadow = '-2px 2px 1px rgba(0,0,0,.75),inset 0 0 4px #cbc6cb,4px 4px 0 rgba(0,0,0,.75)';
  camListPanel.style.filter = 'drop-shadow(-2px 4px 0 rgba(0,0,0,.5))';

  // header
  const camListHeader = document.createElement('div');
  camListHeader.innerHTML = 'CAMERAS';
  camListHeader.style.color = '#322e31';
  camListHeader.style.fontFamily = 'Highway Gothic,sans-serif';
  camListHeader.style.fontWeight = '600';
  camListHeader.style.textTransform = 'uppercase';
  camListHeader.style.textShadow = '0 0 2px rgba(225,239,252,.75)';
  camListHeader.style.paddingBottom = '5px';
  camListHeader.style.width = '100%';
  camListHeader.style.display = 'flex';
  camListHeader.style.justifyContent = 'center';
  camListPanel.appendChild(camListHeader);

  // corner screws
  const screws = document.createElement('div');
  screws.className = 'screws_screws__letgM screws_sm__YY7jC';
  ['top-left', 'top-right', 'bottom-left', 'bottom-right'].forEach((d) => screws.appendChild(newScrew(d)));
  camListPanel.appendChild(screws);

  // camera buttons
  cameras.forEach((c) => {
    const btn = newButton(c);
    btn.addEventListener('click', () => {
      switchCamera(c);
    });
    camListPanel.appendChild(btn);
  });
  appendToLeftPanel(camListPanel);
}

function addFishtankLiveHashtag() {
  const btn = newButton('#fishtanklive');
  btn.style.marginTop = '2px';
  btn.style.paddingTop = '15px';
  btn.style.paddingBottom = '15px';

  btn.addEventListener('click', () => {
    fishtankSound('click-high-short.mp3');
    window.open('https://twitter.com/search?q=%23fishtanklive&src=typed_query&f=live', '_blank');
  });
  appendToLeftPanel(btn);
}

function main() {
  try {
    addCameraButtonPanel();
    addFishtankLiveHashtag();
  } catch(e) {
    console.error('fishtank-s02.js failed - ' + e);
  }
}

function waitForleftPanel(_, observer) {
  if(document.querySelector(leftPanelClass)) {
    observer.disconnect();
    main();
  }
}

(new MutationObserver(waitForleftPanel)).observe(document, {childList: true, subtree: true});
