const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const Reviews = require("../models/reviews.js");
const Listing = require("../models/listing.js");
const {isLoggedIn,validateReview,isreviewAthor} = require("../loginMiddleware.js");


  router.post("/",isLoggedIn,validateReview,wrapAsync(async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    
    //let data = req.body.review;
    let newReviews = new Reviews(req.body.review);
   newReviews.author = req.user._id;
    listing.reviews.push(newReviews);
    
    await newReviews.save();
    await listing.save();
    console.log("save response");
    req.flash("success","New reviews add successfully");
  res.redirect(`/listings/${listing._id}`);
  }));
  
  //delete reviews
  
  router.delete("/:reviewId",isLoggedIn,isreviewAthor,wrapAsync (async(req,res)=>{
  let{id,reviewId} = req.params;
  await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
  await Reviews.findByIdAndDelete(reviewId);
  req.flash("success","review delete successfully");
  res.redirect(`/listings/${id}`);
  }));
  
  module.exports = router;