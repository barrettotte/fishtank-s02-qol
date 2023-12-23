// ==UserScript==
// @name         fishtank-s02 QoL
// @description  Adds some quality of life features for Fishtank season 2 site
// @namespace    http://tampermonkey.net/
// @version      2023-12-23
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
    observer.observe(document.body, {childList: true, subtree: true});
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
  const closeBtn = document.querySelector('.close-button_md__9Ad2o');
  if (closeBtn != null) {
    closeBtn.click(); // close out of camera if currently watching
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
    leftPanel.insertBefore(el, leftPanel.querySelector('.footer_footer__Mnt6p'));
  } else {
    console.error(`Left panel not loaded yet, cannot append element ${el}`);
  }
}

function addCameraButtonPanel() {
  const camListPanel = document.createElement('div');
  camListPanel.id = 'camera-list';
  camListPanel.className = 'desktop-nav-panel_desktop-nav-panel__4TPzk';

  const style = document.createElement('style');
  style.innerText = `
    #camera-list {
      display: block;
      position: relative;
      padding: 4px 2px 24px;
      border-radius: 4px;
      border: 3px outset hsla(300,5%,79%,.75);
      outline: 2px solid rgba(0,0,0,.5);
      box-shadow: -2px 2px 1px rgba(0,0,0,.75), inset 0 0 4px #cbc6cb, 4px 4px 0 rgba(0,0,0,.75);
      filter: drop-shadow(-2px 4px 0 rgba(0,0,0,.5));
      background: linear-gradient(
        90deg, 
        rgba(100, 98, 103, 1),
        rgba(130, 125, 130, 1) 10%,
        rgba(120, 115, 119, 1) 50%,
        rgba(105, 103, 109, 1) 75%,
        rgba(70, 67, 68, 1) 90%
      );
    }

    #camera-list::before, #camera-list::after {
      background-image: url(https://cdn.fishtank.live/images/patterns/light-aluminum-comp.png);
      position: absolute;
      content: "";
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      mix-blend-mode: overlay;
      pointer-events: none;
    }
  `;
  document.head.appendChild(style);

  // header
  const camListHeader = document.createElement('div');
  camListHeader.innerHTML = 'CAMERAS';
  camListHeader.className = 'camera-list_header';
  camListHeader.style.color = '#2c282b';
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

  // camera container
  const camContainer = document.createElement('div');
  camContainer.className = 'camera-list_body';
  camListPanel.appendChild(camContainer);

  // camera buttons
  cameras.forEach((c) => {
    const btn = newButton(c);
    btn.addEventListener('click', () => switchCamera(c));
    camContainer.appendChild(btn);
  });
  appendToLeftPanel(camListPanel);
}

function addFishtankLiveHashtag() {
  const btn = newButton('#fishtanklive');
  btn.style.minHeight = '33px';
  btn.style.maxHeight = '33px';

  btn.addEventListener('click', () => {
    fishtankSound('click-high-short.mp3');
    window.open('https://twitter.com/search?q=%23fishtanklive&src=typed_query&f=live', '_blank');
  });
  appendToLeftPanel(btn);
}

function enableCollapsibility(headerSelector, bodySelectors) {
  const header = document.querySelector(headerSelector);
  
  if (header != null) {
    header.style.cursor = 'pointer';

    header.addEventListener('click', () => {
      fishtankSound('click-high-short.mp3');
      
      bodySelectors.forEach((b) => {
        const body = document.querySelector(b);
        if (body != null) {
          if (body.style.display === 'none') {
            body.style.display = '';
            header.style.minHeight = '';
          } else {
            body.style.display = 'none';
            header.style.minHeight = '25px';
          }
        }
      });
    });
    header.addEventListener('mouseover', () => {
      header.style.filter = 'brightness(0.8)';
    });
    header.addEventListener('mouseout', () => {
      header.style.filter = 'none';
    });
  }
}

function addCollapsibleLeftPanels() {
  const panels = [
    {'name': 'inventory', 'header': '.inventory_header__GOmU_', 'body': ['.inventory_body__9_tdq']},
    {'name': 'cameras', 'header': '.camera-list_header', 'body': ['.camera-list_body']},
    // tabs
    {'name': 'missions', 'header': '.missions_header__K2acn', 'body': ['.missions_body__aG1yj']},
    {'name': 'fish', 'header': '.contestant-leader-board_header__lIEDI', 'body': ['.contestant-leader-board_body__gBqff']},
    {'name': 'poll', 'header': '.last-poll_header__21XjM', 'body': ['.poll-question_poll-question__7r_dL', '.last-poll_body__HqdtJ']},
    {'name': 'map', 'header': '.house-map-panel_header__bBdbV', 'body': ['.house-map-panel_body__XeFna']},
  ];
  const panelWaitMs = 300;

  // re-apply collapsiblity on tab switch
  document.querySelectorAll('.secondary-panel_tab__PxWtZ').forEach((tab) => {
    const tabBtn = tab.children[0];
    tabBtn.addEventListener('click', () => {
      setTimeout(() => {
        const tab = panels.find((p) => p.name === tabBtn.textContent);
        enableCollapsibility(tab.header, tab.body);
      }, panelWaitMs);
    });
  });

  setTimeout(() => {
    panels.forEach((panel) => enableCollapsibility(panel.header, panel.body));
  }, panelWaitMs);
}

(() => {
  // left panel tweaks
  waitForElm(leftPanelClass).then(() => {
    addCameraButtonPanel();
    addFishtankLiveHashtag();
    addCollapsibleLeftPanels();
  });
})();
