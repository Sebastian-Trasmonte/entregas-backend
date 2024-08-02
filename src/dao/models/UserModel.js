import mongoose from "mongoose";
import {
    createHash
} from "../../helpers/utils.js";

const userCollection = "users";

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
        minLength: 3
    },
    last_name: {
        type: String,
        minLength: 5
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String
    },
    age: {
        type: Number
    },
    role: {
        type: String,
        required: true,
        default: "user"
    },
    cart: {
        type: [{
            cart: {
                type: mongoose.Schema.ObjectId,
                ref: "carts"
            }
        }],
        default: []
    },
    documents: {
        type: [{
            name: {
                type: String
            },
            reference: {
                type: String
            }
        }]
    },
    last_connection: {
        type: Date,
        default: Date.now
    }
});

userSchema.pre("save", function (next) {   
    if (this.password)
    {
        this.password = createHash(this.password);
    }
    next();
});

const userModel = mongoose.model(userCollection, userSchema);
export default userModel;