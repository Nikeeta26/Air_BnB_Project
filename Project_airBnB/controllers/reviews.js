const Reviews = require("../models/reviews.js");
const Listing = require("../models/listing.js");

// add reviews
module.exports.createReviews = async(req,res)=>{
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
  };

  // delete reviews
  module.exports.destroyReviews = async(req,res)=>{
    let{id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Reviews.findByIdAndDelete(reviewId);
    req.flash("success","review delete successfully");
    res.redirect(`/listings/${id}`);
    };