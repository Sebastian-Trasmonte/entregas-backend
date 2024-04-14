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

export class ProductCartDB{
    constructor(id, quantity) {
        this._id = id;
        this.quantity = quantity;
    }
}