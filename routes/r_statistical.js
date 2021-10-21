const {
    Record,
    Obtain,
    ObtainCount
} = require("../controller/statistical")

module.exports = {
    // 记录
    "POST /access/record": async ctx => {
        let res = await Record(ctx.request.body)
        ctx.body = res
    },

    // 获取浏览量详情
    "GET /access/obtain": async ctx => {
        let res = await Obtain()
        ctx.body = res
    },

    // 获取总浏览量
    "GET /access/count/obtain": async ctx => {
        let res = await ObtainCount()
        ctx.body = res
    },
}