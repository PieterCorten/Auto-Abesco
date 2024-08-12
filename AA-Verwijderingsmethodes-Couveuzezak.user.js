// ==UserScript==
// @name         AA-Verwijderingsmethodes-Couveuzezak
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Couveuzezakmethode
// @author       Pieter Corten
// @match        https://asbestinventaris-oefen.ovam.be/*
// @match        https://asbestinventaris.ovam.be/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.7.1.js
// ==/UserScript==

(function ($) {
    'use strict';

    const configUrl = 'https://raw.githubusercontent.com/PieterCorten/Auto-Abesco/main/config.txt';

    // Function to check the remote configuration
    function checkConfigAndRun() {
        $.get(configUrl)
            .done(data => {
            if ($.trim(data) === 'enabled') {
                runScript();
            } else {
                console.log('Script is disabled by remote configuration');
            }
        })
            .fail(() => {
            console.log('Failed to fetch configuration, defaulting to disabled');
        });
    }

    checkConfigAndRun();

    // Main script functionality
    function runScript() {
        function couveuzezak() {
            const textToCopy = "Leidingisolatie als buitentoepassing. De erkend verwijderaar kan alsnog kiezen om de toepassing te verwijderen in hermetische zone indien nodig geacht.";

            var notitieElement = document.getElementById('methodiekVerwijderingCouveusezakAsbestverwijderaarMotivatie');

            if (notitieElement) {
                // Focus the element
                notitieElement.focus();

                // Use execCommand to simulate pasting text
                document.execCommand('insertText', false, textToCopy);
            } else {
                alert('Element with id "methodiekVerwijderingCouveusezakAsbestverwijderaarMotivatie" not found!');
            }
        }

        function addButton($ele) {
            if ($('#couveuzezakButtonWrapper').length) {
                return;
            }

            let $wrapper = $('<div>', {
                id: 'couveuzezakButtonWrapper',
                css: {
                    marginTop: '10px',
                    marginBottom: '20px'
                }
            });

            let $button = $('<div>', {
                text: 'Couveuzezak',
                css: {
                    backgroundColor: 'rgba(59, 97, 119, 1)',
                    color: 'white',
                    border: '2px solid black',
                    padding: '10px 20px',
                    fontSize: '16px',
                    cursor: 'pointer',
                    display: 'inline-block'
                },
                click: couveuzezak // Define the function for button click
            });

            $wrapper.append($button);

            if ($ele.length) {
                $ele.after($wrapper);
            }
        }

        // Conditions and positioning of button
        function init() {
            let $labelElement = $('label[for="methodiekVerwijderingCouveusezakAsbestverwijderaar"]');
            let $textareaElement = $('#methodiekVerwijderingCouveusezakAsbestverwijderaarMotivatie');

            if ($labelElement.length && $textareaElement.length) {
                addButton($labelElement);
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
    }

})(jQuery);