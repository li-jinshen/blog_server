const Dialogue = require("../model/dialogue")
const User = require("../model/user")
const { verifyToken } = require("../tool/token")

exports.getDialogue = async data => {
    let { token } = data
    let tokenRes = verifyToken(token)
    let res = await Dialogue.findOne({ account: tokenRes.account })
    if (res) {
        let list = []
        list.push(...res.chat_list)
        let result = await Promise.all(list.map(async item => {
            let belongUser = await User.findOne({ account: item.account })
            item.userName = belongUser.userName
            item.isAdmin = belongUser.isAdmin
            item.isTourists = belongUser.isTourists
            item.photo = belongUser.photo
            return item
        }))
        return result
    } else {
        return []
    }
}

exports.MarkedAsRead = async data => {
    let { token, account } = data
    let tokenRes = verifyToken(token)
    let res = await Dialogue.findOne({ account: tokenRes.account })
    let chat_list = res.chat_list
    let index = chat_list.findIndex(item => {
        return item.account == account
    })
    if (index > -1) {
        chat_list[index].unRead = 0
        let dialogRes = await Dialogue.updateOne({ account: tokenRes.account }, { $set: { chat_list } })
    }
    return {
        msg: "更新成功",
        status: 1
    }
}

exports.RemoveChat = async data => {
    let { token, account } = data
    let tokenRes = verifyToken(token)
    let res = await Dialogue.findOne({ account: tokenRes.account })
    let chat_list = res.chat_list
    let index = chat_list.findIndex(item => {
        return item.account == account
    })
    if (index > -1) {
        chat_list.splice(index, 1)
        let dialogRes = await Dialogue.updateOne({ account: tokenRes.account }, { $set: { chat_list } })
        return {
            msg: "更新成功",
            status: 1
        }
    } else {
        return {
            msg: "更新失败",
            status: 0
        }
    }
}