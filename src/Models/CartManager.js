import { promises as fs } from 'fs';
import Cart, { ProductCart } from './Cart.js';

export default class CartManager{
    constructor(pathCart, pathProduct) {
        this.carts = [];
        this.pathCart= pathCart;
        this.pathProduct = pathProduct;
    }
    addCart = async () => {
        await this.#getCartsInArchive();
       
        const idCart = this.#getMaxId() + 1;
        this.carts.push(new Cart(idCart));
        await this.#updateCartArchive();
        return `The cart was created successfully, id cart: ${idCart}`;
    }
    #getMaxId() {
        if (this.carts.length === 0) {
            return 0;
        }
        return Math.max(...this.carts.map(cart => cart.id));
    }
    addProductToCart = async (idCart, idProduct) => {
        const existentProducts = await this.#getProductsInArchive();
        const productExists = existentProducts.find(product => product.id == idProduct);

        if (!productExists) {
            throw new Error('Product does not exist');
        }

        await this.#getCartsInArchive();

        const cart = this.carts.find(cart => cart.id == idCart);

        if (!cart) {
            throw new Error('Cart does not exist');
        }

        if (cart.productsCart.length != 0 && cart.productsCart.find(product => product.id === idProduct)) 
        {
            cart.productsCart.find(product => product.id === idProduct).quantity += 1;
            await this.#updateCartArchive();
            return `The product was updated successfully to the cart with id: ${cart.id}`;
        }
        else{
            cart.productsCart.push(new ProductCart(idProduct, 1));
            await this.#updateCartArchive();
            return `The product was added successfully to the cart with id: ${cart.id}`;
        }              
    }
    getCartById = async(id) => {
        await this.#getCartsInArchive();
        let cart = this.carts.find(cart => cart.id == id);
        return cart ?? "Not found";
    }
    #getCartsInArchive = async () => {
        const data = await fs.readFile(this.pathCart, 'utf-8');
        if (data === "") {
            return;
        }
        this.carts = JSON.parse(data);
    }
    #updateCartArchive = async () => {
        fs.writeFile(this.pathCart, JSON.stringify(this.carts));   
    }
    #getProductsInArchive = async () => {
        const data = await fs.readFile(this.pathProduct, 'utf-8');
        if (data === "") {
            return;
        }
        return JSON.parse(data);
    }
}