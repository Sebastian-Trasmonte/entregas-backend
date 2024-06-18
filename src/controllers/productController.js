import ProductService from '../repository/productService.js';
import {socketServer} from '../app.js';

export default class ProductController {

    constructor() {
        this.productService = new ProductService();
    }

    async getAllProducts() {
        return this.productService.getAllProducts();
    }

    async getAllProductsWithFilters(limit,page,sort,query) {
        let sortOrder;
        if (sort === 'asc') {
            sortOrder = { price: 1 }; // Orden ascendente por precio
        } else if (sort === 'desc') {
            sortOrder = { price: -1 }; // Orden descendente por precio
        }

        return this.productService.getAllProductsWithFilters(limit,page,sortOrder,query);
    }

    async getProductsById(productId) {
        return this.productService.getProductsById(productId);
    }

    async addProduct(product) {
        const result = this.productService.addProduct(product);

        if (result._id != undefined){
            product._id = result._id.toString();
            socketServer.emit("product-added", product);
        }
        return result;
    }

    async addImageToProduct(idProduct, file) {
        return this.productService.addImageToProduct(idProduct, file);
    }

    async updateProduct(productId, updatedFields) {
        return this.productService.updateProduct(productId,updatedFields);
    }

    async removeProductById(productId) {
        const result = this.productService.removeProductById(productId);
        socketServer.emit("product-deleted", productId);
        return result
    }
}