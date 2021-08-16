let {
    GetInform,
    ReadInform,
    DeleteInform
} = require("../controller/inform")

module.exports = {

    "GET /inform/obtain": async ctx => {
        let res = await GetInform(ctx.request.query)
        ctx.body = res
    },

    "POST /inform/read": async ctx => {
        let res = await ReadInform(ctx.request.body)
        ctx.body = res
    },

    "POST /inform/remove": async ctx => {
        let res = await DeleteInform(ctx.request.body)
        ctx.body = res
    }
}