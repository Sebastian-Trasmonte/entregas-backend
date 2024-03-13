import {
  Router
} from "express";
import CartManager from '../models/CartManager.js';
import Cart from "../models/Cart.js";
import path from 'path';

const router = Router();

const rootDir = path.resolve();

const cartManager = new CartManager(`${rootDir}/src/carts.txt`, `${rootDir}/src/products.txt`);

router.get('/:id', async (req, res) => {
    const cartId = req.params.id;
    res.send(await cartManager.getCartById(cartId));
});

router.post('/', async (req, res) => {
  try {
    const productsCart = new Cart(req.body);
    res.send(await cartManager.addCart(productsCart));
  } 
  catch (error) {
    console.log("error", error)
    return res.status(500).send({
      error: error.message
    });
  }

});


export default router;