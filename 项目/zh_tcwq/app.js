//app.js
// var push = require('zh_tcwq/utils/pushsdk.js');
App({
  onLaunch: function () {
  },
  onShow: function () {
   
  },
  onHide: function () {
    console.log(getCurrentPages())
  },
  onError: function (msg) {
    console.log(msg)
  },
  getUrl: function (n) {
    var url = this.globalData.url;
    console.log(url, n)
    n.setData({
      url: url
    })
    var e = this;
    url || e.util.request({
      'url': 'entry/wxapp/Url',
      success: function (res) {
        console.log(res)
        wx.setStorageSync('url', res.data)
        e.globalData.url = res.data
        e.getUrl(n)
      }
    })
  },
  setNavigationBarColor: function (n) {
    var t = this.globalData.color;
    console.log(t, n)
    t && wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: t,
    }); n.setData({
      color: t
    })
    var e = this;
    t || e.util.request({
      'url': 'entry/wxapp/System',
      success: function (t) {
        console.log(t)
        getApp().xtxx = t.data
        e.globalData.color = t.data.color
        e.setNavigationBarColor(n)
        // 0 == t.code && (wx.setStorageSync("_navigation_bar_color", t.data), e.setNavigationBarColor())
      }
    })
  },
  // 提示iphone无法支付
  unableToPay:function(e){
    return false 
    wx.getSystemInfo({
      success: function (res) {
        console.log(res.model)
        if (res.model.search('iPhone') != -1) {
          wx.showModal({
            title: '暂不支持',
            content: '十分抱歉，由于相关规范，iPhone机型暂时无法支付',
            confirmText: '好的',
            showCancel:false,
            confirmColor: "#666"
          })
          false
        }else{
           true
        }
      }
    })
  },
  getUser: function (cb) {
    var that = this
    // ----------------------------------获取用户登录信息----------------------------------
    wx.login({
      success: function (res) {
        var code = res.code
        wx.setStorageSync("code", code)
        wx.getUserInfo({
          success: function (res) {
            console.log(res)
            wx.setStorageSync("user_info", res.userInfo)
            var nickName = res.userInfo.nickName
            var avatarUrl = res.userInfo.avatarUrl
            that.util.request({
              'url': 'entry/wxapp/openid',
              'cachetime': '0',
              data: { code: code },
              success: function (res) {
                console.log(res)
                wx.setStorageSync("key", res.data.session_key)
                wx.setStorageSync("openid", res.data.openid)
                var openid = res.data.openid
                that.util.request({
                  'url': 'entry/wxapp/Login',
                  'cachetime': '0',
                  data: { openid: openid, img: avatarUrl, name: nickName },
                  success: function (res) {
                    console.log(res)
                    wx.setStorageSync('users', res.data)
                    wx.setStorageSync('uniacid', res.data.uniacid)
                    cb(res.data)
                  },
                })
              },
            })
          },
          fail: function (res) {
            wx.getSetting({
              success: (res) => {
                var authSetting = res.authSetting
                if (authSetting['scope.userInfo'] == false) {
                  wx.openSetting({
                    success: function success(res2) {
                      if (res2.authSetting["scope.userInfo"]) {
                        that.getUser(cb)
                      }
                      else {
                        that.getUser(cb)
                      }
                    }
                  });
                }
              }
            })
          }
        })
      }
    })
  },
  getUserInfo: function (cb) {
    var that = this, userinfo = this.globalData.userInfo;
    console.log(userinfo)
    if (userinfo) {
      typeof cb == "function" && cb(userinfo)
    } else {
      wx.login({
        success: function (res) {
          wx.showLoading({
            title: "正在登录",
            mask: !0
          })
          console.log(res.code)
          that.util.request({
            'url': 'entry/wxapp/Openid',
            'cachetime': '0',
            data: { code: res.code },
            header: {
              'content-type': 'application/json'
            },
            dataType: 'json',
            success: function (res) {
              console.log('openid信息', res.data)
              getApp().getOpenId = res.data.openid;
              getApp().getSK = res.data.session_key;
              //存用户信息
              that.util.request({
                'url': 'entry/wxapp/login',
                'cachetime': '0',
                data: { openid: res.data.openid },
                header: {
                  'content-type': 'application/json'
                },
                dataType: 'json',
                success: function (res) {
                  console.log('用户信息', res)
                  getApp().getuniacid = res.data.uniacid;
                  wx.setStorageSync('users', res.data)
                  that.globalData.userInfo = res.data
                  typeof cb == "function" && cb(that.globalData.userInfo)
                },
              })
            },
            fail: function (res) { },
            complete: function (res) { },
          })
        }
      });
    }
  },
  getLocation: function (cb) {
    var that = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        typeof cb == "function" && cb(res)
      },
      fail: function () {
        wx.getSetting({
          success: (res) => {
            console.log(res)
            var authSetting = res.authSetting
            if (authSetting['scope.userLocation'] == false) {
              wx.showModal({
                title: '提示',
                content: '您暂未授权位置信息无法正常使用,请在（右上角 - 关于 - 右上角 - 设置）中开启位置信息授权后，下拉刷新即可正常使用',
              })
              // wx.showModal({
              //   title: '提示',
              //   content: '您拒绝了位置授权,无法正常使用功能，点击确定重新获取授权。',
              //   showCancel: false,
              //   success: function (res) {
              //     if (res.confirm) {
              //       console.log('用户点击确定')
              //       wx.openSetting({
              //         success: function success(res2) {
              //           if (res2.authSetting["scope.userLocation"]) {
              //             that.getLocation(cb)
              //           }
              //           else {
              //             that.getLocation(cb)
              //           }
              //         }
              //       });
              //     }
              //   }
              // })
            }
          }
        })
      },
      complete: function (res) {
      }
    })
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
  ab: function (e) {
    
  },
  util: require('we7/resource/js/util.js'),
  siteInfo: require('siteinfo.js'),
  tabBar: {
    "color": "#123",
    "selectedColor": "#1ba9ba",
    "borderStyle": "#1ba9ba",
    "backgroundColor": "#fff",
    "list": [
      {
        "pagePath": "/we7/pages/index/index",
        "iconPath": "/we7/resource/icon/home.png",
        "selectedIconPath": "/we7/resource/icon/homeselect.png",
        "text": "首页"
      },
      {
        "pagePath": "/we7/pages/user/index/index",
        "iconPath": "/we7/resource/icon/user.png",
        "selectedIconPath": "/we7/resource/icon/userselect.png",
        "text": "微擎我的"
      }
    ]
  },
  globalData: {
    userInfo: null,
  },
});