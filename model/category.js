const mongoose = require("mongoose")
const categorySchema=new mongoose.Schema({
    name:String,
    count:Number,
})

module.exports=mongoose.model("category",categorySchema);