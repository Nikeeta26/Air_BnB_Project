const express = require("express");
const app = express();
const mongoose = require("mongoose");

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

let port = 8080;
app.listen(port,()=>{
    console.log("server run on port 8080");
});

