const Announcement = require("../model/announcement");
const { DateFormat } = require("../tool/DateFormat")  //格式化时间的工具类

//获取公告
exports.Obtain = async data => {
    const { limit, page } = data;
    const count = await Announcement.find().countDocuments();
    if (limit) {
        const start = (+limit) * (+page - 1);
        const result = await Announcement.find().sort({ date: -1 }).skip(start).limit(+limit)
        return {
            status: 1,
            data: result,
            count
        }
    } else {
        const result = await Announcement.find().sort({ date: -1 });
        return {
            status: 1,
            data: result,
            count
        }
    }
}
//发布公告
exports.Release = async data => {
    data.date = DateFormat("YYYY-mm-dd HH:MM:SS", new Date())
    const result = await Announcement.create(data)
    if (result) {
        return {
            status: 1,
            msg: "公告发布成功"
        }
    } else {
        return {
            status: 1,
            msg: "公告发布失败"
        }
    }
}

//删除公告
exports.Remove = async data => {
    const result = await Announcement.deleteOne(data)
    if (result.deletedCount) {
        return {
            status: 1,
            msg: "公告删除成功",
        }
    } else {
        return {
            status: 0,
            msg: "公告删除失败",
        }
    }
}