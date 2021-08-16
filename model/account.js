const mongoose = require("mongoose")
const accountSchema = new mongoose.Schema({
    account: {
        type: Number,
        default: 1997414
    }
})

module.exports = mongoose.model("account", accountSchema);