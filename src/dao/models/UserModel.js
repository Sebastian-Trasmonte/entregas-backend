import mongoose from "mongoose";

const userCollection = "users";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        max: 100
    },
    email: {
        type: String,
        required: true,
        max: 100
    },
    password: {
        type: String,
        required: true,
        max: 100
    },
    role: {
        type: String,
        required: true,
        max: 100
    }
});

const userModel = mongoose.model(userCollection, userSchema);
export default userModel;