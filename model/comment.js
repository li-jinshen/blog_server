const mongoose = require("mongoose")
const Schema = mongoose.Schema;
const comentschema = new Schema({
    article: String,
    user: {
        type: Object,
        default: {}
    },
    date: String,
    content: String,
    children: { //存储子评论
        type: Array,
        default: []
    }
})
const comment = mongoose.model("comment", comentschema);
module.exports = comment;