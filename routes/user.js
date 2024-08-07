const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../loginMiddleware.js");

const userController = require("../controllers/users.js");

//------------------------ signup user------------------------------
router
.route("/signup")
.get(userController.signUpUserForm)
.post(wrapAsync(userController.addsignUpUser))



//-------------------------- login User ---------------------
router
.route("/login")
.get(userController.userLoginForm)
.post(saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",saveRedirectUrl,failureFlash:true,}),
userController.addLoginUser);

//---------------------- logout user --------------------------

router.get("/logout",userController.logoutUser);

module.exports = router;