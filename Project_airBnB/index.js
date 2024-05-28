const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");

const MONGODB_URL = 'mongodb://127.0.0.1:27017/wanderlust';
main().then(()=>{
   console.log("connected successfuly");
}).catch(()=>{
   console.log("error occurs");
});
async function main(){
     await mongoose.connect(MONGODB_URL);
}

app.get("/",(req,res)=>{
    res.send("hello");
});

app.get("/testListing",async(req,res)=>{
   let sampleListing = new Listing({
      title:"my New village",
      description:"By the beach",
      price:12000,
      location:"pune",
      country : "india",
   });

   await sampleListing.save();
   console.log("sample was save");
   res.send("success testing");
});

let port = 8080;
app.listen(port,()=>{
    console.log("server run on port 8080");
});


