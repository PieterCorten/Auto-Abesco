// ==UserScript==
// @name         AA-Bronfiche-Roerendgoedfiche-Notitie
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Notitie asbestVERDACHT
// @author       Pieter Corten
// @match        https://asbestinventaris-oefen.ovam.be/*
// @match        https://asbestinventaris.ovam.be/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.7.1.min.js
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
        function notitieAV() {
            const textToCopy = "De toepassing is asbestVERDACHT. Aanvullend onderzoek is vereist om vast te stellen of de toepassing al dan niet asbesthoudend is.";

            var notitieElement = document.getElementById('notitie');

            if (notitieElement) {
                // Focus the element
                notitieElement.focus();

                // Use execCommand to simulate pasting text
                document.execCommand('insertText', false, textToCopy);
            } else {
                alert('Element with id "notitie" not found!');
            }
        }

        function addButton($ele) {
            if ($('#notitieAVButtonWrapper').length) {
                return;
            }

            let $wrapper = $('<div>', {
                id: 'notitieAVButtonWrapper',
                css: {
                    marginTop: '10px',
                    marginBottom: '20px'
                }
            });

            let $button = $('<div>', {
                text: 'Notitie AV',
                css: {
                    backgroundColor: 'rgba(59, 97, 119, 1)',
                    color: 'white',
                    border: '2px solid black',
                    padding: '10px 20px',
                    fontSize: '16px',
                    cursor: 'pointer',
                    display: 'inline-block'
                },
                click: notitieAV // Define the function for button click
            });

            $wrapper.append($button);

            if ($ele.length) {
                $ele.after($wrapper);
            }
        }

        // Conditions and positioning of button
        function init() {
            let $notitieElement = $('label:contains("Notitie (optioneel)")').first();
            let $h2Element = $('h2[data-cy="title"]');
            let containsText = $h2Element.text().includes("Roerendgoedfiche") || $h2Element.text().includes("Bronfiche");

            if ($notitieElement.length && containsText) {
                addButton($notitieElement);
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
