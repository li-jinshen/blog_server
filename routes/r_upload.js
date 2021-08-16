const {
    uploadImage,
} = require("../controller/upload");

module.exports = {
    // 上传图片
    "POST /upload/image": async ctx => {
        let res = await uploadImage(ctx)
        ctx.body = res
    },


}