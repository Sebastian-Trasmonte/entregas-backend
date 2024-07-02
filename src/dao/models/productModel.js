import mongoose from "mongoose";
import moongosePaginate from "mongoose-paginate-v2";

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
    category: {
        type: String,
        required: true
    },
    owner : {
        type: String,
        required: true
    }
})

productSchema.plugin(moongosePaginate);
productSchema.pre("save", function (next) {
    this.owner = this.owner || "admin";
    next();
});

const productModel = mongoose.model(productCollection, productSchema);



export default productModel;