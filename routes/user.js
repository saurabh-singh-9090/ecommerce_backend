const express = require("express");
const router = express.Router();

const {getUserById, getUser, updateUser, userPurchaseList} = require("../controllers/user");
const {isAdmin, isAuthenticated, isSignedIn} = require("../controllers/auth");

//Here, getUserById populates the request.profile with the user object that is coming from the dB and 
//whenever there is ":any_data" in the route,that will be interpreted as 'userId'
router.param("userId", getUserById);

/* 
   Here, ':userId' calls 'getUserById' middleware which then returns 'req.profile' 
   containg all the datails of the user stored in the DB of that particular id which
   can be further used to authenticate the user or to perform another method on user
*/
router.get("/user/:userId", isSignedIn, isAuthenticated, getUser);

//Assignment to get all users from dB
//router.get("/users", getUsers);

router.put("/user/:userId", isSignedIn, isAuthenticated, updateUser);

router.get("/orders/user/:userId", isSignedIn, isAuthenticated, userPurchaseList);

module.exports = router;