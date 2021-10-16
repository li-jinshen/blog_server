const Category = require("../model/category")
exports.GetCategory = async ctx => {
    result = await Category.find()
    return {
        msg: "分类获取成功",
        status: 1,
        data: result,
    }
}
exports.deleteCategory = async ctx => {
    const result = await Category.deleteOne(data)
    if (result.deletedCount) {
        return {
            status: 1,
            msg: "分类删除成功",
        }
    } else {
        return {
            status: 0,
            msg: "分类删除失败",
        }
    }
}