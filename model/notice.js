// 评论通知表
const mongoose = require("mongoose")
const Schema = mongoose.Schema;
const noticeSchema = new Schema({
    account: Number,
    comments: {
        type: Array,
        default: []
    },
})
const notice = mongoose.model("notice", noticeSchema);
module.exports = notice;