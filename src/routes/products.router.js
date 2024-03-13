import {Router} from "express";
import ProductManager from '../models/ProductManager.js';
import Product from "../models/Product.js";
import path from 'path';

const router = Router();

const rootDir = path.resolve();
const productManager = new ProductManager(`${rootDir}/src/products.txt`);

router.get('/', async (req, res) => {
    const limitProducts = req.query.limit;
    
    if (limitProducts !== undefined && isNaN(limitProducts)) {
        res.status(400).send({ error: 'Limit must be a number' });
        return;
    }

    res.send(await productManager.getProducts(limitProducts));
});

router.get('/:id', async (req, res) => {
    const productId = req.params.id;
    res.send(await productManager.getProductsById(productId));
});

router.post('/', async (req, res) => {
    const {title, description, price, thumbnail, code, stock, status}= req.body;
    const product = new Product(title, description, price, thumbnail, code, stock, status)
    res.send(await productManager.addProduct(product));
});

router.put('/', async (req, res) => {
    try {
        const {id,title, description, price, thumbnail, code, stock, status}= req.body;
        const product = new Product(title, description, price, thumbnail, code, stock, status)
        product.id =id;
        res.send(await productManager.updateProduct(product));
    } catch (error) {
    return res.status(500).send({error: error.message});
    }
});

router.delete('/:id', async (req, res) => {
    const productId = req.params.id;
    if (isNaN(productId)) {
        res.status(400).send({ error: 'id must be a number' });
        return;
    }
    res.send(await productManager.removeProductById(productId));
});

export default router;