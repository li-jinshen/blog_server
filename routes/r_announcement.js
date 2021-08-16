//关于公告模块导入的变量
const {
    Release,
    Obtain,
    Remove
} = require("../controller/announcement")

module.exports = {
    //发表公告
    "POST /announcement/release": async ctx => {
        let res = await Release(ctx.request.body)
        ctx.body = res
    },

    // 获取公告
    "GET /announcement/obtain": async ctx => {
        let res = await Obtain(ctx.request.query)
        ctx.body = res
    },

    // 删除公告
    "POST /announcement/remove": async ctx => {
        let res = await Remove(ctx.request.body)
        ctx.body = res
    },
}