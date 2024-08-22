// ==UserScript==
// @name         AA-Verwijderingsmethodes-Hermetische-zone
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  Hermetische zone
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
            'Hgb binnen beschadigd',
            'Niet-hgb plaat of karton',
            'Significante contaminatie met resten',
            'Standaardtekst',
        ];

        let lastSelectedOption = null;

        function openOptions() {
            if ($('#hermetischeZoneOptionsBox').length) {
                $('#hermetischeZoneOptionsBox').remove();
                return;
            }

            let container = $('<div>', {
                id: 'hermetischeZoneOptionsBox',
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
                        $('#hermetischeZoneOptionsBox').remove();
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
            if ($('#hermetischeZoneButtonWrapper').length) {
                return;
            }

            let wrapper = $('<div>', {
                id: 'hermetischeZoneButtonWrapper',
                css: {
                    marginTop: '10px',
                    marginBottom: '20px'
                }
            });

            let button = $('<div>', {
                text: 'Hermetische zone',
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
            let $labelElement = $('label[for="methodiekVerwijderingHermetischeZoneAsbestverwijderaar"]');
            let $textareaElement = $('#methodiekVerwijderingHermetischeZoneAsbestverwijderaarMotivatie');

            if ($labelElement.length && $textareaElement.length) {
                addButton($labelElement);
            } else {
                $('#hermetischeZoneButtonWrapper').remove();
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
            case 'Hgb binnen beschadigd':
                hgbBinnenBeschadigdFunction();
                break;
            case 'Niet-hgb plaat of karton':
                plaatOfKartonFunction();
                break;
            case 'Significante contaminatie met resten':
                significanteContaminatieFunction();
                break;
            case 'Standaardtekst':
                standaardtekstFunction();
                break;
        }
    }

    // Function to insert text into the element
    function insertTextToNotitie(textToCopy) {
        var notitieElement = document.getElementById('methodiekVerwijderingHermetischeZoneAsbestverwijderaarMotivatie');
        if (notitieElement) {
            notitieElement.focus();
            document.execCommand('insertText', false, textToCopy);
        } else {
            alert('Element with id "methodiekVerwijderingHermetischeZoneAsbestverwijderaarMotivatie" not found!');
        }
    }

    // Specific functions for different texts
    function hgbBinnenBeschadigdFunction() {
        const textToCopy = "Verwijdering is onmogelijk zonder beschadiging van de toepassing en/of vezelvrijgave. Indien in het werkplan van de erkende verwijderaar kan worden aangetoond dat de risico’s beheersbaar zijn, kan de verwijderingsmethode worden versoepeld naar eenvoudige handelingen.";
        insertTextToNotitie(textToCopy);
    }

    function plaatOfKartonFunction() {
        const textToCopy = "Verwijdering is onmogelijk zonder beschadiging van de toepassing en/of vezelvrijgave. Indien in het werkplan van de erkende verwijderaar kan worden aangetoond dat de risico’s beheersbaar zijn, kan de verwijderingsmethode worden versoepeld naar eenvoudige handelingen.";
        insertTextToNotitie(textToCopy);
    }

    function significanteContaminatieFunction() {
        const textToCopy = "Verwijdering is onmogelijk zonder vezelvrijgave. Indien in het werkplan van de erkende verwijderaar kan worden aangetoond dat de risico’s beheersbaar zijn, kan de verwijderingsmethode worden versoepeld naar eenvoudige handelingen.";
        insertTextToNotitie(textToCopy);
    }

    function standaardtekstFunction() {
        const textToCopy = "Verwijdering is onmogelijk zonder beschadiging van de toepassing en/of vezelvrijgave. Enkel veilig te verwijderen in hermetische zone.";
        insertTextToNotitie(textToCopy);
    }

})(jQuery);
