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
export default router;