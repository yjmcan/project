// zh_dianc/pages/home/sjfl.js
const app = getApp()
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var qqmapsdk;
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listarr: ['推荐排序', '销量', '评分', '距离'],
    activeIndex: 0,
    qqsj: false,
    scrollHeight: 0,
    pagenum: 1,
    storelist: [],
    mygd: false,
    jzgd: true,
    jzwb: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var ptxx = wx.getStorageSync('bqxx')
    if (ptxx.more == '1') {
      var nbcolor = wx.getStorageSync('bqxx').color
    }
    if (ptxx.more == '2') {
      var nbcolor = wx.getStorageSync('nbcolor')
    }
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: nbcolor,
    })
    console.log(options)
    wx.setNavigationBarTitle({
      title: options.flname
    })
    var url = wx.getStorageSync('imglink')
    this.setData({
      flid: options.flid,
      url: url
    })
    console.log(this.data.flid)
    var that = this;
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: ptxx.map_key
    });
    //获取设备高度
    wx.getSystemInfo({
      success(res) {
        that.setData({
          scrollHeight: res.windowHeight
        })
      }
    });
    this.reLoad();
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
        tjstorelist: that.data.tjpx.sort(that.comparesx("number")),
        qqsj: true
      })
    }
    if (index == '1') {
      console.log(that.data.xlpx)
      that.setData({
        xlstorelist: that.data.xlpx.sort(that.comparejx("sales")),
        qqsj: true
      })
    }
    if (index == '2') {
      console.log(that.data.pfpx)
      that.setData({
        pfstorelist: that.data.pfpx.sort(that.comparejx("score")),
        qqsj: true
      })
    }
    if (index == '3') {
      that.setData({
        qqsj: true
      })
    }
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
  sljz: function () {
    console.log('上拉加载', this.data.pagenum)
    var that = this;
    if (!this.data.mygd && this.data.jzgd) {
      this.setData({
        jzgd: false
      })
      this.reLoad();
    }
    else {
      // wx.showToast({
      //   title: '没有更多了',
      //   icon: 'loading',
      //   duration: 1000,
      // })
    }
  },
  reLoad: function () {
    console.log(this.data.flid)
    var that = this;
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
            })
            //推荐商家列表
            app.util.request({
              'url': 'entry/wxapp/StoreList',
              'cachetime': '0',
              data: {lat: start.lat, lng: start.lng, type_id: that.data.flid, page: that.data.pagenum ,pagesize:10},
              success: function (res) {
                console.log('分页返回的商家列表数据', res.data)
                if (res.data.length < 10) {
                  that.setData({
                    mygd: true,
                    jzwb: true,
                  })
                  wx.showToast({
                    title: '没有更多了',
                    icon: 'loading',
                    duration: 1000,
                  })
                }
                that.setData({
                  jzgd: true,
                  pagenum: that.data.pagenum + 1,
                })
                var storelist = that.data.storelist;
                storelist = storelist.concat(res.data);
                if (res.data.length == 0) {
                  that.setData({
                    tjstorelist: storelist,
                    jlpx: storelist,
                    xlpx: storelist,
                    pfpx: storelist,
                    qqsj: true,
                  })
                }
                else {
                  for (let i = 0; i < storelist.length; i++) {
                    if (storelist[i].score == '0.0') {
                      storelist[i].score = '5.0'
                    }
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
                      jlstorelist: storelist,
                      tjpx: storelist,
                      xlpx: storelist,
                      pfpx: storelist,
                      storelist: storelist,
                      qqsj: true,
                    })
                    that.setData({
                      tjstorelist: that.data.tjpx.sort(that.comparesx("number")),
                      xlstorelist: that.data.xlpx.sort(that.comparejx("sales")),
                      pfstorelist: that.data.pfpx.sort(that.comparejx("score")),
                    })
                  }
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
                    that.reLoad();
                  } else {
                    that.reLoad();
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
  },
  //自定义算距离方法
  distance: function (f, t, cbk) {
    // 调用距离接口
    var distance;
    qqmapsdk.calculateDistance({
      mode: 'driving',
      from: {
        latitude: f.lat,
        longitude: f.lng
      },
      to: [{
        latitude: t.lat,
        longitude: t.lng
      }],
      success: function (res) {
        console.log(res);
        if (res.status == 0) {
          distance = Math.round(res.result.elements[0].distance)
          cbk(distance)
        }
      },
      fail: function (res) {
        console.log(res);
        if (res.status == 373) {
          distance = 15000;
          cbk(distance)
        }
      },
      complete: function (res) {
        console.log(res);
      }
    });
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
    var that = this
    // pageNum = 1;
    this.setData({
      activeIndex: 0,
      qqsj: false,
      pagenum: 1,
      storelist: [],
      mygd: false,
      jzgd: true,
      jzwb:false,
    })
    that.reLoad()
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})