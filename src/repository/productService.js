import ProductManagerDB from "../dao/ProductManagerDB.js";

export default class ProductService {
    constructor() {
        this.productManager = new ProductManagerDB();
    }

    async getAllProducts() {
        return this.productManager.getAllProducts();
    }

    async getAllProductsWithFilters(limit,page,sort,query) {
        return this.productManager.getAllProductsWithFilters(limit,page,sort,query);
    }

    async getProductsById(productId) {
        return this.productManager.getProductsById(productId);
    }

    async addProduct(product) {
        return this.productManager.addProduct(product);
    }

    async addImageToProduct(idProduct, file) {
        return this.productManager.addImageToProduct(idProduct, file);
    }

    async updateProduct(productId, updatedFields) {
        return this.productManager.updateProduct(productId,updatedFields);
    }

    async removeProductById(productId) {
        return this.productManager.removeProductById(productId);
    }
}