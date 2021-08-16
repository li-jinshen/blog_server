const { getDialogue, MarkedAsRead, RemoveChat } = require("../controller/dialogue")

module.exports = {
    // 获取聊天列表
    "GET /dialogue/obtain": async ctx => {
        let res = await getDialogue(ctx.request.query)
        ctx.body = res
    },

    // 更新未读
    "Post /dialogue/marked": async ctx => {
        let res = await MarkedAsRead(ctx.request.body)
        ctx.body = res
    },

    // 删除聊天
    "Post /dialogue/remove": async ctx => {
        let res = await RemoveChat(ctx.request.body)
        ctx.body = res
    }
}