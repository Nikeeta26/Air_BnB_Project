
const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner,validateListing} = require("../loginMiddleware.js");

const listingController = require("../controllers/listings.js");

//router.router
  // Index Route and  New Route create Route
router
.route("/")
.get( wrapAsync(listingController.index))
//.post(isLoggedIn, validateListing, wrapAsync(listingController.addListing));
.post((req,res)=>{
  res.send(req.body);
});

// New Route create Route 
router.get("/new",isLoggedIn,listingController.renderNewform);


//edit , delete, show
router
.route("/:id")
.get(listingController.showListing )
.put(isLoggedIn,isOwner, validateListing, wrapAsync(listingController.UpdateData))
.delete(isLoggedIn,isOwner, wrapAsync(listingController.destroyListing))

// Edit Route Update Route 
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.editFormShow));

module.exports = router;


// Index Route
//router.get("/", wrapAsync(listingController.index));
//router.post("/",isLoggedIn, validateListing, wrapAsync(listingController.addListing));
//router.put("/:id",isLoggedIn,isOwner, validateListing, wrapAsync(listingController.UpdateData));

// Delete Route
//router.delete("/:id",isLoggedIn,isOwner, wrapAsync(listingController.destroyListing));

// Show Route
//router.get("/:id",listingController.showListing );