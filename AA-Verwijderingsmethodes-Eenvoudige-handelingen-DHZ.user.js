// ==UserScript==
// @name         AA-Verwijderingsmethodes-Eenvoudige-handelingen-DHZ
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  Eenvoudige handelingen DHZ
// @author       Pieter Corten
// @match        *://asbestinventaris-oefen.ovam.be/*
// @match        *://asbestinventaris.ovam.be/*
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
            case 'Contaminatie geen resten':
                ContaminatieGeenRestenFunction();
                break;
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
        const textToCopy = "De volgende asbesthoudende toepassingen kunnen zelf worden verwijderd voor zover deze via eenvoudige handelingen kunnen worden weggenomen: Hechtgebonden asbest die niet beschadigd is of waarbij er geen vrije vezels zichtbaar zijn en waarbij verwijdering geen aanleiding geeft tot een wijziging van de toestand.";
        insertTextToNotitie(textToCopy);
    }

    function hgbBuitenFunction() {
        const textToCopy = "De volgende asbesthoudende toepassingen kunnen zelf worden verwijderd voor zover deze via eenvoudige handelingen kunnen worden weggenomen: Hechtgebonden asbest die beschadigd is of waarbij er vrije vezels zichtbaar zijn en die verwerkt is in een buitentoepassing waarbij geen derden aanwezig zijn, voor zover de verwijdering geen aanleiding geeft tot een wijziging van de toestand.";
        insertTextToNotitie(textToCopy);
    }

    function dichtingKoordRemvoeringFunction() {
        const textToCopy = "De volgende asbesthoudende toepassingen kunnen zelf worden verwijderd voor zover deze via eenvoudige handelingen kunnen worden weggenomen: Asbesthoudende koorden, dichtingen of pakkingen, remvoeringen en analoge materialen.";
        insertTextToNotitie(textToCopy);
    }

    function ContaminatieGeenRestenFunction() {
        const textToCopy = "De techniek van eenvoudige handelingen wordt toegepast bij de verwijdering van asbestcontaminatie van een lokaal, ruimte, gebouw of technische installatie waarbij er geen zichtbare asbestresten aanwezig zijn, voorzover het lokaal, de ruimte, het gebouw of de technische installatie gereinigd wordt met stofzuigers met een absoluutfilter (HEPA 13/14) en door middel van vochtige doeken.";
        insertTextToNotitie(textToCopy);
    }

})(jQuery);
