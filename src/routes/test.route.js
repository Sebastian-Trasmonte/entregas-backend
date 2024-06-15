import {
    Router
} from "express";
import {
    generateUser,
    generateCart,
    generateProduct,
    generateProductErrorTitle
} from '../helpers/fakerUtils.js';
import ProductController from "../controllers/productController.js";
import Product from "../models/Product.js";
import userModel from "../dao/models/userModel.js";
import { errorsEnum } from "../helpers/errorsEnum.js";

const router = Router();
const productController = new ProductController();

router.get('/generateUser', async (req, res) => {
    res.send(
        generateUser()
    );
});

router.get('/generateCart', async (req, res) => {
    res.send(
        generateCart()
    );
});

router.get('/generateProduct', async (req, res) => {
    res.send(
        generateProduct()
    );
});

router.get('/', async (req, res) => {
    var resulttest = [];
    resulttest = await ProductTest();
    resulttest = resulttest.concat(await UserTest());
    res.send(resulttest);
});

const ProductTest = async () => {
    var resulttest = [];
    resulttest.push({
        test: 'AddProductFail',
        result: await AddProductFail()
    });
    resulttest.push({
        test: 'AddProductOk',
        result: await AddProductOk()
    });
    resulttest.push({
        test: 'GetProductIdInvalid',
        result: await GetProductIdInvalid()
    });
    resulttest.push({
        test: 'GetProductNotExists',
        result: await GetProductNotExists()
    });
    resulttest.push({
        test: 'AddProductIsNotAProduct',
        result: await AddProductIsNotAProduct()
    });
    resulttest.push({
        test: 'DeleteProductNotExists',
        result: await DeleteProductNotExists()
    });
    return resulttest;
}

const UserTest = async () => {
    var resulttest = [];
    resulttest.push({
        test: 'AddUserFailNameRequired',
        result: await AddUserFailNameRequired()
    });
    resulttest.push({
        test: 'AddUserOk',
        result: await AddUserOk()
    });
    return resulttest;
}

// #region UserTests

const AddUserFailNameRequired = async () => {
    try {
        var user = generateUser();
        delete user.first_name;
        const newUser = {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            age: user.age,
            password: user.password,
            role: user.role
        };
        await userModel.create(newUser);
        return false;
    } catch (error) {
        {
            if (error.message.includes("validation failed: first_name")) {
                return true;
            }
            return false;
        }
    }
}

const AddUserOk = async () => {
    var user = generateUser();
    const newUser = {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        age: user.age,
        password: user.password,
        role: user.role
    };
    var result = await userModel.create(newUser);
    return result._id != undefined ? true : false;
}

// #endregion UserTests

// #region ProductTests
const AddProductFail = async () => {
    try {
        var product = generateProductErrorTitle();
        const productfake = new Product(product.title, product.description, product.price, product.thumbnail, product.code, product.stock, product.status, product.category);
        return false;
    } catch (error) {
        {
            if (error.message == errorsEnum.REQUIRED_FIELDS) {
                return true;
            }
        }
    }
}

const AddProductOk = async () => {
    var product = generateProduct();
    const productfake = new Product(product.title, product.description, product.price, product.thumbnail, product.code, product.stock, product.status, product.category);
    var result = await productController.addProduct(productfake);
    return result._id != undefined ? true : false;
}

const GetProductIdInvalid = async () => {
    var productId = "123";
    var result = await productController.getProductsById(productId);
    return result == errorsEnum.INVALID_MONGOOSE_ID ? true : false;
}

const GetProductNotExists = async () => {
    var productId = "66754785030970d385a44321";
    var result = await productController.getProductsById(productId);
    return result == errorsEnum.NOT_FOUND ? true : false;
}

const AddProductIsNotAProduct = async () => {
    var product = generateProduct();
    var result = await productController.addProduct(product);
    return result == errorsEnum.INVALID_PRODUCT ? true : false;
}

const DeleteProductNotExists = async () => {
    var productId = "66754785030970d385a44321";
    var result = await productController.removeProductById(productId);
    return result == errorsEnum.NOT_FOUND ? true : false;
}

// #endregion ProductTests
export default router;