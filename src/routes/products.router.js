import {Router} from "express";
// import ProductManager from '../dao/ProductManagerFS.js';
import ProductManagerDB from "../dao/ProductManagerDB.js";
import Product from "../models/Product.js";
import {uploader} from '../helpers/utils.js';
import {socketServer} from '../app.js';
import {admin} from '../middlewares/auth.js';

const router = Router();
const productManager = new ProductManagerDB();

router.get('/', admin, async (req, res) => {
    const { limit = 10, page = 1, sort, query } = req.query;
    
    if (limit !== undefined && isNaN(limit)) {
        res.status(400).send({ error: 'Limit must be a number' });
        return;
    }

    if (page !== undefined && isNaN(page)) {
        res.status(400).send({ error: 'Page must be a number' });
        return;
    }
    let sortOrder;
    if (sort === 'asc') {
        sortOrder = { price: 1 }; // Orden ascendente por precio
    } else if (sort === 'desc') {
        sortOrder = { price: -1 }; // Orden descendente por precio
    }

    res.send(await productManager.getAllProductsWithFilters(limit,page,sortOrder,query));
});

router.get('/:id',admin, async (req, res) => {
    const productId = req.params.id;
    res.send(await productManager.getProductsById(productId));
});

router.post('/',admin, async (req, res) => {
    const {title, description, price, thumbnail, code, stock, status,category}= req.body;
    const product = new Product(title, description, price, thumbnail, code, stock, status,category)
    const result = await productManager.addProduct(product);
    if (result._id != undefined){
        product._id = result._id.toString();
        socketServer.emit("product-added", product);
    }
    res.send(result);
});

router.post('/imgToProduct',admin,uploader.single('file') , async (req, res) => {
    const {idProduct}= req.body;
    res.send(await productManager.addImageToProduct(idProduct, req.file));
});

router.put('/:id',admin, async (req, res) => {
    try {
        const productId = req.params.id;
        const updatedFields = req.body;
        res.send(await productManager.updateProduct(productId,updatedFields));
    } catch (error) {
    return res.status(500).send({error: error.message});
    }
});

router.delete('/:id',admin, async (req, res) => {
    const productId = req.params.id;
    const result = await productManager.removeProductById(productId);
    socketServer.emit("product-deleted", productId);
    res.send(result);
});

export default router;