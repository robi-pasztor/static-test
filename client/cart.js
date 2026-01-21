function createDisplayCart() {
    const div = document.createElement("div");
    div.id = "display";
    const root = document.getElementById("root");
    root.replaceChildren();
    const cartContent = JSON.parse(sessionStorage.getItem("cart"));
    console.log(cartContent);
    cartContent.forEach((car) => {
        const carDiv = document.createElement("div");

        const image = document.createElement("img");
        image.src = car.image_url;
        image.style.width = "200px";

        const name = document.createElement("h3");
        name.innerText = `${car.manufacturer} ${car.model}`;

        const price = document.createElement("h3");
        price.innerText = `${car.price_usd} $`;

        const button = document.createElement("button");
        button.id = car.id;
        button.innerText = "Delete";
        handlerOfDeleteButton(button);

        carDiv.append(image, name, price, button);
        div.appendChild(carDiv);
    });

    const totalSum = cartContent.reduce((acc, car) => acc + Number(car.price_usd), 0);
    const totalElement = document.createElement("h2");
    totalElement.innerText = `Total: ${totalSum} $`;
    div.appendChild(totalElement);
    root.prepend(div);
}

function createContinueButton() {
    const root = document.getElementById("root");
    const button = document.createElement("button");
    button.innerText = "Continue to checkout";
    button.id = "continue";
    handlerOfContinue(button);

    root.appendChild(button);
}

function handlerOfContinue(button) {
    button.addEventListener("click", function() {
        window.location.assign("/create/checkout");
    });
}

function handlerOfDeleteButton(button) {
    button.addEventListener("click", function(event) {
        const cartContent = JSON.parse(sessionStorage.getItem("cart"));
        const filteredCart = cartContent.filter((product) => product.id !== Number(event.target.id));
        sessionStorage.setItem("cart", JSON.stringify(filteredCart));
        document.getElementById("display").replaceChildren();
        createDisplayCart();
        validateCart();
    });
}

function displayEmpty() {
    const root = document.getElementById("root");
    root.replaceChildren();
    const div = document.createElement("div");
    const header = document.createElement("h1");
    header.innerText = "Your cart is empty!";

    div.append(header);
    root.append(div);
}

function validateCart() {
    const cartContent = JSON.parse(sessionStorage.getItem("cart"));
    if (cartContent.length === 0) {
        displayEmpty();
    } else {
        createDisplayCart();
        createContinueButton();
    }
}

function main() {
    validateCart();
}

main();
