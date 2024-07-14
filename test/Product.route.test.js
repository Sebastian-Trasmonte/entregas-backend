import * as chai from 'chai';
import supertest from 'supertest';
import sinon from 'sinon';

const requester = supertest('http://localhost:8080/api/products');
const expect = chai.expect;

describe('Product routes', () => {
    let productId = "";
    let mockAuth;
    before(() => {
        mockAuth = sinon.fake((req, res, next) => {
            req.session = {
                user: {
                    email: 'lalala@gmail.com',
                    role: 'admin'
                }
            };
            next();
        });
    });

    it('GET /products', async () => {
        const response = await requester.get('/').send();
        expect(response.status).to.equal(200);
        expect(response.body.docs).to.be.an('array');
        productId = response.body.docs[0]._id;
    });
});