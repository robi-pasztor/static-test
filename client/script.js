
/* eslint-disable consistent-return */
const CARSURL = "/api/products";

function createProducts(cars) {
    const root = document.getElementById("root");
    const carsDiv = document.createElement("div");
    carsDiv.id = "cars";

    cars.forEach((car) => {
        const div = document.createElement("div");
        div.id = car.id;

        const img = document.createElement("img");
        img.src = car.image_url;
        img.style.width = "200px";

        const carName = document.createElement("h2");
        carName.innerText = `${car.manufacturer} ${car.model}`;

        const hp = document.createElement("p");
        hp.innerText = `Horsepower: ${car.specs.horse_power} hp`;

        const topSpeed = document.createElement("p");
        topSpeed.innerText = `Top speed ${car.specs.top_speed_kmh} km/h`;

        const accelTime = document.createElement("p");
        accelTime.innerText = `0-100 km/h: ${car.specs.acceleration_0_100} sec`;

        const price = document.createElement("p");
        price.innerHTML = `<strong>${car.price_usd} $</strong>`;

        const buyButton = document.createElement("button");
        buyButton.innerText = "Buy";
        buyButton.dataset.buttonId = car.id;

        div.append(img, carName, hp, topSpeed, accelTime, price, buyButton);
        carsDiv.appendChild(div);
    });

    root.appendChild(carsDiv);
}

function createSessionStorage() {
    if (!sessionStorage.getItem("cart")) {
        sessionStorage.setItem("cart", JSON.stringify([]));
    }
}

function handlerOfBuyButton(products) {
    const buttons = document.querySelectorAll("[data-button-id]");
    buttons.forEach((button) => {
        button.addEventListener("click", function() {
            const storage = JSON.parse(sessionStorage.getItem("cart"));
            const id = Number(button.dataset.buttonId);
            const productToSave = products.find((product) => product.id === id);
            storage.push(productToSave);
            sessionStorage.setItem("cart", JSON.stringify(storage));
        });
    });
}


function createToolBar() {
    const div = document.createElement("div");
    div.id = "toolbar";

    const cartButton = document.createElement("button");
    cartButton.id = "cart";
    cartButton.innerText = "Cart";


    div.append(cartButton);
    document.body.prepend(div);
}

function handlerOfCartButton() {
    const button = document.getElementById("cart");
    const url = "/cart";
    button.addEventListener("click", function() {
        window.location.assign(url);
    });
}

async function fetchData(url) {
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.log(error);
    }
}

async function main() {
    const cars = await fetchData(CARSURL);
    createProducts(cars);
    createSessionStorage();
    handlerOfBuyButton(cars);
    createToolBar();
    handlerOfCartButton();
}

window.addEventListener("load", main);
