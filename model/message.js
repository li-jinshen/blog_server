const mongoose = require("mongoose")
const messageSchema = new mongoose.Schema({
    name: String,
    content: String,
    date: String,
    photo: String,
    account: Number,
    isAdmin: {
        type: Boolean,
        default: false,
    },
    children: {
        type: Array,
        default: []
    }
})

module.exports = mongoose.model("message", messageSchema);