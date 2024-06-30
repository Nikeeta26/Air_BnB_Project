
const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner,validateListing} = require("../loginMiddleware.js");


// Index Route
router.get("/", wrapAsync(async (req, res) => {
  const allListings = await Listing.find({});
  res.render("./listings/index.ejs", { allListings });
}));

// New Route create Route
router.get("/new",isLoggedIn, (req, res) => {
  res.render("./listings/showNew.ejs");
});

router.post("/",isLoggedIn, validateListing, wrapAsync(async (req, res, next) => {
  const newListing = new Listing(req.body.listing);
  //console.log(req.user);
  newListing.owner = req.user._id;
  await newListing.save();
  req.flash("success","New listing create");
  res.redirect("/listings");
}));

// Edit Route Update Route
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if(!listing){
    req.flash("error","Listing you requested for does not exit");
    res.redirect("/listings");
    return;
  }
  res.render("./listings/edit.ejs", { listing });
}));

router.put("/:id",isLoggedIn,isOwner, validateListing, wrapAsync(async (req, res, next) => {
  let { id } = req.params;
  /* use one both of
   await Listing.findByIdAndUpdate(id, req.body.listing );*/
  await Listing.findByIdAndUpdate(id, {...req.body.listing });
  req.flash("success","edit successfully");
  res.redirect(`/listings/${id}`);
}));

// Delete Route
router.delete("/:id",isLoggedIn,isOwner, wrapAsync(async (req, res) => {
  let { id } = req.params;
  const deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success","Delete successfully");
  res.redirect("/listings");
}));

// Show Route
router.get("/:id", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"},}).populate("owner");
  if(!listing){
    req.flash("error","Listing you requested for does not exit");
    res.redirect("/listings");
    return;
  }
  console.log(listing);
  res.render("./listings/show.ejs", { listing });
});

module.exports = router;
