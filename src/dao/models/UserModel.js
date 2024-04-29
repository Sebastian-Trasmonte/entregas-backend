import mongoose from "mongoose";

const userCollection = "users";

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String
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
        required: true
    }
});

const userModel = mongoose.model(userCollection, userSchema);
export default userModel;