class Product {
    constructor(title, description, price,thumbnail,code,stock) {
       
        if (title === undefined || title === null ||
            description === undefined || description === null ||
            price === undefined || price === null ||
            thumbnail === undefined || thumbnail === null||
            code === undefined || code === null || 
            stock === undefined || stock === null) {
            throw new Error('Required fields are missing');
        }
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock;
        this.id = null;
    }
}

export default Product;