// ==UserScript==
// @name         AA-Adviesfiche-Beschrijving
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  Adviesfiches
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
            'Afwerkingslaag schrijnwerk',
            'CV ketel AV',
            'CV ketel N-AV',
            'Elektrische installatie',
            'Gevelbekleding buren',
            'Putjes geopend',
            'Tegellijm faiencetegels',
            'Verwarmingstoestel',
        ];

        let lastSelectedOption = null;

        function openOptions() {
            if ($('#adviesfichesOptionsBox').length) {
                $('#adviesfichesOptionsBox').remove();
                return;
            }

            let container = $('<div>', {
                id: 'adviesfichesOptionsBox',
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
                        $('#adviesfichesOptionsBox').remove();
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
            if ($('#adviesfichesButtonWrapper').length) {
                return;
            }

            let wrapper = $('<div>', {
                id: 'adviesfichesButtonWrapper',
                css: {
                    marginTop: '10px',
                    marginBottom: '20px'
                }
            });

            let button = $('<div>', {
                text: 'Adviesfiches',
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

            let containsText = $h2Element.text().includes("Adviesfiche");

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
            case 'Afwerkingslaag schrijnwerk':
                afwerkingslaagSchrijnwerkFunction();
                break;
            case 'CV ketel AV':
                CVKetelAVFunction();
                break;
            case 'CV ketel N-AV':
                CVKetelNAVFunction();
                break;
            case 'Elektrische installatie':
                elektrischeInstallatieFunction();
                break;
            case 'Gevelbekleding buren':
                gevelbekledingBurenFunction();
                break;
            case 'Putjes geopend':
                putjesGeopendFunction();
                break;
            case 'Tegellijm faiencetegels':
                tegellijmFaiencetegelsFunction();
                break;
            case 'Verwarmingstoestel':
                verwarmingstoestelFunction();
                break;
            default:
                console.log('Onbekende optie: ' + option);
        }
    }

    // Global variables for commonly used elements
    var dropdownIdentificatiemethode;
    var dropdownPrimaireDrager;
    var dropdownAsbestToepassing;
    var inputElementBindmiddel;
    var notitieElement;

    // Initialize global elements
    function initElements() {
        dropdownIdentificatiemethode = document.getElementById('identificatieMethodiek');
        dropdownPrimaireDrager = document.getElementById('primaireDrager');
        dropdownAsbestToepassing = document.getElementById('asbestToepassing');
        inputElementBindmiddel = document.querySelector('input.ant-select-selection-search-input');
        notitieElement = document.getElementById('notitie');
    }

    // Helper function to set dropdown value and dispatch change event
    function setDropdownValue(dropdown, value) {
        dropdown.value = value;
        dropdown.dispatchEvent(new Event('change', { bubbles: true }));
    }

    // Helper function to insert text into the notitie element
    function insertText(text) {
        if (notitieElement) {
            notitieElement.focus();
            document.execCommand('insertText', false, text);
        } else {
            alert('Element with id "notitie" not found!');
        }
    }

    // Helper function to handle bindmiddel input and dispatch events
    function handleBindmiddelInput(text) {
        if (inputElementBindmiddel) {
            inputElementBindmiddel.focus();
            document.execCommand('insertText', false, text);

            setTimeout(function() {
                inputElementBindmiddel.dispatchEvent(new KeyboardEvent('keydown', {
                    key: 'ArrowDown',
                    keyCode: 40,
                    code: 'ArrowDown',
                    which: 40,
                    bubbles: true
                }));
                setTimeout(function() {
                    inputElementBindmiddel.dispatchEvent(new KeyboardEvent('keydown', {
                        key: 'Enter',
                        keyCode: 13,
                        code: 'Enter',
                        which: 13,
                        bubbles: true
                    }));
                }, 100);
            }, 100);
        } else {
            console.error('Input element with class "ant-select-selection-search-input" not found');
        }
    }

    // Function implementations
    function afwerkingslaagSchrijnwerkFunction() {
        initElements();
        setDropdownValue(dropdownIdentificatiemethode, 'ADVIESFICHE_VASTSTELLING_EXPERTISE_NIET_ASBESTVERDACHT');
        setDropdownValue(dropdownPrimaireDrager, 'WANDOPENING_VERTICAAL');
        insertText("De afwerkingslaag rond het schrijnwerk is geïnspecteerd. Er werden geen asbestverdachte mastieken vastgesteld.");
    }

    function CVKetelAVFunction() {
        initElements();
        setDropdownValue(dropdownIdentificatiemethode, 'ADVIESFICHE_REDELIJK_VERMOEDEN');
        setDropdownValue(dropdownPrimaireDrager, 'HVAC_INFRASTRUCTUUR');
        setDropdownValue(dropdownAsbestToepassing, 'PAKKING_DICHTING');
        handleBindmiddelInput('Karton - papier - viltachtig');
        setTimeout(function() {
            insertText("Oude CV-ketels kunnen asbesthoudende dichtingen bevatten. De database van IAD-online beschikt niet over de benodigde informatie om voor dit model uitsluitsel te geven. Voordat het toestel wordt verwijderd dient informatie bij de fabrikant te worden ingewonnen.");
        }, 500);
    }

    function CVKetelNAVFunction() {
        initElements();
        setDropdownValue(dropdownIdentificatiemethode, 'ADVIESFICHE_VASTSTELLING_EXPERTISE_NIET_ASBESTVERDACHT');
        setDropdownValue(dropdownPrimaireDrager, 'HVAC_INFRASTRUCTUUR');
        insertText("De CV-ketel is geïnspecteerd. Op basis van onderzoek via IAD-online of vanwege het bouwjaar van de installatie is vastgesteld dat deze geen asbesthoudende materialen bevat.");
    }

    function elektrischeInstallatieFunction() {
        initElements();
        setDropdownValue(dropdownIdentificatiemethode, 'ADVIESFICHE_VASTSTELLING_EXPERTISE_NIET_ASBESTVERDACHT');
        setDropdownValue(dropdownPrimaireDrager, 'COMMUNICATIE_ELEKTRISCHE_INFRASTRUCTUUR');
        insertText("De elektrische installatie is geïnspecteerd. Er werden geen asbestverdachte materialen vastgesteld.");
    }

    function gevelbekledingBurenFunction() {
        initElements();
        setDropdownValue(dropdownIdentificatiemethode, 'ADVIESFICHE_REDELIJK_VERMOEDEN');
        setDropdownValue(dropdownPrimaireDrager, 'WAND_BUITENSCHIL');
        setDropdownValue(dropdownAsbestToepassing, 'LEI_SHINGLE');
        handleBindmiddelInput('Cement');
        setTimeout(function() {
            insertText(`De gevelleien op de wand van de buren, die grenst aan het inspectiegebied, worden als asbestverdacht beschouwd. Deze situatie kan op termijn leiden tot blootstelling aan asbestvezels, wat op verschillende manieren kan plaatsvinden:
- Directe blootstelling: inademing van vezels die vrijkomen door verwering.
- Afdruipzone: het aflopende water van de leien contamineert de grond waarin dit water terechtkomt.
- Contaminatie van dakbedekking op platte daken: wanneer het aflopende water van de leien uitkomt op bijvoorbeeld de roofing van een plat dak, kan dit leiden tot contaminatie van de roofing.
- Korstmos dat loskomt van asbestleien is vaak gecontamineerd.
- Asbesthoudende fragmenten kunnen door verwering loskomen.`);
        }, 500);
    }

    function tegellijmFaiencetegelsFunction() {
        initElements();
        setDropdownValue(dropdownIdentificatiemethode, 'ADVIESFICHE_REDELIJK_VERMOEDEN');
        setDropdownValue(dropdownPrimaireDrager, 'BINNENWAND');
        setDropdownValue(dropdownAsbestToepassing, 'LIJMLAAG');
        handleBindmiddelInput('Lijm');
        setTimeout(function() {
            insertText("De lijm waarmee de faiencetegels aan de wand zijn bevestigd kan mogelijk asbest bevatten. Aanvullend onderzoek is vereist om vast te stellen of de lijm al dan niet asbesthoudend is.");
        }, 500);
    }

    function putjesGeopendFunction() {
        initElements();
        setDropdownValue(dropdownIdentificatiemethode, 'ADVIESFICHE_VASTSTELLING_EXPERTISE_NIET_ASBESTVERDACHT');
        setDropdownValue(dropdownPrimaireDrager, 'SANITAIRE_INFRASTRUCTUUR');
        insertText("Eén of meerdere putjes rondom de woning werden geopend. Er zijn geen asbestverdachte leidingen vastgesteld.");
    }

    function verwarmingstoestelFunction() {
        initElements();
        setDropdownValue(dropdownIdentificatiemethode, 'ADVIESFICHE_REDELIJK_VERMOEDEN');
        setDropdownValue(dropdownPrimaireDrager, 'HVAC_INFRASTRUCTUUR');
        setDropdownValue(dropdownAsbestToepassing, 'PAKKING_DICHTING');
        handleBindmiddelInput('Karton - papier - viltachtig');
        setTimeout(function() {
            insertText("Oude verwarmingstoestellen kunnen asbesthoudende dichtingen bevatten. Voordat de toestellen worden verwijderd dient informatie bij de fabrikant te worden ingewonnen.");
        }, 500);
    }

})(jQuery);
