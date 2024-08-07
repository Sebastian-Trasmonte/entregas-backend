import ProductService from '../repository/productService.js';
import socketServer from '../app.js';
import NotificationController from './notificationController.js';

export default class ProductController {

    constructor() {
        this.productService = new ProductService();
        this.notificationController = new NotificationController
    }

    async getAllProducts() {
        return this.productService.getAllProducts();
    }

    async getAllProductsWithFilters(limit, page, sort, query) {
        let sortOrder;
        if (sort === 'asc') {
            sortOrder = {
                price: 1
            }; // Orden ascendente por precio
        } else if (sort === 'desc') {
            sortOrder = {
                price: -1
            }; // Orden descendente por precio
        }

        return this.productService.getAllProductsWithFilters(limit, page, sortOrder, query);
    }

    async getProductsById(productId) {
        return this.productService.getProductsById(productId);
    }

    async addProduct(product, userRole, userEmail) {
        if (userRole == "premium") {
            product.owner = userEmail;
        }
        const result = this.productService.addProduct(product);

        if (result._id != undefined) {
            product._id = result._id.toString();
            socketServer.emit("product-added", product);
        }
        return result;
    }

    async addImageToProduct(idProduct, file) {
        return this.productService.addImageToProduct(idProduct, file);
    }

    async updateProduct(productId, updatedFields) {
        return this.productService.updateProduct(productId, updatedFields);
    }

    async removeProductById(productId, userRole, userEmail) {
        const product = await this.productService.getProductsById(productId);
        
        if (userRole == "premium") {
            if (product.owner != userEmail) {
                throw new Error("You can't delete this product, you are not the owner");
            }
        }
        if (product.owner != 'admin'){
            const info = {
                recipient: product.owner,
                subject: "Your product has been deleted",
                text: `Your product ${product.title} has been deleted by an admin. If you think this is a mistake, please contact us.`,
                title: "Product deleted"
            };
            this.notificationController.sendEmail(info);
        }      

        const result = this.productService.removeProductById(productId);
        return result
    }
}