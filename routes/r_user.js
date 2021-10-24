const {
    Register,
    Login,
    Refresh,
    FindFile,
    ModifyFile,
    ModifyPassword,
    allUser,
    setMute,
    LandingTime,
    Logout
} = require("../controller/user");

module.exports = {
    // 注册
    "POST /user/register": async ctx => {
        let res = await Register(ctx.request.body)
        ctx.body = res
    },

    // 登陆
    "POST /user/login": async ctx => {
        let res = await Login(ctx.request.body)
        ctx.body = res
    },

    // 刷新token
    "POST /user/token/refresh": async ctx => {
        let res = await Refresh(ctx.request.body)
        ctx.body = res
    },

    // 更新登陆时间
    "POST /user/time/refresh": async ctx => {
        let res = await LandingTime(ctx.request.body)
        ctx.body = res
    },

    // 查找用户资料
    "GET /find/file": async ctx => {
        let res = await FindFile(ctx.request.query)
        ctx.body = res
    },

    // 修改用户信息
    "POST /modify/file": async ctx => {
        let res = await ModifyFile(ctx.request.body)
        ctx.body = res
    },
    // 修改密码
    "POST /modify/password": async ctx => {
        let res = await ModifyPassword(ctx.request.body)
        ctx.body = res
    },


    // 查找所有用户
    "GET /user/findAll": async ctx => {
        let res = await allUser()
        ctx.body = res
    },

    // 用户禁言
    "POST /user/mute": async ctx => {
        let res = await setMute(ctx.request.body)
        ctx.body = res
    },

    "POST /logout": async ctx => {
        let res = await Logout(ctx.request.body)
        ctx.body = res
    }
}