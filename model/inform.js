// 留言通知表
const mongoose = require("mongoose")
const Schema = mongoose.Schema;
const informSchema = new Schema({
    account: Number,
    message: {
        type: Array,
        default: []
    },
})
const inform = mongoose.model("inform", informSchema);
module.exports = inform;