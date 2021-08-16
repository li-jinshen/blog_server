const {
    Record,
    Obtain
} = require("../controller/statistical")

module.exports = {
    // 记录
    "POST /access/record": async ctx => {
        let res = await Record(ctx.request.body)
        ctx.body = res
    },

    // 获取
    "GET /access/obtain": async ctx => {
        let res = await Obtain()
        ctx.body = res
    },

}