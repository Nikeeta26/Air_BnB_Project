const User = require("../models/user.js");
//signUp user form
module.exports.signUpUserForm = (req,res)=>
    {
        res.render("users/signup.ejs");
    };

//add signup user signUpUser
module.exports.addsignUpUser = async(req,res)=>{
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
};

//login  form of user
module.exports.userLoginForm = (req,res)=>{
    res.render("users/login.ejs");
  };

// add login user
module.exports.addLoginUser = async(req,res)=>{
    req.flash("success","Welcome to wanderlust! You are logged in!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
  //res.redirect("/listings");
};

//logout user 
module.exports.logoutUser = (req,res,next)=>{
    req.logout((err)=>{
    if(err){
      return next(err);
    }
    req.flash("success","You are logged out ");
    res.redirect("/listings");
    })
  
  };

