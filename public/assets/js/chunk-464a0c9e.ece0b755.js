(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-464a0c9e"],{8598:function(t,e,s){"use strict";s.r(e);var a=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"result-container"},[s("vue-scroll",{ref:"vs",attrs:{ops:t.ops}},[s("div",{staticClass:"el-input el-input--small el-input--prefix"},[s("input",{directives:[{name:"model",rawName:"v-model.lazy",value:t.keyword,expression:"keyword",modifiers:{lazy:!0}}],staticClass:"el-input__inner",attrs:{type:"text",autocomplete:"off",placeholder:"输入关键字，点击回车键即可搜索"},domProps:{value:t.keyword},on:{change:function(e){t.keyword=e.target.value}}}),s("span",{staticClass:"el-input__prefix"},[s("i",{staticClass:"el-input__icon el-icon-search"})])]),s("div",{staticClass:"title-wrap"},[s("span",{staticClass:"title"},[t._v("关键词："+t._s(t.keyword))]),s("span",{staticClass:"sub-title"},[t._v("找到"+t._s(t.total)+"个结果")])]),s("el-tabs",{model:{value:t.activeIndex,callback:function(e){t.activeIndex=e},expression:"activeIndex"}},[s("el-tab-pane",{attrs:{label:"歌曲",name:"songs"}},[s("table",{staticClass:"el-table"},[s("thead",[s("th"),s("th",[t._v("音乐标题")]),s("th",[t._v("歌手")]),s("th",[t._v("专辑")]),s("th",[t._v("时长")])]),s("tbody",t._l(t.songs,(function(e,a){return s("tr",{key:a,staticClass:"el-table__row",on:{click:function(s){return t.playmusic(e)}}},[s("td",{staticStyle:{width:"50px"}},[t._v(t._s(a+1))]),s("td",{staticStyle:{width:"200px"}},[s("div",{staticClass:"song-wrap"},[s("div",{staticClass:"name-wrap"},[s("span",[t._v(t._s(e.name))]),e.mvid?s("span",{staticClass:"iconfont icon-mv"}):t._e()])])]),s("td",{staticStyle:{width:"150px"}},[t._v(t._s(e.artists[0].name))]),s("td",{staticStyle:{width:"300px"}},[t._v(t._s(e.album.name))]),s("td",[t._v(t._s(t._f("formDate")(e.duration)))])])})),0)])]),s("el-tab-pane",{attrs:{label:"歌单",name:"lists"}},[s("div",{staticClass:"recom"},t._l(t.lists,(function(e,a){return s("div",{key:a,staticClass:"recom-item",on:{click:function(s){return t.golist(e.id)}}},[s("div",{staticClass:"imgbox"},[s("div",{staticClass:"dsc"},[s("i",[t._v("播放量："+t._s(t._f("count")(e.playCount)))])]),s("img",{attrs:{src:e.coverImgUrl,alt:""}}),s("span",{staticClass:"iconfont icon-play"})]),s("div",{staticClass:"listname"},[t._v(t._s(e.name))])])})),0)]),s("el-tab-pane",{attrs:{label:"MV",name:"mv"}},[s("div",{staticClass:"items"},t._l(t.mvs,(function(e,a){return s("div",{key:a,staticClass:"item",on:{click:function(s){return t.toMv(e.id)}}},[s("div",{staticClass:"img-wrap"},[s("img",{attrs:{src:e.cover,alt:""}}),s("div",{staticClass:"num-wrap"},[s("div",{staticClass:"iconfont icon-play"}),s("div",{staticClass:"num"},[t._v(t._s(t._f("count")(e.playCount)))])]),s("div",{staticClass:"iconbox"},[s("span",{staticClass:"iconfont icon-play"})])]),s("div",{staticClass:"info-wrap"},[s("div",{staticClass:"name"},[t._v(t._s(e.name))]),s("div",{staticClass:"singer"},[t._v(t._s(e.artistName))])])])})),0)])],1),s("div",{staticClass:"pagebox"},[s("el-pagination",{attrs:{background:"",layout:"prev, pager, next",total:t.total,"current-page":t.page,"page-size":12,"hide-on-single-page":""},on:{"current-change":t.handleCurrentChange}})],1)],1)],1)},i=[],n=(s("b0c0"),s("96cf"),s("1da1")),r=s("1857"),c={name:"result",data:function(){return{activeIndex:"songs",keyword:"",count:0,limit:12,total:0,type:1,page:1,songs:[],lists:[],mvs:[],ops:{vuescroll:{sizeStrategy:"percent",detectResize:!0},scrollPanel:{scrollingX:!1},rail:{},bar:{showDelay:500,onlyShowBarOnScroll:!1,keepShow:!0,background:"#b3c0d1",opacity:1,hoverStyle:!1,specifyBorderRadius:!1,minSize:!1,size:"6px",disable:!1}}}},filters:{formDate:function(t){var e=parseInt(t/1e3/60);e<10&&(e="0"+e);var s=parseInt(t/1e3%60);return s<10&&(s="0"+s),e+":"+s},count:function(t){return t>=1e4&&(t=Math.ceil(t/1e4)+"万"),t}},watch:{keyword:function(t){t&&(this.page=1,this.keyword=t,this.clicksearch())},activeIndex:function(t){switch(t){case"songs":this.type=1,this.page=1,this.clicksearch();break;case"lists":this.type=1e3,this.page=1,this.clicksearch();break;case"mv":this.type=1004,this.page=1,this.clicksearch();break}}},created:function(){},methods:{golist:function(t){this.$router.push("/musichome/listinfo?id=".concat(t))},toMv:function(t){this.$router.push("/musichome/videoinfo?id=".concat(t))},handleCurrentChange:function(t){this.page=t,this.clicksearch(),this.$refs["vs"].scrollTo({y:"0%"},0)},clicksearch:function(){var t=this;return Object(n["a"])(regeneratorRuntime.mark((function e(){var s;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,Object(r["p"])({keywords:t.keyword,type:t.type,limit:t.limit,offset:(t.page-1)*t.limit});case 2:s=e.sent,1==t.type?(t.songs=s.result.songs,t.total=s.result.songCount):1e3==t.type?(t.lists=s.result.playlists,t.total=s.result.playlistCount):(t.mvs=s.result.mvs,t.total=s.result.mvCount);case 4:case"end":return e.stop()}}),e)})))()},playmusic:function(t){var e=this;return Object(n["a"])(regeneratorRuntime.mark((function s(){var a,i;return regeneratorRuntime.wrap((function(s){while(1)switch(s.prev=s.next){case 0:return s.next=2,Object(r["m"])({id:t.id});case 2:a=s.sent,a.data[0].url?(i="",i=t.album.blurPicUrl?t.album.blurPicUrl:"https://i.loli.net/2020/03/23/m6KE9A2dQXa5zJU.png",e.$store.commit("upDateSong",{musicUrl:a.data[0].url,imgUrl:i,name:"歌曲正在加载中...",songName:t.name,author:t.artists[0].name,id:t.id})):e.$notify.error({title:"错误",message:"该歌曲无法获取"});case 4:case"end":return s.stop()}}),s)})))()}}},l=c,o=(s("af3e"),s("2877")),u=Object(o["a"])(l,a,i,!1,null,"0c2af80e",null);e["default"]=u.exports},"8d95":function(t,e,s){},af3e:function(t,e,s){"use strict";var a=s("8d95"),i=s.n(a);i.a}}]);