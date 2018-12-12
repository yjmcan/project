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
    bfstorelist: [],
    mygd: false,
    jzgd: true,
    isjzz: true,
    params: { nopsf: 2, nostart: 2, yhhd: '' },
  },
  dwreLoad: function () {
    var that = this, params = this.data.params;
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
            params.lat = start.lat, params.lng = start.lng;
            console.log(res);
            console.log(res.result.formatted_addresses.recommend);
            console.log('坐标转地址后的经纬度：', res.result.ad_info.location)
            that.setData({
              weizhi: res.result.formatted_addresses.recommend,
              startjwd: start,
              params: params,
            })
            // that.getstorelist();
          },
          fail: function (res) {
            console.log(res);
          },
          complete: function (res) {
            console.log(res);
          }
        });
      },
      fail: function () {
        wx.getSetting({
          success: (res) => {
            console.log(res)
            var authSetting = res.authSetting
            if (authSetting['scope.userLocation'] == false) {
              wx.showModal({
                title: '提示',
                content: '您点击了拒绝授权,无法正常使用功能，点击确定重新获取授权。',
                showCancel: false,
                success: function (res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                    wx.openSetting({
                      success: function success(res2) {
                        if (res2.authSetting["scope.userLocation"]) {
                          that.dwreLoad()
                        }
                        else {
                          that.dwreLoad()
                        }
                      }
                    });
                  }
                }
              })
            }
          }
        })
      },
      complete: function (res) {
      }
    })
  },
  onLoad: function (options) {
    app.setNavigationBarColor(this);
    // 页面初始化 options为页面跳转所带来的参数  
    var that = this;
    that.setData({
      mdxx: wx.getStorageSync('bqxx')
    })
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
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: wx.getStorageSync('bqxx').map_key
    });
    console.log(wx.getStorageSync('bqxx'))
    that.dwreLoad()
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
    if (!this.data.mygd && this.data.jzgd && !this.data.isjzz) {
      this.setData({
        jzgd: false
      })
      this.getstorelist();
    }
    else {
      wx.showToast({
        title: '没有更多了',
        icon: 'loading',
        duration: 1000,
      })
    }
  },
  getstorelist: function () {
    var that = this, page = that.data.pagenum; that.data.params.page = page, that.data.params.pagesize = 20, that.data.params.keywords = searchTitle;
    console.log(page, that.data.params);
    that.setData({
      isjzz: true
    })
    //推荐商家列表
    app.util.request({
      'url': 'entry/wxapp/StoreList',
      'cachetime': '0',
      data: that.data.params,
      success: function (res) {
        console.log('分页返回的商家列表数据', res.data)
        if (res.data.length < 10) {
          that.setData({
            mygd: true,
            jzgd: true,
            isjzz: false
          })
        }
        else {
          that.setData({
            jzgd: true,
            pagenum: page + 1,
            isjzz: false
          })
        }
        var storelist = that.data.bfstorelist;
        storelist = storelist.concat(res.data);
        function unrepeat(arr) {
          var newarr = [];
          for (var i = 0; i < arr.length; i++) {
            if (newarr.indexOf(arr[i]) == -1) {
              newarr.push(arr[i]);
            }
          }
          return newarr;
        }
        storelist = unrepeat(storelist)
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].sales == '0.0') {
            res.data[i].sales = '5.0'
          }
          // var sjjwd = (res.data[i].coordinates).split(',')
          // console.log(sjjwd, start)
          // var distance = (util.getDistance(start.lat, start.lng, sjjwd[0], sjjwd[1])).toFixed(1)
          // console.log(distance)
          var distance = parseFloat(res.data[i].juli)
          console.log(distance)
          console.log()
          if (distance < 1000) {
            res.data[i].aa = distance + 'm'
            res.data[i].aa1 = distance
          }
          else {
            res.data[i].aa = (distance / 1000).toFixed(2) + 'km'
            res.data[i].aa1 = distance
          }
          that.setData({
            storelist: storelist,
            bfstorelist: storelist,
            isxlsxz: false,
          })
        }
        console.log(storelist)
        that.setData({
          qqsj: true,
        })
      },
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
      that.setData({
        qqsj: false,
        msgList: [],
        scrollTop: 0,
        pagenum: 1,
        storelist: [],
        bfstorelist: [],
        mygd: false,
        jzgd: true,
        isjzz: true,
      });
      that.getstorelist()
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