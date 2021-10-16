//关于分类模块导入的变量
const {
    GetCategory
} = require("../controller/category")


module.exports = {
    // 获取所有分类
    "GET /category/get": async ctx => {
        let res = await GetCategory(ctx.request.query)
        ctx.body = res
    },
    "POST /category/delete": async ctx => {
        let res = await GetCategory(ctx.request.body)
        ctx.body = res
    },

}