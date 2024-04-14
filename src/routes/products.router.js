import {Router} from "express";
// import ProductManager from '../dao/ProductManagerFS.js';
import ProductManagerDB from "../dao/ProductManagerDB.js";
import Product from "../models/Product.js";
import {uploader} from '../helpers/utils.js';
import {socketServer} from '../app.js';

const router = Router();
const productManager = new ProductManagerDB();

router.get('/', async (req, res) => {
    const limitProducts = req.query.limit;
    
    if (limitProducts !== undefined && isNaN(limitProducts)) {
        res.status(400).send({ error: 'Limit must be a number' });
        return;
    }

    res.send(await productManager.getAllProducts(limitProducts));
});

router.get('/:id', async (req, res) => {
    const productId = req.params.id;
    res.send(await productManager.getProductsById(productId));
});

router.post('/', async (req, res) => {
    const {title, description, price, thumbnail, code, stock, status}= req.body;
    const product = new Product(title, description, price, thumbnail, code, stock, status)
    const result = await productManager.addProduct(product);
    socketServer.emit("product-added", product);
    res.send(result);
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
    const result = await productManager.removeProductById(productId);
    socketServer.emit("product-deleted", result._id);
    res.send(result);
});

export default router;