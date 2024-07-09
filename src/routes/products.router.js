import {Router} from "express";
import Product from "../models/Product.js";
import {uploader} from '../helpers/utils.js';
import {admin,auth,premiumOrAdmin} from '../middlewares/auth.js';
import ProductController from "../controllers/productController.js";

const router = Router();
const productController = new ProductController();

router.get('/', auth, async (req, res) => {
    const { limit = 10, page = 1, sort, query } = req.query;
    if (limit !== undefined && isNaN(limit)) {
        res.status(400).send({ error: 'Limit must be a number' });
        return;
    }

    if (page !== undefined && isNaN(page)) {
        res.status(400).send({ error: 'Page must be a number' });
        return;
    }
    
    res.send(await productController.getAllProductsWithFilters(limit,page,sort,query));
});

router.get('/:id',admin, async (req, res) => {
    try
    {
        const productId = req.params.id;
        res.send(await productController.getProductsById(productId));
    }
    catch(e)
    {
        return res.status(500).send({error: e.message});
    }
});

router.post('/',premiumOrAdmin, async (req, res) => {
    try{
        const {email,role}= req.session.user;
        const {title, description, price, thumbnail, code, stock, status,category}= req.body;
        const product = new Product(title, description, price, thumbnail, code, stock, status,category)
        res.send(await productController.addProduct(product,role,email));
    }
    catch(error){
        return res.status(500).send({error: error.message});
    }

});

router.post('/imgToProduct',admin,uploader.single('file') , async (req, res) => {
    const {idProduct}= req.body;
    res.send(await productController.addImageToProduct(idProduct, req.file));
});

router.put('/:id',admin, async (req, res) => {
    try {
        const productId = req.params.id;
        const updatedFields = req.body;
        res.send(await productController.updateProduct(productId,updatedFields));
    } catch (error) {
    return res.status(500).send({error: error.message});
    }
});

router.delete('/:id',premiumOrAdmin, async (req, res) => {
    try{
        const productId = req.params.id;
        const {email,role}= req.session.user;
        const result = await productController.removeProductById(productId,role,email);
        res.send(result);
    }
    catch(error){
        return res.status(500).send({error: error.message});
    }
 
});

export default router;