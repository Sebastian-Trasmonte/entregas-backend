import { Router } from "express";
import ProductManager from "../models/ProductManager.js";
import path from 'path';

const router = Router();
const rootDir = path.resolve();
const productManager = new ProductManager(`${rootDir}/src/products.json`);

router.get("/", async (req, res) => {

    const products = await productManager.getProducts();
    
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