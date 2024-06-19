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
import ProductManagerDB from './dao/ProductManagerDB.js';
import MessageManagerDB from './dao/MessageManagerDB.js';
import mongoose from 'mongoose';
import sessionRouter from './routes/user.router.js';
import testRouter from './routes/test.route.js';
import session from 'express-session';
import mongoStore from 'connect-mongo';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import inicializatePassport from './config/passportConfig.js';
import config from './config/config.js';
import { addLogger,logger } from './helpers/logger.js';


const __filename = fileURLToPath(
    import.meta.url);
const __dirname = dirname(__filename);
const productManager = new ProductManagerDB();
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

app.use("/mockingproducts", testRouter);

app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

const PORT = config.port;
const htppServer = app.listen(PORT, () => {
    logger.info("Server is running on port " + PORT)

});

export const socketServer = new Server(htppServer);

const messages = await messageManager.getAllMessages();
socketServer.emit("messagesLogs", messages);
socketServer.on("connection", (socket) => {
    socket.on("delete-product", async (idproduct) => {
        await productManager.removeProductById(idproduct);
        socketServer.emit("product-deleted", idproduct);
    })

    socket.on("add-product", async (data) => {
        const {
            title,
            price,
            description,
            code,
            stock,
            category
        } = data;
        const product = new Product(title, description, price, null, code, stock,true, category)
        const result = await productManager.addProduct(product);
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
});