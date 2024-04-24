require('dotenv').config();

const mongoose = require("mongoose");
const express = require("express");
const app = express();//here 'app' can be considered as a server
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

//My Routes
const authRoutes = require("./routes/auth.js");
const userRoutes = require("./routes/user.js");
const categoryRoutes = require("./routes/category.js");
const productRoutes = require("./routes/product.js");
const orderRoutes = require("./routes/order.js");

//DB Connection
mongoose.connect(process.env.DATABASE,{
    useNewUrlParser: true,
    useUnifiedTopology:true,
    useCreateIndex:true
}).then(() => {
    console.log("DB CONNECTED...")
});

//Middlewares
app.use(bodyParser.json()); // parse application/json
app.use(cookieParser()); //It helps to create and put value in the cookies and also to delete the value from cookies of the browser
app.use(cors());

//My Routes
app.use("/api", authRoutes); //each route will start with '/api'
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", orderRoutes);

//PORT
const port = process.env.port  || 8000;

//Starting a server
app.listen(port, () => {
    console.log(`App is running at port: ${port}`)
});