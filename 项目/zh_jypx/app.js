//app.js
App({
  util: require('we7/resource/js/util.js'),
  siteInfo: require('siteinfo.js'),
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },

  getUserInfo: function (cb) {
    var that = this
    // ----------------------------------获取用户登录信息----------------------------------
    wx.login({
      success: function (res) {
        var code = res.code
        console.log(res)
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


  globalData: {
    userInfo: null,
  }
})