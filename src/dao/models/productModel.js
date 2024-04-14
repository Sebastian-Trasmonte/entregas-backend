import mongoose from "mongoose";

const productCollection = "products";

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    thumbnail: {
        type: Array,
        required: false,
        default: []
    },
    code: {
        type: String,
        required: true,
        unique:true
    },
    stock: {
        type: Number,
        required: true
    },
    status: {
        type: Boolean,
        required: false,
        default: true
    },
})

const productModel = mongoose.model(productCollection, productSchema);

export default productModel;