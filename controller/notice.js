const Notice = require("../model/notice");
const { verifyToken } = require("../tool/token")

// 获取新评论通知
exports.GetNotice = async data => {
    let tokenRes = verifyToken(data.token)
    let res = await Notice.findOne({ account: tokenRes.account })
    if (res) {
        return {
            msg: "获取成功",
            data: res
        }
    } else {
        res = await Notice.create({
            account: tokenRes.account,
            comments: []
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

// 将评论通知标为已读
exports.ReadNotice = async data => {
    let { token } = data
    let tokenRes = verifyToken(token)
    let res = await Notice.findOne({ account: tokenRes.account })
    let comments = res.comments
    comments.forEach(item => {
        item.read ? "" : item.read = true
    })
    let result = await Notice.updateOne({ account: tokenRes.account }, { $set: { comments } })
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
exports.DeleteNotice = async data => {
    let { token, index } = data
    let tokenRes = verifyToken(token)
    let res = await Notice.findOne({ account: tokenRes.account })
    let comments = res.comments
    let delIndex = comments.findIndex(item => {
        return item.index == index
    })
    if (delIndex > -1) {
        comments.splice(delIndex, 1)
        let result = await Notice.updateOne({ account: tokenRes.account }, { $set: { comments } })
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