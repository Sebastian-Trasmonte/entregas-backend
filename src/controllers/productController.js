import ProductManagerDB from "../dao/ProductManagerDB.js";
import {socketServer} from '../app.js';

export default class ProductController {

    constructor() {
        this.productManager = new ProductManagerDB();
    }

    async getAllProducts() {
        return this.productManager.getAllProducts();
    }

    async getAllProductsWithFilters(limit,page,sort,query) {
        let sortOrder;
        if (sort === 'asc') {
            sortOrder = { price: 1 }; // Orden ascendente por precio
        } else if (sort === 'desc') {
            sortOrder = { price: -1 }; // Orden descendente por precio
        }

        return this.productManager.getAllProductsWithFilters(limit,page,sort,query);
    }

    async getProductsById(productId) {
        return this.productManager.getProductsById(productId);
    }

    async addProduct(product) {
        const result = this.productManager.addProduct(product);
        if (result._id != undefined){
            product._id = result._id.toString();
            socketServer.emit("product-added", product);
        }
        return result;
    }

    async addImageToProduct(idProduct, file) {
        return this.productManager.addImageToProduct(idProduct, file);
    }

    async updateProduct(productId, updatedFields) {
        return this.productManager.updateProduct(productId,updatedFields);
    }

    async removeProductById(productId) {
        const result = this.productManager.removeProductById(productId);
        socketServer.emit("product-deleted", productId);
        return result
    }
}