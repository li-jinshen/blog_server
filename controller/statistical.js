const Statistical = require("../model/statistical");
// 获取最近30天
function getThirty(num) {
    //最近七天和最近三十天时间
    function timeForMat(count) {
        // 拼接时间
        let time1 = new Date()
        time1.setTime(time1.getTime() - 24 * 60 * 60 * 1000)
        let Y1 = time1.getFullYear()
        let M1 =
            time1.getMonth() + 1 > 10
                ? time1.getMonth() + 1
                : "0" + (time1.getMonth() + 1)
        let D1 = time1.getDate() > 10 ? time1.getDate() : "0" + time1.getDate()
        let timer1 = Y1 + "-" + M1 + "-" + D1 // 当前时间
        let time2 = new Date()
        time2.setTime(time2.getTime() - 24 * 60 * 60 * 1000 * count)
        let Y2 = time2.getFullYear()
        //   let M2 =
        //     time2.getMonth() + 1 > 9
        //       ? time2.getMonth() + 1
        //       : "0" + (time2.getMonth() + 1)
        let M2 = time2.getMonth() + 1
        let D2 = time2.getDate() > 9 ? time2.getDate() : "0" + time2.getDate() // let timer2 = Y2 + '-' + M2 + '-' + D2 // 之前的7天或者30天 // return { // // t1: timer1, // // t2: timer2 // }
        return { year: Y2, month: M2, day: D2 }
    }
    let timer = timeForMat(num)

    let date = new Date()
    let nowMonth = date.getMonth()
    let nowDay = date.getDate()
    let dateList = []
    if (nowMonth + 1 == timer.month) {
        for (let i = timer.day + 1; i <= nowDay; i++) {
            dateList.push(i)
        }
    } else {
        var d = new Date(timer.year, timer.month, 0)
        let day = d.getDate()
        for (let i = timer.day + 1; i <= day; i++) {
            dateList.push(i)
        }
        for (let j = 1; j <= nowDay; j++) {
            dateList.push(j)
        }
    }
    return dateList
}

function getDate(originVal) {
    const dt = new Date(originVal)
    const y = dt.getFullYear()
    const m = (dt.getMonth() + 1 + '').padStart(2, '0')
    const d = (dt.getDate() + '').padStart(2, '0')

    // const hh = (dt.getHours() + '').padStart(2, '0')
    // const mm = (dt.getMinutes() + '').padStart(2, '0')
    // const ss = (dt.getSeconds() + '').padStart(2, '0')

    // return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
    return `${y}-${m}-${d}`
}

let addressList = {
    台湾: 0,
    河北: 0,
    山西: 0,
    内蒙古: 0,
    辽宁: 0,
    吉林: 0,
    黑龙江: 0,
    江苏: 0,
    浙江: 0,
    安徽: 0,
    福建: 0,
    江西: 0,
    山东: 0,
    河南: 0,
    湖北: 0,
    湖南: 0,
    广东: 0,
    广西: 0,
    海南: 0,
    四川: 0,
    贵州: 0,
    云南: 0,
    西藏: 0,
    陕西: 0,
    甘肃: 0,
    青海: 0,
    宁夏: 0,
    新疆: 0,
    北京: 0,
    天津: 0,
    上海: 0,
    重庆: 0,
    香港: 0,
    澳门: 0,
}
let province = [
    "台湾",
    "河北",
    "山西",
    "内蒙古",
    "辽宁",
    "吉林",
    "黑龙江",
    "江苏",
    "浙江",
    "安徽",
    "福建",
    "江西",
    "山东",
    "河南",
    "湖北",
    "湖南",
    "广东",
    "广西",
    "海南",
    "四川",
    "贵州",
    "云南",
    "西藏",
    "陕西",
    "甘肃",
    "青海",
    "宁夏",
    "新疆",
    "北京",
    "天津",
    "上海",
    "重庆",
    "香港",
    "澳门",
]

let todayVisit = {
    date: null,
    visitors: []
}

// 统计浏览量数据
exports.Record = async data => {
    let { ip, cname } = data
    let location = null
    let today = new Date()
    let day = todayVisit.date ? getDate(todayVisit.date) : null
    if (getDate(today) == day) {
        let index = todayVisit.visitors.findIndex(item => {
            return item.ip == ip
        })
        if (index > -1) {
            let distance = (todayVisit.visitors[index].date.getTime() - today.getTime()) / 1000 / 60
            if (distance < 10) {
                return
            } else {
                todayVisit.visitors[index].date = today
                todayVisit.visitors[index].count++
            }
        } else {
            todayVisit.visitors.push({ ip, date: today, count: 1 })
        }
    } else {
        todayVisit.date = today
        todayVisit.visitors = []
        todayVisit.visitors.push({ ip, date: today, count: 1 })
    }
    province.forEach((item) => {
        if (cname.includes(item)) {
            location = item
        }
    })
    // if (location == null) { //无法查找到地址
    //     return {
    //         msg: "更新失败",
    //         state: 0
    //     }
    // }
    let statistical = await Statistical.findOne({ name: "statistical" })
    let res = null
    if (statistical) {
        let { views, address, count } = statistical
        let date = new Date()
        let day = date.getDate()
        if (views[views.length - 1].day == day) {
            views[views.length - 1].number++
        } else {
            views.shift()
            views.push({
                day,
                number: 1
            })
        }
        address[location]++
        count++
        res = await Statistical.updateOne({ name: "statistical" }, { $set: { address, count, views } })
    } else { //不存在就创建
        let dateList = getThirty(30)
        let views = []
        dateList.forEach(item => {
            views.push({
                "day": item,
                number: 0
            })
        })
        views[views.length - 1].number++  //最后一项就是当天的统计增加1
        addressList[location]++
        res = await Statistical.create({
            views,
            address: addressList,
            count: 1
        })
    }
    if (res || res.nModified > 0) {
        return {
            msg: "更新成功",
            state: 1
        }
    } else {
        return {
            msg: "更新失败",
            state: 0
        }
    }
}
// 获取浏览量数据
exports.Obtain = async data => {
    let statistical = await Statistical.findOne({ name: "statistical" })
    // console.log(statistical)
    if (statistical) {
        return statistical
    } else {
        return {
            count: 0,
            view: [],
            address: {}
        }
    }
}