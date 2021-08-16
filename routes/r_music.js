var request = require('request');

function requestGet(path, requestData) {
    var baseUrl = "https://autumnfish.cn"
    // var baseUrl = "http://localhost:3000"
    return new Promise((resolve, reject) => {
        var url = baseUrl + path;
        var option = {
            url: url,
            method: "GET",   //指定请求方法类型：GET, POST
            json: true,
            timeout: 30000,  // 设置请求超时，单位是毫秒  
            headers: {
                "content-type": "application/json",
            },
            qs: requestData    // 进行GET请求时，此处的参数一定是qs,请注意，如果是POST请求，参数是form
        }
        request(option, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                resolve(body)   // 返回response的内容
            } else {
                reject(error);   // 返回错误信息
            }
        });
    });

};

module.exports = {
    // 获取banner
    "GET /banner": async ctx => {
        let result = await requestGet('/banner', ctx.request.query)
        ctx.body = result
    },

    // 获取推荐歌单
    "GET /personalized": async ctx => {
        let result = await requestGet('/personalized', ctx.request.query)
        ctx.body = result
    },

    // 获取新歌速递
    "GET /personalized/newsong": async ctx => {
        let result = await requestGet('/personalized/newsong', ctx.request.query)
        ctx.body = result
    },

    // 获取推荐mv
    "GET /personalized/mv": async ctx => {
        let result = await requestGet('/personalized/mv', ctx.request.query)
        ctx.body = result
    },

    // 获取歌曲播放地址
    "GET /song/url": async ctx => {
        let result = await requestGet('/song/url', ctx.request.query)
        ctx.body = result
    },

    // 获取歌曲信息
    "GET /song/detail": async ctx => {
        let result = await requestGet('/song/detail', ctx.request.query)
        ctx.body = result
    },

    // 获取歌单详情
    "GET /playlist/detail": async ctx => {
        let result = await requestGet('/playlist/detail', ctx.request.query)
        ctx.body = result
    },

    // 获取歌单评论
    "GET /comment/playlist": async ctx => {
        let result = await requestGet('/comment/playlist', ctx.request.query)
        ctx.body = result
    },

    // 获取所有mv
    "GET /mv/all": async ctx => {
        let result = await requestGet('/mv/all', ctx.request.query)
        ctx.body = result
    },

    // 搜索
    "GET /search": async ctx => {
        let result = await requestGet('/search', ctx.request.query)
        ctx.body = result
    },

    // 获取排行榜的音乐
    "GET /top/song": async ctx => {
        let result = await requestGet('/top/song', ctx.request.query)
        ctx.body = result
    },

    // 获取mv
    "GET /mv/url": async ctx => {
        let result = await requestGet('/mv/url', ctx.request.query)
        ctx.body = result
    },

    // 获取mv详情
    "GET /mv/detail": async ctx => {
        let result = await requestGet('/mv/detail', ctx.request.query)
        ctx.body = result
    },

    // 获取mv发布者信息
    "GET /artists": async ctx => {
        let result = await requestGet('/artists', ctx.request.query)
        ctx.body = result
    },

    // 获取精品歌单信息
    "GET /top/playlist/highquality": async ctx => {
        let result = await requestGet('/top/playlist/highquality', ctx.request.query)
        ctx.body = result
    },

    // 获取分类所有歌单
    "GET /top/playlist/": async ctx => {
        let result = await requestGet('/top/playlist/', ctx.request.query)
        ctx.body = result
    },

    // 获取歌词
    "GET /lyric": async ctx => {
        let result = await requestGet('/lyric', ctx.request.query)
        ctx.body = result
    },

    // 获取推荐视频
    "GET /simi/mv": async ctx => {
        let result = await requestGet('/simi/mv', ctx.request.query)
        ctx.body = result
    },

    // 获取视频评论
    "GET /comment/mv": async ctx => {
        let result = await requestGet('/comment/mv', ctx.request.query)
        ctx.body = result
    },

    // 获取所有榜单
    "GET /toplist/detail": async ctx => {
        let result = await requestGet('/toplist/detail', ctx.request.query)
        ctx.body = result
    },

    // 获取榜单的数据
    "GET /top/list": async ctx => {
        let result = await requestGet('/top/list', ctx.request.query)
        ctx.body = result
    },

    // 歌手榜
    "GET /toplist/artist": async ctx => {
        let result = await requestGet('/toplist/artist', ctx.request.query)
        ctx.body = result
    },

    // 歌手
    "GET /artist/list": async ctx => {
        let result = await requestGet('/artist/list', ctx.request.query)
        ctx.body = result
    },

    // 歌手详情
    "GET /artist/desc": async ctx => {
        let result = await requestGet('/artist/desc', ctx.request.query)
        ctx.body = result
    },

    // 歌手专辑
    "GET /artist/album": async ctx => {
        let result = await requestGet('/artist/album', ctx.request.query)
        ctx.body = result
    },

    // 歌手单曲
    "GET /artists": async ctx => {
        let result = await requestGet('/artists', ctx.request.query)
        ctx.body = result
    },

    // 歌手MV
    "GET /artist/mv": async ctx => {
        let result = await requestGet('/artist/mv', ctx.request.query)
        ctx.body = result
    },

    // 相似歌手
    "GET /simi/artist": async ctx => {
        let result = await requestGet('/simi/artist', ctx.request.query)
        ctx.body = result
    },
}