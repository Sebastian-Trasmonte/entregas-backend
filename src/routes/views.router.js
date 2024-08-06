import {
    Router
} from "express";
import MessageManagerDB from "../dao/MessageManagerDB.js";
import {
    auth,
    user,
    premiumOrAdmin,
    admin
} from "../middlewares/auth.js";
import ProductController from "../controllers/productController.js";
import CartController from "../controllers/cartController.js";
import UserController from "../controllers/userController.js";

const router = Router();
const productController = new ProductController();
const messageManagerDB = new MessageManagerDB();
const cartController = new CartController();
const userController = new UserController();

router.get("/", premiumOrAdmin, async (req, res) => {
    const products = await productController.getAllProducts();
    res.render(
        "home", {
            title: "Products",
            products: products,
            style: "index.css",
            name: req.session.user.first_name,
            role: req.session.user.role,
            isAdmin: req.session.user.role === "admin",
            email: req.session.user.email
        }
    )
});

router.get("/login", async (req, res) => {
    res.render(
        "login", {
            style: "index.css",
            failLogin: req.session?.failLogin ?? false
        }
    )
});

router.get("/register", async (req, res) => {
    res.render(
        "register", {
            style: "index.css",
            failLogin: req.session?.failLogin ?? false
        }
    )
});

router.get("/forgotPassword", async (req, res) => {
    res.render(
        "forgotPassword", {
            style: "index.css",
        }
    )
});

router.get("/messages", user, async (req, res) => {

    const messages = await messageManagerDB.getAllMessages();
    res.render(
        "message", {
            title: "Messages",
            messages: messages,
            style: "index.css",
        }
    )
});

router.get("/products", auth, async (req, res) => {
    const {
        limit = 10, page = 1, sort, query
    } = req.query;

    if (limit !== undefined && isNaN(limit)) {
        res.status(400).send({
            error: 'Limit must be a number'
        });
        return;
    }

    if (page !== undefined && isNaN(page)) {
        res.status(400).send({
            error: 'Page must be a number'
        });
        return;
    }
    const result = await productController.getAllProductsWithFilters(limit, page, sort, query);

    const products = result.docs.map(product => {
        return product.toObject({
            getters: true
        });
    });

    res.render(
        "products", {
            title: "Products",
            products: products,
            style: "index.css",
            page: result.page,
            totalPages: result.totalPages,
            totalDocs: result.totalDocs,
            hasNextPage: result.hasNextPage,
            hasPrevPage: result.hasPrevPage,
            nextPage: result.nextPage,
            prevPage: result.prevPage,
            limit: limit,
            sort: sort,
            query: query,
            name: req.session.user.first_name,
            role: req.session.user.role
        }
    )
});

router.get("/productDetail/:id", auth, async (req, res) => {
    const id = req.params.id;
    const product = await productController.getProductsById(id);
    const user = req.session.user;
    if (user.cart == undefined || user.cart.length == 0) 
        {
        user.cart.push(await cartController.addCart(req.session.user._id));
        req.session.user = user;
    }
    res.render(
        "productDetail", {
            title: "Product details",
            product: product,
            style: "index.css",
            user: user,
            cartId: user.cart[0]._id,
        }
    )
});

router.get('/cart/:id', auth, async (req, res) => {
    const id = req.params.id;
    const cart = await cartController.getCartById(id);

    let total = 0;
    for (let item of cart.productsCart) {
        total += item.product.price * item.quantity;
    }

    const products = cart.productsCart.map(product => {
        return product.toObject({
            getters: true
        });
    });

    res.render('cart', {
        cartsProducts: products,
        total: total
    });
});

router.get('/resetPassword', async (req, res) => {
    res.render(
        "forgotPassword", {
            style: "index.css",
        }
    )
});

router.get('/users', async (req, res) => {
    const users = await userController.getAllUsers();
    res.render(
        "userManager", {
            style: "index.css",
            users: users,
            name: req.session.user.first_name,
            role: req.session.user.role,
        }
    )
});

export default router;