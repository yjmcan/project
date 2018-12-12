//app.js
App({
  siteInfo: require('siteinfo.js'),
  onLaunch: function () {
    var siteInfo = require('siteinfo.js')
    wx.setStorageSync('siteroot', siteInfo.siteroot)
    // this.GetSystem()
  },
  onShow: function () {
  },
  onHide: function () {
  },
  onError: function (msg) {
  },
  getUrl: function (n) {
    var url = this.globalData.url;
    console.log(url)
    n.setData({
      url: url
    })
    var e = this;
    url || e.util.request({
      'url': 'entry/wxapp/Url',
      success: function (res) {
        e.globalData.url = res.data
        e.getUrl(n)
      }
    })
  },
  getSystem: function (n) {
    var color = this.globalData.color;
    var system = this.globalData.system;
    color && wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: color,
    }); n.setData({
      color: color,
      system: system
    })
    var e = this;
    color || e.util.request({
      'url': 'entry/wxapp/GetSystem',
      success: function (res) {
        console.log(res)
        e.globalData.color = res.data.color
        e.globalData.system = res.data
        e.getSystem(n)
      }
    })
  },
  setNavigationBarColor: function (n) {
    var t = this.globalData.color;
    t && wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: t,
    }); n.setData({
      color: t
    })
    var e = this;
    t || e.util.request({
      'url': 'entry/wxapp/getSystem',
      success: function (t) {
        getApp().xtxx = t.data
        e.globalData.color = t.data.color
        e.setNavigationBarColor(n)
        // 0 == t.code && (wx.setStorageSync("_navigation_bar_color", t.data), e.setNavigationBarColor())
      }
    })
  },
  // 用户登录
  getUserInfo: function (cb) {
    var that = this
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
            var openid = res.data.openid
            //调用登录接口
            wx.getSetting({
              success: res => {
                var auth = res.authSetting
                if (auth["scope.userInfo"] != true) {
                  console.log('检测到用户没有授权')
                  that.util.request({
                    'url': 'entry/wxapp/login',
                    'cachetime': '0',
                    data: { openid: openid, img: '', name: '' },
                    success: function (res) {
                      getApp().getuniacid = res.data.uniacid;
                      getApp().user_info = res.data;
                      wx.setStorageSync('userInfo', res.data)
                      cb(res.data)

                      var pages = getCurrentPages() //获取加载的页面

                      var currentPage = pages[pages.length - 1] //获取当前页面的对象

                      var url = currentPage.route //当前页面url
                      var options = currentPage.options //如果要获取url中所带的参数可以查看options
                      if (url != 'zh_gjhdbm/pages/index/index') {
                        wx.navigateTo({
                          url: '../login/index',
                        })
                      }
                    },
                  })
                } else {
                  console.log('检测到用户已经授权')
                  wx.getUserInfo({
                    withCredentials: false,
                    success: function (res1) {
                      //存用户信息
                      that.util.request({
                        'url': 'entry/wxapp/login',
                        'cachetime': '0',
                        data: { openid: openid, img: res1.userInfo.avatarUrl, name: res1.userInfo.nickName },
                        success: function (res) {
                          console.log(res)
                          getApp().getuniacid = res.data.uniacid;
                          getApp().user_info = res.data;
                          wx.setStorageSync('userInfo', res.data)
                          cb(res.data)
                        },
                      })
                    }
                  })
                }
              }
            })

          },

        })
      }
    });
  },
  // 判断用户是否跳转授权
  getUserinfo: function (t) {
    if (wx.getStorageSync('userInfo').img == '') {
      wx.showModal({
        title: '温馨提示',
        content: '您需要授权才能正常使用小程序',
        success: res => {
          if (res.confirm) {
            wx.navigateTo({
              url: '../login',
            })
          } else {
            getApp().getUserinfo()
          }
        }
      })
    } else {
      return true
    }
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
    var hours = date.getHours()
    var minu = date.getMinutes()
    var scend = date.getSeconds()
    if (hours <= 9) {
      hours = '0' + hours
    }
    if (minu <= 9) {
      minu = '0' + minu
    }
    if (scend <= 9) {
      scend = '0' + minu
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
      + " " + hours + seperator2 + minu + seperator2 + scend;
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
  // 解析富文本
  convertHtmlToText: function convertHtmlToText(inputText) {
    var returnText = "" + inputText;
    returnText = returnText.replace(/<\/div>/ig, '\r\n');
    returnText = returnText.replace(/<\/li>/ig, '\r\n');
    returnText = returnText.replace(/<li>/ig, '  *  ');
    returnText = returnText.replace(/<\/ul>/ig, '\r\n');
    returnText = returnText.replace(/<br\s*[\/]?>/gi, "\r\n");
    returnText = returnText.replace("?", "\n");
    returnText = returnText.replace(/<p.*?>/gi, "\r\n");
    returnText = returnText.replace(/<a.*href="(.*?)".*>(.*?)<\/a>/gi, " $2 ($1)");
    returnText = returnText.replace(/<script.*>[\w\W]{1,}(.*?)[\w\W]{1,}<\/script>/gi, "");
    returnText = returnText.replace(/<style.*>[\w\W]{1,}(.*?)[\w\W]{1,}<\/style>/gi, "");
    returnText = returnText.replace(/<(?:.|\s)*?>/g, "");
    returnText = returnText.replace(/(?:(?:\r\n|\r|\n)\s*){2,}/gim, "\r\n\r\n");
    returnText = returnText.replace(/ +(?= )/g, '');
    returnText = returnText.replace(/ /gi, " ");
    returnText = returnText.replace(/&/gi, "&");
    returnText = returnText.replace(/"/gi, '"');
    returnText = returnText.replace(/</gi, '<');
    returnText = returnText.replace(/>/gi, '>');
    return returnText;
  },
  // 下载网络图片
  downLoadImg: function (netUrl) {
    var path
    wx.downloadFile({
      url: netUrl, //仅为示例，并非真实的资源
      success: function (res) {
        var path = res.tempFilePath

      }
    })
    return path
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
  globaldata: {
    name: '你在搞笑么？'
  },
  globalData: {
    userInfo: null,
    sele_city: 1
  },
});