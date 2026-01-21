import { countries } from "/data.js";

const PAGES = {};
let COUNTER = 1;
let LANGUAGE = "eng";

function createNewElement(type, id, string) {
    const newElement = document.createElement(type);
    if (id) {
        newElement.id = id;
    }
    newElement.innerText = string;
    return newElement;
}

function addOptions(list) {
    const selectElement = document.getElementById("all");
    selectElement.appendChild(createNewElement("option", "please", "Please select a country"));
    const sortedList = list.toSorted(function (a, b) {
        if (a.name.common < b.name.common) {
            return -1;
        }
        if (a.name.common > b.name.common) {
            return 1;
        }
        return 0;
    });
    for (const country of sortedList) {
        const optionElement = createNewElement("option", "", country.name.common);
        optionElement.value = country.name.common;
        selectElement.appendChild(optionElement);
    }
}

function initLargest(list, buttonID, key) {
    const selectElement = document.getElementById("all");
    const button = document.getElementById(buttonID);
    button.addEventListener("click", function() {
        const currentCountry = list.filter((obj) => obj.name.common === selectElement.value)[0];
        if (currentCountry.borders) {
            const neighbours = collectNeighbours(list, currentCountry);
            const biggest = getBiggestNeighbour(neighbours, key);
            selectElement.value = biggest.name.common;
            setupPage(list);
        }
    });
}

function getBiggestNeighbour(list, key) {
    const biggest = list.reduce((acc, curr) => acc[key] > curr[key] ? acc : curr, list[0]);
    return biggest;
}

function collectNeighbours(list, countryObj) {
    const neighbours = [];
    for (const neighbour of countryObj.borders) {
        const neighbourObj = list.filter((obj) => neighbour === obj.cca3);
        neighbours.push(neighbourObj[0]);
    }
    return neighbours;
}

function displayDetails(countryObject) {
    const mainElement = document.getElementById("country");
    const flag = createNewElement("img", "", "");
    flag.src = countryObject.flags.png;
    const name = createNewElement("h1", "", countryObject.name.common);

    mainElement.innerHTML = "";

    mainElement.appendChild(flag);
    mainElement.appendChild(name);

    if (countryObject.region) {
        const region = createNewElement("h2", "", countryObject.region);
        mainElement.appendChild(region);
    }
    if (countryObject.subregion) {
        const subRegion = createNewElement("h3", "", countryObject.subregion);
        mainElement.appendChild(subRegion);
    }
    if (countryObject.capital) {
        const capital = createNewElement("h4", "", countryObject.capital);
        mainElement.appendChild(capital);
    }
    if (LANGUAGE !== "eng") {
        name.textContent = countryObject.translations[LANGUAGE].common;
    }
}

function setupPage(list) {
    const selectElement = document.getElementById("all");
    const currentCountry = list.filter((obj) => obj.name.common === selectElement.value)[0];

    displayDetails(currentCountry);

    toggleLargestButtons(currentCountry, "population");
    toggleLargestButtons(currentCountry, "area");
    togglePrevButtons("prev");
    toggleNextButton("next");

    PAGES[COUNTER] = selectElement.value;
    COUNTER++;
}

function initSelect(list) {
    const selectElement = document.getElementById("all");
    selectElement.addEventListener("change", function() {
        clearNext();
        setupPage(list);
        removePleaseOption();
    });
}

function removePleaseOption() {
    const selectElement = document.getElementById("all");
    const pleaseElement = document.getElementById("please");
    if (selectElement.childNodes[0] === pleaseElement) {
        pleaseElement.remove();
    }
}

function initPrevBtn(list) {
    const prevBtn = document.getElementById("prev");
    const selectElement = document.getElementById("all");
    prevBtn.addEventListener("click", function() {
        selectElement.value = PAGES[COUNTER - 2];
        COUNTER -= 2;
        setupPage(list);
    });
}

function initNextBtn(list) {
    const nextBtn = document.getElementById("next");
    const selectElement = document.getElementById("all");
    nextBtn.addEventListener("click", function() {
        selectElement.value = PAGES[COUNTER];
        setupPage(list);
    });
}

function toggleLargestButtons(country, buttonID) {
    if (country.borders) {
        enableButton(buttonID);
    } else {
        disableButton(buttonID);
    }
}

function togglePrevButtons(buttonID) {
    if (COUNTER > 1) {
        enableButton(buttonID);
    } else {
        disableButton(buttonID);
    }
}

function toggleNextButton(buttonID) {
    Object.keys(PAGES).length <= COUNTER ? disableButton(buttonID) : enableButton(buttonID);
}

function enableButton(buttonID) {
    const button = document.getElementById(buttonID);
    button.disabled = false;
    button.classList.add("enabled-btn");
}

function disableButton(buttonID) {
    const button = document.getElementById(buttonID);
    button.disabled = true;
    button.classList.remove("enabled-btn");
}

function clearNext() {
    const length = Object.keys(PAGES).length;
    for (let i = COUNTER; i <= length; i++) {
        delete PAGES[i];
    }
}

function initLanguageSelect() {
    const langSelector = document.getElementById("lang");
    const defaultLang = createNewElement("option", "", "eng");
    langSelector.appendChild(defaultLang);

    for (const language in countries[0].translations) {
        const option = createNewElement("option", "", language);
        langSelector.appendChild(option);
    }

    langSelector.addEventListener("change", function () {
        LANGUAGE = langSelector.value;
        if (COUNTER !== 1) {
            COUNTER--;
            setupPage(countries);
        }
    });
}

function initRedButton() {
    const redButton = document.getElementById("red-btn");
    redButton.addEventListener("click", async function () {
        const country = document.getElementById("all").value;
        const countdownContainer = createNewElement("div", "countdown-container", "3");
        const numberElement = createNewElement("p", "countdown", "");
        countdownContainer.appendChild(numberElement);
        document.body.appendChild(countdownContainer);
        await countDown();
        window.open(`https://en.wikipedia.org/wiki/${country}`);
        countdownContainer.remove();
    });
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function countDown() {
    const countDownElement = document.getElementById("countdown");
    for (let i = 3; i >= 1; i--) {
        countDownElement.textContent = i;
        await delay(1000);
    }
}

function main() {
    addOptions(countries);
    initSelect(countries);
    initLargest(countries, "population", "population");
    initLargest(countries, "area", "area");
    initPrevBtn(countries);
    initNextBtn(countries);
    initLanguageSelect();
    initRedButton();
}

window.addEventListener("load", main);
