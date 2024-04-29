import {
    Router
} from "express";
import userModel from "../dao/models/userModel.js";
import {
    createHash
} from "../helpers/utils.js";
import passport from "passport";

const router = Router();

router.post("/register",
    passport.authenticate("register", {
        failureRedirect: "/api/ssesion/failRegister",
    }),
    async (req, res) => {
        try {
            req.session.failRegister = false;
            res.redirect("/login");
        } catch (e) {
            req.session.failRegister = true;
            res.redirect("/register");
        }
    });

router.get("/failRegister",
    (req, res) => {
        res.status(400).send({
            message: "Error al registrar usuario",
            status: "error"
        });
    });

router.post("/login",
    passport.authenticate("login", {
        failureRedirect: "/api/session/failLogin"
    }),
    async (req, res) => {
        try {
            if (!req.user) {
                req.session.failLogin = true;
                res.redirect("/login");
            }

            req.session.user = {
                first_name: req.user.first_name,
                last_name: req.user.last_name,
                email: req.user.email,
                age: req.user.age,
                role: req.user.role
            }
            req.session.failLogin = false;

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

router.get("/failLogin",
    (req, res) => {
        res.status(400).send({
            message: "Error al loguear usuario",
            status: "error"
        });
    });

router.post("/logout", async (req, res) => {
    req.session.user = null;
    res.redirect("/login");
});

router.post("/forgotPassword", async (req, res) => {
    const {
        email,
        password
    } = req.body;

    let hashedPassword = createHash(password);
    await userModel.findOneAndUpdate({
        email: email
    }, {
        password: hashedPassword
    });

    res.redirect("/login");
});

router.get("/login/github",
    passport.authenticate("github", {
        scope: ["user:email"]
    }),
    async (req, res) => {
        res.send("Session API");
    });

router.get("/githubcallback",
    passport.authenticate("github", {
        failureRedirect: "/login"
    }),
    async (req, res) => {
        req.session.user = req.user;
        res.redirect('/');
    });

export default router;