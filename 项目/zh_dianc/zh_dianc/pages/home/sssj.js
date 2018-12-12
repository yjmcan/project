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
    searchLogShowed: true 
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数  
    var that = this;
    var url=wx.getStorageSync('imglink')
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
      'url': 'entry/wxapp/system',
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
  },
  reLoad:function(searchtext){
    this.setData({
      qqsj:false
    })
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
            //推荐商家列表
            app.util.request({
              'url': 'entry/wxapp/SearchStore',
              'cachetime': '0',
              data:{key:searchtext},
              success: function (res) {
                console.log(res.data)
                that.setData({
                  qqsj:true
                })
                if(res.data.length==0){
                  that.setData({
                    tjstorelist: []
                  })
                }
                var storelist = res.data
                for (let i = 0; i < storelist.length; i++) {
                  var sjjwd = (storelist[i].coordinates).split(',')
                  console.log(sjjwd, start)
                  var distance = (util.getDistance(start.lat, start.lng, sjjwd[0], sjjwd[1])).toFixed(1)
                  console.log(distance)
                    if (distance < 1000) {
                      storelist[i].aa = distance + 'm'
                      storelist[i].aa1 = distance
                    }
                    else {
                      storelist[i].aa = (distance / 1000).toFixed(2) + 'km'
                      storelist[i].aa1 = distance
                    }
                    that.setData({
                      tjstorelist: storelist,
                    })
                }
                console.log(storelist)
              },
            })
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
  //自定义转换方法
  changejwd: function (lat, lng, cbk) {
    //坐标转地址
    var jwd;
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: lat,
        longitude: lng
      },
      coord_type: 3,
      success: function (res) {
        console.log(res);
        console.log('坐标转地址后的经纬度：', res.result.ad_info.location)
        jwd = res.result.ad_info.location
        cbk(jwd)
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        console.log(res);
      }
    });
  },
  tzsj: function (e) {
    console.log(e.currentTarget.dataset.sjid)
    var sjinfo = e.currentTarget.dataset.sjid
    getApp().sjid = e.currentTarget.dataset.sjid.id
    if (sjinfo.is_dn == '0' && sjinfo.is_pd == '0' && sjinfo.is_yy == '0' && sjinfo.is_wm == '1' && sjinfo.is_sy == '0') {
      wx.navigateTo({
        url: '../index/index?type=2'
      })
    }
    else {
      wx.navigateTo({
        url: '../info/info'
      })
    }
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
      inputVal: searchTitle
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