// ==UserScript==
// @name         AA-Verwijderingsmethodes-Eenvoudige-handelingen-DHZ
// @namespace    http://tampermonkey.net/
// @version      3.5
// @description  Eenvoudige handelingen DHZ
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
            'Hgb binnen onbeschadigd',
            'Hechtgebonden buiten',
            'Dichting, koord, remvoering',
            'Hgb binnen beschadigd',
            'Niet-hgb plaat of karton',
            'Contaminatie geen resten',
        ];

        let lastSelectedOption = null;

        function openOptions() {
            if ($('#EHDHZOptionsBox').length) {
                $('#EHDHZOptionsBox').remove();
                return;
            }

            let container = $('<div>', {
                id: 'EHDHZOptionsBox',
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
                        $('#EHDHZOptionsBox').remove();
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
            if ($('#EHDHZButtonWrapper').length) {
                return;
            }

            let wrapper = $('<div>', {
                id: 'EHDHZButtonWrapper',
                css: {
                    marginTop: '10px',
                    marginBottom: '20px'
                }
            });

            let button = $('<div>', {
                text: 'Eenvoudige handelingen: DHZ of aannemer',
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
            let $labelElement = $('label[for="methodiekVerwijderingEenvoudigeHandelingDoeHetZelfWerknemerAttest"]');
            let $textareaElement = $('#methodiekVerwijderingEenvoudigeHandelingDoeHetZelfWerknemerAttestMotivatie');

            if ($labelElement.length && $textareaElement.length) {
                addButton($labelElement);
            } else {
                // Close the options container if the conditions are no longer met
                $('#EHDHZOptionsBox').remove();
                $('#EHDHZButtonWrapper').remove();
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
            case 'Hgb binnen onbeschadigd':
                hgbBinnenOnbeschadigdFunction();
                break;
            case 'Hechtgebonden buiten':
                hgbBuitenFunction();
                break;
            case 'Dichting, koord, remvoering':
                dichtingKoordRemvoeringFunction();
                break;
            case 'Hgb binnen beschadigd':
                hgbBinnenBeschadigdFunction();
                break;
            case 'Niet-hgb plaat of karton':
                nietHgbPlaatKartonFunction();
                break;
            case 'Contaminatie geen resten':
                ContaminatieGeenRestenFunction();
                break;
            default:
                console.log('Onbekende optie: ' + option);
        }
    }

    // Function to insert text into the element
    function insertTextToNotitie(textToCopy) {
        var notitieElement = document.getElementById('methodiekVerwijderingEenvoudigeHandelingDoeHetZelfWerknemerAttestMotivatie');
        if (notitieElement) {
            notitieElement.focus();
            document.execCommand('insertText', false, textToCopy);
        } else {
            alert('Element with id "methodiekVerwijderingEenvoudigeHandelingDoeHetZelfWerknemerAttestMotivatie" not found!');
        }
    }

    // Specific functions for different texts
    function hgbBinnenOnbeschadigdFunction() {
        const textToCopy = "Hechtgebonden binnentoepassing in onbeschadigde toestand. Verwijdering geeft geen aanleiding tot beschadiging van het materiaal mits correcte uitvoering.";
        insertTextToNotitie(textToCopy);
    }

    function hgbBuitenFunction() {
        const textToCopy = "Hechtgebonden buitentoepassing. Enkel zelf verwijderen indien mogelijk zonder verdere beschadiging van het materiaal.";
        insertTextToNotitie(textToCopy);
    }

    function dichtingKoordRemvoeringFunction() {
        const textToCopy = `Particuliere verwijdering toegestaan voor onderstaande toepassingen ongeacht of ze zich binnen of buiten bevinden:
- Dichtingen of pakkingen;
- Koorden en andere geweven materialen;
- Remvoeringen of gelijkaardige toepassingen.
Het is ten stelligste aangeraden de verwijdering te laten uitvoeren door werknemers met actueel opleidingsattest eenvoudige handelingen.`;
        insertTextToNotitie(textToCopy);
    }

    function hgbBinnenBeschadigdFunction() {
        const textToCopy = "Hechtgebonden binnentoepassing. Verwijdering enkel toegelaten voor werknemers met actueel opleidingsattest eenvoudige handelingen.";
        insertTextToNotitie(textToCopy);
    }

    function nietHgbPlaatKartonFunction() {
        const textToCopy = "Niet-hechtgebonden asbesthoudend plaatmateriaal of asbestkarton, eenvoudig demonteerbaar. Verwijdering geeft geen aanleiding tot beschadiging van het materiaal mits correcte uitvoering. Enkel toegelaten voor werknemers met actueel opleidingsattest eenvoudige handelingen.";
        insertTextToNotitie(textToCopy);
    }

    function ContaminatieGeenRestenFunction() {
        const textToCopy = "Asbestcontaminatie waarbij geen zichtbare asbestresten aanwezig zijn. Verwijdering enkel toegelaten voor werknemers met actueel opleidingsattest eenvoudige handelingen.";
        insertTextToNotitie(textToCopy);
    }

})(jQuery);
