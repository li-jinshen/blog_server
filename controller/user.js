const User = require("../model/user")
const Account = require("../model/account")
const { InvitationCode } = require("../tool/common")
const { encrypt, decrypt } = require("../tool/crypto")
const { generateToken, verifyToken } = require("../tool/token")
const userSocket = require("../model/userSocket")

// 注册
exports.Register = async data => {
    let { inviteCode, userName, passWord, photo } = data
    let isAdmin = false  //是否是管理员
    let isTourists = false // 是否是游客
    if (!photo) {
        photo = "http://localhost:4000/user/1997414/avatars/1597664571994.jpg"
    }
    let result = await Account.find()
    if (result.length == 0) {
        result = await Account.create({})
        if (!result) {
            return {
                status: 0,
                msg: "注册失败，请稍后重试"
            }
        }
    } else {
        result = result[0]
    }
    if (inviteCode == InvitationCode) {
        isAdmin = true   //管理员权限码正确则是管理员
    }

    let pwd = null
    if (passWord == "") {  // 密码为空则是游客
        isTourists = true
        pwd = ""
    } else {
        pwd = encrypt(passWord)
    }

    let res = await User.create({
        userName,
        passWord: pwd,
        account: result.account,
        date: new Date(),
        isAdmin,
        isTourists,
        photo
    })
    if (res) {
        // 更新账号表
        let account = result.account + 1
        let accountRes = await Account.updateOne({ _id: result._id }, { $set: { account } })
        return {
            status: 1,
            msg: "注册成功",
            account: res.account
        }
    } else {
        return {
            status: 0,
            msg: "注册失败，请稍后重试"
        }
    }
}



//登录
exports.Login = async data => {
    let { account, passWord } = data
    if (passWord == "") { // 游客登录
        var result = await User.findOne({ account })
        // 生成token
        let token = generateToken(account.toString())
        let res = await User.updateOne({ account }, { $set: { LandingTime: new Date() } })
        return {
            status: 1,
            msg: "登录成功",
            token,
            user: result
        };
    } else { // 用户登陆
        let pwd = encrypt(passWord)
        // let accountUser = await User.findOne({ account })
        // console.log(decrypt(accountUser.passWord))
        var result = await User.findOne({ account, passWord: pwd })
        let res = await User.updateOne({ account }, { $set: { LandingTime: new Date() } })
        if (result) {
            // 生成token
            let token = generateToken(result.account.toString())
            return {
                status: 1,
                msg: "登录成功",
                token,
                user: result
            };
        } else {
            return {
                status: 0,
                msg: "登录失败，账号或者密码错误"
            }
        }
    }

}

// 更新token
exports.Refresh = async data => {
    let tokenRes = verifyToken(data.token)
    let token = generateToken(tokenRes.account)
    return {
        token,
        status: 1,
        msg: "token更新成功"
    }
}

// 检测用户是否存在并更新登陆时间
exports.LandingTime = async data => {
    let tokenRes = verifyToken(data.token)
    let result = await User.findOne({ account: tokenRes.account })
    let res = null
    if (result) {
        res = await User.updateOne({ account: tokenRes.account }, { $set: { LandingTime: new Date() } })
        return {
            status: 1,
            msg: "更新成功"
        }
    } else {
        return {
            status: 0,
            msg: "账号不存在"
        }
    }

    return res
}

//查找用户资料
exports.FindFile = async data => {
    let { token } = data
    var result = null
    if (token) {
        let { account } = verifyToken(token)
        result = await User.findOne({ account })
    } else {
        result = await User.findOne(data)
    }
    return result

}

// 修改用户资料
exports.ModifyFile = async data => {
    const { _id, userName, photo, signature } = data
    var result = await User.updateOne({ _id }, {
        $set: {
            userName,
            photo,
            signature
        }
    })

    if (result.nModified) {
        return {
            status: 1,
            msg: "个人信息更新成功"
        }
    } else {
        return {
            status: 0,
            msg: "个人信息更新失败"
        }
    }
}

// 修改密码
exports.ModifyPassword = async data => {
    const { _id, password } = data
    var result = await User.updateOne({ _id }, {
        $set: {
            passWord: encrypt(password)
        }
    })

    if (result.nModified) {
        return {
            status: 1,
            msg: "修改密码成功"
        }
    } else {
        return {
            status: 0,
            msg: "修改密码失败"
        }
    }
}


// 查找所有用户
exports.allUser = async data => {
    let result = await User.find().sort({ LandingTime: -1 })
    return result
}

// 用户禁言
exports.setMute = async data => {
    let { account } = data
    let user = await User.findOne({ account })
    let res = await User.updateOne({ account }, { $set: { mute: !user.mute } })
    if (res.nModified) {
        let socketUser = await userSocket.findOne({ account })
        io.to(socketUser.socketId).emit("operation")
        if (!user.mute) {
            io.emit("systemInforms", user)
        }
        return {
            status: 1,
            msg: "设置成功"
        }
    } else {
        return {
            status: 0,
            msg: "设置失败"
        }
    }
}

// 用户退出账号，切断socket.io连接
exports.Logout = async data => {
    let tokenRes = verifyToken(data.token)
    // 把当前用户的信息从users中删除掉
    let idx = users.findIndex(item => item.account == tokenRes.account)
    if (idx > -1) {
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
        return {
            status: 1,
            msg: "成功断开"
        }
    } else {
        return {
            status: 0,
            msg: "断开失败"
        }
    }
}