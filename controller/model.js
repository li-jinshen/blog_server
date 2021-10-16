const Model = require("../model/model");


// 添加模块
exports.AddModel = async data => {
    let { name } = data
    let result = await Model.findOne({ name })
    if (result) {
        return {
            status: 0,
            msg: "添加失败，该模块名已经存在，请修改模块名称"
        }
    } else {
        let { _id } = await Model.create(data)
        return {
            status: 1,
            msg: "模块创建成功",
            id: _id
        }
    }
}

// 获取所有模块（名称，图标）
exports.GetModel = async data => {
    let result = await Model.find({}, { id: 1, name: 1, icon: 1 }).sort({ sort: -1 })
    return {
        status: 1,
        data: result,
    }
}

// 获取模块详情
exports.GetModelList = async data => {
    let result = await Model.findOne({ _id: data.id })
    return {
        status: 1,
        msg: "数据接收成功",
        data: result,
    }
}


