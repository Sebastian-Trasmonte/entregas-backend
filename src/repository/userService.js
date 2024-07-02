import UserManager from "../dao/UserManager.DB.js";
import {
    isSamePassword
} from '../helpers/utils.js';

export default class UserService {
    constructor() {
        this.userManager = new UserManager();
    }

    async userExists(email) {
        let user = await this.userManager.getUser(email);
        if (user) {
            return true;
        }
        return false;
    }

    async validatePassword(email, password) {
        let user = await this.userManager.getUser(email);
        if (user) {

            return isSamePassword(user,password);
        }
        return false;
    }

    async updatePassword(email, password) {
        await this.userManager.updatePassword(email, password);
    }

    async getUser(email) {
        return await this.userManager.getUser(email);
    }

};