//关于分类模块导入的变量
const {
    AddModel,
    GetModel,
    GetModelList,
    updateModel,
    updateModelItem
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
    // 获取模块详情
    "GET /model/list": async ctx => {
        let res = await GetModelList(ctx.request.query)
        ctx.body = res
    },
    // 模块更新
    "POST /model/update/model": async ctx => {
        let res = await updateModel(ctx.request.body)
        ctx.body = res
    },
    // 模块子项操作
    "POST /model/update/list": async ctx => {
        let res = await updateModelItem(ctx.request.body)
        ctx.body = res
    },
}