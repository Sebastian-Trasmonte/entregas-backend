import CartManager from '../dao/CartManagerDB.js';



export default class CartController {

    constructor() {
        this.cartManager = new CartManager();
    }

    async getCartById(cartId) {
        return this.cartManager.getCartById(cartId);
    }

    async addCart() {
        return await this.cartManager.addCart();
    }

    async addProductToCart(cartId, productId) {
        return await this.cartManager.addProductToCart(cartId, productId);
    }

    async deleteProductFromCart(id, productId) {
        return await this.cartManager.deleteProductFromCart(id, productId);
    }

    async deleteAllproductsFromCart(cartId) {
        return await this.cartManager.deleteAllproductsFromCart(cartId);
    }

    async updateProductQuantity(id, productId, quantity) {
        return await this.cartManager.updateProductQuantity(id, productId, quantity);
    }

    async updateProductQuantity(id, products) {
        return await this.cartManager.updateProducts(id, products);
    }


}