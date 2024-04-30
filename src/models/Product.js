class Product {
    constructor(title, description, price,thumbnail,code,stock,status,category) {
       
        if (title === undefined || title === null ||
            description === undefined || description === null ||
            price === undefined || price === null ||           
            code === undefined || code === null || 
            stock === undefined || stock === null ||
            category === undefined || category === null) {
            throw new Error('Required fields are missing');
        }
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock;
        this.category = category;
        this.status = status ?? true;
    }
}

export default Product;