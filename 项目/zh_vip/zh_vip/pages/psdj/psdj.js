// var t = require("../../api.js"),
var app = getApp();
var dataheith = [0];
var linheightid = 0;
Page({
  data: {
    rgihtdata:[],
    sub_cat_list_scroll_top: 0,
    store: { cat_style: 4 },
    tab_config: {
      tabs: [],
      tab_left: 0,
    },
    linheightid: linheightid,
    scroll: "scroll"
  },
  onLoad: function (t) {
    app.pageOnLoad(this);
    // this.setData({
    //   store: wx.getStorageSync("store")
    // })
    var that = this;
    var xtxx = wx.getStorageSync('xtxx')
    var url = getApp().imgurl;
    console.log(xtxx)
    this.setData({
      xtxx: xtxx,
      url: url,
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: xtxx.link_color,
    })
  },
  reLoad:function(){
    var that = this;
    var mdid = wx.getStorageSync('mdid')
    console.log(mdid)
    //Type 
    app.util.request({
      'url': 'entry/wxapp/Type',
      'cachetime': '0',
      data: { store_id: mdid },
      success: function (res) {
        console.log(res.data)
        var typelist=[];
        for(let i=0;i<res.data.length;i++){
          if (res.data[i].type2.length>0){
             typelist.push(res.data[i])
          }
        }
        console.log(typelist)
        var indexheight = 0
        for (var i = 0; i < typelist.length; i++) {
          indexheight += (Math.floor(typelist[i].type2.length / 3) + 1) * 95;
          dataheith.push(indexheight);
        }
        //
        let { window_height, tab_config } = that.data;
        var sjxx = wx.getSystemInfoSync()
        console.log(sjxx)
        window_height = sjxx.windowHeight - 110

        // tab_config.item_height = window_height / tab_config.tabs.length;
        tab_config.item_height = 50
        console.log(window_height, tab_config.item_height)

        that.setData({ "window_height": window_height, "tab_config": tab_config });
        that.setData({
          tab_config: {
            tabs: typelist,
            tab_left: 0,
          },
        })
      }
    });
  },
  onShow: function () {
    this.reLoad();
    // a.pageOnShow(this),
    //   this.loadData()
  },
  // loadData: function (s) {
  //   var e = this,
  //     c = wx.getStorageSync("cat_list");
  //   c && e.setData({
  //     cat_list: c,
  //     current_cat: null
  //   }),
  //     a.request({
  //       url: t.
  //         default.cat_list,
  //       success: function (t) {
  //         0 == t.code && (e.setData({
  //           cat_list: t.data.list,
  //           current_cat: null
  //         }), wx.setStorageSync("cat_list", t.data.list))
  //       },
  //       complete: function () {
  //         wx.stopPullDownRefresh()
  //       }
  //     })
  // },
  catItemClick: function (e) {
    var that = this;
    console.log("你点击的ID为：", e.currentTarget.dataset.index);
    var linheightid = e.currentTarget.dataset.index;
    console.log(typeof linheightid)
    that.updateSelectedPage(parseInt(linheightid));
    this.setData({
      intoid: "id" + linheightid,
      linheightid: linheightid,
      scroll: ""
    });
    setTimeout(function () {
      that.setData({
        scroll: "scroll"
      });
    }, 500)
  },
  // 滚动触发
  scroll: function (e) {
    console.log(e);
    var that = this;
    var scrolltop = e.detail.scrollTop;
    var scrollbotton = e.detail.scrollTop
    for (var i = 0; i < dataheith.length; i++) {
      if (scrolltop <= dataheith[i - 1]) {
        console.log(i);
        console.log(scrolltop, linheightid)
        if (linheightid != i) {
          that.updateSelectedPage(i - 2);
          linheightid = i - 2
          if (linheightid == -1) {
            this.setData({
              linheightid: 0
            })
            return
          }
          this.setData({
            linheightid: linheightid
          })
        }
        break
      }
    }
  },
  // 更换页面到指定page ，从0开始
  updateSelectedPage(page) {
    let that = this;
    console.log("====_updateSelectedPage", page);
    let { window_height, tab_config } = this.data;
    let underline_offset = tab_config.item_width * page;

    let show_item_num = Math.round(window_height / tab_config.item_height); 
    let min_left_item = tab_config.item_height * (page - show_item_num + 1); 
    let max_left_item = tab_config.item_height * page; 
    if (tab_config.tab_left < min_left_item || tab_config.tab_left > max_left_item) {
      tab_config.tab_left = max_left_item - (window_height - tab_config.item_height) / 2;
    }
    console.log(tab_config)
    that.setData({
      "tab_config": tab_config,
    });
  },
  onPullDownRefresh: function () {
    linheightid = 0;
    dataheith = [0];
    this.setData({
      intoid: "id" + linheightid,
      linheightid: linheightid,
    })
    this.reLoad()
    setTimeout(function () {
      wx.stopPullDownRefresh()
    }, 1000)
  },
});