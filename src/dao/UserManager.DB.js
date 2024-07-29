import {
    errorsEnum
} from '../helpers/errorsEnum.js';
import userModel from './models/userModel.js';
import mongoose from 'mongoose';

export default class UserManager {
    getUser = async (email) => {
        const user = await userModel.findOne({
            email: email
        });
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
        if (user.role == 'premium') {
            user.role = 'user';
        } else {
            if (user.documents.length != 3) {
                return errorsEnum.USER_NOT_HAS_DOCUMENTS;
            }
            user.role = 'premium';
        }
        await userModel.updateOne({
            _id: id
        }, {
            role: user.role
        });
        return user.role;
    }
    updateSessionTime = async (email) => {
        await userModel.updateOne({
            email: email
        }, {
            last_connection: Date.now()
        });
    }
    addDocumentToUser = async (email,files) => {
        const dbFiles = files.map(file => {
            return {
                name: file.filename,
                reference: file.path
            }
        });
        await userModel.updateOne({
            email: email
        }, {
            $push: {
                documents: dbFiles
            }
        });
    }
}