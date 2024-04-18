import {
    Router
} from "express";

import userModel from "../dao/models/UserModel";

const router = Router();

router.get("/register", async (req, res) => {
    try {
        req.session.failRegister = false;
        const user = req.body;
        await userModel.create(user);

        req.session.failRegister = true;
        res.redirect("/login");
    } catch (e) {
        res.redirect("/register");
    }
});


router.get("/login", async (req, res) => {
    try {
        req.session.failLogin = false;
        const {
            email
        } = req.body;
        const user = await userModel.findOne({
            email
        });
        if (!user) {
            req.session.failLogin = true;
            res.redirect("/login");
        }

        if (user.password !== req.body.password) {
            req.session.failLogin = true;
            res.redirect("/login");
        }
        delete user.password;
        req.session.user = user;
    } catch (e) {
        res.redirect("/login");
    }
});