import { Router } from "express";
//import ProductManager from "../dao/ProductManagerFS.js";
import ProductManager from "../dao/ProductManagerDB.js";
import path from 'path';

const router = Router();
const rootDir = path.resolve();
const productManager = new ProductManager();

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

export default router;