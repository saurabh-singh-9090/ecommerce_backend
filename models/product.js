const mongoose = require("mongoose");
const{ObjectId} = mongoose.Schema;

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:true,
        maxlength:32
    },
    description:{
        type:String,
        maxlength:2000,
        trim:true,
        required:true
    },
    //Usually images/videos are stored in AWS s3 buckets from where we pull out their addresses whenever needed
    //But here, we would be accessing them from the dB itself
    photo:{
        data:Buffer,
        contentType:String
    },
    price:{
        type:Number,
        required:true,
        maxlength:32,
        trim:true
    },
    category:{
        type:ObjectId,
        ref:"Category",  //to map product with the Category schema
        required:true
    },
    stock:{
        type:Number
    },
    sold:{
        type:Number,
        default:0
    }

},{timestamps:true});

module.exports=mongoose.model("Product",productSchema);