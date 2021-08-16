const mongoose = require("mongoose")
const announcementSchema = new mongoose.Schema({
    content: String,
    date: String
})

module.exports = mongoose.model("announcement", announcementSchema);