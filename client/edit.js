const CARSURL = "/api/products";

async function fetchData(url) {
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.log(error);
    }
}

function addNewProduct(cars) {
    const root = document.getElementById("root");
    const button = document.getElementById("add-new-product");
    button.addEventListener("click", function() {
        const div = document.createElement("div");
        const form = document.createElement("form");
        form.innerHTML = `
        <label>manufacturer: <input name="manufacturer" required></label><br>
        <label>model: <input name="model" required></label><br>
        <label>range_km: <input name="range_km" type="number" required></label><br>
        <label>charging_time_hours: <input name="charging_time_hours" type="number" step="0.1"></label><br>
        <label>price_usd: <input name="price_usd" type="number"></label><br>
        <label>features: <input name="features" placeholder="Comma,separated,features"></label><br>
        <label>horse_power: <input name="horse_power" type="number"></label><br>
        <label>top_speed_kmh: <input name="top_speed_kmh" type="number"></label><br>
        <label>acceleration_0_100: <input name="acceleration_0_100" type="number" step="0.1"></label><br>
        <label>image_url: <input name="image_url" type="url"></label><br>
        <button type="submit">Save</button>
        `;
        div.appendChild(form);
        root.prepend(div);
        handlerofCreateButton(form);
    });
}

function handlerofCreateButton(form) {
    form.addEventListener("submit", function() {
        const newProduct = {

            "manufacturer": form.manufacturer.value,
            "model": form.model.value,
            "range_km": parseInt(form.range_km.value),
            "charging_time_hours": parseFloat(form.charging_time_hours.value),
            "price_usd": parseFloat(form.price_usd.value),
            "features": form.features.value.split(",").map((product) => product.trim()),
            "specs": {
                "horse_power": parseInt(form.horse_power.value),
                "top_speed_kmh": parseInt(form.top_speed_kmh.value),
                "acceleration_0_100": parseFloat(form.acceleration_0_100.value),
            },
            "image_url": form.image_url.value,
        };
        postProduct(newProduct);
    });
}

async function postProduct(newProduct) {
    try {
        await fetch("/api/products", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newProduct),
        });
    } catch (error) {
        console.error(error);
    }
}

function displayAllProduct(cars) {
    const root = document.getElementById("root");
    cars.forEach((car) => {
        const div = document.createElement("div");
        const form = document.createElement("form");
        form.id = car.id;

        for (const key in car) {
            if (typeof car[key] !== "object" && key !== "id") {
                const br = document.createElement("br");
                const label = document.createElement("label");
                label.innerText = `${key}: `;
                label.setAttribute("for", key);
                const input = document.createElement("input");
                input.id = key;
                input.value = car[key];

                form.append(label, input, br);
            } else if (Array.isArray(car[key])) {
                const label = document.createElement("label");
                label.innerText = `${key}: `;
                label.setAttribute("for", key);
                form.appendChild(label);
                const input = document.createElement("input");
                input.id = key;
                input.value = car[key];

                form.append(input);
                const br = document.createElement("br");
                form.append(br);
            } else if (typeof car[key] === "object" && !Array.isArray(car[key])) {
                for (const nestedKey in car[key]) {
                    const br = document.createElement("br");
                    const label = document.createElement("label");
                    label.setAttribute("for", nestedKey);
                    label.innerText = `${nestedKey}: `;
                    const input = document.createElement("input");
                    input.id = nestedKey;
                    input.value = car[key][nestedKey];
        
                    form.append(label, input, br);
                }
            }
        }
        const button = document.createElement("button");
        button.innerText = "Edit";
        handlerOfEditButton(form);

        const deleteButton = document.createElement("button");
        deleteButton.id = "deleteBtn";
        deleteButton.type = "button";
        deleteButton.innerText = "Delete";
        handlerOfDeleteButton(deleteButton);

        form.appendChild(deleteButton);
        form.appendChild(button);
        div.appendChild(form);
        root.appendChild(div);
    });
}

function handlerOfDeleteButton(button) {
    button.addEventListener("click", function(event) {
        const id = event.target.parentElement.id;
        console.log(id);
        deleteProduct(id);
    });
}

function handlerOfEditButton(form) {
    form.addEventListener("submit", function(event) {
        event.preventDefault();
        const id = form.id;
        const replacement = {
            "manufacturer": event.target.manufacturer.value,
            "model": event.target.model.value,
            "range_km": event.target.range_km.value,
            "charging_time_hours": event.target.charging_time_hours.value,
            "price_usd": event.target.price_usd.value,
            "features": event.target.features.value.split(",").map((feature) => feature.trim()),
            "specs": {
                "horse_power": event.target.horse_power.value,
                "top_speed_kmh": event.target.top_speed_kmh.value,
                "acceleration_0_100": event.target.acceleration_0_100.value,
            },
            "image_url": event.target.image_url.value,
        };
        console.log(replacement);
        putProduct(id, replacement);
    });
}

async function deleteProduct(id) {
    try {
        await fetch(
            `/api/products/${id}`,
            {
                method: "DELETE",
            },
        );
    } catch (error) {
        console.error(error);
    }
}

async function putProduct(id, replacement) {
    await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(replacement),
    });
}

async function main() {
    const cars = await fetchData(CARSURL);
    displayAllProduct(cars);
    addNewProduct(cars);
}

main();
