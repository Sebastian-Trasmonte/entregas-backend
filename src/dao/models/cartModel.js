import mongoose from "mongoose";

const cartCollection = "carts";

const cartSchema = new mongoose.Schema({
    productsCart: {
        type: [{
            product: {
                type: mongoose.Schema.ObjectId,
                ref: "products"
            },
            quantity: {
                type: Number,
                default: 1
            }
        }],
        default: []
    }
})

const cartModel = mongoose.model(cartCollection, cartSchema);

export default cartModel;