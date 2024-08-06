import {
    Router
} from "express";
import passport from "passport";
import UserController from "../controllers/userController.js";


const router = Router();
const userController = new UserController();

router.post("/register",
    passport.authenticate("register", {
        failureRedirect: "/api/session/failRegister",
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
                role: req.user.role,
                id: req.user._id,
                cart: req.cart
            }
            req.session.failLogin = false;

            if (req.user.role === "admin" || req.user.role === "premium") {
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
    userController.logout(req.user.email);
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
        if (req.user.role === "admin") {
            res.redirect("/");
            return;
        }
        res.redirect("/products");
    });

router.get("/current", async (req, res) => {
    res.send(req.session.user);
})

router.post("/forgotpassword", async (req, res) => {
    res.render(
        "forgotPassword", {
            title: "Forgot password",
            style: "index.css",
        }
    )
});

router.post("/getLinkForgetPassword", async (req, res) => {
    try {
        const {
            email
        } = req.body;
        await userController.getLinkForgetPassword(email);
        res.redirect("/login");
    } catch (e) {
        res.status(400).send({
            message: e.message,
            status: "error"
        });
    }
});

router.get("/resetpasswordcallback/:jwt", async (req, res) => {
    try {
        const jwt = req.params.jwt;
        let email = await userController.ValidateJWTPassword(jwt);
        res.render(
            "resetPassword", {
                title: "Reset password",
                email: email,
                style: "index.css",
            }
        )
    } catch (e) {
        res.status(400).send({
            message: e.message,
            status: "error"
        });
    }
});

router.post("/resetpassword", async (req, res) => {
    const {
        email,
        password
    } = req.body;
    try {
        await userController.resetPassword(email, password);
        res.redirect("/login");
    } catch (e) {
        res.status(400).send({
            message: e.message,
            status: "error"
        });
    }
});

export default router;