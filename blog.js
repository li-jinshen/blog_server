const Koa = require("koa")
const app = new Koa();
const static = require("koa-static");
const router = require("koa-router")();
const bodyParser = require("koa-bodyparser")
const mongoose = require("mongoose")
var cors = require('koa2-cors');
let fs = require("fs");
let path = require("path")
// socket.io处理逻辑
const { detail } = require("./controller/socket")
// socket.io
const server = require('http').Server(app.callback());  //koa正确姿势
const io = require('socket.io')(server); //核心，实现客户端之间交互通信

// 上传模块
let { upload } = require("./tool/multer")

//关于分类模块导入的变量
const {
    GetCategory
} = require("./controller/category")


app.use(static("./public"))  //设置静态目录
app.use(bodyParser())  //该项要放在路由前面
app.use(cors({}))
app.use(router.routes());//启动路由

// 自动化注册后端路由 
const routesData = {}
const routesPath = path.join(__dirname, "routes")
const files = fs.readdirSync(routesPath)
files.forEach(item => {
    Object.assign(routesData, require(path.join(routesPath, item)))
})
for (let key in routesData) {
    let [method, url] = key.split(' ')
    method = method.toLowerCase()
    if (url.includes("/upload")) {  //处理上传文件的路由(单个文件)
        router[method](url, upload.single('file'), routesData[key])
        // 多文件上传
        // router[method](url, upload.array('avatar', 9), routesData[key])
    } else { //处理普通路由
        router[method](url, routesData[key])
    }
}

//分类模块的路由
router.get("/category/get", GetCategory)


// 解决刷新后not found，设置前端路由
app.use(ctx => {
    // 设置响应头
    ctx.set("Content-Type", "text/html ; charset=UTF-8")
    const data = fs.readFileSync(__dirname + "/public/index.html")
    ctx.body = data
})

// socket.io
io.on("connection", socket => {
    detail(io, socket)

})
mongoose.connect("mongodb://localhost:27017/blog-data", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("blog-data数据库已经连接")
    server.listen("81", function() {
        console.log("81端口已经启动")
    })
}).catch(() => {
    console.log("数据库连接失败")
})

// mongoose.connect("mongodb://localhost:27019/blog-data", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// }).then(() => {
//     console.log("blog-data数据库已经连接")
//     // app.listen("4000", function () {
//     //     console.log("4000端口已经启动")
//     // })
//     server.listen(4000, () => {
//         console.log(`监听地址: http://localhost:4000`);
//     })
// }).catch(() => {
//     console.log("数据库连接失败")
// })