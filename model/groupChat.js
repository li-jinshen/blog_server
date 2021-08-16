
const mongoose = require("mongoose")
// 聊天表
const groupChatSchema = new mongoose.Schema({
    name: {
        type: String,
        default: "group"
    },
    msg_list: []
})
module.exports = mongoose.model("groupChat", groupChatSchema);