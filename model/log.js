const mongoose = require("mongoose")
const logSchema=new mongoose.Schema({
    content:String,
    date:String
})

module.exports=mongoose.model("log",logSchema);