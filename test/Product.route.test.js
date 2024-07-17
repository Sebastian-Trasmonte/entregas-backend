import * as chai from 'chai';
import supertest from 'supertest';
import sinon from 'sinon';

const requester = supertest('http://localhost:8080/api/products');
const loginRequester = supertest('http://localhost:8080/api/session');
const expect = chai.expect;

describe('Product routes', () => {
    let productId = "";
    let token = "";
    let productToDelete = "";
    it('POST /login, expects login user', async () => {
        const response = await loginRequester.post('/login').send({
            email: 'adminCoder@coder.com',
            password: 'adminCod3r123'
        });
        token = response.headers['set-cookie'][0];
    });
    it('GET /products, expects get all products', async () => {
        const response = await requester.get('/').set('Cookie', token);
        expect(response.status).to.equal(200);
        expect(response.body.docs).to.be.an('array');
        productId = response.body.docs[0]._id;
    });
    it('GET /products/:id, expects get product by id', async () => {
        const response = await requester.get(`/${productId}`).set('Cookie', token);
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('object');
    });
    it('POST /products, expects add a new product', async () => {
        const response = await requester.post('/').set('Cookie', token).send({
            title: 'Test',
            description: 'Test',
            price: 1,
            thumbnail: 'Test',
            code: 'Test',
            stock: 1,
            status: 'Test',
            category: 'Test'
        });
        productToDelete = response.body._id;
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('object');
    });
    it('PUT /products/:id, expects update a product', async () => {
        const response = await requester.put(`/${productToDelete}`).set('Cookie', token).send({
            title: 'Test2',
        });
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('object');
        expect(response.body.modifiedCount).to.equal(1);
    });
    it('DELETE /products/:id, expects delete a product', async () => {
        const response = await requester.delete(`/${productToDelete}`).set('Cookie', token);
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('object');
        expect(response.body.deletedCount).to.equal(1);
    });

});