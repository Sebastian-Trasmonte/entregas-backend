import {
    Router
} from "express";
import userModel from "../dao/models/userModel.js";
import {createHash,isValidPassword} from "../helpers/utils.js";

const router = Router();

router.post("/register", async (req, res) => {
    try {
        req.session.failRegister = false;
        const user = req.body;
        user.role = "usuario";
        user.password = createHash(user.password);
        await userModel.create(user);
        res.redirect("/login");
    } catch (e) {
        req.session.failRegister = true;
        res.redirect("/register");
    }
});

router.post("/login", async (req, res) => {
    try {
        req.session.failLogin = false;
        const {
            email,
            password
        } = req.body;
        const user = await userModel.findOne({
            email
        });

        if (!user) {
            req.session.failLogin = true;
            res.redirect("/login");
            return;
        }

        if (!isValidPassword(user, password)) {
            req.session.failLogin = true;
            res.redirect("/login");
            return;
        }
        delete user.password;
        req.session.user = user;

        
        if (user.role === "admin") {
            res.redirect("/");
            return;
        }
        res.redirect("/products");
    } catch (e) {
        req.session.failLogin = true;
        res.redirect("/login");
    }
});

router.post("/logout", async (req, res) => {
    req.session.user = null;
    res.redirect("/login");
});

router.post("/forgotPassword", async (req, res) => {
    const { email, password } = req.body;

        let hashedPassword = createHash(password);
        await userModel.findOneAndUpdate(
            { email: email },
            { password: hashedPassword }
        );

        res.redirect("/login");
});

export default router;