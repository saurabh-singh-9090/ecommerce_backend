var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator');

const {signout, signup, signin, isSignedIn} = require("../controllers/auth");

router.post("/signup",[
    check("name","name should be atleast 3 characters").isLength({min: 3}),
    check("email","email is required").isEmail(),
    check("password","password should be atleast 3 char long").isLength({min: 3})
], signup);

router.post("/signin",[
    check("email","email is required").isEmail(),
    check("password","password is required").isLength({min: 1})
], signin);

router.get("/signout", signout);

//middleware example[Put Bearer token of signedIn user in Header of GET request]
// router.get("/testroute", isSignedIn, (req,res) => {
//     res.send(req.auth);//shows the id of signedIn user
// });



module.exports = router;