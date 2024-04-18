export default class Cart{
    constructor(idCart) {
        this.productsCart = [];
        this.id = idCart;
    }
}

export class ProductCart{
    constructor(id, quantity) {
        this.id = id;
        this.quantity = quantity;
    }
}
