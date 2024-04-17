import { Router } from "express";
//import ProductManager from "../dao/ProductManagerFS.js";
import ProductManager from "../dao/ProductManagerDB.js";
import MessageManagerDB from "../dao/MessageManagerDB.js";

const router = Router();
const productManager = new ProductManager();
const messageManagerDB = new MessageManagerDB();

router.get("/", async (req, res) => {
    const products = await productManager.getAllProducts();

    res.render(
        "home",
        {
            title: "Products",
            products: products,
            style: "index.css",
        }
    )
});

router.get("/messages", async (req, res) => {
 
    const messages = await messageManagerDB.getAllMessages();
    res.render(
        "message",
        {
            title: "Messages",
            messages: messages,
            style: "index.css",
        }
    )
});

router.get("/products", async (req, res) => {
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

    const result = await productManager.getAllProductsWithFilters(limit,page,sortOrder,query);
        
    const products = result.docs.map(product => {
        return product.toObject({ getters: true });
    });

    res.render(
        "products",
        {
            title: "Products",
            products: products,
            style: "index.css",
            page: result.page,
            totalPages: result.totalPages,
            totalDocs: result.totalDocs,
            hasNextPage: result.hasNextPage,
            hasPrevPage: result.hasPrevPage,
            nextPage: result.nextPage,
            prevPage: result.prevPage,   
            limit: limit,
            sort: sort,
            query: query   
        }
    )
});

router.get("/productDetail/:id", async (req, res) => {
    const id = req.params.id;
    const product = await productManager.getProductsById(id);
    res.render(
        "productDetail",
        {
            title: "Product details",
            product: product,
            style: "index.css",
        }
    )
});

export default router;