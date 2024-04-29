import {
    Router
} from "express";

import userModel from "../dao/models/userModel.js";

const router = Router();

router.post("/register", async (req, res) => {
    try {
        console.log("session register",req.session)
        req.session.failRegister = false;
        const user = req.body;
        await userModel.create(user);
        res.redirect("/login");
    } catch (e) {
        req.session.failRegister = true;
        res.redirect("/register");
    }
});

router.post("/login", async (req, res) => {
    try {
        console.log("session login",req.session)
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

        if (user.password !== password) {
            req.session.failLogin = true;
            res.redirect("/login");
            return;
        }
        delete user.password;
        req.session.user = user;

        res.redirect("/api/products");
    } catch (e) {
        req.session.failLogin = true;
        res.redirect("/login");
    }
});

router.post("/logout", async (req, res) => {
    req.session.user = null;
    res.redirect("/login");
});

export default router;