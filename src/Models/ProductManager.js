import Product from './Product.js';
import { promises as fs } from 'fs';

export default class ProductManager {
    constructor(path) {
        this.products = [];
        this.path = path;
    }
    addProduct = async (product)  => {      
        if (!(product instanceof Product)) {
            return ("The product is invalid");
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
        return { message: `The product was added successfully`, id: product.id };
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
        return  { message: `The product was removed successfully`, id: id }
    }
    updateProduct=async(idProduct, updatedFields) =>{
        await this.#getProductsInArchive();
        const productIndex = this.products.findIndex(product => product.id == idProduct);

        if (productIndex === -1) {
            throw new Error('Product does not exist');
        }

        // Actualiza solo los campos que vienen en updatedFields
        const updatedProduct = { ...this.products[productIndex], ...updatedFields };

        // Reemplaza el producto en el índice encontrado con el producto actualizado
        this.products[productIndex] = updatedProduct;
        await this.#updateProductsArchive();
        return "The product was updated successfully";
    }
    #getProductsInArchive = async () => {
        const data = await fs.readFile(this.path, 'utf-8');
        if (data === "") {
            return;
        }
        this.products = JSON.parse(data);
    }
    #updateProductsArchive = async () => {
        fs.writeFile(this.path, JSON.stringify(this.products));   
    }
    addImageToProduct = async (idProduct, file) => {
        await this.#getProductsInArchive();
        let product = this.products.find(product => product.id == idProduct);
        if (product === undefined) {
            return "The product was not found";
        }
        product.thumbnail = file.filename;
        await this.#updateProductsArchive();
        return "The image was added successfully";
    }
}