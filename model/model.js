const mongoose = require("mongoose")
const modelSchema = new mongoose.Schema({
    name: String,
    icon: String,
    sort: {
        type: Number,
        default: 1
    },
    style: String, // 渲染的样式类型，由前端控制
    modelList: {
        type: Array,
        default: []
        // 数组存储对象
        // 该对象的相关属性： 
        // name：名称
        // picture：图片
        // describe：描述
        // link：链接
        // type：类型(属性值：链接[link]、文本[text])
    }
})

module.exports = mongoose.model("model", modelSchema);