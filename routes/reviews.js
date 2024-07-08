const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const Reviews = require("../models/reviews.js");
const Listing = require("../models/listing.js");
const {isLoggedIn,validateReview,isreviewAthor} = require("../loginMiddleware.js");

const reviewsController = require("../controllers/reviews.js");
  router.post("/",isLoggedIn,validateReview,wrapAsync(reviewsController.createReviews));
  
  //delete reviews
  
  router.delete("/:reviewId",isLoggedIn,isreviewAthor,wrapAsync (reviewsController.destroyReviews));
  
  module.exports = router;