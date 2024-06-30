const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../loginMiddleware.js");

//------------------------ signup user------------------------------
router.get("/signup",(req,res)=>
{
    res.render("users/signup.ejs");
});


router.post("/signup",wrapAsync(async(req,res)=>{
    try{    
  let{username,email,password} = req.body;
    const newUser =new User({ email,username });
    const registerUser = await User.register(newUser,password);

console.log(registerUser);
req.login(registerUser,(err)=>{
    if(err){
      return next(err);
    }
    req.flash("success","User signUp successfully");
    res.redirect("/listings");
    });
    } catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
          console.log(e); 
    }
}));


//-------------------------- login User ---------------------

router.get("/login",(req,res)=>{
  res.render("users/login.ejs");
});

router.post("/login",saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",saveRedirectUrl,failureFlash:true,}),
  async(req,res)=>{
          req.flash("success","Welcome to wanderlust! You are logged in!");
          let redirectUrl = res.locals.redirectUrl || "/listings";
          res.redirect(redirectUrl);
        //res.redirect("/listings");
});

//---------------------- logout user --------------------------

router.get("/logout",(req,res,next)=>{
  req.logout((err)=>{
  if(err){
    return next(err);
  }
  req.flash("success","You are logged out ");
  res.redirect("/listings");
  })

});

module.exports = router;