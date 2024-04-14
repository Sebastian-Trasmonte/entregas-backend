import {
    ProductCart
} from '../models/Cart.js';
import cartModel from './models/cartModel.js'
import productModel from './models/productModel.js'

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

        // let product;
        // try {
        //     product = productModel.findOne({
        //         _id: id
        //     });
        // } catch (error) {
        //     console.error(error.message);
        //     throw new Error("Error in find product")
        // }

        // if (!product) {
        //     throw new Error('Product does not exist');
        // }
     

        // try {
        //     await cartModel.findByIdAndUpdate(
        //             idCart, {
        //                 $set: {
        //                     thumbnail: file.originalname
        //                 }
        //             }, {
        //                 new: true
        //             }, // Para que devuelva el documento actualizado
        //         )
        //         .then(documentoActualizado => {
        //             console.log('The image was added successfully');
        //             return documentoActualizado;
        //         })
        //         .catch(err => {
        //             console.error('Error in insert image:', err);
        //         });
        // } catch (error) {
        //     console.error(error.message);
        //     throw new Error(`Error in add image to product, id ${idProduct}`)
        // }

        if (cart.productsCart.length != 0 && cart.productsCart.find(product => product.id === idProduct)) {
            cart.productsCart.find(product => product.id === idProduct).quantity += 1;
            const result = await cartModel.updateOne({
                _id: idCart
            }, cart);
            return result;
        } else {
            cart.productsCart.push(new ProductCart(idProduct, 1));
            const result = await cartModel.updateOne({
                _id: idCart
            }, cart);
            return result;
        }
    }
    getCartById = async (id) => {
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