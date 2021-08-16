//关于留言模块导入的变量
const {
    Release,
    Obtain,
    Remove,
    ReleaseChild,
} = require("../controller/message")

module.exports = {
    "POST /message/release": async ctx => {
        let res = await Release(ctx.request.body)
        ctx.body = res
    },

    "POST /message/release/child": async ctx => {
        let res = await ReleaseChild(ctx.request.body)
        ctx.body = res
    },

    "GET /message/obtain": async ctx => {
        let res = await Obtain(ctx.request.query)
        ctx.body = res
    },

    "POST /message/remove": async ctx => {
        let res = await Remove(ctx.request.body)
        ctx.body = res
    }
}