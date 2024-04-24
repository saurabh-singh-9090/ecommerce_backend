const User = require("../models/user.js");
const { check, validationResult } = require('express-validator');
var jwt = require('jsonwebtoken');
var expressJwt = require("express-jwt");

exports.signup = (req,res) => {
  const errors = validationResult(req);
  
  if(!errors.isEmpty()){
        return res.status(422).json({
          error: errors.array()[0].msg
        });
  }
  
  const user = new User(req.body);//object 'user' created from class 'User'
  user.save((err,user) => {
       if(err){
        return res.status(400).json({
          err: "NOT able to save user in DB"
        });
       }
       res.json({
        name: user.name,
        email: user.email,
        id: user._id
       });
  });
};


exports.signin = (req,res) => {
  const errors = validationResult(req);
  const {email, password} = req.body;//destructure email and name from the request body

  //if validation fails
  if(!errors.isEmpty()){
    return res.status(422).json({
      error: errors.array()[0].msg
    });
}
  //find user by email into the DB
  User.findOne({email}, (err,user) => {
    if(err || !user){
      res.status(400).json({
        error: "Email does not exist"
      })
    }

    if(!user.authenticate(password)){
      return res.status(401).json({
        error: "Email and password do not match"
      })
    }

    //create token based on id of a user
    const token = jwt.sign({_id: user._id}, process.env.SECRET);

    //put the token into the cookie along with its expiry date
    res.cookie("token", token, {expire: new Date() + 9999});

    //send response to frontend
    const {_id, name, email, role} = user;
    return res.json({token, user: {_id, name, email, role}});//token will be stored in localstorage of the browser

  });
}


exports.signout = (req,res) => {
  res.clearCookie("token"); //clears cookie from the browser
  res.json({
      message: "user signed out successfully"
    });
};

//protected routes
exports.isSignedIn = expressJwt({
  secret: process.env.SECRET,
  userProperty: "auth"         //'auth' contains id of the signedIn user
});                   // Here 'next()' is already embedded inside expressJwt

//Custom middlewares
exports.isAuthenticated = (req,res,next) => {
  let checker = req.profile && req.auth && req.profile._id == req.auth._id;
  if(!checker){
     return res.status(403).json({
       error:"ACCESS DENIED"
     });
  }
  next();
}

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(403).json({
      error: "You are not ADMIN, Access denied"
    });
  }
  next();
};


