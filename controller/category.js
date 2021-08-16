const Category = require("../model/category")
exports.GetCategory = async ctx => {
    result = await Category.find()
    ctx.body = {
        status: 1,
        data: result,
    }
}