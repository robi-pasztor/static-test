/* eslint-disable consistent-return */
import express from "express";
import fs, { readFileSync } from "node:fs";
import path from "path";
import url from "url";

const app = express();


const __filename =  url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, "../client");
const dataPath = path.join(__dirname, "/data.json");
const products = JSON.parse(readFiles("data.json"));

const PORT = 3000;
app.use(express.static(publicDir));
app.use(express.json());

function createID() {
    const updatedProducts = products.map((product, index) => ({id: index, ...product}));
    fs.writeFileSync(path.join(__dirname, "/data.json"), JSON.stringify(updatedProducts, null, 2));
}

// createID();

function readFiles(dataName) {
    try {
        const data = fs.readFileSync(dataName, "utf8");
        return data;
    } catch (err) {
        console.error(err);
    }
}

function replaceProduct(id, replacement) {
    const newProducts = JSON.parse(readFiles("data.json"));

    const productToReplace = newProducts.find((product) => product.id === id);
    Object.assign(productToReplace, replacement);

    const productsData = JSON.stringify(newProducts, null, 2);
    fs.writeFileSync(dataPath, productsData, "utf-8");
    return JSON.stringify(productToReplace, null, 2);
}

function createOrder(newOrder) {
    const order = JSON.parse(readFiles("orders.json"));
    const id = order[order.length - 1].id + 1;
    newOrder.id = id;
    order.push(newOrder);
    fs.writeFileSync(path.join(__dirname, "/orders.json"), JSON.stringify(order, null, 2), "utf-8");
    return JSON.stringify(order, null, 2);
}

function createNew(newProduct) {
    const currentData = JSON.parse(readFiles("data.json"));

    const newID = currentData.length > 0 ? Math.max(...currentData.map((product) => product.id)) + 1 : 0;
    newProduct.id = newID;
    currentData.push(newProduct);
    fs.writeFileSync(dataPath, JSON.stringify(currentData, null, 2));
    return JSON.stringify(newProduct);
}

function deleteProduct(id) {
    const currentData = JSON.parse(readFiles("data.json"));

    const filteredProducts = currentData.filter((product) => product.id !== id);

    fs.writeFileSync(dataPath, JSON.stringify(filteredProducts, null, 2));
    return JSON.stringify(filteredProducts);
}

app.put("/api/products/:id", (req, res) => {
    const productID = parseInt(req.params.id);
    const replacement = req.body;

    const replacedProduct = replaceProduct(productID, replacement);

    res.send(replacedProduct);
});


app.get("/products/edit", (req, res) => {
    res.sendFile(path.join(publicDir, "/edit.html"));
});

app.get("/products", (req, res) => {
    res.sendFile(path.join(publicDir, "/index.html"));
});

app.get("/api/products", (req, res) => {
    res.json(products);
});

app.get("/create/checkout", (req, res) => {
    res.sendFile(path.join(publicDir, "checkout.html"));
});

app.get("/cart", (req, res) => {
    res.sendFile(path.join(publicDir, "/cart.html"));
});

app.post("/create/checkout", (req, res) => {
    const newOrder = req.body;

    const createdOrder = createOrder(newOrder);

    res.send(createdOrder);
});

app.post("/api/products", (req, res) => {
    const newProduct = req.body;

    const createdPorduct = createNew(newProduct);

    res.send(createdPorduct);
});

app.delete("/api/products/:id", (req, res) => {
    const id = Number(req.params.id);
    const filteredList = deleteProduct(id);
    res.send(filteredList);
});

app.listen(PORT, function() {
    console.log(`Server runs on http://localhost:${PORT}`);
});
