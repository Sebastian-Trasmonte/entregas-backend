import { Router } from "express";
//import ProductManager from "../dao/ProductManagerFS.js";
import ProductManager from "../dao/ProductManagerDB.js";
import MessageManagerDB from "../dao/MessageManagerDB.js";

const router = Router();
const productManager = new ProductManager();
const messageManagerDB = new MessageManagerDB();

router.get("/", async (req, res) => {

    const { limit = 10, page = 1, sort, query } = req.query;
    const result = await productManager.getAllProducts(limit,page,sort,query);
    
    const products = result.docs.map(product => {
        return product.toObject({ getters: true });
    });

    console.log(products)
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

export default router;