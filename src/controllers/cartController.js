import CartManager from '../dao/CartManagerDB.js';
import NotificationController from './notificationController.js';
import config from '../config/config.js';



export default class CartController {

    constructor() {
        this.cartManager = new CartManager();
        this.notificationController = new NotificationController();
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

    async purchaseCart(cartId) {
        let productWithStock = await this.cartManager.purchaseCart(cartId);
        let productsName = productWithStock.map(product => product.product.title).join(', ');
        let info = {
            recipient: config.recipient,
            subject: 'Purchase made',
            text: 'The purchase was made successfully. The following products were purchased: ' + productsName            
        };
        this.notificationController.sendNotification(info);
        return '';
    }
}