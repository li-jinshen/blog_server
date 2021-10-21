const mongoose = require("mongoose")
const Schema = mongoose.Schema;
const statisticalModel = new Schema({
    name: {
        type: String,
        default: "statistical"
    },
    count: {
        type: Number,
        default: 0
    },
    address: {
        type: Object,
        default: {}
    },
    views: [],
    records: []
})
const statistical = mongoose.model("statistical", statisticalModel);
module.exports = statistical;