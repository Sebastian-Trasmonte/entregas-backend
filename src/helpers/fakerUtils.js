import {fakerES as faker} from '@faker-js/faker'
import {createHash} from './utils.js';

export const generateUser = () => { 
    return {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: createHash(faker.internet.password()),
        age: faker.person.age,
        role: faker.helpers.arrayElement(["user", "admin"]),
        cart: generateCart()
    };
}

export const generateCart = () => {
    let numOfProducts = faker.number.int({min: 1, max: 7});
    let productsCart = [];

    for (let i = 0; i < numOfProducts; i++) {
        productsCart.push({
            product: generateProduct(),
            quantity: faker.number.int(10)
        });
    }

    return {
        id: faker.database.mongodbObjectId(),
        productsCart
    }
}

export const generateProduct = () => {
    return {
            id:faker.database.mongodbObjectId(),
            title: faker.commerce.productName(),
            description: faker.lorem.sentence(),
            price: faker.commerce.price(),
            thumbnail: faker.image.url(),
            code: faker.string.alpha(10),
            stock:faker.number.int({min: 0, max: 50}),
            status: faker.datatype.boolean(),
            category: faker.commerce.department()
    };
};

export const generateProductErrorTitle = () => {
    return {
            id:faker.database.mongodbObjectId(),
            description: faker.lorem.sentence(),
            price: faker.commerce.price(),
            thumbnail: faker.image.url(),
            code: faker.string.alpha(10),
            stock:faker.number.int({min: 0, max: 50}),
            status: faker.datatype.boolean(),
            category: faker.commerce.department()
    };
};