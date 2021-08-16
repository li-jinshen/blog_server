const {
    Release,
    Obtain,
    ReleaseChild,
    Remove
} = require("../controller/comment")

module.exports = {
    //发表评论
    "POST /comment/release": async ctx => {
        let res = await Release(ctx.request.body)
        ctx.body = res
    },

    // 获取评论
    "GET /comment/obtain": async ctx => {
        let res = await Obtain(ctx.request.query)
        ctx.body = res
    },

    // 发表子评论
    "POST /comment/obtain/child": async ctx => {
        let res = await ReleaseChild(ctx.request.body)
        ctx.body = res
    },

    // 删除评论
    "POST /comment/remove": async ctx => {
        let res = await Remove(ctx.request.body)
        ctx.body = res
    },
}