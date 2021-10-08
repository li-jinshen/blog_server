const Category = require("../model/category")
const Article = require("../model/article")
const fs = require("fs")

//获取纯文本方法,并截取一定数量的文字
function removeHTMLTag (str, number) {

    str = str.replace(/<\/?[^>]*>/g, ''); //去除HTML tag

    str = str.replace(/[ | ]*\n/g, '\n'); //去除行尾空白

    //str = str.replace(/\n[\s| | ]*\r/g,'\n'); //去除多余空行

    // str = str.replace(/&nbsp;/ig, ''); //去掉&nbsp;

    // str = str.replace(/\s/g, ','); //将空格去掉

    str = str.slice(0, number) //截取

    return str;
}

//发表文章 || 更新文章
exports.Published = async data => {
    const { title, content, category, _id } = data;
    const result = await Article.findOne({ title })
    if (result && !_id) {
        return {
            status: 0,
            msg: "该文章题目在数据库中已存在，请修改再发表"
        }
    } else {
        //截取文章的一部分作为简介
        data.Intro = removeHTMLTag(content, 400)
        //匹配到文章里的第一章图片，将将其作为展示图片
        var imgReg = /<img.*?(?:>|\/>)/gi;
        if (content.match(imgReg)) {
            data.background = content.match(imgReg)[0];
        }
        if (_id) {  //_id存在则是更新文章
            const result = await Article.updateOne({ _id }, data)
            if (result.nModified) {
                return {
                    status: 1,
                    msg: "文章更新成功",
                    id: _id
                }
            } else {
                return {
                    status: 0,
                    msg: "文章更新失败",
                    id: _id
                }
            }

        } else {//不存在则是发表文章
            //分类集合的添加与查询
            const reg = new RegExp(category[0], "i") //不区分大小写
            const cateResult = await Category.findOne({ name: { $regex: reg } })
            if (cateResult) {
                const res1 = await Category.updateOne({ _id: cateResult._id }, { $inc: { count: 1 } })
            } else {
                const res2 = await Category.create({ name: category[0], count: 1 })
            }
            const { _id } = await Article.create(data)
            return {
                status: 1,
                msg: "发表成功",
                id: _id
            }
        }

    }
}

//获取+查找文章
exports.GetArticle = async data => {
    const { category, title, id } = data;
    let result;
    if (title) {
        const reg = new RegExp(title, "i") //不区分大小写
        result = await Article.find({ title: { $regex: reg } }, { id: 1, title: 1, views: 1, date: 1 }).sort({ views: -1 })
    } else if (category) {
        const reg = new RegExp(category, "i") //不区分大小写
        result = await Article.find({ category: { $regex: reg } }, { id: 1, title: 1, views: 1, date: 1 }).sort({ views: -1 })
    } else if (id) {
        const update = await Article.updateOne({ _id: id }, { $inc: { views: 1 } }) //更新浏览量
        result = await Article.find({ _id: id })
        // console.log(result);
    } else {
        result = await Article.find().sort({ date: -1 });
    }
    return {
        status: 1,
        data: result,
        count: result.length,
    }
}

//根据页面获取文章 
exports.GetSinglePage = async data => {
    const { limit, page, sort } = data;

    const count = await Article.find().countDocuments();
    const start = (+limit) * (+page - 1);
    let result = ""
    if (sort == 1) {
        result = await Article.find().sort({ date: -1 }).skip(start).limit(+limit)
    } else if (sort == 2) {
        result = await Article.find().sort({ views: -1 }).skip(start).limit(+limit)
    } else {
        result = await Article.find({}, { id: 1, title: 1, views: 1, date: 1, category: 1 }).sort({ date: -1 }).skip(start).limit(+limit)
    }
    return {
        status: 1,
        msg: "数据接收成功",
        data: result,
        count
    }
}

// 获取排行榜
exports.getRank = async data => {
    const { limit } = data;
    let result = await Article.find({}, { id: 1, title: 1, views: 1, date: 1 }).sort({ views: -1 }).limit(+limit)
    return {
        status: 1,
        msg: "数据接收成功",
        data: result,
    }
}

// 查找同分类的文章
exports.getCategoryArticle = async data => {
    let { category } = data;
    let reg = new RegExp(category, "i") //不区分大小写
    let result = await Article.find({ category: { $regex: reg } }).sort({ views: -1 }).limit(7)
    return {
        status: 1,
        msg: "数据接收成功",
        data: result,
    }
}

//删除文章
exports.DeleteArticle = async data => {
    const result = await Article.deleteOne(data)
    if (result.deletedCount) {
        return {
            status: 1,
            msg: "文章删除成功",
        }
    } else {
        return {
            status: 0,
            msg: "文章删除失败",
        }
    }
}

//根据关键字搜索文章
exports.SearchArticle = async data => {
    const { keyword } = data;
    const reg = new RegExp(keyword, "i") //不区分大小写
    var titleResult = await Article.find({ title: { $regex: reg } }, { id: 1, title: 1, views: 1, date: 1 }).sort({ date: -1 })
    const cate = new RegExp(keyword, "i") //不区分大小写
    var categoryResult = await Article.find({ category: { $regex: cate } }, { id: 1, title: 1, views: 1, date: 1 }).sort({ date: -1 })
    var result = []
    result.push(...titleResult);
    categoryResult.forEach(item => {
        let index = result.findIndex(item2 => {
            return item._id.toString() == item2._id.toString()
        })
        if (index == -1) {
            result.push(item)
        }
    })
    return {
        status: 1,
        data: result
    }
}

// 删除文章图片
exports.removeImage = async data => {
    // let basePath = "http://localhost:4000"
    let basePath = "http://www.yemengs.cn"
    let { imgPath } = data
    let newPath = imgPath.replace(basePath, "public").trim()
    if (fs.existsSync(newPath)) {
        fs.unlinkSync(newPath);
    }
    return { status: 1, msg: "删除成功" }
}