//app.js
App({
  onLaunch: function () {
  },
  onShow: function () {
    console.log(getCurrentPages())
  },
  onHide: function () {
    console.log(getCurrentPages())
  },
  onError: function (msg) {
    console.log(msg)
  },
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.getUserInfo({
        withCredentials: false,
        success: function (res) {
          console.log(res.userInfo)
          that.globalData.userInfo = res.userInfo
          typeof cb == "function" && cb(that.globalData.userInfo)
        },
        fail: function () {
          wx.showModal({
            title: '提示',
            content: '您点击了拒绝个人头像等信息授权,无法正常使用此小程序,点击确定重新获取授权。',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                wx.openSetting({
                  success: (res) => {
                    if (res.authSetting["scope.userInfo"]) {////如果用户重新同意了授权登录
                      wx.getUserInfo({
                        success: function (res) {
                          console.log(res.userInfo)
                          that.globalData.userInfo = res.userInfo
                          typeof cb == "function" && cb(that.globalData.userInfo)
                        }
                      })
                    }
                    else {
                      console.log('用户再次拒绝')
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
    }
  },
  userlogin:function(callb){
    var that=this
    //取openid
    wx.login({
      success: function (res) {
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
            console.log(res.data)
            getApp().getOpenId = res.data.openid;
            getApp().getSK = res.data.session_key;
            //存用户信息
            that.util.request({
              'url': 'entry/wxapp/login',
              'cachetime': '0',
              data: { openid: res.data.openid, img: that.globalData.userInfo.avatarUrl, nickname: that.globalData.userInfo.nickName },
              header: {
                'content-type': 'application/json'
              },
              dataType: 'json',
              success: function (res) {
                console.log(res)
                getApp().getuniacid = res.data.uniacid;
                wx.setStorageSync('UserData', res.data)
                callb(res.data)
              },
            })
          },
          fail: function (res) { },
          complete: function (res) { },
        })
      }
    });
  },
  util: require('we7/resource/js/util.js'),
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
  siteInfo:require('siteinfo.js')
});