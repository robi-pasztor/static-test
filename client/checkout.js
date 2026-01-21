function main() {
    const url = "/create/checkout";
    createCheckoutForm(url);
}
main();

function displaySuccess() {
    const root = document.getElementById("root");
    root.replaceChildren();
    const div = document.createElement("div");
    div.id = "success";
    const header = document.createElement("h1");
    header.innerText = "Your order was successful!";

    div.append(header);
    root.appendChild(div);
}


function createCheckoutForm(url) {
    const root = document.getElementById("root");
    const form = document.createElement("form");
    form.classList.add("checkoutForm");
    root.appendChild(form);

    const personalData = {
        "Name": "Nagy Farkas Laszlo",
        "Shipping address": {
            "ZIP code": "4432",
            "City": "Nyiregyhaza",
            "Street": "Kiraly utca",
            "House number": "69",
        },
        "Phone number": "+36302062463",
        "E-mail": "nagyfarkas@gmail.com",
    };

    Object.keys(personalData).forEach((dataKey) => {
        if (typeof personalData[dataKey] === "object") {
            Object.keys(personalData[dataKey]).forEach((nestedKey) => {
                const label = document.createElement("label");
                const br = document.createElement("br");

                label.textContent = nestedKey;
                label.setAttribute("for", nestedKey);

                const input = document.createElement("input");
                input.required  = true;
                input.name = nestedKey;
                input.id = nestedKey;
                input.placeholder = personalData[dataKey][nestedKey];


                form.append(label, input);
            });
        } else {
            const label = document.createElement("label");
            label.textContent = dataKey;
            label.setAttribute("for", dataKey);
            const br = document.createElement("br");
            const input = document.createElement("input");
            input.name = dataKey;
            input.id = dataKey;
            input.required  = true;
            input.placeholder = personalData[dataKey];

            if (dataKey === "Phone number"){
                input.type = "tel";
            } else if (dataKey === "E-mail"){
                input.type = "email";
            }

            form.append(label, input);

        }
    });
    const confirmButton = document.createElement("button");
    confirmButton.textContent = "Confirm";
    confirmButton.type = "submit";
    confirmButton.classList.add("confirmButton");
    form.appendChild(confirmButton);
    handleCheckOut(url);
}

function handleCheckOut(url) {
    const form = document.querySelector(".checkoutForm");
    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const personalData = {
            "Name": form.elements["Name"].value,
            "Shipping address": {
                "ZIP code": form.elements["ZIP code"].value,
                "City": form.elements["City"].value,
                "Street": form.elements["Street"].value,
                "House number": form.elements["House number"].value,
            },
            "Phone number": form.elements["Phone number"].value,
            "E-mail": form.elements["E-mail"].value,
        };
        await postNewUser(personalData, url);
        displaySuccess();
        setTimeout(() => {
            window.location.assign("/products");
        }, 2000);
        sessionStorage.removeItem("cart");
    });
};

async function postNewUser(newUserData, url) {
    await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newUserData),
    });
}
