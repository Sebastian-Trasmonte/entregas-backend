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
        await this.#getProductsInArchive();
        const isProductExist = this.products.some(existingProduct => existingProduct.code === product.code);
        if (isProductExist) {
            return ("The product was exists in the list");
        }
        let lastIdOfProducts = this.#getMaxId();
        product.id = lastIdOfProducts + 1;
        this.products.push(product);
        await this.#updateProductsArchive();
        return `The product was added successfully id: ${product.id}`
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
        this.products = this.products.filter(product => product.id != id);
        await this.#updateProductsArchive();
        return "The product was removed successfully";
    }
    updateProduct = async(updatedProduct) =>{
        if (updatedProduct.id === undefined) {
            return "The id is required";
        }
        await this.#getProductsInArchive();
        this.products = this.products.map(product => {
            if (product.id === updatedProduct.id) {
                if (this.products.find(product => product.code === updatedProduct.code && product.id !== updatedProduct.id)) {
                  throw new Error("The product was exists in the list");
                }
                return {...product, ...updatedProduct};
            }

            return product;
        });
        await this.#updateProductsArchive();
        return "The product was updated successfully";
    }
    #getProductsInArchive = async () => {
        const data = await fs.readFile(this.path, 'utf-8');
        this.products = JSON.parse(data);
    }
    #updateProductsArchive = async () => {
        fs.writeFile(this.path, JSON.stringify(this.products));   
    }
}