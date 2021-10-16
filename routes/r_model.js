//关于分类模块导入的变量
const {
    AddModel,
    GetModel,
    GetModelList
} = require("../controller/model")


module.exports = {
    // 添加模块
    "POST /model/add": async ctx => {
        let res = await AddModel(ctx.request.body)
        ctx.body = res
    },
    // 获取所有模块
    "GET /model/get": async ctx => {
        let res = await GetModel()
        ctx.body = res
    },
    "get /model/list": async ctx => {
        let res = await GetModelList(ctx.request.query)
        ctx.body = res
    },

}