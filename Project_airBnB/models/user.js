const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    email:{
        type:String,
        required:true
    }
});

User.plugin(passportLocalMongoose);//this is atomatically add username and password with salting and hashing

module.exports = mongoose.model('User', userSchema);
