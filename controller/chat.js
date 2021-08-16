const { verifyToken } = require("../tool/token")
const Chat = require("../model/chat")
const GroupChat = require("../model/groupChat")
const Dialogue = require("../model/dialogue")
const User = require("../model/user")


// 存储聊天记录
exports.saveChat = async data => {
    let { account, token, chatType, type, date, message, isAdmin } = data
    let tokenRes = verifyToken(token)
    let user = await User.findOne({ account: tokenRes.account })
    if (chatType == "private") { //私聊
        let tokenChat = await Chat.findOne({ fromUser: tokenRes.account, toUser: account })
        let chatRes = ""
        if (type == "text") {
            // 存储到token用户的聊天表中
            if (tokenChat) {
                let msg_list = tokenChat.msg_list
                if (msg_list.length >= 100) {
                    msg_list.pop()
                }
                msg_list.unshift({ message, account: tokenRes.account, type, date })
                chatRes = await Chat.updateOne({
                    fromUser: tokenRes.account, toUser: account
                }, {
                    $set: { msg_list }
                })
            } else {
                chatRes = await Chat.create({
                    fromUser: tokenRes.account, toUser: account,
                    msg_list: [
                        { message, account: tokenRes.account, type, date }
                    ]
                })
            }
            // 存储到好友的聊天表中
            let idChat = await Chat.findOne({ fromUser: account, toUser: tokenRes.account })
            if (idChat) {
                let msg_list = idChat.msg_list
                if (msg_list.length >= 100) {
                    msg_list.pop()
                }
                msg_list.unshift({ message, account: tokenRes.account, type, date })
                chatRes = await Chat.updateOne({
                    fromUser: account, toUser: tokenRes.account
                }, {
                    $set: { msg_list }
                })
            } else {
                chatRes = await Chat.create({
                    fromUser: account, toUser: tokenRes.account,
                    msg_list: [
                        { message, account: tokenRes.account, type, date }
                    ]

                })
            }
        }
        // 更新对话信息(token用户)
        let dialogRes = null
        let dialogToken = await Dialogue.findOne({ account: tokenRes.account })
        if (dialogToken) {
            let chat_list = dialogToken.chat_list
            let index = chat_list.findIndex(item => {
                return item.account == account
            })
            if (index >= 0) {
                let unRead = chat_list[index].unRead
                chat_list.splice(index, 1)
                chat_list.unshift({
                    account,
                    chatType,
                    type,
                    message,
                    date,
                    unRead: unRead + 1,
                })
                dialogRes = await Dialogue.updateOne({ account: tokenRes.account }, { $set: { "chat_list": chat_list } })

            } else {
                chat_list.unshift({
                    account, chatType, type, message, date, unRead: 0
                })
                dialogRes = await Dialogue.updateOne({ account: tokenRes.account }, { $set: { "chat_list": chat_list } })
            }
        } else {
            dialogRes = await Dialogue.create({
                account: tokenRes.account,
                "chat_list": [{ account, chatType, type, message, date, "unRead": 0 }]
            })
        }
        // 更新对话信息（好友）
        let dialogID = await Dialogue.findOne({ account })
        if (dialogID) {
            let chat_list = dialogID.chat_list
            let index = chat_list.findIndex(item => {
                return item.account == tokenRes.account
            })
            if (index >= 0) {
                chat_list[index].message = message
                chat_list[index].type = type
                chat_list[index].date = date
                chat_list[index].unRead = chat_list[index].unRead + 1
                dialogRes = await Dialogue.updateOne({ account }, { $set: { "chat_list": chat_list } })
            } else {
                chat_list.unshift({
                    account: tokenRes.account, type, chatType, message, date, unRead: 1
                })
                dialogRes = await Dialogue.updateOne({ account }, { $set: { "chat_list": chat_list } })
            }
        } else {
            dialogRes = await Dialogue.create({
                account,
                "chat_list": [{ account: tokenRes.account, type, chatType, "message": message, date, "unRead": 1 }]
            })
        }
    } else { //群聊
        if (type == "text") {
            let group_chat = await GroupChat.findOne({ name: "group" })
            let chatRes = null
            if (group_chat) {
                let msg_list = group_chat.msg_list
                if (msg_list.length >= 200) {
                    msg_list.pop()
                }
                msg_list.unshift({ message, isAdmin, account: user.account, type, name: user.userName, photo: user.photo, date })
                chatRes = await GroupChat.updateOne({
                    name: "group"
                }, {
                    $set: { msg_list }
                })
            } else {
                chatRes = await GroupChat.create({
                    name: "group",
                    "msg_list": [{ message, isAdmin, account: user.account, type, name: user.userName, photo: user.photo, date }]
                })
            }
        }
    }

}

// 获取聊天记录
exports.history = async data => {
    let { token, account, chatType, page, limit } = data
    page ? "" : page = 1
    limit ? "" : limit = 50
    if (chatType == "private") {
        let tokenRes = verifyToken(token)
        let chats = await Chat.findOne({ fromUser: tokenRes.account, toUser: account })
        if (chats) {
            let msg_list = chats.msg_list
            let count = msg_list.length
            let maxPage = Math.ceil(count / limit)
            if (page > maxPage) {
                return {
                    msg_list: []
                }
            }
            let skip = (page - 1) * limit
            let oldList = msg_list.splice(skip, limit)
            let newList = oldList.sort(listSort)
            return {
                msg_list: newList,
                count
            }
        } else {
            chats = await Chat.create({
                fromUser: tokenRes.account,
                toUser: account,
                msg_list: []
            })
            return {
                msg_list: chats.msg_list,
                count: 0,
            }
        }
    } else {
        let chats = await GroupChat.findOne({ name: "group" })
        if (chats) {
            let msg_list = chats.msg_list
            let count = msg_list.length
            let maxPage = Math.ceil(count / limit)
            if (page > maxPage) {
                return {
                    msg_list: [],
                    count,
                }
            }
            let skip = (page - 1) * limit
            let oldList = msg_list.splice(skip, limit)
            let newList = oldList.sort(listSort)
            return {
                msg_list: newList,
                count
            }
        } else {
            return {
                msg_list: [],
                count: 0
            }
        }
    }
}

// 排序的方法
function listSort(a, b) {
    return new Date(a.date).getTime() - new Date(b.date).getTime()
}