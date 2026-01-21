import { products } from './data.js';

function createNewTextElement(type, id, string) {
    const newElement = document.createElement(type);
    if (id) {
        newElement.id = id;
    }
    newElement.innerText = string;
    return newElement;
}

function addRoot() {
    const rootElement = createNewTextElement("div", "root", "");
    document.body.appendChild(rootElement);
}

function createAlbums(albums, parent) {
    for (const album of albums) {
        const albumDiv = createNewTextElement("div", "", "");
        const albumHeading = createNewTextElement("h2", "", album.name);
        const skuParag = createNewTextElement("p", "", album.sku);
        const idHeading = createNewTextElement("h4", "", album.id);
        albumDiv.appendChild(albumHeading);
        albumDiv.appendChild(skuParag);
        albumDiv.appendChild(idHeading);
        createTracks(album.details, albumDiv);
        parent.appendChild(albumDiv);
    }
}

function createTracks(tracks, parent) {
    for (const track of tracks) {
        const trackDiv = createNewTextElement("div", "", "");
        const trackHeading = createNewTextElement("h4", "", track.name);
        const trackID = createNewTextElement("h4", "", track.track_id);
        const trackPrice = createNewTextElement("p", "", track.unit_price);
        trackDiv.appendChild(trackHeading);
        trackDiv.appendChild(trackID);
        trackDiv.appendChild(trackPrice);
        parent.appendChild(trackDiv);
    }
}

function getAlbumsLessThan(albums, maxPrice) {
    const lessAlbums = albums.filter((album) => album.price < maxPrice);
    return lessAlbums;
}

function getAlbumsStartingWith(albums, letter) {
    const result = albums.filter((album) => album.name[0].toLowerCase() === letter || album.name[0].toUpperCase() === letter);
    return result;
}

function getAlbumsAvgPrice(albums) {
    let priceSum = 0;
    for (const album of albums) {
        priceSum += album.price;
    }
    return Math.round(priceSum / albums.length * 100) / 100;
}

function createToolBar() {
    const toolsDiv = createNewTextElement("div", "tools", "");
    const numberInput = document.createElement("input");
    const letterInput = document.createElement("input");
    const searchBtn = createNewTextElement("button", "", "Search");
    toolsDiv.appendChild(numberInput);
    toolsDiv.appendChild(letterInput);
    toolsDiv.appendChild(searchBtn);
    document.body.prepend(toolsDiv);
    handlerOfSearch(searchBtn, numberInput, letterInput);
}

function handlerOfSearch(button, numberInput, letterInput) {
    const root = document.getElementById("root");
    button.addEventListener("click", function() {
        root.innerHTML = "";
        createAlbums(getAlbumsStartingWith(getAlbumsLessThan(products, numberInput.value), letterInput.value), root);
    });
}

const loadEvent = function() {
    addRoot();
    const root = document.getElementById("root");
    createAlbums(products, root);
    console.log(getAlbumsStartingWith(getAlbumsLessThan(products, 1000), "T"));
    console.log(getAlbumsAvgPrice(products));
    createToolBar();
};

window.addEventListener("load", loadEvent);
