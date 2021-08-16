const mongoose = require("mongoose")
const permissionsSchema=new mongoose.Schema({
    name:String,
    key:String,
})
module.exports=mongoose.model("permissions",permissionsSchema);