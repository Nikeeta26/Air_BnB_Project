const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const wrapAsync = require("./utils/wrapAsync.js");
const expressError = require("./utils/expressError.js");
const {listingSchema,reviewsSchema} = require("./schema.js");
const Reviews = require("./models/reviews.js");

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


const validateListing = (req,res,next)=>{
  let {error} = listingSchema.validate(req.body);
  console.log(error);

  if(error){
    // let errMsg = error.details.map((el)=>
    //   el.message).join(",");
    
   throw new expressError(400,error);
  }
  else{
    next();
  }
}

const validateReview = (req,res,next)=>{
  let {error} = reviewsSchema.validate(req.body);
  console.log(error);

  if(error){
    // let errMsg = error.details.map((el)=>
    //   el.message).join(",");
    
   throw new expressError(400,error);
  }
  else{
    next();
  }
}

app.get("/", (req, res) => {
  res.send("Hi, I am root");
});

//Index Route
app.get("/listings", wrapAsync(async (req, res) => {
  const allListings = await Listing.find({});
  res.render("./listings/index.ejs", { allListings });
}));

//New Route create Route
app.get("/listings/new", (req, res) => {
  res.render("./listings/showNew.ejs");
});


app.post("/listings",validateListing ,wrapAsync( async (req, res, next) => {
 
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
  
}));

//Edit Route Update Route
app.get("/listings/:id/edit",wrapAsync( async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("./listings/edit.ejs", { listing });
}));

app.put("/listings/:id", validateListing, wrapAsync(async (req, res,next) => {
  let { id } = req.params;
//   if(!req.body.listing){
//     throw new expressError(400,"Send valid data for listing");
// }
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`);
}));


//delete Route
app.delete("/listings/:id",wrapAsync(async(req,res)=>{
   let{ id } = req.params;
   const deletedListing = await Listing.findByIdAndDelete(id);
   console.log(deletedListing);
   res.redirect("/listings");

}));

//Show Route
app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id).populate("reviews");
  res.render("./listings/show.ejs", { listing });
});


// reviews route
app.post("/listings/:id/reviews",validateReview,wrapAsync(async(req,res)=>{

  let listing = await Listing.findById(req.params.id);
  
  //let data = req.body.review;
  let newReviews = new Reviews(req.body.review);

  listing.reviews.push(newReviews);

  await newReviews.save();
  await listing.save();
  console.log("save response");
res.redirect(`/listings/${listing._id}`);
}));

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
  throw new expressError(404, "Page not found !");
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
