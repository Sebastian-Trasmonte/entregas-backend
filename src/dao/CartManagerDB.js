import {
    errorsEnum
} from '../helpers/errorsEnum.js';
import cartModel from './models/cartModel.js'
import productModel from './models/productModel.js'
import mongoose from 'mongoose';
import {
    logger
} from '../helpers/logger.js';
import userModel from './models/UserModel.js';
import Stripe from 'stripe';
import config from '../config/config.js';

const stripe = new Stripe(config.api_key_stripe);

export default class CartManagerDB {
    addCart = async (userId) => {
        try {
            const result = await cartModel.create({});
            await userModel.updateOne({
                _id: userId
            }, {
                cart: result
            });
            return result._id;
        } catch (error) {
            logger.error(error.message);
            throw new Error("Error in create cart");
        }
    }
    addProductToCart = async (idCart, idProduct, quantityToAdd) => {

        if (!mongoose.Types.ObjectId.isValid(idCart) || !mongoose.Types.ObjectId.isValid(idProduct)) {
            throw new Error("Id cart or IdProduct is an invalid mongoose id")
        }

        let cart;
        try {
            cart = await cartModel.findOne({
                _id: idCart
            });
        } catch (error) {
            logger.error(error.message);
            throw new Error("Error in find cart")
        }
        if (!cart) {
            throw new Error('Cart does not exist');
        }

        let product;
        try {
            product = await productModel.findOne({
                _id: idProduct
            });
        } catch (error) {
            logger.error(error.message);
            throw new Error("Error in find product")
        }

        if (!product) {
            throw new Error('Product does not exist');
        }

        if (quantityToAdd != undefined && product.stock < quantityToAdd) {
            throw new Error('There is not enough stock');
        }

        quantityToAdd = quantityToAdd ?? 1;

        if (cart.productsCart.length != 0 &&
            cart.productsCart.find(product => product.product.toString() === idProduct)) {
            const currentQuantity = Number(cart.productsCart.find(product => product.product.toString() === idProduct).quantity);
            
            if (currentQuantity + Number(quantityToAdd) > product.stock) {
                throw new Error('There is not enough stock');
            }
            cart.productsCart.find(product => product.product.toString() === idProduct).quantity = currentQuantity + Number(quantityToAdd);

            const result = await cartModel.updateOne({
                _id: idCart
            }, cart);
            return result;
        } else {
            cart.productsCart.push({
                product: idProduct,
                quantity: quantityToAdd
            });
            const result = await cartModel.updateOne({
                _id: idCart
            }, cart);
            return result;
        }
    }
    getCartById = async (id) => {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error("Id cart is an invalid mongoose id")
        }

        try {
            const cart = await cartModel.findById(id).populate('productsCart.product');
            return cart ?? errorsEnum.NOT_FOUND;
        } catch (error) {
            logger.error(error.message);
            throw new Error(`Error in find cart by id ${id}`)
        }
    }
    deleteProductFromCart = async (idCart, idProduct) => {
        if (!mongoose.Types.ObjectId.isValid(idCart) || !mongoose.Types.ObjectId.isValid(idProduct)) {
            throw new Error("Id cart or IdProduct is an invalid mongoose id")
        }
        let cart = await cartModel.findOne({
            _id: idCart
        });
        if (!cart) {
            throw new Error('Cart does not exist');
        }
        cart.productsCart = cart.productsCart.filter(productCarts => productCarts.product.toString() != idProduct);
        const result = await cartModel.updateOne({
            _id: idCart
        }, cart);
        return result;
    }
    deleteAllproductsFromCart = async (idCart) => {
        if (!mongoose.Types.ObjectId.isValid(idCart)) {
            throw new Error("Id cart is an invalid mongoose id")
        }
        let cart = await cartModel.findOne({
            _id: idCart
        });
        if (!cart) {
            throw new Error('Cart does not exist');
        }
        cart.productsCart = [];
        const result = await cartModel.updateOne({
            _id: idCart
        }, cart);
        return result;
    }
    updateProductQuantity = async (idCart, idProduct, quantity) => {
        if (!mongoose.Types.ObjectId.isValid(idCart) || !mongoose.Types.ObjectId.isValid(idProduct)) {
            throw new Error("Id cart or IdProduct is an invalid mongoose id")
        }
        let cart = await cartModel.findOne({
            _id: idCart
        });
        if (!cart) {
            throw new Error('Cart does not exist');
        }
        if (quantity <= 0) {
            throw new Error('Quantity must be greater than 0');
        }
        if (!cart.productsCart.find(productsCart => productsCart.product.toString() == idProduct)) {
            throw new Error(errorsEnum.PRODUCT_NOT_EXISTS_IN_CART);
        }
        cart.productsCart.find(productsCart => productsCart.product.toString() == idProduct).quantity = quantity;
        const result = await cartModel.updateOne({
            _id: idCart
        }, cart);
        return result;
    }
    updateProducts = async (idCart, products) => {
        if (!products.every(product => product._id && product.quantity)) {
            throw new Error('Products must have _id and quantity');
        }
        if (!mongoose.Types.ObjectId.isValid(idCart)) {
            throw new Error(errorsEnum.INVALID_MONGOOSE_ID)
        }

        let cart = await cartModel.findOne({
            _id: idCart
        });

        if (!cart) {
            throw new Error(errorsEnum.NOT_FOUND);
        }

        for (let product of products) {
            if (!isNaN(product._id) || !mongoose.Types.ObjectId.isValid(product._id)) {
                throw new Error(errorsEnum.INVALID_MONGOOSE_ID)
            }
            let productMongo = await productModel.findOne({
                _id: product._id
            });
            if (!productMongo) {
                throw new Error(errorsEnum.NOT_FOUND);
            }
        }
        cart.productsCart = products;
        const result = await cartModel.updateOne({
            _id: idCart
        }, cart);
        return result;
    }
    purchaseCart = async (idCart) => {
        let cart = await cartModel.findOne({
            _id: idCart
        }).populate('productsCart.product');
        if (!cart) {
            throw new Error(errorsEnum.NOT_FOUND);
        }
        let productsWithoutStock = [];
        let productWithStock = [];


        for (let product of cart.productsCart) {
            if (product.product.stock < product.quantity) {
                logger.warning('The product ' + product.product.title + ' does not have enough stock')
                productsWithoutStock.push(product);
            } else {
                productWithStock.push(product);
            }
        }
        if (productWithStock.length === 0) {
            throw new Error(errorsEnum.ENOUGHT_STOCK);
        }
        for (let product of productWithStock) {
            product.product.stock -= product.quantity;
            await productModel.updateOne({
                _id: product.product._id
            }, product.product);
        }
        cart.productsCart = productsWithoutStock;
        await cartModel.updateOne({
            _id: idCart
        }, cart);

        let total = 0;
        for (let item of productWithStock) {
            total += item.product.price * item.quantity;
        }
       
        const paymentIntent = await stripe.paymentIntents.create({
            amount: total * 100, // amount in cents
            currency: 'usd',
            payment_method_types: ['card'],
        });

        return productWithStock;
    }
    getCartByUser(email) {
        //hacer un get id con el email y luego buscar el carrito con ese id
        const cart = userModel.findOne({
            email
        }).populate('cart');
        return cart;
    }
}