import * as chai from 'chai';
import mongoose from 'mongoose';
import cartService from '../src/repository/cartService.js';
import productModel from '../src/dao/models/productModel.js';

const conectionString = "mongodb+srv://tpCoder:iEkbrfkVja0LHEwh@cluster0.uswvjfi.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(conectionString);
const service = new cartService();
const expect = chai.expect;

//correr npm test, ya está configurado en package.json
//para que haga watch 
//npx mocha --watch --parallel 
//ejecutar solo este test
//npx mocha .\test\Cart.repository.test.js
describe("Cart Model", () => {
    let productId = "123123";
    let cartId = "";
    before(async ()  => {
        //obtener el último product._id para las pruebas
        productId = await productModel.find().limit(1).then((products) => {
            return products[0]._id;
        });
    });
    after(() => {
       mongoose.connection.db.dropCollection("carts");
    });
    it("Agregar un carrito", async () => {
        const cart = await service.addCart();
        cartId = cart._id;
        expect(cart).to.be.an('object');
    });
    it("Agregar un producto al carrito", async () => {
        const product = await service.addProductToCart(cartId, productId);
        expect(product).to.be.an('object');
    });
    it ("Product id no es un id moongose valido", async () => {
        try {
            await service.addProductToCart(cartId, "123");
        } catch (error) {
            expect(error).to.be.an('error');
            expect(error.message).to.equal("Id cart or IdProduct is an invalid mongoose id");
        }
    });
    it ("Cart id no es un id moongose valido", async () => {
        try {
            await service.addProductToCart("123", productId);
        } catch (error) {
            expect(error).to.be.an('error');
            expect(error.message).to.equal("Id cart or IdProduct is an invalid mongoose id");
        }
    });
    it ("Carrito no existe",async () => {
        try {
            await service.addProductToCart("6684a93e18ae0d9a3ad4716d", productId);
        } catch (error) {
            expect(error).to.be.an('error');
            expect(error.message).to.equal("Cart does not exist");
        }
    });
    it ("cantidad de productos debe ser mayor a 0", async () => {
        try {
            await service.updateProductQuantity(cartId, productId, 0);
        } catch (error) {
            expect(error).to.be.an('error');
            expect(error.message).to.equal("Quantity must be greater than 0");
        }
    });
    it ("Actualizar la cantidad de productos en el carrito", async () => {
        const result = await service.updateProductQuantity(cartId, productId, 5);
        expect(result).to.be.an('object');
        expect(result.modifiedCount).to.equal(1);
    });
    it ("Eliminar todos los productos del carrito", async () => {
        const result = await service.deleteAllproductsFromCart(cartId);
        expect(result).to.be.an('object');
        expect(result.modifiedCount).to.equal(1);
    });
    it ("Eliminar el productId del carrito", async () => {
        await service.addProductToCart(cartId, productId);
        const result = await service.deleteProductFromCart(cartId, productId);
        console.log(result);
        expect(result).to.be.an('object');
        expect(result.modifiedCount).to.equal(1);
    });
    it ("Get del carrito", async () => {
        const result = await service.getCartById(cartId);
        expect(result).to.be.an('object');
    });
});