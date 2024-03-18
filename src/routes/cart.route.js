import {
  Router
} from "express";
import CartManager from '../models/CartManager.js';
import Cart from "../models/Cart.js";
import path from 'path';

const router = Router();

const rootDir = path.resolve();

const cartManager = new CartManager(`${rootDir}/src/carts.json`, `${rootDir}/src/products.json`);

router.get('/:id', async (req, res) => {
    const cartId = req.params.id;
    res.send(await cartManager.getCartById(cartId));
});

router.post('/', async (req, res) => {
  try {
    res.send(await cartManager.addCart());
  } 
  catch (error) {
    console.log("error", error)
    return res.status(500).send({
      error: error.message
    });
  }
});

router.post('/:id/product/:productId', async (req, res) => {
  try {
    const cartId = req.params.id;
    const productId = req.params.productId;
    res.send(await cartManager.addProductToCart(cartId, productId));
  } 
  catch (error) {
    console.log("error", error)
    return res.status(500).send({
      error: error.message
    });
  }
});


export default router;