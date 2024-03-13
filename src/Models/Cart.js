export default class Cart{
    constructor(productsCart) {
        productsCart.forEach(productcart => {
            if (productcart.id === undefined || productcart.quantity === undefined) {
                throw new Error('The productCart must have an id and a quantity');
            }
        });

        this.productsCart = productsCart;
        this.id = null;
    } 
}

export class ProductCart{
    constructor(id, quantity) {
        this.id = id;
        this.quantity = quantity;
    }
}