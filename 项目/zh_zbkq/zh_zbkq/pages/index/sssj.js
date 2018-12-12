// zh_dianc/pages/home/sssj.js
var app = getApp();
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var qqmapsdk;
var util = require('../../utils/util.js');
var pageNum = 1; // 当前页数  
var searchTitle = ""; // 搜索关键字  
var msgListKey = ""; // 文章列表本地缓存key  

Page({
  data: {
    qqsj: true,
    msgList: [], 
    searchLogList: [],   
    hidden: true, 
    scrollTop: 0, 
    inputShowed: false, 
    inputVal: "", 
    searchLogShowed: true,
    scrollHeight: 0,
    pagenum: 1,
    storelist: [],
    mygd: false,
    jzgd: true, 
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数  
    var that = this;
    var url=getApp().imgurl
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth,
          searchLogList: wx.getStorageSync('searchLog') || [],
          url:url
        })
      }
    });
    // 系统设置
    app.util.request({
      'url': 'entry/wxapp/GetMapKey',
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        // 实例化API核心类
        qqmapsdk = new QQMapWX({
          key: res.data.map_key
        });
        that.setData({
          mdxx: res.data
        })
      },
    })
    //获取设备高度
    wx.getSystemInfo({
      success(res) {
        that.setData({
          scrollHeight: res.windowHeight
        })
      }
    });
  },
  sljz: function () {
    console.log('上拉加载', this.data.pagenum)
    var that = this;
    if (!this.data.mygd && this.data.jzgd) {
      this.setData({
        jzgd: false
      })
      this.jzgd(searchTitle);
    }
    else {
      wx.showToast({
        title: '没有更多了',
        icon: 'loading',
        duration: 1000,
      })
    }
  },
  reLoad:function(searchtext){
    this.setData({
      qqsj:false
    })
    this.jzgd(searchtext)
  },
  jzgd: function (searchtext){
    var that = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        let latitude = res.latitude
        let longitude = res.longitude
        let op = latitude + ',' + longitude;
        console.log(op)
        // 调用接口
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: latitude,
            longitude: longitude
          },
          coord_type: 1,
          success: function (res) {
            var start = res.result.ad_info.location
            console.log(res);
            console.log(res.result.formatted_addresses.recommend);
            console.log('坐标转地址后的经纬度：', res.result.ad_info.location)
            that.setData({
              weizhi: res.result.formatted_addresses.recommend,
            })
            //取门店;
            app.util.request({
              'url': 'entry/wxapp/MdList',
              'cachetime': '0',
              data: { lat: start.lat, lng: start.lng, keywords: searchtext, page: that.data.pagenum, pagesize: 5 },
              success: function (res) {
                console.log('分页返回的门店列表数据', res.data)
                if (res.data.length == 0) {
                  that.setData({
                    mygd: true,
                    jzgd: true,
                  })
                  wx.showToast({
                    title: '没有更多了',
                    icon: 'loading',
                    duration: 1000,
                  })
                }
                else{
                  that.setData({
                    jzgd: true,
                    pagenum: that.data.pagenum + 1,
                  })
                }
                var mdlist = that.data.storelist;
                mdlist = mdlist.concat(res.data)
                for (let i = 0; i < mdlist.length; i++) {
                  var distance = (util.getDistance(start.lat, start.lng, mdlist[i].lat, mdlist[i].lng)).toFixed(2)
                  if (distance < 1000) {
                    mdlist[i].distance = distance + 'm'
                  }
                  else {
                    mdlist[i].distance = (distance / 1000).toFixed(2) + 'km'
                  }
                }
                that.setData({
                  mdlist: mdlist,
                  qqsj: true,
                  storelist: mdlist,
                })
                console.log(mdlist)
              }
            });
          },
          fail: function (res) {
            console.log(res);
          },
          complete: function (res) {
            console.log(res);
          }
        });
      }
    })
  },
  tzsj: function (e) {
    console.log(e.currentTarget.dataset.src)
    wx.navigateTo({
      url: e.currentTarget.dataset.src,
    })
  },
  onReady: function () {
    // 页面渲染完成  
  },
  onShow: function () {
    // 页面显示  
  },
  // 定位数据  
  scroll: function (event) {
    var that = this;
    that.setData({
      scrollTop: event.detail.scrollTop
    });
  },
  // 显示搜索输入框和搜索历史记录  
  showInput: function () {
    var that = this;
    if ("" != wx.getStorageSync('searchLog')) {
      that.setData({
        inputShowed: true,
        searchLogShowed: true,
        searchLogList: wx.getStorageSync('searchLog')
      });
    } else {
      that.setData({
        inputShowed: true,
        searchLogShowed: true
      });
    }
  },

  // 点击 搜索 按钮
  searchData: function () {
    console.log(searchTitle)
    var that = this;
    that.setData({
      msgList: [],
      scrollTop: 0,
      storelist: [],
      pagenum: 1,
      mygd: false,
    });
    //  
    if ("" != searchTitle) {
      var searchLogData = that.data.searchLogList;
      if (searchLogData.indexOf(searchTitle) === -1) {
        searchLogData.unshift(searchTitle);
        wx.setStorageSync('searchLog', searchLogData);
        that.setData({
          searchLogList: wx.getStorageSync('searchLog')
        })
      }
      that.reLoad(searchTitle)
    }
    else{
      wx.showToast({
        title: '搜索内容为空',
        icon:'loading',
        duration:1000,
      })
    }
  },

  // 点击叉叉icon 清除输入内容
  clearInput: function () {
    var that = this;
    that.setData({
      msgList: [],
      scrollTop: 0,
      inputVal: ""
    });
    searchTitle = "";
  },

  // 输入内容时  
  inputTyping: function (e) {
    var that = this;
    // 如果不做这个if判断，会导致 searchLogList 的数据类型由 list 变为 字符串  
    if ("" != wx.getStorageSync('searchLog')) {
      that.setData({
        inputVal: e.detail.value,
        searchLogList: wx.getStorageSync('searchLog')
      });
    } else {
      that.setData({
        inputVal: e.detail.value,
        searchLogShowed: true
      });
    }
    searchTitle = e.detail.value;
  },

  // 通过搜索记录查询数据  
  searchDataByLog: function (e) {
    // 从view中获取值，在view标签中定义data-name(name自定义，比如view中是data-log="123" ; 那么e.target.dataset.log=123)  
    searchTitle = e.target.dataset.log;
    console.log(e.target.dataset.log)
    var that = this;
    that.setData({
      msgList: [],
      scrollTop: 0,
      inputShowed:true,
      inputVal: searchTitle,
    });
    this.searchData()
  },
  // 清楚搜索记录  
  clearSearchLog: function () {
    var that = this;
    that.setData({
      hidden: false
    });
    wx.removeStorageSync("searchLog");
    that.setData({
      scrollTop: 0,
      hidden: true,
      searchLogList: []
    });
  },
  onHide: function () {
    // 页面隐藏  
  },
  onUnload: function () {
    // 页面关闭  
  }
}) 