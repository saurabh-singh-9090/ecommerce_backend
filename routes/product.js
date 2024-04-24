const express = require("express");
const router = express.Router();

const { getProductById, 
        createProduct, 
        getProduct, 
        photo, 
        deleteProduct,
        updateProduct,
        getAllProducts,
        getAllUniqueCategories
      } = require("../controllers/product");
const {isAdmin, isAuthenticated, isSignedIn} = require("../controllers/auth");
const {getUserById} = require("../controllers/user");

//params
router.param("userId", getUserById);
router.param("productId", getProductById);

//actual routes goes here-------------------------------------
//POST[Create route]
router.post("/product/create/:userId", isSignedIn, isAuthenticated, isAdmin, createProduct);

//GET[Read routes]
router.get("/product/:productId", getProduct);
router.get("/product/photo/:productId", photo);

//DELETE
router.delete("/product/:productId/:userId", 
       isSignedIn, 
       isAuthenticated, 
       isAdmin, 
       deleteProduct
);

//UPDATE
router.put("/product/:productId/:userId", 
       isSignedIn,
       isAuthenticated, 
       isAdmin, 
       updateProduct
);

//listing routes
router.get("/products", getAllProducts);
router.get("/products/categories", getAllUniqueCategories);


module.exports = router;