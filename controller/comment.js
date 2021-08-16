const Comment = require("../model/comment");
const Notice = require("../model/notice");
const User = require("../model/user")
const userSocket = require("../model/userSocket")
// 发表评论
exports.Release = async data => {
    let { article, user, content, arName, date } = data
    let res = await Comment.create({
        article,
        user,
        content,
        date
    })
    if (res) {
        if (!user.isAdmin) { // 不是管理员发表评论时才通知管理员
            let admin = await User.findOne({ isAdmin: true })
            let unread_com = await Notice.findOne({
                account: admin.account
            })

            let comment_obj = {
                article,
                arName,
                fromUser: user,
                toUser: {
                    userName: admin.userName,
                    photo: admin.photo,
                    account: admin.account,
                    isAdmin: admin.isAdmin
                },
                content,
                date,
                read: false,
                parentId: res._id
            }
            let result = null
            if (unread_com) {
                let length = unread_com.comments.length
                length == 0 ? comment_obj.index = 0 : comment_obj.index = unread_com.comments[length - 1].index + 1
                result = await Notice.updateOne({
                    account: admin.account,
                }, { $push: { comments: comment_obj } })
            } else {
                comment_obj.index = 0
                result = await Notice.create({
                    account: admin.account,
                    comments: [comment_obj]
                })
            }
            if (result || result.nModified) {
                let socketUser = await userSocket.findOne({ account: admin.account })
                io.to(socketUser.socketId).emit("notice", { type: "comment" })
            }
        }
        return {
            status: 1,
            data: res,
            msg: "评论发表成功",
        }
    } else {
        return {
            status: 0,
            data: res,
            msg: "评论发表失败，请稍后再试",
        }
    }

}

// 发表子评论
exports.ReleaseChild = async data => {
    let { parentId, fromUser, article, arName, c_content, c_date, toUser, comment } = data
    let result = await Comment.update({ _id: parentId }, { $push: { children: data } })
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
        let comment_obj = {
            article,
            arName,
            fromUser,
            toUser,
            content: c_content,
            date: c_date,
            read: false,
            comment,
            parentId
        }
        let result = await Promise.all(obj_list.map(async item => {
            let unread_com = await Notice.findOne({
                account: item.account
            })
            let res = null
            if (unread_com) {
                let length = unread_com.comments.length
                length == 0 ? comment_obj.index = 0 : comment_obj.index = unread_com.comments[length - 1].index + 1
                res = await Notice.updateOne({
                    account: item.account,
                }, { $push: { comments: comment_obj } })
            } else {
                comment_obj.index = 0
                res = await Notice.create({
                    account: item.account,
                    comments: [comment_obj]
                })
            }
            if (res || res.nModified) {
                let socketUser = await userSocket.findOne({ account: item.account })
                io.to(socketUser.socketId).emit("notice", { type: "comment" })
            }
            return item
        }))

        return {
            status: 1,
            msg: "评论成功"
        }
    } else {
        return {
            status: 0,
            msg: "评论失败，请稍后再试"
        }
    }

}

// 获取评论
exports.Obtain = async data => {
    let { article, page, limit } = data
    const start = (+limit) * (+page - 1);
    let result = await Comment.find({ article }).sort({ date: -1 }).skip(start).limit(+limit)
    const total = await Comment.find({ article }).countDocuments();
    let index = 0;
    let res = await Comment.find({ article })
    let count = res.map(item => {
        if (item.children) {
            index += item.children.length
        }
        return ""
    })
    return {
        status: 1,
        data: result,
        msg: "评论获取成功",
        total,
        count: index + total
    }
}

// 删除评论
exports.Remove = async data => {
    let { _id, c_date } = data
    let result = ""
    if (c_date == -1) {
        result = await Comment.deleteOne({ _id })
    } else {
        result = await Comment.update(
            { _id },
            { $pull: { children: { c_date } } }
        );
    }
    if (result.ok) {
        return {
            msg: "评论删除成功",
            status: 1
        }
    } else {
        return {
            msg: "评论删除失败",
            status: 0
        }
    }

}