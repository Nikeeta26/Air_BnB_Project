const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const expressError = require("./utils/expressError.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";


const listings = require("./routes/listing.js");
const reviews = require("./routes/reviews.js");

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });


async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));



app.get("/", (req, res) => {
  res.send("Hi, I am root");
});


//routes 
app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);



// app.get("/testListing", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "My New Villa",
//     description: "By the beach",
//     price: 1200,
//     location: "Calangute, Goa",
//     country: "India",
//   });

//   await sampleListing.save();
//   console.log("sample was saved");
//   res.send("successful testing");
// });


//custome mongoose
// function handleValidationError(err){
//   console.log("some valaidaton error occurse");
//   console.dir(err.message);
//    return err;
// }

// app.use((err,req,res,next)=>{
//   console.log(err.name);
//   if(err.name === "validationError"){
//       err = handleValidationError(err);
//   }
//  next(err);
// });
// custome expressError
app.all("*", (req, res, next) => {
  throw new expressError(404, "Page not found !");
});


//err middleware
app.use((err, req, res, next) => {
  let { statusCode=500, message="something went wrong" } = err;
  res.status(statusCode).render("error.ejs",{message});
  // res.status(statusCode).send(message);
 // res.send("page not");
});



app.listen(8080, () => {
  console.log("server is listening to port 8080");
});
