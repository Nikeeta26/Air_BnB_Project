const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewsSchema = new Schema({
    comment : {
       type: String,
       require:true
    },
    rating:{
        type:Number,
        min:1,
        max:5,
        require:true
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        require:true
    },
    author:{
      type:Schema.Types.ObjectId,
      ref:"User"
    }
})

module.exports = mongoose.model("Review",reviewsSchema);