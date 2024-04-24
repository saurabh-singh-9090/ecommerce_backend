const Product = require("../models/product");
const formidable = require("formidable");
const _ = require("lodash");//only used in "updateProduct" route
const fs = require("fs"); //'file system' module is present by default in nodeJs

exports.getProductById = (req, res, next, id) => {
    Product.findById(id)
    .populate("category")
    .exec((err, product) => {
        if(err){
            return res.status(400).json({
                error: "Product not found in DB"
            });
        }
        req.product = product;
        next();
    });
};

exports.createProduct = (req, res) => { //'formidable' module is used here
    
      let form = new formidable.IncomingForm(); //IncomingForm() captures the form data from the front-end and passes its reference to 'form' variable  
      form.keepExtensions = true; //  extensions like .png, .jpg, etc
      -
      form.parse(req, (err, fields, file) => {
        //console.log(fields);
        /*
          {
                name: 'I write Code',
                description: 'A classic T-shirt',
                price: '20',
                category: '62ca6ba6cd63420b2c7e632b',
                stock: '27'
          }
        */
        //console.log(file);
        if(err){
            return res.status(400).json({
                error: "Problem with image"
            });
        }
        
        //destructure the fields
        const {name, description, price, category, stock} = fields; //same as 'fields.name', 'fields.description', etc.
        
        if(!name || !description || !price || !category || !stock){
            return res.status(400).json({
                error: "Please include all fields"
            });
        }
        
        let product = new Product(fields);//'fields' will contain name,description,etc of the product
        
        //handle file here
        if(file.photo){
            if(file.photo.size > 3000000){
                return res.status(400).json({
                    error:"File size is too big"
                });
            }
            product.photo.data = fs.readFileSync(file.photo.path); //'readFileSync()' returns binary type data
            product.photo.contentType = file.photo.type; //"image/png"
        }
        // console.log(product);
        
        //save to the DB
        product.save((err, product) => {
            if(err){
                return res.status(400).json({
                    error: "Saving T-shirt in DB failed"
                });
            }
            res.json(product);
        });
      });
      
};

exports.getProduct = (req, res) => {
    req.product.photo = undefined;//it's made undefined because large binary file of photo might take longer time to be fetched from the database
    return res.json(req.product);//"req.product" is coming from "getProductById" middleware
};

//delete controller
exports.deleteProduct = (req, res) => {
    let product = req.product;
    product.remove((err, deletedProduct) => {
        if(err){
            return res.status(400).json({
                error: "Failed to delete the product"
            });
        }
        res.json({
            message: "Deletion successfull !!",
            deletedProduct //optional
        });
    });
};

//update controller
exports.updateProduct = (req, res) => {
    let form = new formidable.IncomingForm(); //IncomingForm() captures the form data from the front-end and passes its reference to 'form' variable  
    form.keepExtensions = true; //  extensions like .png, .jpg, etc
    
    form.parse(req, (err, fields, file) => {
      
      if(err){
          return res.status(400).json({
              error: "Problem with image"
          });
      }
      
      //updation code
      let product = req.product;
      product = _.extend(product, fields);//lodash used here
      
      //handle file here
      if(file.photo){
          if(file.photo.size > 3000000){ //approx 3MB
              return res.status(400).json({
                  error:"File size is too big"
              });
          }
          product.photo.data = fs.readFileSync(file.photo.path); //'readFileSync()' returns binary type data
          product.photo.contentType = file.photo.type; //"image/png"
      }
      // console.log(product);
      
      //save to the DB
      product.save((err, product) => {
          if(err){
              return res.status(400).json({
                  error: "Updation of Product failed"
              });
          }
          res.json(product);
      });
    });
};

//product listing
exports.getAllProducts = (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 8 ; //8 is the default value of limit if user doesn't specify a value through query
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";// sort as per '_id' by default

    Product.find()
    .select("-photo")  //don't select photo
    .sort([[sortBy, "asc"]]) /* one more eg: .sort([['updatedAt', 'descending']]),sort the 
                                products in desc order as per 'updatedAt' parameter        */
    .populate("category")
    .limit(limit)
    .exec((err, products)=>{
        if(err){
            return res.status(400).json({
                error:"No Products Found"
            });
        }
        res.json(products);
    });
};

exports.getAllUniqueCategories = (req, res) => {
    Product.distinct("category", {}, (err, categories) => {
        if(err){
            return res.status(400).json({
                error: "No Categories Found"
            });
        }
        res.json(categories);
    });
}


//middlewares

//Purpose here: [to load photo binary data in background while server is sending "req.product"]
exports.photo = (req, res, next) => {
    if(req.product.photo.data){
        res.set("Content-type", req.product.photo.contentType);
        return res.send(req.product.photo.data);
    }
    next();
};

exports.updateStock = (req, res, next) => {
    let myOperations = req.body.order.products.map(prod => { //"prod" refers to every single product present in "req.body.order.products"
        return{
            updateOne: {
                filter: {_id:prod._id},
                update: {$inc: {stock: -prod.count, sold: +prod.count}} //decrease stock count and increase sold count by 1 after every purchase
            }
        }
    });

    Product.bulkWrite(myOperations, {}, (err, products) => {
        if(err){
            return res.status(400).json({
                error: "Bulk Operation Failed!!"
            });
        }
        next();
    });
};