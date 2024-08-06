import express from 'express'
import productRouter from './routes/products.router.js'
import cartRouter from './routes/cart.route.js'
import handlebars from "express-handlebars";
import {
    fileURLToPath
} from "url";
import {
    dirname
} from "path";
import viewsRouter from "./routes/views.router.js";
import {
    Server
} from "socket.io";
import Product from './models/Product.js';
import ProductController from './controllers/productController.js';
import MessageManagerDB from './dao/MessageManagerDB.js';
import mongoose from 'mongoose';
import sessionRouter from './routes/session.router.js';
import userRouter from './routes/user.router.js';
import testRouter from './routes/test.route.js';
import session from 'express-session';
import mongoStore from 'connect-mongo';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import inicializatePassport from './config/passportConfig.js';
import config from './config/config.js';
import {
    addLogger,
    logger
} from './helpers/logger.js';
import {
    cpus
} from 'os';
import cluster from 'cluster';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';
import CartController from './controllers/cartController.js';


let socketServer = null;

// if (cluster.isPrimary) {
//     for (let i = 0; i < cpus().length; i++) {
//         cluster.fork();

//     }

//     cluster.on('disconnect', worker => {
//         logger.info(`PID instance ${worker.process.pid} down, creating a new one...`);
//         cluster.fork();
//     });
// } else {
logger.info(`Creating a new instance of the server... ID: ${process.pid	}`);
const __filename = fileURLToPath(
    import.meta.url);
const __dirname = dirname(__filename);
const productController = new ProductController();
const cartController = new CartController();
const messageManager = new MessageManagerDB();

const app = express();

const conectionString = config.mongo_url;

mongoose.connect(conectionString);

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.use(express.static("public"));

app.use(cookieParser("random"));

app.use(session({
    store: mongoStore.create({
        mongoUrl: conectionString,
        mongoOptions: {
            useUnifiedTopology: true
        },
        ttl: 600
    }),
    secret: "secreto",
    resave: false, // prevents unnecessary session saves if the session wasn't modified.
    saveUninitialized: false // avoids saving empty sessions.
}));
inicializatePassport();
app.use(passport.initialize());
app.use(passport.session());
app.use(addLogger);

app.use("/api/products", productRouter);
app.use("/api/cart", cartRouter);
app.use("/", viewsRouter);
app.use("/api/session", sessionRouter);
app.use("/api/users", userRouter);

app.use("/mockingproducts", testRouter);

app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Manage API",
            version: "1.0.0",
            description: "A simple API to manage products, cart and users."
        },
    },
    apis: ['./src/docs/**/*.yaml']
};

const specs = swaggerJSDoc(swaggerOptions);
app.use("/api-docs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

const PORT = config.port;
const htppServer = app.listen(PORT, () => {
    logger.info("Server is running on port " + PORT)
});

socketServer = new Server(htppServer);
const messages = await messageManager.getAllMessages();
socketServer.emit("messagesLogs", messages);
socketServer.on("connection", (socket) => {
    socket.on("delete-product", async (idproduct, userRole, userEmail) => {
        try {
            await productController.removeProductById(idproduct, userRole, userEmail);
            socketServer.emit("product-deleted", idproduct);
        } catch (e) {
            socket.emit("error-occurred", e.message);
        }

    })
    socket.on("add-product", async (data) => {
        const {
            title,
            price,
            description,
            code,
            stock,
            category,
            userRole,
            userEmail
        } = data;
        const product = new Product(title, description, price, null, code, stock, true, category)
        const result = await productController.addProduct(product, userRole, userEmail);
        if (result._id != undefined) {
            product._id = result.id;
            socketServer.emit("product-added", product);
        }

    })
    socket.on("message", async data => {
        await messageManager.addMessage(data.user, data.message);
        const messages = await messageManager.getAllMessages();
        socketServer.emit("messagesLogs", messages);
    });
    socket.on("userConnect", data => {
        socket.emit("messagesLogs", messages);
        socket.broadcast.emit("newUser", data);
    });
    socket.on("add-to-cart", async data => {
        const {
            productId,
            quantity,
            cart,
            role,
            email
        } = data;
        try {
            await cartController.addProductToCart(cart, productId, role, email, quantity);
            socket.emit("productAddedToCart", productId);
        } catch (e) {
            socket.emit("error-occurred", e.message);
        }
    });
});


// }

export default socketServer;