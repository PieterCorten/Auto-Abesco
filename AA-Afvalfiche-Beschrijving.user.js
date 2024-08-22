// ==UserScript==
// @name         AA-Afvalfiche-Beschrijving
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  Afvalfiches
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
        const options = [
            'Korstmos',
            'Sediment in dakgoot',
        ];

        let lastSelectedOption = null;

        function openOptions() {
            if ($('#afvalFichesOptionsBox').length) {
                $('#afvalFichesOptionsBox').remove();
                return;
            }

            let container = $('<div>', {
                id: 'afvalFichesOptionsBox',
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

            let headerColor = 'rgba(148, 147, 35, 1)';

            let header = $('<h1>', {
                text: 'Auto Abesco',
                css: {
                    color: headerColor,
                    margin: '0 0 10px 0',
                    textAlign: 'center',
                    textDecoration: 'underline',
                    fontSize: '1.5em'
                }
            });

            let content = $('<div>', {
                css: {
                    overflowY: 'auto',
                }
            });

            options.forEach(option => {
                let optionButton = $('<button>', {
                    text: option,
                    css: {
                        display: 'block',
                        width: '100%',
                        margin: '5px 0',
                        padding: '5px',
                        backgroundColor: 'rgba(59, 97, 119, 1)',
                        color: 'white',
                        border: '2px solid black',
                        cursor: 'pointer',
                        fontSize: '1em'
                    },
                    click: function () {
                        if (lastSelectedOption) {
                            lastSelectedOption.css('color', 'white');
                        }
                        $(this).css('color', headerColor);
                        lastSelectedOption = $(this);
                        updatePlayButtonColor(headerColor);
                    }
                });
                content.append(optionButton);
            });

            let playButton = $('<button>', {
                html: `
                <svg id="playIcon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M5 3l14 9-14 9V3z" fill="currentColor"/>
                </svg>
            `,
                css: {
                    display: 'block',
                    margin: '10px auto 5px auto',
                    padding: '5px 10px',
                    backgroundColor: 'rgba(59, 97, 119, 1)',
                    color: 'white',
                    border: '2px solid black',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    textAlign: 'center',
                    lineHeight: '1.5',
                },
                click: function () {
                    const selectedOption = lastSelectedOption ? lastSelectedOption.text() : 'Geen';
                    if (selectedOption !== 'Geen') {
                        $('#afvalFichesOptionsBox').remove();
                        executeOption(selectedOption);
                    } else {
                        alert('Selecteer een optie voordat u doorgaat');
                    }
                }
            });

            function updatePlayButtonColor(color) {
                $('#playIcon path').attr({
                    'fill': color,
                    'stroke': color
                });
            }

            container.append(header, content, playButton);
            $('body').append(container);
        }

        function addButton(ele) {
            if ($('#afvalFichesButtonWrapper').length) {
                return;
            }

            let wrapper = $('<div>', {
                id: 'afvalFichesButtonWrapper',
                css: {
                    marginTop: '10px',
                    marginBottom: '20px'
                }
            });

            let button = $('<div>', {
                text: 'Afvalfiches',
                css: {
                    backgroundColor: 'rgba(59, 97, 119, 1)',
                    color: 'white',
                    border: '2px solid black',
                    padding: '10px 20px',
                    fontSize: '16px',
                    cursor: 'pointer',
                    display: 'inline-block'
                },
                click: openOptions
            });

            wrapper.append(button);
            $(ele).after(wrapper);
        }

        // Conditions and positioning of button
        function init() {
            let $beschrijvingLabel = $('label:contains("Beschrijving")').first();
            let $h2Element = $('h2[data-cy="title"].margin-bottom-0');

            let containsText = $h2Element.text().includes("Afvalfiche");

            if ($beschrijvingLabel.length && containsText) {
                addButton($beschrijvingLabel);
            } else {
                $('#afvalFichesOptionsBox').remove();
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

    // Function to execute the corresponding function for the selected option
    function executeOption(option) {
        switch (option) {
            case 'Korstmos':
                korstmosFunction();
                break;
            case 'Sediment in dakgoot':
                sedimentInDakgootFunction();
                break;
        }
    }

    // Utility function to handle delays
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Main functions
    async function korstmosFunction() {
        document.querySelector('label[for="omgeving-BUITEN"]').click();

        document.querySelector('label[for="afvalType-RESTEN"]').click();

        var dropdownIdentificatiemethode = document.getElementById('identificatieMethodiek');
        dropdownIdentificatiemethode.value = 'AFVALFICHE_VASTSTELLING_EXPERTISE';
        dropdownIdentificatiemethode.dispatchEvent(new Event('change', { bubbles: true }));

        document.querySelector('label[for="asbestKarakterisatie-ASBEST"]').click();

        var inputElementTypeResten = document.getElementById('resten.restenTypes');
        if (inputElementTypeResten) {
            await delay(100);
            inputElementTypeResten.focus();
            await delay(100);
            document.execCommand('insertText', false, 'materiaal');

            await delay(100);
            inputElementTypeResten.dispatchEvent(new KeyboardEvent('keydown', {
                key: 'Enter',
                keyCode: 13,
                code: 'Enter',
                which: 13,
                bubbles: true
            }));

            await delay(100);
            inputElementTypeResten.dispatchEvent(new KeyboardEvent('keydown', {
                key: 'Escape',
                keyCode: 27,
                code: 'Escape',
                which: 27,
                bubbles: true
            }));
        } else {
            console.error('Input element "resten.restenTypes" not found');
        }

        var inputElementBesmetMateriaal = document.getElementById('resten.besmetteMaterialen');
        if (inputElementBesmetMateriaal) {
            inputElementBesmetMateriaal.focus();
            await delay(100);
            document.execCommand('insertText', false, 'Organisch');

            await delay(100);
            inputElementBesmetMateriaal.dispatchEvent(new KeyboardEvent('keydown', {
                key: 'Enter',
                keyCode: 13,
                code: 'Enter',
                which: 13,
                bubbles: true
            }));

            await delay(100);
            inputElementBesmetMateriaal.dispatchEvent(new KeyboardEvent('keydown', {
                key: 'Escape',
                keyCode: 27,
                code: 'Escape',
                which: 27,
                bubbles: true
            }));
        } else {
            console.error('Input element "resten.besmetteMaterialen" not found');
        }

        document.querySelector('label[for="resten.bronRestenAanwezig-true"]').click();

        var elementToFocus = document.getElementById('primaireDrager');
        if (elementToFocus) {
            elementToFocus.focus();
        } else {
            console.error('Primaire drager element not found');
        }
    }

    async function sedimentInDakgootFunction() {
        document.querySelector('label[for="omgeving-BUITEN"]').click();

        document.querySelector('label[for="afvalType-RESTEN"]').click();

        var dropdownIdentificatiemethode = document.getElementById('identificatieMethodiek');
        dropdownIdentificatiemethode.value = 'AFVALFICHE_VASTSTELLING_EXPERTISE';
        dropdownIdentificatiemethode.dispatchEvent(new Event('change', { bubbles: true }));

        document.querySelector('label[for="asbestKarakterisatie-ASBEST"]').click();

        var dropdownPrimaireDrager = document.getElementById('primaireDrager');
        dropdownPrimaireDrager.value = 'INFRASTRUCTUUR_HEMELWATER';
        dropdownPrimaireDrager.dispatchEvent(new Event('change', { bubbles: true }));

        var inputElementTypeResten = document.getElementById('resten.restenTypes');
        if (inputElementTypeResten) {
            await delay(100);
            inputElementTypeResten.focus();
            await delay(100);
            document.execCommand('insertText', false, 'materiaal');

            await delay(100);
            inputElementTypeResten.dispatchEvent(new KeyboardEvent('keydown', {
                key: 'Enter',
                keyCode: 13,
                code: 'Enter',
                which: 13,
                bubbles: true
            }));

            await delay(100);
            inputElementTypeResten.dispatchEvent(new KeyboardEvent('keydown', {
                key: 'Escape',
                keyCode: 27,
                code: 'Escape',
                which: 27,
                bubbles: true
            }));
        } else {
            console.error('Input element "resten.restenTypes" not found');
        }

        var inputElementBesmetMateriaal = document.getElementById('resten.besmetteMaterialen');
        if (inputElementBesmetMateriaal) {
            inputElementBesmetMateriaal.focus();
            await delay(100);
            document.execCommand('insertText', false, 'Sediment');

            await delay(100);
            inputElementBesmetMateriaal.dispatchEvent(new KeyboardEvent('keydown', {
                key: 'Enter',
                keyCode: 13,
                code: 'Enter',
                which: 13,
                bubbles: true
            }));

            await delay(100);
            inputElementBesmetMateriaal.dispatchEvent(new KeyboardEvent('keydown', {
                key: 'Escape',
                keyCode: 27,
                code: 'Escape',
                which: 27,
                bubbles: true
            }));
        } else {
            console.error('Input element "resten.besmetteMaterialen" not found');
        }

        document.querySelector('label[for="resten.bronRestenAanwezig-true"]').click();

        var elementToFocus = document.querySelector('textarea[data-cy="resten.bronRestenBeschrijving"]');
        if (elementToFocus) {
            elementToFocus.focus();
        } else {
            console.error('Aanwezige bron tekstveld element not found');
        }
    }

})(jQuery);
