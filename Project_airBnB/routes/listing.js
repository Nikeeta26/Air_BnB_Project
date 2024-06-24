// const express = require("express");
// const router = express.Router();
// const wrapAsync = require("../utils/wrapAsync.js");
// const expressError = require("../utils/expressError.js");
// const {listingSchema,reviewsSchema} = require("../schema.js");
// const Listing = require("../models/listing.js");

// const validateListing = (req,res,next)=>{
//   let {error} = listingSchema.validate(req.body);
//   console.log(error);

//   if(error){
//     // let errMsg = error.details.map((el)=>
//     //   el.message).join(",");
    
//    throw new expressError(400,error);
//   }
//   else{
//     next();
//   }
// }


// //Index Route
// router.get("/", wrapAsync(async (req, res) => {
//     const allListings = await Listing.find({});
//     res.render("./listings/index.ejs", { allListings });
//   }));
  
//   //New Route create Route
//   router.get("/new", (req, res) => {
//     res.render("./listings/showNew.ejs");
//   });
  
  
//   router.post("/",validateListing ,wrapAsync( async (req, res, next) => {
   
//     const newListing = new Listing(req.body.listing);
//     await newListing.save();
//     res.redirect("/listings");
    
//   }));
  
//   //Edit Route Update Route
//   router.get("/:id/edit",wrapAsync( async (req, res) => {
//     let { id } = req.params;
//     const listing = await Listing.findById(id);
//     res.render("./listings/edit.ejs", { listing });
//   }));
  
//   router.put("/:id", validateListing, wrapAsync(async (req, res,next) => {
//     let { id } = req.params;
//   //   if(!req.body.listing){
//   //     throw new expressError(400,"Send valid data for listing");
//   // }
//     await Listing.findByIdAndUpdate(id, { ...req.body.listing });
//     res.redirect(`/listings/${id}`);
//   }));
  
  
//   //delete Route
//   router.delete("/:id",wrapAsync(async(req,res)=>{
//      let{ id } = req.params;
//      const deletedListing = await Listing.findByIdAndDelete(id);
//      console.log(deletedListing);
//      res.redirect("/listings");
  
//   }));
  
//   //Show Route
//   app.get("/:id", async (req, res) => {
//     let { id } = req.params;
//     const listing = await Listing.findById(id).populate("reviews");
//     res.render("./listings/show.ejs", { listing });
//   });
  
//   module.exports = router;



const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const expressError = require("../utils/expressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    throw new expressError(400, error);
  } else {
    next();
  }
};



// Index Route
router.get("/", wrapAsync(async (req, res) => {
  const allListings = await Listing.find({});
  res.render("./listings/index.ejs", { allListings });
}));

// New Route create Route
router.get("/new", (req, res) => {
  res.render("./listings/showNew.ejs");
});

router.post("/", validateListing, wrapAsync(async (req, res, next) => {
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  req.flash("success","New listing create");
  res.redirect("/listings");
}));

// Edit Route Update Route
router.get("/:id/edit", wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if(!listing){
    req.flash("error","Listing you requested for does not exit");
    res.redirect("/listings");
    return;
  }
  res.render("./listings/edit.ejs", { listing });
}));

router.put("/:id", validateListing, wrapAsync(async (req, res, next) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  req.flash("success","edit successfully");
  res.redirect(`/listings/${id}`);
}));

// Delete Route
router.delete("/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  const deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success","Delete successfully");
  res.redirect("/listings");
}));

// Show Route
router.get("/:id", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id).populate("reviews");
  if(!listing){
    req.flash("error","Listing you requested for does not exit");
    res.redirect("/listings");
    return;
  }
  res.render("./listings/show.ejs", { listing });
});

module.exports = router;
