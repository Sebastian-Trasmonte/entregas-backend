import multer from "multer";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../config/config.js'


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `public/img/${req.multerRoute}`);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

export const uploader = multer({storage});

export const createHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

export const isSamePassword = (user, password) => {
    return bcrypt.compareSync(password, user.password);
}

export const generateJWT = (user) => {
    return jwt.sign({user}, config.jwt_secret, {expiresIn: "1h"});
}

export const verifyJWT = (token) => {
    try {
        return jwt.verify(token, config.jwt_secret);
    }
    catch (e) {
        return null;
    }
}