import {
  Router
} from "express";
import CartManager from '../dao/CartManagerDB.js';

const router = Router();
const cartManager = new CartManager();

router.get('/:id', async (req, res) => {
  try {
    const cartId = req.params.id;
    res.send(await cartManager.getCartById(cartId));
  } catch (error) {
    console.log("error", error)
    return res.status(500).send({
      error: error.message
    });
  }

});

router.post('/', async (req, res) => {
  try {
    res.send(await cartManager.addCart());
  } catch (error) {
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
  } catch (error) {
    console.log("error", error)
    return res.status(500).send({
      error: error.message
    });
  }
});

router.delete('/:id/product/:productId', async (req, res) => {
  try {
    const {
      id,
      productId
    } = req.params;
    res.send(await cartManager.deleteProductFromCart(id, productId));
  } catch (err) {
    return res.status(500).send({
      error: err.message
    });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const cartId = req.params.id;
    res.send(await cartManager.deleteAllproductsFromCart(cartId));
  } catch (err) {
    return res.status(500).send({
      error: err.message
    });
  }
});

router.put('/:id/product/:productId', async (req, res) => {
  try {
    const {
      id,
      productId
    } = req.params;
    const quantity = req.body.quantity;
    res.send(await cartManager.updateProductQuantity(id, productId, quantity));
  } catch (err) {
    return res.status(500).send({
      error: err.message
    });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const products = req.body;
    res.send(await cartManager.updateProducts(id, products));
  } catch (err) {
    return res.status(500).send({
      error: err.message
    });
  }
});

export default router;