const { history } = require("../controller/chat")

module.exports = {
    "GET /chat/obtain": async ctx => {
        let res = await history(ctx.request.query)
        ctx.body = res
    }
}