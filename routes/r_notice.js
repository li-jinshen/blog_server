let {
    GetNotice,
    ReadNotice,
    DeleteNotice
} = require("../controller/notice")

module.exports = {

    "GET /notice/obtain": async ctx => {
        let res = await GetNotice(ctx.request.query)
        ctx.body = res
    },

    "POST /notice/read": async ctx => {
        let res = await ReadNotice(ctx.request.body)
        ctx.body = res
    },

    "POST /notice/remove": async ctx => {
        let res = await DeleteNotice(ctx.request.body)
        ctx.body = res
    }
}