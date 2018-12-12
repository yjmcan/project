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
  pageOnLoad: function (e) {
    var that = this;
    console.log("----setPageNavbar----"), console.log(e);
    function a(t) {
      console.log(t)
      var a = !1,
        o = e.route || e.__route__ || null;
      for (var n in t.navs) t.navs[n].url === "/" + o ? (t.navs[n].active = !0, a = !0) : t.navs[n].active = !1;
      a && e.setData({
        _navbar: t
      })
    }
    var navdata = {
      background_image:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAAA1BMVEX///+nxBvIAAAACklEQVQI12NgAAAAAgAB4iG8MwAAAABJRU5ErkJggg==", border_color: "rgba(0,0,0,.1)"
    }
    var o = that.globalData.navbar;
    console.log(o)
    o && a(o);
    o || that.util.request({
      'url': 'entry/wxapp/nav',
      success: function (t) {
        console.log(t)
        if (t.data.length == 0) {
          var arr = [{
            logo: '/zh_vip/img/ddf.png', logo2: '/zh_vip/img/dd.png', title:'首页', title_color: '#ff7f46', title_color2: '#888', url: "/zh_vip/pages/index/index"
          }, {
            logo: '/zh_vip/img/tabzdf.png', logo2: '/zh_vip/img/tabzd.png', title: '账单', title_color: '#ff7f46', title_color2: '#888', url: "/zh_vip/pages/my/wdzd"
          }, {
              logo: '/zh_vip/img/myf.png', logo2: '/zh_vip/img/my.png', title: '我的', title_color: '#ff7f46', title_color2: '#888', url: "/zh_vip/pages/my/my"
          }]
           navdata.navs=arr
           a(navdata)
           that.globalData.navbar = navdata
        }
        else {
          that.util.request({
            'url': 'entry/wxapp/url',
            'cachetime': '0',
            success: function (res) {
              console.log(res.data)
              var url = res.data
              for (var i in t.data) t.data[i].logo = url + t.data[i].logo, t.data[i].logo2 = url + t.data[i].logo2
              navdata.navs = t.data
              a(navdata)
              that.globalData.navbar = navdata
            }
          });
        }
      }
    })
  },
  getUserInfo: function (cb) {
    var that = this
    // var that = this, userinfo = this.globalData.userInfo;
    // console.log(userinfo)
    // if (userinfo) {
    //   typeof cb == "function" && cb(userinfo)
    // } else {
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
            console.log('openid信息', res.data)
            getApp().getOpenId = res.data.openid;
            getApp().getSK = res.data.session_key;
            //存用户信息
            that.util.request({
              'url': 'entry/wxapp/login',
              'cachetime': '0',
              data: { openid: res.data.openid},
              header: {
                'content-type': 'application/json'
              },
              dataType: 'json',
              success: function (res) {
                console.log('用户信息', res)
                getApp().getuniacid = res.data.uniacid;
                wx.setStorageSync('UserData', res.data)
                // that.globalData.userInfo = res.data
                cb(res.data)
              },
            })
            // //调用登录接口
            // wx.getUserInfo({
            //   withCredentials: false,
            //   success: function (res1) {
            //     console.log(res1.userInfo)
            //     //存用户信息
            //     that.util.request({
            //       'url': 'entry/wxapp/login',
            //       'cachetime': '0',
            //       data: { openid: res.data.openid, img: res1.userInfo.avatarUrl, name: res1.userInfo.nickName },
            //       header: {
            //         'content-type': 'application/json'
            //       },
            //       dataType: 'json',
            //       success: function (res) {
            //         console.log('用户信息', res)
            //         getApp().getuniacid = res.data.uniacid;
            //         wx.setStorageSync('UserData', res.data)
            //         cb(res.data)
            //       },
            //     })
            //   },
            //   fail: function () {
            //     wx.showModal({
            //       title: '提示',
            //       content: '您点击了拒绝个人头像等信息授权,无法正常使用此小程序,点击确定重新获取授权。',
            //       showCancel: false,
            //       success: function (res3) {
            //         if (res3.confirm) {
            //           wx.openSetting({
            //             success: (res2) => {
            //               if (res2.authSetting["scope.userInfo"]) {////如果用户重新同意了授权登录
            //                 wx.getUserInfo({
            //                   success: function (res1) {
            //                     console.log(res1.userInfo)
            //                     //存用户信息
            //                     that.util.request({
            //                       'url': 'entry/wxapp/login',
            //                       'cachetime': '0',
            //                       data: { openid: res.data.openid, img: res1.userInfo.avatarUrl, name: res1.userInfo.nickName },
            //                       header: {
            //                         'content-type': 'application/json'
            //                       },
            //                       dataType: 'json',
            //                       success: function (res) {
            //                         console.log('用户信息', res)
            //                         getApp().getuniacid = res.data.uniacid;
            //                         wx.setStorageSync('UserData', res.data)
            //                         cb(res.data)
            //                       },
            //                     })
            //                   }
            //                 })
            //               }
            //               else {
            //                 console.log('用户再次拒绝')
            //                 //存用户信息
            //                 that.util.request({
            //                   'url': 'entry/wxapp/login',
            //                   'cachetime': '0',
            //                   data: { openid: res.data.openid, img: '', name: '' },
            //                   header: {
            //                     'content-type': 'application/json'
            //                   },
            //                   dataType: 'json',
            //                   success: function (res) {
            //                     console.log('用户信息', res)
            //                     getApp().getuniacid = res.data.uniacid;
            //                     wx.setStorageSync('UserData', res.data)
            //                     cb(res.data)
            //                   },
            //                 })
            //               }
            //             },
            //             fail: function (res) {
            //             }
            //           })
            //         }
            //       }
            //     })
            //   }, complete: function (res) {
            //   }
            // })
          },
          fail: function (res) { },
          complete: function (res) { },
        })
      }
    });
    // }
    // wx.getSetting({
    //   success: (res) => {
    //     console.log(res)
    //     if (this.globalData.userInfo && res.authSetting["scope.userInfo"]){
    //       typeof cb == "function" && cb(this.globalData.userInfo)
    //     }
    //      else {
    //       //调用登录接口
    //       wx.getUserInfo({
    //         withCredentials: false,
    //         success: function (res) {
    //           console.log(res.userInfo)
    //           that.globalData.userInfo = res.userInfo
    //           that.userlogin();
    //           typeof cb == "function" && cb(that.globalData.userInfo)
    //         },
    //         fail: function () {
    //           wx.showModal({
    //             title: '提示',
    //             content: '您点击了拒绝个人头像等信息授权,无法正常使用此小程序,点击确定重新获取授权。',
    //             showCancel: false,
    //             success: function (res) {
    //               if (res.confirm) {
    //                 wx.openSetting({
    //                   success: (res) => {
    //                     if (res.authSetting["scope.userInfo"]) {////如果用户重新同意了授权登录
    //                       wx.getUserInfo({
    //                         success: function (res) {
    //                           console.log(res.userInfo)
    //                           that.globalData.userInfo = res.userInfo
    //                           that.userlogin();
    //                           typeof cb == "function" && cb(that.globalData.userInfo)
    //                         }
    //                       })
    //                     }
    //                     else {
    //                       console.log('用户再次拒绝')
    //                       that.globalData.userInfo = { avatarUrl: '', nickName: '' }
    //                       that.userlogin();
    //                     }
    //                   },
    //                   fail: function (res) {
    //                   }
    //                 })
    //               }
    //             }
    //           })
    //         }, complete: function (res) {
    //         }
    //       })
    //     }
    //   }
    // })
  },
  // userlogin: function () {
  //   var that=this
  //   //取openid
  //   wx.login({
  //     success: function (res) {
  //       console.log(res.code)
  //       that.util.request({
  //         'url': 'entry/wxapp/Openid',
  //         'cachetime': '0',
  //         data: { code: res.code },
  //         header: {
  //           'content-type': 'application/json'
  //         },
  //         dataType: 'json',
  //         success: function (res) {
  //           console.log('openid信息',res.data)
  //           getApp().getOpenId = res.data.openid;
  //           getApp().getSK = res.data.session_key;
  //           //存用户信息
  //           that.util.request({
  //             'url': 'entry/wxapp/login',
  //             'cachetime': '0',
  //             data: { openid: res.data.openid, img: that.globalData.userInfo.avatarUrl, name: that.globalData.userInfo.nickName },
  //             header: {
  //               'content-type': 'application/json'
  //             },
  //             dataType: 'json',
  //             success: function (res) {
  //               console.log('用户信息',res)
  //               getApp().getuniacid = res.data.uniacid;
  //               wx.setStorageSync('UserData', res.data)
  //             },
  //           })
  //         },
  //         fail: function (res) { },
  //         complete: function (res) { },
  //       })
  //     }
  //   });
  // },
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
  siteInfo: require('siteinfo.js')
});