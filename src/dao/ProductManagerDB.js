import Product from '../models/Product.js';
import productModel from './models/productModel.js'

export default class ProductManagerDB {
    addProduct = async (product) => {
        const {
            title,
            description,
            code,
            price,
            stock,
            thumnails
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
                thumnails: thumnails ?? []
            });
            return result;
        } catch (error) {
            console.error(error.message);
            throw new Error("Error in create product");
        }
    }
    getAllProducts = async (limit) => {
        try {
            return await productModel.find().lean();
        } catch (error) {
            console.error(error.message);
            throw new Error("Error in find products")
        }
    }
    getProductsById = async (id) => {
        try {
            const product = await productModel.findOne({
                _id: id
            });
            return product ?? "Not found";
        } catch (error) {
            console.error(error.message);
            throw new Error(`Error in find product by id ${id}`)
        }
    }
    removeProductById = async (id) => {
        try {
            const result = await productModel.deleteOne({
                _id: id
            });

            if (result.deletedCount === 0){
                throw new Error(`Product id ${idProduct} not exists`) 
            }

            return result;
        } catch (error) {
            console.error(error.message);
            throw new Error(`Error in remove product, id ${idProduct}`)
        }
    }
    updateProduct = async (idProduct, updatedFields) => {
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