const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const expressError = require("../utils/expressError.js");
const {reviewsSchema} = require("../schema.js");
const Reviews = require("../models/reviews.js");
const Listing = require("../models/listing.js");

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


  router.post("/",validateReview,wrapAsync(async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    
    //let data = req.body.review;
    let newReviews = new Reviews(req.body.review);
  
    listing.reviews.push(newReviews);
  
    await newReviews.save();
    await listing.save();
    console.log("save response");
  res.redirect(`/listings/${listing._id}`);
  }));
  
  //delete reviews
  
  router.delete("/:reviewId",wrapAsync (async(req,res)=>{
  let{id,reviewId} = req.params;
  await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
  await Reviews.findByIdAndDelete(reviewId);
  res.redirect(`/listings/${id}`);
  }));
  
  module.exports = router;