const mongoose = require("mongoose")
const userSchema = new mongoose.Schema({
    userName: String,
    passWord: String,
    account: Number,
    date: Date,
    signature: String,
    mute: {
        type: Boolean,
        default: false
    },
    isTourists: {
        type: Boolean,
        default: true,
    },
    photo: String,
    isAdmin: Boolean,
    LandingTime: Date
})

module.exports = mongoose.model("user", userSchema);