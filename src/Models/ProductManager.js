import Product from './Product.js';
import { promises as fs } from 'fs';

export default class ProductManager {
    constructor(path) {
        this.products = [];
        this.path = path;
    }
    addProduct = async (product)  => {
        if (!(product instanceof Product)) {
            return console.log("The product is invalid");
        }
        const isProductExist = this.products.some(existingProduct => existingProduct.code === product.code);
        if (isProductExist) {
            return console.log("The product was exists in the list");
        }
        let lastIdOfProducts = this.#getMaxId();
        product.id = lastIdOfProducts + 1;
        this.products.push(product);
        await this.#updateProductsArchive();
    }
    #getMaxId() {
        if (this.products.length === 0) {
            return 0;
        }
        return Math.max(...this.products.map(product => product.id));
    }
    getProducts = async(limit) => {
        await this.#getProductsInArchive();
        return this.products.slice(0, limit);
    }
    getProductsById= async(id) =>{
        await this.#getProductsInArchive();
        let product = this.products.find(product => product.id == id);
        return product ?? "Not found";
    }
    removeProductById = async(id) =>{
        await this.#getProductsInArchive();
        this.products = this.products.filter(product => product.id !== id);
        await this.#updateProductsArchive();
    }
    updateProduct = async(updatedProduct) =>{
        this.products = this.products.map(product => {
            if (product.id === updatedProduct.id) {
                return {...product, ...updatedProduct};
            }
            return product;
        });
        await this.#updateProductsArchive();
    }
    #getProductsInArchive = async () => {
        const data = await fs.readFile(this.path, 'utf-8');
        this.products = JSON.parse(data);
    }
    #updateProductsArchive = async () => {
        fs.writeFileSync(this.path, JSON.stringify(this.products));   
    }
}

