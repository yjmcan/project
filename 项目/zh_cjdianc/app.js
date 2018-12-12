//app.js
App({
  onLaunch: function () {
    // this.getNavigationBarColor()
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
  util: require('we7/resource/js/util.js'),
  getimgUrl: function (n) {
    var url = this.globalData.imgurl;
    console.log(url, n)
    n.setData({
      url: url
    })
    var e = this;
    url || e.util.request({
      'url': 'entry/wxapp/Url',
      success: function (res) {
        console.log(res)
        e.globalData.imgurl = res.data
        e.getimgUrl(n)
      }
    })
  },
  setNavigationBarColor: function (n) {
    var t = this.globalData.color, url = this.globalData.imgurl;
    console.log(t, url, n)
    t && wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: t,
    }); n.setData({
      color: t,
      url: url
    })
    var e = this;
    t || e.util.request({
      'url': 'entry/wxapp/system',
      success: function (t) {
        console.log(t)
        getApp().xtxx = t.data
        e.globalData.imgurl = t.data.attachurl
        e.globalData.color = t.data.color
        e.setNavigationBarColor(n)
        // 0 == t.code && (wx.setStorageSync("_navigation_bar_color", t.data), e.setNavigationBarColor())
      }
    })
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
        var xtxx = getApp().xtxx1
        console.log(t, xtxx)
        if (t.data.length == 0) {
          if (xtxx.model == '1') {
            var arr = [{
              logo: '/zh_cjdianc/img/tabindexf.png', logo2: '/zh_cjdianc/img/tabindex.png', title: '首页', title_color: '#34aaff', title_color2: '#888', url: "/zh_cjdianc/pages/index/index"
            }, {
              logo: '/zh_cjdianc/img/tabddf.png', logo2: '/zh_cjdianc/img/tabdd.png', title: '订单', title_color: '#34aaff', title_color2: '#888', url: "/zh_cjdianc/pages/wddd/order"
            }, {
              logo: '/zh_cjdianc/img/tabmyf.png', logo2: '/zh_cjdianc/img/tabmy.png', title: '我的', title_color: '#34aaff', title_color2: '#888', url: "/zh_cjdianc/pages/my/index"
            }]
          }
          if (xtxx.model == '2') {
            var arr = [{
              logo: '/zh_cjdianc/img/tabindexf.png', logo2: '/zh_cjdianc/img/tabindex.png', title: '首页', title_color: '#34aaff', title_color2: '#888', url: "/zh_cjdianc/pages/seller/index"
            }, {
              logo: '/zh_cjdianc/img/tabddf.png', logo2: '/zh_cjdianc/img/tabdd.png', title: '订单', title_color: '#34aaff', title_color2: '#888', url: "/zh_cjdianc/pages/wddd/order"
            }, {
              logo: '/zh_cjdianc/img/tabmyf.png', logo2: '/zh_cjdianc/img/tabmy.png', title: '我的', title_color: '#34aaff', title_color2: '#888', url: "/zh_cjdianc/pages/my/index"
            }]
          }
          if (xtxx.model == '4') {
            var arr = [{
              logo: '/zh_cjdianc/img/tabindexf.png', logo2: '/zh_cjdianc/img/tabindex.png', title: '首页', title_color: '#34aaff', title_color2: '#888', url: "/zh_cjdianc/pages/seller/indextakeout"
            }, {
              logo: '/zh_cjdianc/img/tabddf.png', logo2: '/zh_cjdianc/img/tabdd.png', title: '订单', title_color: '#34aaff', title_color2: '#888', url: "/zh_cjdianc/pages/wddd/order"
            }, {
              logo: '/zh_cjdianc/img/tabmyf.png', logo2: '/zh_cjdianc/img/tabmy.png', title: '我的', title_color: '#34aaff', title_color2: '#888', url: "/zh_cjdianc/pages/my/index"
            }]
          }
          navdata.navs = arr
          a(navdata)
          that.globalData.navbar = navdata
        }
        else {
          navdata.navs = t.data
          a(navdata)
          that.globalData.navbar = navdata
          // that.util.request({
          //   'url': 'entry/wxapp/url',
          //   'cachetime': '0',
          //   success: function (res) {
          //     console.log(res.data)
          //     var url = res.data
          //     for (var i in t.data) t.data[i].logo = url + t.data[i].logo, t.data[i].logo2 = url + t.data[i].logo2
          //     navdata.navs = t.data
          //     a(navdata)
          //     that.globalData.navbar = navdata
          //   }
          // });
        }
      }
    })
  },
  title:function(title){
    if(title!=''){
      wx.showModal({
        title: '',
        content: title,
      })
    }else{
      return true
    }
  },
  getUserInfo: function (cb) {
    // var that = this
    // var users = wx.getStorageSync("users");
    // console.log(users)
    // users && cb(users)
    // users || wx.login({
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
              //调用登录接口
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
              //         wx.setStorageSync('users', res.data)
              //         that.globalData.userInfo = res.data
              //         typeof cb == "function" && cb(that.globalData.userInfo)
              //       },
              //     })
              //   },
              //   fail: function () {
              //     wx.getSetting({
              //       success: (res) => {
              //         console.log(res)
              //         var authSetting = res.authSetting
              //         if (authSetting['scope.userInfo'] == false) {
              //           wx.showModal({
              //             title: '提示',
              //             content: '您点击了拒绝个人头像等信息授权,无法正常使用此小程序,点击确定重新获取授权。',
              //             showCancel: false,
              //             success: function (res) {
              //               if (res.confirm) {
              //                 console.log('用户点击确定')
              //                 wx.openSetting({
              //                   success: function success(res2) {
              //                     if (res2.authSetting["scope.userInfo"]) {
              //                       that.getUserInfo(cb)
              //                     }
              //                     else {
              //                       that.getUserInfo(cb)
              //                     }
              //                   }
              //                 });
              //               }
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
    }
  },
  //sjdnav
  sjdpageOnLoad: function (e) {
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
    var o = that.globalData.sjdnavbar;
    console.log(o)
    o && a(o);
    o || that.util.request({
      'url': 'entry/wxapp/nav',
      success: function (t) {
        console.log(t)
        if (0 == 0) {
          var arr = [{
            logo: '/zh_cjdianc/img/tabindexf.png', logo2: '/zh_cjdianc/img/tabindex.png', title: '外卖订单', title_color: '#34aaff', title_color2: '#888', url: "/zh_cjdianc/pages/sjzx/wmdd/wmdd"
          }, {
              logo: '/zh_cjdianc/img/tabdnf.png', logo2: '/zh_cjdianc/img/tabdn.png', title: '店内订单', title_color: '#34aaff', title_color2: '#888', url: "/zh_cjdianc/pages/sjzx/dndd/dndd"
            }, {
              logo: '/zh_cjdianc/img/tabglf.png', logo2: '/zh_cjdianc/img/tabgl.png', title: '商品管理', title_color: '#34aaff', title_color2: '#888', url: "/zh_cjdianc/pages/sjzx/spgl/cplb"
            },  {
              logo: '/zh_cjdianc/img/tabddf.png', logo2: '/zh_cjdianc/img/tabdd.png', title: '数据统计', title_color: '#34aaff', title_color2: '#888', url: "/zh_cjdianc/pages/sjzx/sjtj/sjtj"
          },{
              logo: '/zh_cjdianc/img/tabmyf.png', logo2: '/zh_cjdianc/img/tabmy.png', title: '商家中心', title_color: '#34aaff', title_color2: '#888', url: "/zh_cjdianc/pages/sjzx/sjzx/sjzx"
          }]
          navdata.navs = arr
          a(navdata)
          that.globalData.sjdnavbar = navdata
        }
        else {
          navdata.navs = t.data
          a(navdata)
          that.globalData.sjdnavbar = navdata
        }
      }
    })
  },
  // 解析富文本
  convertHtmlToText: function convertHtmlToText(inputText) {
    var returnText = "" + inputText;
    // returnText = returnText.replace(/<\/div>/ig, '\r\n');
    // returnText = returnText.replace(/<\/li>/ig, '\r\n');
    // returnText = returnText.replace(/<li>/ig, '  *  ');
    // returnText = returnText.replace(/<\/ul>/ig, '\r\n');
    // returnText = returnText.replace(/<br\s*[\/]?>/gi, "\r\n");
    // returnText = returnText.replace("↵", "\n");
    returnText = returnText.replace(/<p.*?>/gi, "\r\n");
    returnText = returnText.replace(/<\/p>/ig, '\r\n', '  *  ');
    // returnText = returnText.replace(/<a.*href="(.*?)".*>(.*?)<\/a>/gi, " $2 ($1)");
    // returnText = returnText.replace(/<script.*>[\w\W]{1,}(.*?)[\w\W]{1,}<\/script>/gi, "");
    // returnText = returnText.replace(/<style.*>[\w\W]{1,}(.*?)[\w\W]{1,}<\/style>/gi, "");
    // returnText = returnText.replace(/<(?:.|\s)*?>/g, "");
    // returnText = returnText.replace(/(?:(?:\r\n|\r|\n)\s*){2,}/gim, "\r\n\r\n");
    // returnText = returnText.replace(/ +(?= )/g, '');
    // returnText = returnText.replace(/ /gi, " ");
    // returnText = returnText.replace(/&/gi, "&");
    // returnText = returnText.replace(/"/gi, '"');
    // returnText = returnText.replace(/</gi, '<');
    // returnText = returnText.replace(/>/gi, '>');
    return returnText;
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
  siteInfo: require('siteinfo.js')
});