// ==UserScript==
// @name         AA-Bronfiche-Primaire-drager
// @namespace    http://tampermonkey.net/
// @version      3.5
// @description  Vaak voorkomende toepassingen en speciale gevallen
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
        const options1 = [
            'Anti-dreun folie',
            'Golfplaat vezelcement dak',
            'Lei dak',
            'Lei gevel',
            'Leidingisolatie',
            'Massal dorpel',
            'Massal venstertablet',
            'Mastiek',
            'Menuiserite onderdak',
            'Nok / windveer',
            'Roofing plat dak',
            'Pakking',
            'Pleisterwerk plafonds',
            'Pleisterwerk wanden',
            'Schouwbuis Rookgas',
            'Schouwhoed / ventilatiekap',
            'Vinyl tegel',
            'Vinyl vloerzeil'
        ];

        const options2 = [
            'OptionOne',
            'OptionTwo'
        ];

        let lastSelectedOption = null;

        function openOptions(options) {
            if ($('#primaireDragerBox').length) {
                $('#primaireDragerBox').remove();
                return;
            }

            let container = $('<div>', {
                id: 'primaireDragerBox',
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
                        $('#primaireDragerBox').remove();
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

        function addButton(ele, text, options) {
            let wrapperId = text.replace(/\s+/g, '') + 'Wrapper';
            if ($('#' + wrapperId).length) {
                return;
            }

            let wrapper = $('<div>', {
                id: wrapperId,
                css: {
                    display: 'inline-block',
                    marginTop: '10px',
                    marginBottom: '20px',
                    marginRight: '10px'
                }
            });

            let button = $('<div>', {
                text: text,
                css: {
                    backgroundColor: 'rgba(59, 97, 119, 1)',
                    color: 'white',
                    border: '2px solid black',
                    padding: '10px 20px',
                    fontSize: '16px',
                    cursor: 'pointer',
                    display: 'inline-block'
                },
                click: function() { openOptions(options); }
            });

            wrapper.append(button);
            $(ele).after(wrapper);
        }

        // Conditions and positioning of button
        function init() {
            var label = $('label:contains("Primaire drager")').first();
            var $h2Element = $('h2[data-cy="title"]');

            let containsText = $h2Element.text().includes("Bronfiche");
            if (label.length && containsText) {
                addButton(label, 'Vaak voorkomende toepassingen', options1);
                addButton(label, 'Speciale gevallen', options2);
            } else {
                $('#primaireDragerBox').remove();
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
            case 'Anti-dreun folie':
                antidreunFolieFunction();
                break;
            case 'Golfplaat vezelcement dak':
                golfplaatFunction();
                break;
            case 'Lei dak':
                leiDakFunction();
                break;
            case 'Lei gevel':
                leiGevelFunction();
                break;
            case 'Leidingisolatie':
                leidingisolatieFunction();
                break;
            case 'Massal dorpel':
                massalDorpelFunction();
                break;
            case 'Massal venstertablet':
                massalVenstertabletFunction();
                break;
            case 'Mastiek':
                mastiekFunction();
                break;
            case 'Menuiserite onderdak':
                menuiseriteFunction();
                break;
            case 'Nok / windveer':
                nokWindveerFunction();
                break;
            case 'Roofing plat dak':
                roofingPlatDakFunction();
                break;
            case 'Pakking':
                pakkingFunction();
                break;
            case 'Pleisterwerk plafonds':
                pleisterPlafondsFunction();
                break;
            case 'Pleisterwerk wanden':
                pleisterWandenFunction();
                break;
            case 'Schouwbuis Rookgas':
                schouwbuisRookgasFunction();
                break;
            case 'Schouwhoed / ventilatiekap':
                schouwhoedFunction();
                break;
            case 'Vinyl tegel':
                vinylTegelFunction();
                break;
            case 'Vinyl vloerzeil':
                vinylVloerzeilFunction();
                break;
            case 'OptionOne':
                optionOneFunction();
                break;
            case 'OptionTwo':
                optionTwoFunction();
                break;
            default:
                console.log('Onbekende optie: ' + option);
        }
    }

    // Global Variables
    var changeEvent = new Event('change', { bubbles: true });
    var inputSelector = 'span.ant-select-selection-search input.ant-select-selection-search-input';

    // Helper Functions
    function setDropdownValue(elementId, value) {
        var dropdown = document.getElementById(elementId);
        if (dropdown) {
            dropdown.value = value;
            dropdown.dispatchEvent(changeEvent);
        } else {
            console.error(`Element with id "${elementId}" not found`);
        }
    }

    function setInputValue(inputQuerySelector, value) {
        var inputElement = document.querySelector(inputQuerySelector);
        if (inputElement) {
            inputElement.focus();
            document.execCommand('insertText', false, value);
            triggerKeyboardEvents(inputElement);
        } else {
            console.error('Input element not found');
        }
    }

    function triggerKeyboardEvents(inputElement) {
        setTimeout(function() {
            inputElement.dispatchEvent(new KeyboardEvent('keydown', {
                key: 'ArrowDown',
                keyCode: 40,
                code: 'ArrowDown',
                which: 40,
                bubbles: true
            }));

            setTimeout(function() {
                inputElement.dispatchEvent(new KeyboardEvent('keydown', {
                    key: 'Enter',
                    keyCode: 13,
                    code: 'Enter',
                    which: 13,
                    bubbles: true
                }));
            }, 100); // Delay for pressing Enter
        }, 100); // Delay for pressing ArrowDown
    }

    function insertTextToElement(elementId, text, delay = 0) {
        setTimeout(function() {
            var element = document.getElementById(elementId);
            if (element) {
                element.focus();
                document.execCommand('insertText', false, text);
            } else {
                alert(`Element with id "${elementId}" not found!`);
            }
        }, delay);
    }

    // Function implementations
    function antidreunFolieFunction() {
        setDropdownValue('primaireDrager', 'SANITAIRE_INFRASTRUCTUUR');
        setDropdownValue('asbestToepassingGegevens.asbestToepassing', 'ANDERE');
        setInputValue(inputSelector, 'Bitumen');
        insertTextToElement('asbestToepassingGegevens.andereLabel', 'Anti-dreun folie', 500);
    }

    function golfplaatFunction() {
        setDropdownValue('primaireDrager', 'SCHUIN_DAK');
        setDropdownValue('asbestToepassingGegevens.asbestToepassing', 'GOLFPLAAT_DAK');
        setInputValue(inputSelector, 'Cement');
    }

    function leiDakFunction() {
        setDropdownValue('primaireDrager', 'SCHUIN_DAK');
        setDropdownValue('asbestToepassingGegevens.asbestToepassing', 'LEI_SHINGLE');
        setInputValue(inputSelector, 'Cement');
    }

    function leiGevelFunction() {
        setDropdownValue('primaireDrager', 'WAND_BUITENSCHIL');
        setDropdownValue('asbestToepassingGegevens.asbestToepassing', 'LEI_SHINGLE');
        setInputValue(inputSelector, 'Cement');
    }

    function leidingisolatieFunction() {
        setDropdownValue('primaireDrager', 'HVAC_INFRASTRUCTUUR');
        setDropdownValue('asbestToepassingGegevens.asbestToepassing', 'THERMISCHE_ISOLATIE');
        setInputValue(inputSelector, 'Gips - kalk');
    }

    function massalDorpelFunction() {
        setDropdownValue('primaireDrager', 'VLOER');
        setDropdownValue('asbestToepassingGegevens.asbestToepassing', 'TYPE_MASSAL');
        setInputValue(inputSelector, 'Cement');
    }

    function massalVenstertabletFunction() {
        setDropdownValue('primaireDrager', 'BINNENWAND');
        setDropdownValue('asbestToepassingGegevens.asbestToepassing', 'TYPE_MASSAL');
        setInputValue(inputSelector, 'Cement');
    }

    function mastiekFunction() {
        setDropdownValue('primaireDrager', 'WANDOPENING_VERTICAAL');
        setDropdownValue('asbestToepassingGegevens.asbestToepassing', 'PAST_STOPVERF_VOEGSEL_STOPSEL');
        setInputValue(inputSelector, 'Kitten, mastiek, pasta');
    }

    function menuiseriteFunction() {
        setDropdownValue('primaireDrager', 'PLAFOND');
        setDropdownValue('asbestToepassingGegevens.asbestToepassing', 'TYPE_MENUISERITE');
        setInputValue(inputSelector, 'Cement');
    }

    function nokWindveerFunction() {
        setDropdownValue('primaireDrager', 'SCHUIN_DAK');
        setDropdownValue('asbestToepassingGegevens.asbestToepassing', 'NOK_WINDVEER_BOEIBOORD');
        setInputValue(inputSelector, 'Cement');
    }

    function roofingPlatDakFunction() {
        setDropdownValue('primaireDrager', 'PLAT_DAK');
        setDropdownValue('asbestToepassingGegevens.asbestToepassing', 'ROOFING');
        setInputValue(inputSelector, 'Bitumen');
    }

    function pakkingFunction() {
        setDropdownValue('primaireDrager', 'HVAC_INFRASTRUCTUUR');
        setDropdownValue('asbestToepassingGegevens.asbestToepassing', 'PAKKING_DICHTING');
        setInputValue(inputSelector, 'Karton - papier - viltachtig');
    }

    function pleisterPlafondsFunction() {
        setDropdownValue('primaireDrager', 'PLAFOND');
        setDropdownValue('asbestToepassingGegevens.asbestToepassing', 'PLEISTERWERK');
        setInputValue(inputSelector, 'Gips - kalk');
    }

    function pleisterWandenFunction() {
        setDropdownValue('primaireDrager', 'BINNENWAND');
        setDropdownValue('asbestToepassingGegevens.asbestToepassing', 'PLEISTERWERK');
        setInputValue(inputSelector, 'Gips - kalk');
    }

    function schouwbuisRookgasFunction() {
        setDropdownValue('primaireDrager', 'HVAC_INFRASTRUCTUUR');
        setDropdownValue('asbestToepassingGegevens.asbestToepassing', 'ROOKGASKANAAL');
        setInputValue(inputSelector, 'Cement');
    }

    function schouwhoedFunction() {
        setDropdownValue('primaireDrager', 'HVAC_INFRASTRUCTUUR');
        setDropdownValue('asbestToepassingGegevens.asbestToepassing', 'SCHOUWHOED_VENTILATIEKAP');
        setInputValue(inputSelector, 'Cement');
    }

    function vinylTegelFunction() {
        setDropdownValue('primaireDrager', 'VLOER');
        setDropdownValue('asbestToepassingGegevens.asbestToepassing', 'TEGEL');
        setInputValue(inputSelector, 'Kunststof of -hars');
    }

    function vinylVloerzeilFunction() {
        setDropdownValue('primaireDrager', 'VLOER');
        setDropdownValue('asbestToepassingGegevens.asbestToepassing', 'VLOERZEIL');
        setInputValue(inputSelector, 'Karton - papier - viltachtig');
    }

    function optionOneFunction() {
        console.log('OptionOne function executed');
    }

    function optionTwoFunction() {
        console.log('OptionTwo function executed');
    }

})(jQuery);
