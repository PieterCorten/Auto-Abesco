// ==UserScript==
// @name         AA-Beperkingsfiche-Beschrijving
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Beperkingsfiches
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
            'Kruipkelder',
            'Onderdak',
            'Roofing',
            'Sediment in dakgoot',
        ];

        let lastSelectedOption = null;

        function openOptions() {
            if ($('#beperkingsfichesOptionsBox').length) {
                $('#beperkingsfichesOptionsBox').remove();
                return;
            }

            let container = $('<div>', {
                id: 'beperkingsfichesOptionsBox',
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
                        $('#beperkingsfichesOptionsBox').remove();
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
            if ($('#beperkingsfichesButtonWrapper').length) {
                return;
            }

            let wrapper = $('<div>', {
                id: 'beperkingsfichesButtonWrapper',
                css: {
                    marginTop: '10px',
                    marginBottom: '20px'
                }
            });

            let button = $('<div>', {
                text: 'Beperkingsfiches',
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

            let containsText = $h2Element.text().includes("Beperkingsfiche");

            if ($beschrijvingLabel.length && containsText) {
                addButton($beschrijvingLabel);
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
            case 'Kruipkelder':
                kruipkelderFunction();
                break;
            case 'Onderdak':
                onderdakFunction();
                break;
            case 'Roofing':
                roofingFunction();
                break;
            case 'Sediment in dakgoot':
                sedimentInDakgootFunction();
                break;
            default:
                console.log('Onbekende optie: ' + option);
        }
    }

    // Utility function to select a value from a dropdown and dispatch change event
    function selectDropdownValue(dropdownId, value) {
        const dropdown = document.getElementById(dropdownId);
        if (dropdown) {
            dropdown.value = value;
            dropdown.dispatchEvent(new Event('change', { bubbles: true }));
        } else {
            console.error('Dropdown with id "' + dropdownId + '" not found');
        }
    }

    // Utility function to insert text into a specified element
    function insertText(elementId, text) {
        const element = document.getElementById(elementId);
        if (element) {
            element.focus();
            document.execCommand('insertText', false, text);
        } else {
            console.error('Element with id "' + elementId + '" not found');
        }
    }

    // Utility function to click a label
    function clickLabel(labelFor) {
        const label = document.querySelector(`label[for="${labelFor}"]`);
        if (label) {
            label.click();
        } else {
            console.error('Label with for attribute "' + labelFor + '" not found');
        }
    }

    // Function to handle Kruipkelder option
    function kruipkelderFunction() {
        clickLabel('beperkingstype-PERMANENT');
        selectDropdownValue('beperkingsreden', 'TEGEN_WELZIJNSWET');

        const textToCopy = "De kruipkelder heeft een hoogte van minder dan 1,50 meter, wat gevaarlijke situaties kan veroorzaken door een gebrek aan zuurstof of de aanwezigheid van schadelijke stoffen. Om deze redenen werd de ruimte niet betreden. Wel werd de zichtbare ruimte van een veilige afstand geïnspecteerd, waarbij geen asbestverdachte materialen werden vastgesteld.";
        insertText('motivatie', textToCopy);
    }

    // Function to handle Onderdak option
    function onderdakFunction() {
        clickLabel('beperkingstype-TIJDELIJK');
        selectDropdownValue('beperkingsreden', 'ONVEILIGE_HOOGTE');

        const textToCopy = "Vanwege de hoogte kon geen dakpan worden opgetild voor inspectie van het onderdak. Ook was het niet mogelijk om het onderdak van binnenuit te inspecteren. Onderdaken kunnen asbesthoudende materialen bevatten.";
        insertText('motivatie', textToCopy);

        selectDropdownValue('primaireDrager', 'PLAFOND');
        selectDropdownValue('asbestToepassingGegevens.asbestToepassing', 'TYPE_MENUISERITE');
    }

    // Function to handle Roofing option
    function roofingFunction() {
        clickLabel('beperkingstype-TIJDELIJK');
        selectDropdownValue('beperkingsreden', 'ONVEILIGE_HOOGTE');

        const textToCopy = "Vanwege de hoogte kon niet worden vastgesteld of het plat dak bedekt is met asbestverdachte roofing.";
        insertText('motivatie', textToCopy);

        selectDropdownValue('primaireDrager', 'PLAT_DAK');
        selectDropdownValue('asbestToepassingGegevens.asbestToepassing', 'ROOFING');
    }

    // Function to handle Sediment in dakgoot option
    function sedimentInDakgootFunction() {
        clickLabel('beperkingstype-TIJDELIJK');
        selectDropdownValue('beperkingsreden', 'ONVEILIGE_HOOGTE');

        const textToCopy = "Vanwege de hoogte kon niet worden vastgesteld of er sediment in de dakgoot aanwezig is. Aangezien de dakgoot water opvangt van een asbesthoudende dakbedekking moet ervan worden uitgegaan dat sediment, indien aanwezig, gecontamineerd is met asbestvezels.";
        insertText('motivatie', textToCopy);

        selectDropdownValue('primaireDrager', 'INFRASTRUCTUUR_HEMELWATER');
    }

})(jQuery);