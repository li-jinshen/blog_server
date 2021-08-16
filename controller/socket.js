const { verifyToken } = require("../tool/token")
const userSocket = require("../model/userSocket")
const User = require("../model/user")
const { saveChat } = require("../controller/chat")
// const Group = require("../model/groupModel")

// socket.emit: 告诉当前用户
// io.emit : 广播事件
// io.emit("addUser", data)
// io.emit("userList", users)
global.users = []

exports.detail = (io, socket) => {
    // 将io和socket保存到全局变量中
    global.io = io
    global.socket = socket

    // 登陆连接
    socket.on("submit", async (data) => {
        // console.log(data + "登陆了")
        let socketUser = await User.findOne({ account: data })
        socket.account = data
        socket.name = socketUser.userName
        socket.photo = socketUser.photo
        // let online = await onlineUser.findOne({ name: "onlineUser" })
        // console.log(online)
        // if (!online) { 
        //     online = await onlineUser.create({})
        // }
        // console.log(online.users)
        // online.users.push({ name: socketUser.userName, photo: socketUser.photo, account: data })
        // let usersRes = await onlineUser.updateOne({ name: "onlineUser" }, { $set: { users: online.users } })
        users.push({ name: socketUser.userName, photo: socketUser.photo, account: data })
        let result = await userSocket.findOne({ account: data })
        if (result) {
            let res = await userSocket.updateOne({ account: data }, { socketId: socket.id })
        } else {
            let res = await userSocket.create({
                account: data,
                socketId: socket.id
            })
        }

        io.emit("groupNotice", {
            user: {
                message: socket.name + "加入了群聊",
                name: "系统通知",
                date: new Date(),
                type: "text",
                account: 0,
            },
            users
        })
    })

    //发送信息
    socket.on("sendMsg", async data => {
        let { token, account, chatType, date, message, type, isAdmin } = data

        let tokenRes = verifyToken(token)

        // 存储聊天记录
        let res = await saveChat(data)

        if (chatType == "private") { //私聊转发
            let socketUser = await userSocket.findOne({ account })
            io.to(socketUser.socketId).emit("receiveMsg", { account: tokenRes.account, message, type, date, photo: data.photo, name: data.name })
        } else {
            // 群聊转发 文字信息
            io.emit("receiveMsg", {
                message: data.message,
                name: data.name,
                photo: data.photo,
                chatType: data.chatType,
                account: tokenRes.account,
                date: new Date(),
                type,
                isAdmin,
            })

        }
    })

    socket.on("disconnect", async () => {
        if (socket.name) {
            // 把当前用户的信息从users中删除掉
            let idx = users.findIndex(item => item.account === socket.account)
            if (idx > -1) {
                // console.log("我是socket页面")
                // 删除掉断开连接的这个人
                users.splice(idx, 1)
                // 1. 告诉所有人，有人离开了聊天室
                io.emit('groupNotice', {
                    user: {
                        message: socket.name + "离开了群聊",
                        name: "系统通知",
                        date: new Date(),
                        type: "text",
                        account: 0,
                    },
                    users: users
                })
            }
        }
    })
}
