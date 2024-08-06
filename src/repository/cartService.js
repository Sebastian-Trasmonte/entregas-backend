import CartManager from '../dao/CartManagerDB.js';

export default class CartService {
    constructor() {
        this.cartManager = new CartManager();
    }

    async getCartById(cartId) {
        return this.cartManager.getCartById(cartId);
    }

    async addCart(userId) {
        return await this.cartManager.addCart(userId);
    }

    async addProductToCart(cartId, productId,quantity) {
        return await this.cartManager.addProductToCart(cartId, productId,quantity);
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

    async updateProducts(id, products) {
        return await this.cartManager.updateProducts(id, products);
    }

    async purchaseCart(cartId) {
        return await this.cartManager.purchaseCart(cartId);
    }
    async getCartByUser(email) {
        return await this.cartManager.getCartByUser(email);
    }
}