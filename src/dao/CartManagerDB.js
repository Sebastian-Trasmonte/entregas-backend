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
            const cart = await cartModel.findById(id).populate('productsCart.product');
            return cart ?? "Not found";
        } catch (error) {
            console.error(error.message);
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
        //eliminar el id del producto del carrito
        cart.productsCart = cart.productsCart.filter(product => product._id.toString() !== idProduct);
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
        //validar que el producto exista en el carrito
        if (!cart.productsCart.find(product => product._id.toString() === idProduct)) {
            throw new Error('Product does not exist in cart');
        }
        cart.productsCart.find(product => product._id.toString() === idProduct).quantity = quantity;
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
            throw new Error("Id cart is an invalid mongoose id")
        }

        let cart = await cartModel.findOne({
            _id: idCart
        });

        if (!cart) {
            throw new Error('Cart does not exist');
        }

        for (let product of products) {
            if (!isNaN(product._id) || !mongoose.Types.ObjectId.isValid(product._id)) {
                throw new Error("Id product is an invalid mongoose id")
            }
            let productMongo = await productModel.findOne({
                _id: product._id
            });
            if (!productMongo) {
                throw new Error(`Product ${product._id} does not exist`);
            }
        }
        cart.productsCart = products;
        const result = await cartModel.updateOne({
            _id: idCart
        }, cart);
        return result;
    }
}