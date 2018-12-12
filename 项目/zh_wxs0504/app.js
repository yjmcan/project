//app.js
App({
  siteInfo: require('siteinfo.js'),
  onLaunch: function () {
    var siteInfo = require('siteinfo.js')
    console.log(siteInfo)
    wx.setStorageSync('siteroot', siteInfo.siteroot)
    // this.GetSystem()
  },
  onShow: function () {
    // console.log(getCurrentPages())
  },
  onHide: function () {
    // console.log(getCurrentPages())
  },
  onError: function (msg) {
    // console.log(msg)
  },
  getUserInfo: function (cb) {
    var that = this
    //取openid
    wx.login({
      success: function (res) {
        that.util.request({
          'url': 'entry/wxapp/Openid',
          'cachetime': '0',
          data: { code: res.code },
          success: function (res) {
            console.log(res)
            getApp().session_key = res.data.session_key;
            getApp().OpenId = res.data.openid;
            getApp().getSK = res.data.session_key;
            //调用登录接口
            wx.getUserInfo({
              withCredentials: false,
              success: function (res1) {
                //存用户信息
                that.util.request({
                  'url': 'entry/wxapp/Login',
                  'cachetime': '0',
                  data: { openid: res.data.openid, img: res1.userInfo.avatarUrl, name: res1.userInfo.nickName },
                  success: function (res) {
                    getApp().getuniacid = res.data.uniacid;
                    getApp().user_info = res.data;
                    wx.setStorageSync('userInfo', res.data)
                    cb(res.data)
                  },
                })
              },
              fail: function () {
                wx.showModal({
                  title: '提示',
                  content: '您拒绝个人信息授权,无法正常使用此小程序,点击确定重新获取授权。',
                  showCancel: false,
                  success: function (res3) {
                    if (res3.confirm) {
                      wx.openSetting({
                        success: (res2) => {
                          if (res2.authSetting["scope.userInfo"]) {////如果用户重新同意了授权登录
                            wx.getUserInfo({
                              success: function (res1) {
                                //存用户信息
                                that.util.request({
                                  'url': 'entry/wxapp/Login',
                                  data: { openid: res.data.openid, img: res1.userInfo.avatarUrl, name: res1.userInfo.nickName },
                                  dataType: 'json',
                                  success: function (res) {
                                    getApp().getuniacid = res.data.uniacid;
                                    wx.setStorageSync('UserData', res.data)
                                    cb(res.data)
                                  },
                                })
                              }
                            })
                          }
                          else {
                            //存用户信息
                            that.util.request({
                              'url': 'entry/wxapp/Login',
                              data: { openid: res.data.openid, img: '', name: '' },
                              dataType: 'json',
                              success: function (res) {
                                getApp().getuniacid = res.data.uniacid;
                                wx.setStorageSync('UserData', res.data)
                                cb(res.data)
                              },
                            })
                          }
                        },
                        fail: function (res) {
                        }
                      })
                    }
                  }
                })
              }, complete: function (res) {
              }
            })
          },
          fail: function (res) { },
          complete: function (res) { },
        })
      }
    });
  },

  // -----------------------------时间戳转换日期时分秒--------------------------------
  ormatDate: function (dateNum) {
    var date = new Date(dateNum * 1000);
    return date.getFullYear() + "-" + fixZero(date.getMonth() + 1, 2) + "-" + fixZero(date.getDate(), 2) + " " + fixZero(date.getHours(), 2) + ":" + fixZero(date.getMinutes(), 2) + ":" + fixZero(date.getSeconds(), 2);
    function fixZero(num, length) {
      var str = "" + num;
      var len = str.length;
      var s = "";
      for (var i = length; i-- > len;) {
        s += "0";
      }
      return s + str;
    }
  },
  // 根据指定日期计算
  week: function (date) {
    var weekDay = ["星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
    var dateStr = "2008-08-08";
    var myDate = new Date(Date.parse(dateStr.replace(/-/g, "/")));
    return weekDay[myDate.getDay()]
  },
  contains: function (arr, src) {
    var i = arr.length;
    while (i--) {
      if (arr[i].src === src) {
        return i;
      }
    }
    return false;
  },
  today: function () {
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
  },
  time: function (nS) {
    return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ');
    // var date = new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ');
    // var year = date.substring(0, 4);
    // var month = date.substring(5, 6);
    // var day = date.substring(8, 9);
    // return year + '-' + month + '-' + day;
  },
  // //获取当前时间，格式YYYY-MM-DD
  today_time: function (e) {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
      + " " + date.getHours() + seperator2 + date.getMinutes()
      + seperator2 + date.getSeconds();
    return currentdate;
  },
  yestoday: function (time) {
    var today = new Date();
    var yesterday_milliseconds = today.getTime() - 1000 * 60 * 60 * 24;

    var yesterday = new Date();
    yesterday.setTime(yesterday_milliseconds);

    var strYear = yesterday.getFullYear();
    var strDay = yesterday.getDate();
    var strMonth = yesterday.getMonth() + 1;
    if (strMonth < 10) {
      strMonth = "0" + strMonth;
    }
    var strYesterday = strYear + "-" + strMonth + "-" + strDay;
    return strYesterday
  },
  util: require('we7/resource/js/util.js'),
  // tabBar: {
  //   "color": "#123",
  //   "selectedColor": "#1ba9ba",
  //   "borderStyle": "#1ba9ba",
  //   "backgroundColor": "#fff",
  //   "list": [
  //     {
  //       "pagePath": "/we7/pages/index/index",
  //       "iconPath": "/we7/resource/icon/home.png",
  //       "selectedIconPath": "/we7/resource/icon/homeselect.png",
  //       "text": "首页"
  //     },
  //     {
  //       "pagePath": "/we7/pages/user/index/index",
  //       "iconPath": "/we7/resource/icon/user.png",
  //       "selectedIconPath": "/we7/resource/icon/userselect.png",
  //       "text": "微擎我的"
  //     }
  //   ]
  // },
  globalData: {
    userInfo: null,
  },
});