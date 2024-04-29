import multer from "multer";
import bcrypt from 'bcrypt';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/img/products");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

export const uploader = multer({storage});

export const createHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

export const isValidPassword = (user, password) => {
    return bcrypt.compareSync(password, user.password);
}