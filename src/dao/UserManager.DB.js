import userModel from './models/userModel.js';
import mongoose from 'mongoose';

export default class UserManager {
    getUser = async (email)  => {     
        const user = await userModel.findOne({ email: email });
        return user;
    }
    updatePassword = async (email, password) => {
        await userModel.updateOne({
            email: email
        }, {
            password: password
        });
    }
}