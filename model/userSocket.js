const mongoose = require("mongoose")

// 保存所有用户的socket id
const socketSchema = new mongoose.Schema({
    account: Number,
    socketId: String
})

module.exports = mongoose.model("userSocket", socketSchema)