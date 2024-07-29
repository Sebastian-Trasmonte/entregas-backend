import NotificationController from './notificationController.js';
import UserService from "../repository/userService.js";
import {
    generateJWT,
    verifyJWT,
    createHash
} from '../helpers/utils.js';


export default class UserController {

    constructor() {
        this.notificationController = new NotificationController();
        this.userService = new UserService();
    }

    async getLinkForgetPassword(email) {
        let exists = await this.userService.userExists(email);
        if (!exists) {
            throw new Error("User does not exist");
        }

        let jwt = generateJWT(email);

        const info = {
            recipient: email,
            subject: "Forgot Password",
            text: `Click here to reset your password http://localhost:8080/api/session/resetpasswordcallback/${jwt}`,
            title: "Forgot Password"
        };
        this.notificationController.sendEmail(info);
    }

    async ValidateJWTPassword(jwt) {

        const jwtToken = verifyJWT(jwt);
        if (jwtToken === null || Date.now() > jwtToken.exp * 1000) {
            throw new Error("El tiempo de expiracion para resetear la contraseña ha expirado, genere uno nuevo");
        }

        return jwtToken.user;
    }

    async resetPassword(email, password) {
        let exists = await this.userService.userExists(email);
        if (!exists) {
            throw new Error("User does not exist");
        }

        let isSamePassword = await this.userService.resetIsSamePassword(email, password);
        if (isSamePassword) {
            throw new Error("Password cannot be the same as the current password");
        }

        let hash = createHash(password);
        await this.userService.updatePassword(email, hash);

        const info = {
            recipient: email,
            subject: "Password Reset",
            text: "Your password has been reset",
            title: "Password Reset"
        };
        await this.notificationController.sendEmail(info)
    }

    async getUser(email) {
        return await this.userService.getUser(email);
    }
    async changeUserRol(id) {
        return await this.userService.changeUserRol(id);
    }
    async login(email, password,done) {
        let user = await this.userService.getUser(email);
        if (!user) {
             return done(null, false, {
                message: "User not found"
            });
        }
        if (!this.userService.isSamePassword(user,password)) {
            return done(null, false, {
                message: "Invalid password"
            });
        }
        this.userService.updateSessionTime(email);
        return done(null, user);
    }
    async logout(email) {
        this.userService.updateSessionTime(email);  
    }
    async addDocumentToUser(email,files) 
    {
        return await this.userService.addDocumentToUser(email,files);
    }
}