// 处理文件上传
const multer = require('koa-multer')
const fs = require("fs")
const path = require("path")
const { verifyToken } = require("../tool/token")

//关于上传文件的配置 需要安装koa-multer 
var storage = multer.diskStorage({
    //文件保存路径 public/uploads/ 
    destination: function (req, file, cb) {
        let { savePath, token } = req.body
        let tokenRes = null
        let pathObject = null
        let date = new Date()
        let time = date.getFullYear() + "" + (date.getMonth() + 1) + "" + date.getDate()
        req.body.savePath = null
        if (token && savePath) {
            tokenRes = verifyToken(token)
            pathObject = {
                "avatars": { //上传头像
                    path: "public/user/" + tokenRes.account + "/" + "avatars",
                    savePath: "user/" + tokenRes.account + "/" + "avatars/"
                },
                "article": { //文章图片
                    path: "public/user/" + tokenRes.account + "/" + "article/" + time,
                    savePath: "user/" + tokenRes.account + "/" + "article/" + time + "/"
                }
            }
            req.body.savePath = pathObject[savePath].savePath
            mkDirsSync(pathObject[savePath].path)
            cb(null, pathObject[savePath].path)
        } else {
            let path = "public/article/" + time
            mkDirsSync(path)
            req.body.savePath = "article/" + time + "/"
            cb(null, path)
        }
    },
    //修改文件名称
    filename: function (req, file, cb) {
        var fileFormat = (file.originalname).split(".");  //以点分割成数组，数组的最后一项就是后缀名
        cb(null, Date.now() + "." + fileFormat[fileFormat.length - 1]);
    }
})
//加载配置
var upload = multer({ storage: storage });

// 递归创建目录 同步方法
function mkDirsSync(dirname) {
    if (fs.existsSync(dirname)) {
        return true;
    } else {
        if (mkDirsSync(path.dirname(dirname))) {
            fs.mkdirSync(dirname);
            return true;
        }
    }
}

exports.upload = upload