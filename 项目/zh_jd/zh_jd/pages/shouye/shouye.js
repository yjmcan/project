//index.js
//获取应用实例
var app = getApp();
var Data = require("../../utils/data.js");
Page({
  data: {
    tips: '选择日期',
    date: '',
    tomorrow: '',
    userInfo: {},
    name: ''
  },

  // ——————————日历点击事件————————
  //事件处理函数
  bindViewTap: function () {
    var that = this;
    var startDate = that.data.date;
    var endDate = that.data.tomorrow;
    console.log(startDate);
    console.log('入住时间礼拜' + new Date(startDate).getDay())
    console.log('离店时间礼拜' + new Date(endDate).getDay())
    console.log(endDate);
    wx.navigateTo({
      url: '../calendar/calendar?startDate=' + startDate + "&endDate=" + endDate
    })
  },
  canvasIdErrorCallback: function (e) {
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 50,
      height: 50,
      destWidth: 100,
      destHeight: 100,
      canvasId: 'myCanvas',
      success: function (res) {
        console.log(res.tempFilePath)
      }
    })
    const ctx = wx.createCanvasContext('myCanvas')
    wx.chooseImage({
      success: function (res) {
        console.log(res)
        ctx.drawImage(res.tempFilePaths[0], 0, 0, 150, 100)
        ctx.draw()
      }
    })
  },
  //事件处理函数
  onLoad: function () {
    var that = this
    
    var context = wx.createCanvasContext('firstCanvas')
    console.log(context)
   
    wx.canvasToTempFilePath({
      x: 100,
      y: 200,
      width: 50,
      height: 50,
      destWidth: 100,
      destHeight: 100,
      canvasId: 'myCanvas',
      success: function (res) {
        console.log(res)
      }
    })
    wx.showShareMenu({
      withShareTicket: true
    })
    // 获取网址信息
    app.util.request({
      'url': 'entry/wxapp/attachurl',
      'cachetime': '0',
      success: function (res) {
        wx.setStorageSync("url", res.data)
        that.setData({
          url:res.data
        })
      },
    })
    // 获取用户登录信息
    wx.login({
      success: function (res) {
        var code = res.code
        wx.setStorageSync("code", res.code)
        wx.getUserInfo({
          success: function (res) {
            wx.setStorageSync("user_info", res.userInfo)
            that.setData({
              avatarUrl: res.userInfo.avatarUrl,
              nickName: res.userInfo.nickName
            })
            app.util.request({
              'url': 'entry/wxapp/openid',
              'cachetime': '0',
              data: { code: code },
              success: function (res) {
                console.log(res)
                wx.setStorageSync("key", res.data.session_key)
                var img = that.data.avatarUrl
                var name = that.data.nickName
                // 异步保存用户openid
                wx.setStorageSync("openid", res.data.openid)
                var openid = res.data.openid
                console.log(openid)
                // 获取用户登录信息
                app.util.request({
                  'url': 'entry/wxapp/Login',
                  'cachetime': '0',

                  data: { openid: openid, img: img, name: name },
                  success: function (res) {
                    console.log(res)
                    // 异步保存用户登录信息
                    wx.setStorageSync('users', res.data)
                  },
                })
              },
            })
          }
        })
      }
    })
    //  获取平台信息
    app.util.request({
      'url': 'entry/wxapp/getplatform',
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        wx.setStorageSync('platform', res.data)
        wx.setStorageSync('platform_type', res.data.type)
        if(res.data.db_color==''){
          wx.setStorageSync('platform_color', '#F9882B')
        }else{
          wx.setStorageSync('platform_color', res.data.db_color)
        }
        
        wx.setNavigationBarTitle({
          title: res.data.name
        })

        wx.setNavigationBarColor({
          frontColor: '#ffffff',
          backgroundColor: wx.getStorageSync('platform_color'),
          animation: {
            duration: 0,
            timingFunc: 'easeIn'
          }
        })
        if(res.data.type==1){
          wx: wx.setStorageSync('hotel', res.data.seller_id)
        }
        that.setData({
          platform: res.data,
          types: res.data.type
        })
      },
    })
    //  获取标题信息
    app.util.request({
      'url': 'entry/wxapp/index',
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        that.setData({
          title: res.data
        })
      },
    })
    
    // 获取当前地理位置的经纬度
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy
      },
    })

    //地理位置
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        let latitude = res.latitude
        let longitude = res.longitude
        let op = latitude + ',' + longitude;
        app.util.request({
          'url': 'entry/wxapp/map',
          'cachetime': '0',
          data: { op: op },
          success: res => {
            console.log(res.data);
            wx.setStorageSync("location", res.data.result.location)
            that.setData({
              city: res.data.result.ad_info.city,
              location: res.data.result.location
            })

          }
        })
      }
    })
  },


  // 下拉刷新
  onPullDownRefresh() {
    var that = this
    that.onLoad()
    wx.stopPullDownRefresh();
  },
  onShow: function () {
    var startDate = this.data.startDate;
    var endDate = this.data.endDate;
    // 默认显示入住时间为当天
    var date = Data.formatDate(new Date(), "yyyy-MM-dd");
    var tomorrow1 = new Date();
    // 默认显示离店日期为第二天
    tomorrow1.setDate((new Date()).getDate() + 1);
    var tomorrow = Data.formatDate(new Date(tomorrow1), "yyyy-MM-dd");
    if (startDate == null) {
      var s1 = new Date(date.replace(/-/g, "/"));
      var s2 = new Date(tomorrow.replace(/-/g, "/"));
      var days = s2.getTime() - s1.getTime();
      var time = parseInt(days / (1000 * 60 * 60 * 24));
      if (new Date(date).getDay() == 0) {
        starttime = date.slice(5, 10) + '周日';
      } else if (new Date(date).getDay() == 1) {
        starttime = date.slice(5, 10) + '周一';
      } else if (new Date(date).getDay() == 2) {
        starttime = date.slice(5, 10) + '周二';
      } else if (new Date(date).getDay() == 3) {
        starttime = date.slice(5, 10) + '周三';
      } else if (new Date(date).getDay() == 4) {
        starttime = date.slice(5, 10) + '周四';
      } else if (new Date(date).getDay() == 5) {
        starttime = date.slice(5, 10) + '周五';
      } else if (new Date(date).getDay() == 6) {
        starttime = date.slice(5, 10) + '周六';
      }
      if (new Date(tomorrow).getDay() == 0) {
        endtime = tomorrow.slice(5, 10) + '周日'
      } else if (new Date(tomorrow).getDay() == 1) {
        endtime = tomorrow.slice(5, 10) + '周一';
      } else if (new Date(tomorrow).getDay() == 2) {
        endtime = tomorrow.slice(5, 10) + '周二';
      } else if (new Date(tomorrow).getDay() == 3) {
        endtime = tomorrow.slice(5, 10) + '周三';
      } else if (new Date(tomorrow).getDay() == 4) {
        endtime = tomorrow.slice(5, 10) + '周四';
      } else if (new Date(tomorrow).getDay() == 5) {
        endtime = tomorrow.slice(5, 10) + '周五';
      } else if (new Date(tomorrow).getDay() == 6) {
        endtime = tomorrow.slice(5, 10) + '周六';
      }

      this.setData({
        startDate: date,
        endDate: tomorrow,
        date: starttime,
        tomorrow: endtime,
        time: time
      });
    } else {
      var s1 = new Date(startDate.replace(/-/g, "/"));
      var s2 = new Date(endDate.replace(/-/g, "/"));
      var days = s2.getTime() - s1.getTime();
      var time = parseInt(days / (1000 * 60 * 60 * 24));
      // 截取日期只显示月和日
      var seatr_time_one = startDate.slice(5, 10)
      var end_time_one = endDate.slice(5, 10)
      console.log(seatr_time_one)
      console.log(end_time_one)
      // 入住日期
      if (new Date(startDate).getDay() == 0) {
        var starttime = seatr_time_one + '周日'
      } else if (new Date(startDate).getDay() == 1) {
        var starttime = seatr_time_one + '周一'
      } else if (new Date(startDate).getDay() == 2) {
        var starttime = seatr_time_one + '周二'
      } else if (new Date(startDate).getDay() == 3) {
        var starttime = seatr_time_one + '周三'
      } else if (new Date(startDate).getDay() == 4) {
        var starttime = seatr_time_one + '周四'
      } else if (new Date(startDate).getDay() == 5) {
        var starttime = seatr_time_one + '周五'
      } else if (new Date(startDate).getDay() == 6) {
        var starttime = seatr_time_one + '周六'
      }

      // 离店日期
      if (new Date(endDate).getDay() == 0) {
        var endtime = end_time_one + '周日'
      } else if (new Date(endDate).getDay() == 1) {
        var endtime = end_time_one + '周一'
      } else if (new Date(endDate).getDay() == 2) {
        var endtime = end_time_one + '周二'
      } else if (new Date(endDate).getDay() == 3) {
        var endtime = end_time_one + '周三'
      } else if (new Date(endDate).getDay() == 4) {
        var endtime = end_time_one + '周四'
      } else if (new Date(endDate).getDay() == 5) {
        var endtime = end_time_one + '周五'
      } else if (new Date(endDate).getDay() == 6) {
        var endtime = end_time_one + '周六'
      }
      this.setData({
        startDate: startDate,
        endDate: endDate,
        date: starttime,
        tomorrow: endtime,
        time: time
      });
    }
  },
  // 订酒店
  hotel: function (e) {
    var that = this
    console.log(this.data)
    function getNewDay(dateTemp, days) {
      var dateTemp = dateTemp.split("-");
      var nDate = new Date(dateTemp[1] + '-' + dateTemp[2] + '-' + dateTemp[0]); //转换为MM-DD-YYYY格式    
      var millSeconds = Math.abs(nDate) + (days * 24 * 60 * 60 * 1000);
      var rDate = new Date(millSeconds);
      var year = rDate.getFullYear();
      var month = rDate.getMonth() + 1;
      if (month < 10) month = "0" + month;
      var date = rDate.getDate();
      if (date < 10) date = "0" + date;
      return (year + "-" + month + "-" + date);
    } 
    var myDate = new Date().toLocaleDateString().replace(/\//g, "-");
    var date = getNewDay(myDate, 27)
    if (this.data.startDate==null){
      wx.setStorageSync('startDate', this.data.startDate)
      wx.setStorageSync('endDate', this.data.endDate)
    }else{
      if (this.data.endDate>date){
        wx:wx.showModal({
          title: '提示',
          content: '最多只能选择28天以内的日期',
          showCancel: true,
          cancelText: '取消',
          cancelColor: '',
          confirmText: '确定',
          confirmColor: '',
          success: function(res) {},
          fail: function(res) {},
          complete: function(res) {},
        })
      }else{
        if (this.data.city == null) {
          wx: wx.showToast({
            title: '定位失败',
            icon: '',
            image: '',
            duration: 1500,
            mask: true,
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { },
          })
        } else {
          wx.setStorageSync('startDate', this.data.startDate)
          wx.setStorageSync('endDate', this.data.endDate)
          if (that.data.types == 2) {
            if (this.data.endDate == null) {
              wx: wx.navigateTo({
                url: "../merchant/merchant?time=" + this.data.time + '&date=' + this.data.date + '&tomorrow=' + this.data.tomorrow + '&dd=' + this.data.startDate + '&to=' + this.data.endDate + '&lat=' + this.data.location.lat + '&lng=' + this.data.location.lng,
              })
            } else {
              console.log('居然有东西')
              wx: wx.navigateTo({
                url: "../merchant/merchant?time=" + this.data.time + '&to=' + this.data.endDate + '&dd=' + this.data.startDate + '&date=' + this.data.date + '&tomorrow=' + this.data.tomorrow + '&lat=' + this.data.location.lat + '&lng=' + this.data.location.lng,
              })
            }
          } else if (that.data.types == 1) {
            if (this.data.endDate == null) {
              wx: wx.navigateTo({
                url: "../wode/index?time=" + this.data.time + '&date=' + this.data.date + '&tomorrow=' + this.data.tomorrow + '&dd=' + this.data.startDate + '&to=' + this.data.endDate + '&lat=' + this.data.location.lat + '&lng=' + this.data.location.lng,
              })
            } else {
              console.log('居然有东西')
              wx: wx.navigateTo({
                url: "../wode/index?time=" + this.data.time + '&to=' + this.data.endDate + '&dd=' + this.data.startDate + '&date=' + this.data.date + '&tomorrow=' + this.data.tomorrow + '&lat=' + this.data.location.lat + '&lng=' + this.data.location.lng,
              })
            }
          }

        }
      }
      
      wx.setStorageSync('startDate', this.data.startDate)
      wx.setStorageSync('endDate', this.data.endDate)
    }
  },
  onReady: function () {
    var that = this
    console.log(that.data)

  },
  in_calendar: function () {
    wx.navigateTo({
      url: '../calendar/calendar',
    })
  },
  tomap: function (e) {

    var that = this
    console.log(that.data)
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度  
      success: function (e) {
        var latitude = e.latitude
        var longitude = e.longitude
        wx.openLocation({
          latitude: latitude,
          longitude: longitude,
          name: that.data.store.name,
          address: that.data.store.address,
          scale: 28
        })
      }
    })

  },
})
