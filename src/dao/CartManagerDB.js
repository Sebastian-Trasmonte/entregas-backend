import {
    ProductCartDB
} from '../models/Cart.js';
import cartModel from './models/cartModel.js'
import productModel from './models/productModel.js'
import mongoose from 'mongoose';

export default class CartManagerDB {
    addCart = async () => {
        try {
            const result = await cartModel.create({});
            return result;
        } catch (error) {
            console.error(error.message);
            throw new Error("Error in create cart");
        }
    }
    addProductToCart = async (idCart, idProduct) => {

        if (!mongoose.Types.ObjectId.isValid(idCart) || !mongoose.Types.ObjectId.isValid(idProduct)) {
            throw new Error("Id cart or IdProduct is an invalid mongoose id")
        }

        let cart;
        try {
            cart = await cartModel.findOne({
                _id: idCart
            });
        } catch (error) {
            console.error(error.message);
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
            console.error(error.message);
            throw new Error("Error in find product")
        }

        if (!product) {
            throw new Error('Product does not exist');
        }
        //661c05ccd59fa3806e4000a1
        const idProductMoongose = new mongoose.Types.ObjectId(idProduct);
        if (cart.productsCart.length != 0 && cart.productsCart.find(product => product._id.toString() === idProduct)) {
            cart.productsCart.find(product => product._id.toString() === idProduct).quantity += 1;
            const result = await cartModel.updateOne({
                _id: idCart
            }, cart);
            return result;
        } else {
            cart.productsCart.push(new ProductCartDB(idProduct, 1));
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
            const cart = await cartModel.findOne({
                _id: id
            });
            return cart ?? "Not found";
        } catch (error) {
            console.error(error.message);
            throw new Error(`Error in find cart by id ${id}`)
        }
    }
}