import mongoose from "mongoose";
import userService from '../src/repository/userService.js';
import Assert from "assert";

const conectionString = "mongodb+srv://tpCoder:iEkbrfkVja0LHEwh@cluster0.uswvjfi.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(conectionString);
const assert = Assert.strict;
const service = new userService();

//para que haga watch 
//npx mocha --watch --parallel .\test\User.dao.test.js
//ejecutar 1 vez
//npx mocha .\test\User.repository.test.js
describe("User Model", () => {
    before(() => {});
    it("debe devolver el usuario del mail", () => {
        const user = service.getUser("adminCoder@coder.com");
        assert.notStrictEqual(user, null);
    });
    it ("existe el usuario", async () => {
        const exists = await service.userExists("adminCoder@coder.com");
        assert.equal(exists, true);
    });
    it ("usuario no existe", async () => {
        const exists = await service.userExists("admin@coder.com");
        assert.equal(exists, false);
    });
    it ("password correcta", async () => {
        const isSame = await service.validatePassword("adminCoder@coder.com","adminCod3r123");
        assert.equal(isSame, true);
    });
    it ("password invalida", async () => {
        const isSame = await service.validatePassword("adminCoder@coder.com","adminCod3r");
        assert.equal(isSame, false);
    });
});