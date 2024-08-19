// ==UserScript==
// @name         AA-Verwijderingsmethodes-Eenvoudige-handelingen-erkend-verwijderaar
// @namespace    http://tampermonkey.net/
// @version      3.5
// @description  Eenvoudige handelingen erkend verwijderaar
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
        function contaminatieZichtbareResten() {
            const textToCopy = "Asbestcontaminatie waarbij zichtbare asbestresten aanwezig zijn.";

            var notitieElement = document.getElementById('methodiekVerwijderingEenvoudigeHandelingAsbestverwijderaarMotivatie');

            if (notitieElement) {
                // Focus the element
                notitieElement.focus();

                // Use execCommand to simulate pasting text
                document.execCommand('insertText', false, textToCopy);
            } else {
                alert('Element with id "methodiekVerwijderingEenvoudigeHandelingAsbestverwijderaarMotivatie" not found!');
            }
        }

        function addButton($ele) {
            if ($('#EHEVButtonWrapper').length) {
                return;
            }

            let $wrapper = $('<div>', {
                id: 'EHEVButtonWrapper',
                css: {
                    marginTop: '10px',
                    marginBottom: '20px'
                }
            });

            let $button = $('<div>', {
                text: 'Contaminatie met resten',
                css: {
                    backgroundColor: 'rgba(59, 97, 119, 1)',
                    color: 'white',
                    border: '2px solid black',
                    padding: '10px 20px',
                    fontSize: '16px',
                    cursor: 'pointer',
                    display: 'inline-block'
                },
                click: contaminatieZichtbareResten // Define the function for button click
            });

            $wrapper.append($button);

            if ($ele.length) {
                $ele.after($wrapper);
            }
        }

        // Conditions and positioning of button
        function init() {
            let $labelElement = $('label[for="methodiekVerwijderingEenvoudigeHandelingAsbestverwijderaar"]');
            let $textareaElement = $('#methodiekVerwijderingEenvoudigeHandelingAsbestverwijderaarMotivatie');

            if ($labelElement.length && $textareaElement.length) {
                addButton($labelElement);
            } else {
                // Close the button wrapper if the conditions are no longer met
                $('#EHEVButtonWrapper').remove();
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
