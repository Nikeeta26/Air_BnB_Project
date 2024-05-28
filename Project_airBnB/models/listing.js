const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ListingSchema = new Schema ({
  title : {
   type: String,
    require :true
  },
  description : {
  type:  String,

  },
  image :{
     type: String,
     set:(v)=> v === " "
     ? "https://images.unsplash.com/photo-1716872491089-a43035b4db58?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw3fHx8ZW58MHx8fHx8" : v,
  },
  price :{
    type: Number,
  },
  location :{
    type: String,
  },
  country : {
    type:String,
  }
});

const Listing = mongoose.model("Listing", ListingSchema);

module.export = Listing;