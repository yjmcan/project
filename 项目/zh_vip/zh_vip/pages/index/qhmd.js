// zh_hyk/pages/index/qhmd.js
var searchTitle = ""; // 搜索关键字  
var app = getApp()
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var util = require('../../utils/util.js');
var qqmapsdk;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listarr: ['推荐排序', '距您最近', '人气优先'],
    weizhi: '定位中...',
    activeIndex: 0,
    qqsj: false,
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
  showInput: function () {
    var that = this;
    that.setData({
      inputShowed: true,
      searchLogShowed: true
    });
  },
  comparesx: function (prop) {
    return function (obj1, obj2) {
      var val1 = obj1[prop];
      var val2 = obj2[prop];
      if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
        val1 = Number(val1);
        val2 = Number(val2);
      }
      if (val1 < val2) {
        return -1;
      } else if (val1 > val2) {
        return 1;
      } else {
        return 0;
      }
    }
  },
  comparejx: function (prop) {
    return function (obj1, obj2) {
      var val1 = obj1[prop];
      var val2 = obj2[prop];
      if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
        val1 = Number(val1);
        val2 = Number(val2);
      }
      if (val1 < val2) {
        return 1;
      } else if (val1 > val2) {
        return -1;
      } else {
        return 0;
      }
    }
  },
  // 点击 搜索 按钮
  searchData: function () {
    console.log(searchTitle)
    var that = this;
    that.setData({
      scrollTop: 0,
      storelist: [],
      tjstorelist: [],
      jlstorelist: [],
      jlpx: [],
      rqpx: [],
      pagenum: 1,
      mygd: false,
      qqsj: false,
    });
    //  
    if ("" != searchTitle) {
      that.tjpx(that.data.start, searchTitle)
    }
    else {
      wx.showToast({
        title: '搜索内容为空',
        icon: 'loading',
        duration: 1000,
      })
      that.setData({
        qqsj: true,
        mygd: true,
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
    that.setData({
      inputVal: e.detail.value,
      searchLogShowed: true
    });
    searchTitle = e.detail.value;
  },
  //点击切换排序
  tabClick: function (e) {
    var that = this;
    var index = e.currentTarget.id
    console.log(index)
    this.setData({
      activeIndex: e.currentTarget.id,
      qqsj: false,
    });
    if (index == '0') {
      that.setData({
        tjstorelist: that.data.storelist,
        qqsj: true
      })
    }
    if (index == '1') {
      that.setData({
        jlstorelist: that.data.jlpx.sort(that.comparesx("aa1")),
        qqsj: true
      })
    }
    if (index == '2') {
      that.setData({
        tjstorelist: that.data.rqpx.sort(that.comparejx("sentiment")),
        qqsj: true
      })
    }
  },
  tzsj: function (e) {
    console.log(e.currentTarget.dataset.sjid, e.currentTarget.dataset.type, e.currentTarget.dataset.appid)
    if (e.currentTarget.dataset.type == '2') {
      wx.navigateToMiniProgram({
        appId: e.currentTarget.dataset.appid,
        success(res) {
          // 打开成功
          console.log(res)
        }
      })
    }
    else {
      wx.navigateBack({

      })
      var pages = getCurrentPages();
      console.log(pages)
      if (pages.length > 1) {

        var prePage = pages[pages.length - 2];

        prePage.StoreInfo(e.currentTarget.dataset.sjid)
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    searchTitle = "";
    var that = this
    //取平台信息
    app.util.request({
      'url': 'entry/wxapp/system',
      'cachetime': '0',
      success: function (res) {
        console.log(res.data)
        that.setData({
          xtxx: res.data,
        })
        wx.setStorageSync('xtxx', res.data)
        // 实例化API核心类
        qqmapsdk = new QQMapWX({
          key: res.data.mapkey
        });
        //定位用户地址
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
                  start: start,
                })
                that.tjpx(that.data.start, searchTitle);
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
            wx.showModal({
              title: '警告',
              content: '您点击了拒绝授权,无法正常使用功能，点击确定重新获取授权。',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  wx.openSetting({
                    success: (res) => {
                      if (res.authSetting["scope.userLocation"]) {////如果用户重新同意了授权登录
                        that.onLoad()
                      } else {
                        that.onLoad();
                      }
                    },
                    fail: function (res) {
                    }
                  })
                }
              }
            })
          },
          complete: function (res) {
          }
        })
        wx.setNavigationBarColor({
          frontColor: '#ffffff',
          backgroundColor: res.data.link_color,
        })
        wx.setNavigationBarTitle({
          title: res.data.link_name,
        })
      }
    });
    //取imglink
    app.util.request({
      'url': 'entry/wxapp/url',
      'cachetime': '0',
      success: function (res) {
        console.log(res.data)
        that.setData({
          url: res.data,
        })
      }
    });
    //ad
    app.util.request({
      'url': 'entry/wxapp/ad',
      'cachetime': '0',
      success: function (res) {
        console.log(res.data)
        that.setData({
          lbarr: res.data,
        })
      }
    });
  },
  tjpx: function (start, searchtext) {
    console.log(searchtext)
    var that = this
    //推荐商家列表
    app.util.request({
      'url': 'entry/wxapp/StoreList',
      'cachetime': '0',
      data: { page: that.data.pagenum, pagesize: 3, name: searchtext },
      success: function (res) {
        console.log('分页返回的商家列表数据', res.data)
        if (res.data.length < 3) {
          that.setData({
            mygd: true,
            jzgd: true,
            qqsj: true,
          })
          // wx.showToast({
          //   title: '没有更多了',
          //   icon: 'loading',
          //   duration: 1000,
          // })
        }
        else {
          that.setData({
            jzgd: true,
            pagenum: that.data.pagenum + 1,
          })
        }
        var storelist = that.data.storelist;
        storelist = storelist.concat(res.data);
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
            storelist: storelist,
            jlpx: storelist,
            rqpx: storelist,
            qqsj: true,
          })
          that.setData({
            jlstorelist: that.data.jlpx.sort(that.comparesx("aa1")),
          })
        }
        console.log('商家列表数据', storelist)
      },
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.onLoad();
    this.setData({
      scrollTop: 0,
      inputVal: "",
      activeIndex: 0,
      storelist: [],
      tjstorelist: [],
      jlstorelist: [],
      jlpx: [],
      rqpx: [],
      pagenum: 1,
      mygd: false,
      qqsj: false,
    });
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('上拉加载', this.data.pagenum)
    var that = this;
    if (!this.data.mygd && this.data.jzgd) {
      this.setData({
        jzgd: false
      })
      this.tjpx(that.data.start, searchTitle);
    }
    else {
      // wx.showToast({
      //   title: '没有更多了',
      //   icon: 'loading',
      //   duration: 1000,
      // })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})