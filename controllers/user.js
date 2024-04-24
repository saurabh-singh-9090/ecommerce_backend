const User = require("../models/user");
const Order = require("../models/order");

exports.getUserById = (req, res, next, id) => {
    User.findById(id).exec((err, user) => {  //exec() performs the query operation in database
        // if error ocuured or user was not found in dB
        if(err || !user){
            return res.status(400).json({
                error:"No user found in DB"
            });
        }
        //if user was found, put it in request object
        req.profile = user;
        next(); //as getUserById is a middleware
    });
}

exports.getUser = (req, res) => {
   //password and salt should not be present in response object for security reasons,hence,they are made undefined
   req.profile.salt = undefined;
   req.profile.encry_password = undefined;
   req.profile.createdAt = undefined;
   req.profile.updatedAt = undefined;
   return res.json(req.profile);
}

//Assignment: Get all users from the database when we go for "/api/users" route.
/*

exports.getUsers =(req,res)=>{
    User.find().exec((err,users)=>{
        if(err || !users){
            return res.status(400).json({
                error:"users not found"
            })
        }
        res.json(users);
    });
}

*/

exports.updateUser = (req, res) => { 
    User.findByIdAndUpdate(
        {_id: req.profile._id},
        {$set: req.body},
        {new: true, useFindAndModify: false}, //compulsory parameters to update the user in DB
        //callback: ()=>{}
        (err, user) => {
           if(err){
               return res.status(400).json({
                   error:"User was not updated in DB"
               });
           }
           user.salt = undefined;
           user.encry_password = undefined;
           res.json(user);
        }
    );
}

/*
   Need of Population[Mongoose populate method]: Whenever in the schema of one 
   collection we provide a reference (in any field) to a document from any other
   collection, we need a populate() method to fill the field with that document.
*/
exports.userPurchaseList = (req,res) => {
      Order.find({user: req.profile._id})
      .populate("user","_id name")//only populate 'id' and 'name' of the user in order schema
      .exec((err, order) =>  {
          if(err){
              return res.status(400).json({
                  error:"No order in this account"
              });
          }
          return res.json(order);
      });
}

//doubt
//middleware to update purchases
exports.pushOrderInPurchaseList = (req, res, next) => {
   let purchases = []
   req.body.order.products.forEach( product => {
       purchases.push({
           _id: product._id,
           name: product.name,
           quantity: product.quantity,
           description: product.description,
           category: product.category,
           amount: req.body.order.amount,
           transaction_id: req.body.order.transaction_id
       });
   });
   
   //save purchase list to DB
   User.findOneAndUpdate(
       {_id: req.profile._id},
       {$push: {purchases: purchases}},
       {new: true},
       (err,purchases) => {
           if(err){
               return res.status(400).json({
                   error:"Unable to save purchase list"
               });
           }
           next();
       }
   );
}