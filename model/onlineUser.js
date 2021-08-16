const mongoose = require("mongoose")

// 保存所有的在线用户
const onlineSchema = new mongoose.Schema({
    name: {
        type: String,
        default: "onlineUser"
    },
    users: {
        type: Array,
        default: []
    }
})

module.exports = mongoose.model("onlineUser", onlineSchema)