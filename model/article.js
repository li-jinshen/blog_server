//文章
const mongoose = require("mongoose");
const Schema = mongoose.Schema
const articleSchema = Schema({
    title: String,
    category: Array,
    value: String,  //文本
    content: String, //html文本
    Intro: String,
    date: {
        type: Date,
        default: Date.now
    },
    views: {
        type: Number,
        default: 0
    },
    background: {
        type: String,
        default: null
    },
    like: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model("article", articleSchema);