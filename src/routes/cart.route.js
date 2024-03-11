import {Router} from "express";
import CartManager from '../models/CartManager.js';

const router = Router();

const productManager = new CartManager('./products.txt');

router.get('/', async (req, res) => {
    const limitProducts = req.query.limit;
    res.send(await productManager.getProducts(limitProducts));
});

router.get('/:id', async (req, res) => {
    const productId = req.params.id;
    res.send(await productManager.getProductsById(productId));
});

router.post('/', async (req, res) => {
    const productId = req.params.id;
    res.send(await productManager.a(productId));
});

export default router;