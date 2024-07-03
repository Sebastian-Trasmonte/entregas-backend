import { errorsEnum } from '../helpers/errorsEnum.js';
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
    changeUserRol = async (id) => {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return errorsEnum.INVALID_MONGOOSE_ID;
        }
        
        let user = await userModel.findById(id);
        let role = user.role == 'premium' ? 'user' : 'premium';
        await userModel.updateOne({
            _id: id
        }, {
            role: role
        });
        return role;
    }
}