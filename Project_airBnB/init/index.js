
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

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

const initDB = async () => {
  await Listing.deleteMany({});
  await Listing.insertMany(initData.data);
  // let sampleListing = new Listing({
  //   title: 'landon wecand',
  //   description: 'Modern Loft in Downtown',
  //   image: 'https://thumbs.dreamstime.com/b/meadow-8867157.jpg',
  //   price: 12000,
  //   location: 'pune',
  //   country: 'India',
  //     });
  console.log("data was initialized");
};

initDB();
