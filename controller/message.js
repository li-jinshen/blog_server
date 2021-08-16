const Message = require("../model/message");
const User = require("../model/user")
const Inform = require("../model/inform")
const userSocket = require("../model/userSocket")
//发表留言
exports.Release = async data => {
    let { name, content, photo, account, isAdmin, date } = data
    const result = await Message.create(data)
    console.log(result)
    if (result) {
        let admin = await User.findOne({ isAdmin: true })
        let admin_inform = await Inform.findOne({
            account: admin.account
        })
        let res = null
        let obj = {
            fromUser: {
                name,
                photo,
                account,
                isAdmin
            }, content, date, read: false, parentId: (result._id).toString()
        }
        if (admin_inform) {
            let length = admin_inform.message.length
            length == 0 ? obj.index = 0 : obj.index = admin_inform.message[length - 1].index + 1
            res = await Inform.updateOne({
                account: admin.account,
            }, { $push: { message: obj } })
        } else {
            obj.index = 0
            res = await Inform.create({
                account: admin.account,
                message: [obj]
            })
        }
        if (res || res.nModified) {
            let socketUser = await userSocket.findOne({ account: admin.account })
            io.to(socketUser.socketId).emit("notice", { type: "message" })
        }
        return {
            status: 1,
            msg: "留言发布成功"
        }
    } else {
        return {
            status: 1,
            msg: "留言发布失败"
        }
    }
}

// 回复留言
exports.ReleaseChild = async data => {
    let { parentId, fromUser, toUser, c_content, c_date, message } = data


    let result = await Message.updateOne({ _id: parentId }, { $push: { children: data } })
    if (result.nModified) {
        let admin = await User.findOne({ isAdmin: true })
        let obj_list = null
        if (fromUser.account == toUser.account || toUser.account == admin.account) {
            obj_list = [admin]
        } else if (fromUser.isAdmin) {
            obj_list = [toUser]
        } else {
            obj_list = [admin, toUser]
        }

        let obj = {
            parentId, fromUser, toUser, content: c_content, date: c_date, message, read: false
        }

        let result = await Promise.all(obj_list.map(async item => {
            let item_inform = await Inform.findOne({
                account: item.account
            })
            let res = null
            if (item_inform) {
                let length = item_inform.message.length
                length == 0 ? obj.index = 0 : obj.index = item_inform.message[length - 1].index + 1
                res = await Inform.updateOne({
                    account: item.account,
                }, { $push: { message: obj } })
            } else {
                obj.index = 0
                res = await Inform.create({
                    account: item.account,
                    message: [obj]
                })
            }
            if (res || res.nModified) {
                let socketUser = await userSocket.findOne({ account: item.account })
                io.to(socketUser.socketId).emit("notice", { type: "message" })
            }
            return item
        }))

    } else {

    }
    return {
        status: 1,
        msg: "评论成功"
    }
}

//删除留言
exports.Remove = async data => {
    const result = await Message.deleteOne(data)
    if (result.deletedCount) {
        return {
            status: 1,
            msg: "留言删除成功",
        }
    } else {
        return {
            status: 0,
            msg: "留言删除失败",
        }
    }
}

//获取留言
exports.Obtain = async data => {
    const { limit, page, name } = data;
    var count;
    if (name) { // 搜索留言
        var reg = new RegExp(name, "i") //不区分大小写
        if (page) {

            count = await Message.find({ name: { $regex: reg } }).countDocuments()
            const start = (+limit) * (+page - 1);
            const result = await Message.find({ name: { $regex: reg } }).sort({ date: -1 }).skip(start).limit(+limit)
            return {
                status: 1,
                data: result,
                count
            }
        } else {
            result = await Message.find({ name: { $regex: reg } }).sort({ date: -1 })
            return {
                status: 1,
                data: result,
            }
        }
    } else {
        count = await Message.find().countDocuments()
        const maxPage = Math.ceil(count / (+limit))
        if (maxPage < page) {
            return {
                status: 0,
                msg: "暂无新留言",
                count
            }
        } else {
            const start = (+limit) * (+page - 1);
            const result = await Message.find().sort({ date: -1 }).skip(start).limit(+limit)
            return {
                status: 1,
                data: result,
                count
            }
        }

    }
}

