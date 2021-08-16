// 上传头像
exports.uploadImage = ctx => {
    return {
        status: 1,
        msg: "图片上传成功",
        imgUrl: " http://www.yemengs.cn/" + ctx.req.body.savePath + ctx.req.file.filename
        // imgUrl: " http://localhost:4000/" + ctx.req.body.savePath + ctx.req.file.filename //本地测试时使用
    }
}