import {
  Router
} from "express";
import {
  admin,
  user
} from '../middlewares/auth.js';
import CartController from "../controllers/cartController.js";
import { logger } from "../helpers/logger.js";

const router = Router();
const cartController = new CartController();

router.get('/:id', admin, async (req, res) => {
  try {
    const cartId = req.params.id;
    res.send(await cartController.getCartById(cartId));
  } catch (error) {
    logger.error(`error ${error}`)
    return res.status(500).send({
      error: error.message
    });
  }
});

router.post('/', admin, async (req, res) => {
  try {
    res.send(await cartController.addCart());
  } catch (error) {
    logger.error(`error ${error}`)
    return res.status(500).send({
      error: error.message
    });
  }
});

router.post('/:id/product/:productId', user, async (req, res) => {
  try {
    const cartId = req.params.id;
    const productId = req.params.productId;
    res.send(await cartController.addProductToCart(cartId, productId));
  } catch (error) {
    logger.error(`error ${error}`)
    return res.status(500).send({
      error: error.message
    });
  }
});

router.delete('/:id/product/:productId', admin, async (req, res) => {
  try {
    const {
      id,
      productId
    } = req.params;
    res.send(await cartController.deleteProductFromCart(id, productId));
  } catch (err) {
    return res.status(500).send({
      error: err.message
    });
  }
});

router.delete('/:id', admin, async (req, res) => {
  try {
    const cartId = req.params.id;
    res.send(await cartController.deleteAllproductsFromCart(cartId));
  } catch (err) {
    return res.status(500).send({
      error: err.message
    });
  }
});

router.put('/:id/product/:productId', user, async (req, res) => {
  try {
    const {
      id,
      productId
    } = req.params;
    const quantity = req.body.quantity;
    res.send(await cartController.updateProductQuantity(id, productId, quantity));
  } catch (err) {
    return res.status(500).send({
      error: err.message
    });
  }
});

router.put('/:id', admin, async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const products = req.body;
    res.send(await cartController.updateProducts(id, products));
  } catch (err) {
    return res.status(500).send({
      error: err.message
    });
  }
});

router.post('/:id/purchase', user, async (req, res) => {
  try {
    const cartId = req.params.id;
    res.send(await cartController.purchaseCart(cartId));
  } catch (error) {
    logger.error(`error ${error}`)
    return res.status(500).send({
      error: error.message
    });
  }
});

export default router;