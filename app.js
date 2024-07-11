if(process.env.NODE_ENV != "production"){
  require('dotenv').config();
}
//console.log(process.env.SECRETE);


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const expressError = require("./utils/expressError.js");
//it is use for deployedment the project because the express session not support for deployment
const session = require("express-session");
const MongoStore = require('connect-mongo');
var flash = require('connect-flash');

 //const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbURL = process.env.ATLASDB_URL;

if (!dbURL) {
  throw new Error('MONGO_URL environment variable is not set');
}


const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js"); 


//routes
const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/reviews.js");
const userRouter = require("./routes/user.js");

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });


async function main() {
  await mongoose.connect(dbURL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const store = MongoStore.create({
  mongoUrl:dbURL,
  crypto: {
    secret: process.env.SECRET
  },
  touchAfter:24*3600,
  });
// if any error occure in MongoStore print error 
store.on("error",()=>{
 console.log("Error in MONGO SESSION STORE",err);
})

const sessionOption = {
  store,
  secret: process.env.SECRET,
  resave:false,
  saveUninitialized:true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // Sets expiry date 7 days from now
    maxAge: 7 * 24 * 60 * 60 * 1000, // Sets maximum age to 7 days
    httpOnly:true,//use for security purpose
  },
  
};
// app.get("/", (req, res) => {
//   res.send("Hi, I am root routs");
// });


app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
 res.locals.error = req.flash("error");
 res.locals.currUser = req.user;
 //console.log( res.locals.currUser);
  //console.log( res.locals.success);
  next();
});
//----------------- demo user signup------------------------------

// app.get("/demoUser",async(req,res)=>{
// let fakeUser = new User({
//   email:"mik@gmail.com",
//   username:"mikeeta"
// });
// let registeredUser  = await User.register(fakeUser,"helloworld");//use register method;
// res.send(registeredUser);
// });

//routes 
app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);


// app.get("/testListing", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "My New Villa",
//     description: "By the beach",
//     price: 1200,
//     location: "Calangute, Goa",
//     country: "India",
//   });

//   await sampleListing.save();
//   console.log("sample was saved");
//   res.send("successful testing");
// });


//custome mongoose
// function handleValidationError(err){
//   console.log("some valaidaton error occurse");
//   console.dir(err.message);
//    return err;
// }

// app.use((err,req,res,next)=>{
//   console.log(err.name);
//   if(err.name === "validationError"){
//       err = handleValidationError(err);
//   }
//  next(err);
// });
// custome expressError
app.all("*", (req, res, next) => {
  throw new expressError(404, "Page not found error !");
});


//err middleware
app.use((err, req, res, next) => {
  let { statusCode=500, message="something went wrong" } = err;
  res.status(statusCode).render("error.ejs",{message});
  // res.status(statusCode).send(message);
 // res.send("page not");
});



 app.listen(8080, () => {
  console.log("server is listening to port 8080");
 
});


// use for close server
// var server = app.listen(8080, () => {
//   console.log("server is listening to port 8080");
//   server.close(function() { console.log('Doh :('); });
// });