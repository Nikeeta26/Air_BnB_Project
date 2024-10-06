
// const mongoose = require("mongoose");
// const Review = require("./reviews.js");
// const User = require("./user.js");
// const { string } = require("joi");
// const Schema = mongoose.Schema;

// const listingSchema = new Schema({
//   title: {
//     type: String,
//     required: true,
//   },
//   description: String,
//   image: {
//     // type: String,
//     // default: "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
//     // set: (v) =>
//     //         v === ""
//     //           ? "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
//     //           : v,
//     url:String,
//     filename:String,
//   },
//   price: Number,
//   location: String,
//   country: String,
//   reviews:[
//     {
//     type:Schema.Types.ObjectId,
//     ref:"Review"
//     }
//   ],
//   owner:{
//     type:Schema.Types.ObjectId,
//     ref:"User"
//   },
//   category:{
//   type:String,
//   enum:["mountains","forms"]
//   }

// });

// listingSchema.post("findOneAndDelete",async(listing)=>{
// if(listing)
//   {
//   await Review.deleteMany({_id:{$in:listing.reviews}});
//   }
// });

// const Listing = mongoose.model("Listing", listingSchema);
// module.exports = Listing;


const mongoose = require("mongoose");
const Review = require("./reviews.js");
const User = require("./user.js");
const { string } = require("joi");
const Schema = mongoose.Schema;

// const listingSchema = new Schema({
//   title: {
//     type: String,
//     required: true,
//   },
//   description: String,
//   image: {
//     // type: String,
//     // default: "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
//     // set: (v) =>
//     //         v === ""
//     //           ? "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
//     //           : v,
//     url:String,
//     filename:String,
//   },
//   price: Number,
//   location: String,
//   country: String,
//   reviews:[
//     {
//     type:Schema.Types.ObjectId,
//     ref:"Review"
//     }
//   ],
//   owner:{
//     type:Schema.Types.ObjectId,
//     ref:"User"
//   },
//   category:{
//   type:String,
//   enum:["mountains","forms"]
//   }

// });

// listingSchema.post("findOneAndDelete",async(listing)=>{
// if(listing)
//   {
//   await Review.deleteMany({_id:{$in:listing.reviews}});
//   }
// });

// const Listing = mongoose.model("Listing", listingSchema);
// module.exports = Listing;




const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    category: {  // Adding category field
        type: String,
        enum: [
            "trending",
            "booms",
            "iconic cities",
            "mountains",
            "castles",
            "amazing pool",
            "camping",
            "farms",
            "arctic",
            "domes"
        ],
        required: true,
    },
    image: {
        url: String,
        filename: String
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review"
    }]
});

listingSchema.index({ title: "text", description: "text" }); // Enable full-text search on title and description

module.exports = mongoose.model("Listing", listingSchema);
