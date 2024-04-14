import {
  Router
} from "express";
import CartManager from '../dao/CartManagerDB.js';
import path from 'path';

const router = Router();
const cartManager = new CartManager();

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