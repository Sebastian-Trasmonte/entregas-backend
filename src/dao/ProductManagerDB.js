import { errorsEnum } from '../helpers/errorsEnum.js';
import Product from '../models/Product.js';
import productModel from './models/productModel.js'
import mongoose from 'mongoose';

export default class ProductManagerDB {
    addProduct = async (product) => {
       
        const {
            title,
            description,
            code,
            price,
            stock,
            thumnails,
            category
        } = product;

        if (!(product instanceof Product)) {
            return ("The product is invalid");
        }

        try {
            const result = await productModel.create({
                title,
                description,
                code,
                price,
                stock,
                category,
                thumnails: thumnails ?? []
            });
            return result;
        } catch (error) {
            
            if (error.code === 11000 || error.code === 11001) {
                return "The product code exists"
            }
            console.error(error.message);            
            throw new Error("Error in create product");
        }
    }
    getAllProducts = async () => {
        try {

          const products = await productModel.find().lean();
    
          return products;
        } catch (error) {
            console.error(error.message);
            throw new Error("Error in find products")
        }
    }
    getAllProductsWithFilters = async (limit,page,sort,query) => {
        try {

            let queryObj = null;
            if (query) {
                queryObj = JSON.parse(query);
            }
            const products = await productModel.paginate(queryObj, {
                limit: limit,
                page: page,
                sort: sort
            });
    
            return products;
        } catch (error) {
            console.error(error.message);
            throw new Error("Error in find products")
        }
    }
    getProductsById = async (id) => {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return errorsEnum.INVALID_MONGOOSE_ID;
        }
        try {
            const product = await productModel.findOne({
                _id: id
            }).lean();
            return product ?? "Not found";
        } catch (error) {
            console.error(error.message);
            throw new Error(`Error in find product by id ${id}`)
        }
    }
    removeProductById = async (id) => {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return errorsEnum.INVALID_MONGOOSE_ID;
        }
        try {
            const result = await productModel.deleteOne({
                _id: id
            });

            if (result.deletedCount === 0){
                return (errorsEnum.NOT_FOUND) 
            }

            return result;
        } catch (error) {
            console.error(error.message);
            throw new Error(`Error in remove product, id ${id}`)
        }
    }
    updateProduct = async (idProduct, updatedFields) => {
        if (!mongoose.Types.ObjectId.isValid(idProduct)) {
            return errorsEnum.INVALID_MONGOOSE_ID;
        }
        try {
            const result = await productModel.updateOne({
                _id: idProduct
            }, updatedFields);
            return result;
        } catch (error) {
            console.error(error.message);
            throw new Error(`Error in update product, id ${idProduct}`)
        }
    }
    addImageToProduct = async (idProduct, file) => {
        if (!mongoose.Types.ObjectId.isValid(idProduct)) {
            return errorsEnum.INVALID_MONGOOSE_ID;
        }
        try {
            await productModel.findByIdAndUpdate(
                idProduct,
                { $set: { thumbnail: file.originalname } },
                { new: true }, // Para que devuelva el documento actualizado
              )
              .then(documentoActualizado => {
                console.log('The image was added successfully');
                return documentoActualizado;
              })
              .catch(err => {
                console.error('Error in insert image:', err);
              });
        } catch (error) {
            console.error(error.message);
            throw new Error(`Error in add image to product, id ${idProduct}`)
        }
    }
}