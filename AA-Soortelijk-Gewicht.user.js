// ==UserScript==
// @name         AA Soortelijk Gewicht
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  Melding Soortelijk Gewicht
// @author       Pieter Corten
// @match        https://asbestinventaris-oefen.ovam.be/*
// @grant        none
// @updateURL    https://github.com/PieterCorten/Auto-Abesco/raw/main/AA-Soortelijk-Gewicht.user.js
// @downloadURL  https://github.com/PieterCorten/Auto-Abesco/raw/main/AA-Soortelijk-Gewicht.user.js
// ==/UserScript==

(function () {
    'use strict';

    function soortelijkGewicht() {
        let existingBox = document.getElementById('soortelijkGewichtBox');
        if (existingBox) {
            existingBox.remove();
            return;
        }

        let container = document.createElement('div');
        container.id = 'soortelijkGewichtBox';
        container.style.position = 'fixed';
        container.style.top = '10px';
        container.style.right = '10px';
        container.style.backgroundColor = 'white';
        container.style.border = '2px solid black';
        container.style.padding = '10px';
        container.style.zIndex = '1000';

        let header = document.createElement('h1');
        header.innerText = 'Auto Abesco';
        header.style.color = 'rgba(148, 147, 35, 1)';
        header.style.margin = '0 0 10px 0';
        header.style.textAlign = 'center';
        header.style.textDecoration = 'underline';

        let content = document.createElement('div');
        content.innerHTML = `
            <p>Mastiek: gemiddeld x kg/lm</p>
            <p>Schouwbuis: externe lengte x 1,20</p>
            <p>Slib: gemiddeld x kg/lm</p>
        `;
        content.style.margin = '0';

        let okButton = document.createElement('button');
        okButton.innerText = 'OK';
        okButton.style.display = 'block';
        okButton.style.margin = '10px auto 0 auto';
        okButton.style.padding = '5px 10px';
        okButton.style.backgroundColor = 'rgba(59, 97, 119, 1)';
        okButton.style.color = 'white';
        okButton.style.border = '2px solid black';
        okButton.style.cursor = 'pointer';

        okButton.onclick = function() {
            container.remove();
        };

        container.appendChild(header);
        container.appendChild(content);
        container.appendChild(okButton);

        document.body.appendChild(container);
    }

    function addButton(ele) {
        if (document.querySelector('#autoAbescoButtonWrapper')) {
            return;
        }

        let wrapper = document.createElement('div');
        wrapper.id = 'autoAbescoButtonWrapper';
        wrapper.style.marginTop = '10px';
        wrapper.style.marginBottom = '10px';

        let button = document.createElement('button');
        button.id = 'autoAbescoButtonSoortelijkGewicht';
        button.innerText = 'Auto Abesco';
        button.style.backgroundColor = 'rgba(59, 97, 119, 1)';
        button.style.color = 'white';
        button.style.border = '2px solid black';
        button.style.padding = '10px 20px';
        button.style.fontSize = '16px';
        button.style.cursor = 'pointer';
        button.style.display = 'block';

        button.onclick = soortelijkGewicht; // Define the function for button click

        wrapper.appendChild(button);

        ele.parentNode.insertBefore(wrapper, ele.nextSibling);
    }

    function init() {
        let pretagsGenaamdLabels = document.getElementsByTagName("label");

        for (let tekstVanElement of pretagsGenaamdLabels) {
            if (tekstVanElement.textContent.trim() === "Hoeveelheid") {
                addButton(tekstVanElement);
                break;
            }
        }
    }

    // Create a MutationObserver to monitor changes in the DOM so the button keeps showing in case of tab change
    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                init();
            }
        }
    });

    // Start observing the document body for changes
    observer.observe(document.body, { childList: true, subtree: true });

    // Run init initially in case the content is already present
    init();

})();
