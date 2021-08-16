const mongoose = require("mongoose")
// 聊天表
const chatSchema = new mongoose.Schema({
    fromUser: Number,
    toUser: Number,
    msg_list: []
})
module.exports = mongoose.model("chat", chatSchema);