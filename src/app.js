import express from 'express'
import productRouter from './routes/products.router.js'
import cartRouter from './routes/cart.route.js'

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

app.use("/api/products", productRouter);
app.use("/api/cart", cartRouter);

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

//cargar con multer las imagenes relacionadas a un id y luego
//usarlo para el producto (validar si existe el id si no tirar error)