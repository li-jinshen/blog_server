const Inform = require("../model/inform");
const { verifyToken } = require("../tool/token")

// 获取新留言通知
exports.GetInform = async data => {
    let tokenRes = verifyToken(data.token)
    let res = await Inform.findOne({ account: tokenRes.account })
    if (res) {
        return {
            msg: "获取成功",
            data: res
        }
    } else {
        res = await Inform.create({
            account: tokenRes.account,
            message: []
        })
        if (res) {
            return {
                msg: "获取成功",
                data: res
            }
        } else {
            return {
                msg: "获取失败",
                data: {}
            }
        }

    }

}

// 将留言通知标为已读
exports.ReadInform = async data => {
    let { token } = data
    let tokenRes = verifyToken(token)
    let res = await Inform.findOne({ account: tokenRes.account })
    let message = res.message
    message.forEach(item => {
        item.read ? "" : item.read = true
    })
    let result = await Inform.updateOne({ account: tokenRes.account }, { $set: { message } })
    if (result.nModified) {
        return {
            status: 1,
            msg: "标记成功",
        }
    } else {
        return {
            status: 0,
            msg: "标记失败",
        }
    }
}

// 删除评论通知
exports.DeleteInform = async data => {
    let { token, index } = data
    let tokenRes = verifyToken(token)
    let res = await Inform.findOne({ account: tokenRes.account })
    let message = res.message
    let delIndex = message.findIndex(item => {
        return item.index == index
    })
    if (delIndex > -1) {
        message.splice(delIndex, 1)
        let result = await Inform.updateOne({ account: tokenRes.account }, { $set: { message } })
        if (result.nModified) {
            return {
                status: 1,
                msg: "删除成功",
            }
        } else {
            return {
                status: 0,
                msg: "删除失败",
            }
        }
    } else {
        return {
            status: 0,
            msg: "删除失败",
        }
    }
}