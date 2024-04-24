const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema;

//Refer to my cart page of Flipkart for better understanding
const ProductCartSchema = new mongoose.Schema({
    product:{
        type:ObjectId,
        ref:"Product"
    },
    count: Number,
    price: Number, //count*price of each item
    name: String
});

const OrderSchema = new mongoose.Schema({
    products:[ProductCartSchema],
    transaction_id: {},
    amount:{type: Number},
    address:{type: String},
    status:{
        type:String,
        default: "Received",
        enum: ["Cancelled", "Delivered", "Shipped", "Received", "Processing"] //only these status names should be used in Order schema
    },
    updated: Date,
    user:{
        type: ObjectId,
        ref: "User"
    }
},{timestamps: true});

const Order = mongoose.model("Order", OrderSchema);
const ProductCart = mongoose.model("ProductCart", ProductCartSchema);
module.exports = {Order, ProductCart};