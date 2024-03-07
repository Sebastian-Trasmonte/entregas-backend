import express from 'express'
import ProductManager from './Models/ProductManager.js';


const app = express();

const productManager = new ProductManager('./products.txt');

app.get('/products', async (req, res) => {
    const limitProducts = req.query.limit;
    res.send(await productManager.getProducts(limitProducts));
});

app.get('/products/:id', async (req, res) => {
    const productId = req.params.id;
    res.send(await productManager.getProductsById(productId));
});

const PORT = 8080;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});