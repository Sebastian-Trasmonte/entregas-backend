import {Router} from "express";
import ProductManager from '../models/ProductManager.js';
import Product from "../models/Product.js";
import path from 'path';
import {uploader} from '../helpers/utils.js';

const router = Router();

const rootDir = path.resolve();
const productManager = new ProductManager(`${rootDir}/src/products.json`);

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


router.post('/imgToProduct',uploader.single('file') , async (req, res) => {
    const {idProduct}= req.body;
    res.send(await productManager.addImageToProduct(idProduct, req.file));
});


router.put('/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const updatedFields = req.body;
        res.send(await productManager.updateProduct(productId,updatedFields));
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