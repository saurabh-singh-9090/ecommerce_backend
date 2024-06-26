const express = require("express");
const router = express.Router();

const {isAdmin, isAuthenticated, isSignedIn} = require("../controllers/auth");
const {getUserById, pushOrderInPurchaseList} = require("../controllers/user");
const {updateStock} = require("../controllers/product");

const {getOrderById, createOrder, getAllOrders, getOrderStatus, updateStatus} = require("../controllers/order");

//params
router.param("userId", getUserById);
router.param("orderId", getOrderById);

//Actual routes
//create
router.post(
    "/order/create/:userId",
    isSignedIn,
    isAuthenticated,
    pushOrderInPurchaseList,
    updateStock,
    createOrder 
);


//read
router.get(
    "/order/all/:userId", 
    isSignedIn,
    isAuthenticated, 
    isAdmin, 
    getAllOrders
);

//status of Order
//NOTE: following routes can also be made for user by just removing the "isAdmin" middleware
router.get(
    "/order/status/:userId", 
    isSignedIn,
    isAuthenticated,
    isAdmin,
    getOrderStatus
);

router.put(
    "/order/:orderId/status/:userId",
    isSignedIn,
    isAuthenticated,
    isAdmin,
    updateStatus
);

module.exports = router;