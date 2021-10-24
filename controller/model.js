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

// 更新模块(修改|删除)
exports.updateModel = async data => {
    const { type, _id, name, icon, style, sort } = data
    if (type == "modify") {
        let modelResult = await Model.updateOne({ _id }, { $set: { name, icon, style, sort } })
        if (modelResult.nModified) {
            return {
                status: 1,
                msg: "修改成功",
            }
        } else {
            return {
                status: 1,
                msg: "修改失败",
            }
        }
    } else {
        let deleteResult = await Model.deleteOne({ _id })
        if (deleteResult.deletedCount) {
            return {
                status: 1,
                msg: "删除成功",
            }
        } else {
            return {
                status: 0,
                msg: "删除失败",
            }
        }
    }
}


// 获取所有模块（名称，图标）
exports.GetModel = async data => {
    let result = await Model.find({}, { id: 1, name: 1, icon: 1, style: 1, sort: 1 }).sort({ sort: -1 })
    return {
        status: 1,
        msg: "数据获取成功",
        data: result,
    }
}

// 获取模块详情
exports.GetModelList = async data => {
    let result = await Model.findOne({ _id: data.id })
    return {
        status: 1,
        msg: "数据获取成功",
        data: result,
    }
}

// 更新模块子项目（添加|删除|修改）
exports.updateModelItem = async data => {
    const { type, id, modelItem } = data
    if (type == "add") {
        let result = await Model.update({ _id: id }, { $push: { modelList: modelItem } })
        console.log(result)
        if (result.nModified) {
            return {
                status: 1,
                msg: "添加成功",
                data: result,
            }
        } else {
            return {
                status: 0,
                msg: "添加失败",
                data: result,
            }
        }

    } else {
        let result = await Model.findOne({ _id: id })
        let modelList = result.modelList
        let modelItemName = modelItem.name
        let itemIndex = modelList.findIndex(item => {
            return item.name == modelItemName
        })
        switch (type) {
            case "modify":
                modelList.splice(itemIndex, 1, modelItem)
                break;
            case "delete":
                modelList.splice(itemIndex, 1)
                break;
        }
        operationResult = await Model.updateOne({
            _id: id
        }, {
            $set: { modelList }
        })
        if (operationResult.nModified) {
            return {
                status: 1,
                msg: type == "delete" ? "删除成功" : "修改成功"
            }
        } else {
            return {
                status: 0,
                msg: type == "delete" ? "删除失败" : "修改失败"
            }
        }

    }

}


