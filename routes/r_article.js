const {
    Published,
    GetArticle,
    GetSinglePage,
    getRank,
    DeleteArticle,
    getCategoryArticle,
    SearchArticle,
    removeImage
} = require("../controller/article")

module.exports = {
    // 发表文章
    "POST /article/published": async ctx => {
        let res = await Published(ctx.request.body)
        ctx.body = res
    },

    // 获取文章详情
    "GET /article/get": async ctx => {
        let res = await GetArticle(ctx.request.query)
        ctx.body = res
    },

    // 获取单页文章
    "GET /article/obtain": async ctx => {
        let res = await GetSinglePage(ctx.request.query)
        ctx.body = res
    },

    // 获取文章点击排行
    "GET /rank/obtain": async ctx => {
        let res = await getRank(ctx.request.query)
        ctx.body = res
    },

    // 删除文章
    "POST /article/delete": async ctx => {
        let res = await DeleteArticle(ctx.request.body)
        ctx.body = res
    },

    // 获取同分类的文章
    "GET /article/category": async ctx => {
        let res = await getCategoryArticle(ctx.request.query)
        ctx.body = res
    },

    // 搜索文章
    "GET /article/search": async ctx => {
        let res = await SearchArticle(ctx.request.query)
        ctx.body = res
    },

    // 删除文章图片
    "POST /article/image/remove": async ctx => {
        let res = await removeImage(ctx.request.body)
        ctx.body = res
    },

}