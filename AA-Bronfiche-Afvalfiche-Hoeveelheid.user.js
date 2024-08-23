// ==UserScript==
// @name         AA-Bronfiche-Afvalfiche-Hoeveelheid
// @namespace    http://tampermonkey.net/
// @version      4.1
// @description  Soortelijke gewichten
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
        function soortelijkGewicht() {
            if ($('#soortelijkGewichtBox').length) {
                $('#soortelijkGewichtBox').remove();
                return;
            }

            let container = $('<div>', {
                id: 'soortelijkGewichtBox',
                css: {
                    position: 'fixed',
                    top: '10px',
                    right: '10px',
                    backgroundColor: 'white',
                    border: '2px solid black',
                    padding: '10px',
                    zIndex: '1000',
                    maxHeight: '90vh',
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'column'
                }
            });

            let header = $('<div>', {
                css: {
                    position: 'relative',
                    backgroundColor: 'white',
                    zIndex: '1001'
                }
            });

            let title = $('<h1>', {
                text: 'Auto Abesco',
                css: {
                    color: 'rgba(148, 147, 35, 1)',
                    margin: '0 0 10px 0',
                    textAlign: 'center',
                    textDecoration: 'underline',
                    fontSize: '1.5em'
                }
            });

            let content = $('<div>', {
                html: `
            <p>Anti-dreun folie: 5 kg/m2</p>
            <p>Mastiek binnen: 0,2 kg/lm</p>
            <p>Mastiek buiten: 0,4 kg/lm</p>
            <p>Pakking: 0,2 kg/stuk</p>
            <p>Schouwhoed: 5-10 kg/stuk</p>
            <p>Sediment: 1 kg/lm</p>
            <p>Ventilatiekap: 5-10 kg/stuk</p>
        `,
                css: {
                    fontSize: '1em',
                    overflowY: 'auto',
                    paddingBottom: '10px'
                }
            });

            header.append(title);
            container.append(header, content);
            $('body').append(container);
        }

        function addButton(ele) {
            if ($('#soortelijkGewichtButtonWrapper').length) {
                return;
            }

            let wrapper = $('<div>', {
                id: 'soortelijkGewichtButtonWrapper',
                css: {
                    marginTop: '10px',
                    marginBottom: '10px'
                }
            });

            let button = $('<div>', {
                text: 'Soortelijk gewicht',
                css: {
                    backgroundColor: 'rgba(59, 97, 119, 1)',
                    color: 'white',
                    border: '2px solid black',
                    padding: '10px 20px',
                    fontSize: '16px',
                    cursor: 'pointer',
                    display: 'inline-block'
                },
                click: soortelijkGewicht
            });

            wrapper.append(button);
            $(ele).after(wrapper);
        }

        // Conditions and positioning of button
        function init() {
            var label = $('label:contains("Hoeveelheid")').first();
            var $h2Element = $('h2[data-cy="title"]');
            let containsText = $h2Element.text().includes("Afvalfiche") || $h2Element.text().includes("Bronfiche");

            if (label.length && containsText) {
                addButton(label);
            } else {
                $('#soortelijkGewichtBox').remove();
            }
        }

        // Create a MutationObserver to monitor changes in the DOM so the button keeps showing in case of tab change
        const observer = new MutationObserver(() => {
            init();
        });

        // Start observing the document body for changes
        observer.observe(document.body, { childList: true, subtree: true });

        init();
    }

})(jQuery);
