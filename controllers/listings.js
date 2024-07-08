const Listing = require("../models/listing.js");

//index
module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", { allListings });
};

//new listing form
module.exports.renderNewform =  (req, res) => {
    res.render("./listings/showNew.ejs");
  };

  // add listings
  module.exports.addListing = async (req, res, next) => {
    //let{path,filename}=req.file
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    //console.log(req.user);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    await newListing.save();
    req.flash("success","New listing create");
    res.redirect("/listings");
  };

  //edit form
  module.exports.editFormShow = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
      req.flash("error","Listing you requested for does not exit");
      res.redirect("/listings");
      return;
    }
    let originalUrl = listing.image.url;
    let originalUrlImage = originalUrl.replace("upload","/upload/w_250");
    res.render("./listings/edit.ejs", { listing, originalUrlImage });
  };

  // edit listings
  module.exports.UpdateData = async (req, res, next) => {
    let { id } = req.params;
    /* use one both of
     await Listing.findByIdAndUpdate(id, req.body.listing );*/
    const listing = await Listing.findByIdAndUpdate(id, {...req.body.listing });
    
    if(typeof req.file!== "undefined"){

    let url = req.file.path;
    let filename = req.file.filename;
    //uploaded image at edit time
    listing.image={url, filename};
    await listing.save();

    }
    req.flash("success","edit successfully");
    res.redirect(`/listings/${id}`);
  };


  //delete 
  module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Delete successfully");
    res.redirect("/listings");
  };

  //show particular listing
  module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"},}).populate("owner");
    if(!listing){
      req.flash("error","Listing you requested for does not exit");
      res.redirect("/listings");
      return;
    }
    console.log(listing);
    res.render("./listings/show.ejs", { listing });
  };