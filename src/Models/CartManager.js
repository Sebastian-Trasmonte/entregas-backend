import { promises as fs } from 'fs';
import Cart from './Cart.js';

export default class CartManager{
    constructor(pathCart, pathProduct) {
        this.carts = [];
        this.pathCart= pathCart;
        this.pathProduct = pathProduct;
    }
    addCart = async (cartToAdd) => {
        const existentProducts = await this.#getProductsInArchive();

        const nonExistentProduct = cartToAdd.productsCart.find(productCart => !existentProducts.some(product => product.id === productCart.id));
        
        if (nonExistentProduct !== undefined) {
            throw new Error(`Product with id ${nonExistentProduct.id} does not exist`);
        }

        await this.#getCartsInArchive();

        if (this.carts.length > 0) {
                   this.carts.forEach(existentCart => {
                    existentCart.productsCart.forEach(productInCart => {
                        const existingProductCart = cartToAdd.productsCart.find(p => p.id === productInCart.id);
                        if (existingProductCart) {
                            productInCart.quantity += existingProductCart.quantity;
                            cartToAdd.productsCart = cartToAdd.productsCart.filter(productToFilter => productToFilter.id != existingProductCart.id);
                        }});
                });
        }
       

        if (cartToAdd.productsCart.length > 0) {
            cartToAdd.id = this.#getMaxId() + 1;
            console.log("cartToAdd",cartToAdd)
            this.carts.push(cartToAdd);         
        }
        await this.#updateCartArchive();
        return 'The cart was added successfully';
    }
    #getMaxId() {
        if (this.carts.length === 0) {
            return 0;
        }
        return Math.max(...this.carts.map(cart => cart.id));
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