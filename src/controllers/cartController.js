import CartService from '../repository/cartService.js';
import NotificationController from './notificationController.js';
import config from '../config/config.js';

export default class CartController {

    constructor() {
        this.cartService = new CartService();
        this.notificationController = new NotificationController();
    }

    async getCartById(cartId) {
        return this.cartService.getCartById(cartId);
    }

    async addCart() {
        return await this.cartService.addCart();
    }

    async addProductToCart(cartId, productId, role, email) {
        if (role == "premium") {
            const product = await this.productService.getProductsById(productId);
            if (product.owner == email) {
                throw new Error("You can't add this product to the cart, you are the owner");
            }
        }

        return await this.cartService.addProductToCart(cartId, productId);
    }

    async deleteProductFromCart(id, productId) {
        return await this.cartService.deleteProductFromCart(id, productId);
    }

    async deleteAllproductsFromCart(cartId) {
        return await this.cartService.deleteAllproductsFromCart(cartId);
    }

    async updateProductQuantity(id, productId, quantity) {
        return await this.cartService.updateProductQuantity(id, productId, quantity);
    }

    async updateProductQuantity(id, products) {
        return await this.cartService.updateProducts(id, products);
    }

    async purchaseCart(cartId) {
        let productWithStock = await this.cartService.purchaseCart(cartId);
        let productsName = productWithStock.map(product => product.product.title).join(', ');
        let info = {
            recipient: config.recipient,
            subject: 'Purchase made',
            text: 'The purchase was made successfully. The following products were purchased: ' + productsName,
            title: 'Purchase notification'
        };
        this.notificationController.sendNotification(info);
        return '';
    }
}