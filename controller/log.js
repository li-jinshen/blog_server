const Permissions = require("../model/permissions");
const Log = require("../model/log");
const { DateFormat } = require("../utils/DateFormat")  //格式化时间的工具类

//获取权限密码
exports.GetPermissins = async ctx => {
    const { name, key } = ctx.request.query;
    const all = await Permissions.find();
    const result = await Permissions.findOne({ name, key })
    if (result) {
        ctx.body = {
            status: 1,
            msg: "访问密码输入正确"
        }
    } else {
        ctx.body = {
            status: 0,
            msg: "访问密码错误"
        }
    }
}
//设置权限密码
exports.SetPermissins = async ctx => {
    const { name } = ctx.request.body
    const result = await Permissions.findOne({ name })
    if (result) {
        const modified = await Permissions.updateOne({ name }, ctx.request.body)
        if (modified.nModified) {
            ctx.body = {
                status: 1,
                msg: "权限重置成功"
            }
        } else {
            ctx.body = {
                status: 0,
                msg: "权限设置失败，请稍后重试"
            }
        }
    } else {
        const create = await Permissions.create(ctx.request.body)
        ctx.body = {
            status: 1,
            msg: "设置新权限成功"
        }
    }
}

//发表日志
exports.PostLog = async ctx => {
    ctx.request.body.date = DateFormat("YYYY-mm-dd HH:MM:SS", new Date())
    const result = await Log.create(ctx.request.body)
    if (result) {
        ctx.body = {
            status: 1,
            msg: "日志发表成功"
        }
    } else {
        ctx.body = {
            status: 0,
            msg: "日志发表失败"
        }
    }
}
//根据页码获取对应的日志
exports.GetLog = async ctx => {
    const { limit, page } = ctx.request.query;
    const count = await Log.find().countDocuments();
    const start = (+limit) * (+page - 1);
    const result = await Log.find().sort({ date: -1 }).skip(start).limit(+limit)
    ctx.body = {
        status: 1,
        msg: "数据接收成功",
        data: result,
        count
    }
}

//删除日志
exports.DeleteLog = async ctx => {
    const result = await Log.deleteOne(ctx.request.body)
    if (result.deletedCount) {
        ctx.body = {
            status: 1,
            msg: "留言删除成功",
        }
    } else {
        ctx.body = {
            status: 0,
            msg: "留言删除失败",
        }
    }
}