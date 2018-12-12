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
  // 用户未授权  调用此方法
  getuser_info: function (cb) {
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
            that.util.request({
              'url': 'entry/wxapp/login',
              'cachetime': '0',
              data: { openid: res.data.openid, img: '', nickname: '' },
              success: function (res) {
                getApp().getuniacid = res.data.uniacid;
                getApp().user_info = res.data;
                wx.setStorageSync('userinfo', res.data)
                cb(res.data)
              },
            })
          },
          fail: function (res) { },
          complete: function (res) { },
        })
      }
    });
  },
  // 用户授权后 调用此方法
  getUserInfo: function (cb) {
    var that = this
    //取openid
    wx.login({
      success: function (res) {
        console.log(res)
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
                console.log(res1)
                //存用户信息
                that.util.request({
                  'url': 'entry/wxapp/login',
                  'cachetime': '0',
                  data: { openid: res.data.openid, img: res1.userInfo.avatarUrl, nickname: res1.userInfo.nickName },
                  success: function (res) {
                    console.log(res)
                    getApp().getuniacid = res.data.uniacid;
                    getApp().user_info = res.data;
                    wx.setStorageSync('userinfo', res.data)
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
                                  'url': 'entry/wxapp/login',
                                  data: { openid: res.data.openid, img: res1.userInfo.avatarUrl, nickname: res1.userInfo.nickName },
                                  dataType: 'json',
                                  success: function (res) {
                                    getApp().getuniacid = res.data.uniacid;
                                    wx.setStorageSync('userinfo', res.data)
                                    cb(res.data)
                                  },
                                })
                              }
                            })
                          }
                          else {
                            //存用户信息
                            that.util.request({
                              'url': 'entry/wxapp/login',
                              data: { openid: res.data.openid, img: '', nickname: '' },
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
  // 计算当前日期
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
  },
  // 计算当前时间 时分秒
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
  // 解析富文本
  convertHtmlToText: function convertHtmlToText(inputText) {
    var returnText = "" + inputText;
    returnText = returnText.replace(/<\/div>/ig, '\r\n');
    returnText = returnText.replace(/<\/li>/ig, '\r\n');
    returnText = returnText.replace(/<li>/ig, '  *  ');
    returnText = returnText.replace(/<\/ul>/ig, '\r\n');
    returnText = returnText.replace(/<br\s*[\/]?>/gi, "\r\n");
    returnText = returnText.replace("↵", "\n");
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
  title: function (title) {
    if (title != '') {
      wx.showModal({
        content: title,
      })
    } else {
      return true
    }
  },
  operation: function (title) {
    if (title != '') {
      wx.showModal({
        content: title,
        success:res=>{
          if(res.confirm){
            return true
          }else{
            return false
          }
        }
      })
    } 
  },
  util: require('we7/resource/js/util.js'),
  route: function (e) {
    var that = this
    var obj = wx.getStorageSync('tabbar')
    var url1 = wx.getStorageSync('url')
    function ifArrVal(arr, value) {//多维数组判断是否存在某值
      for (var i = 0; i < arr.length; i++) {
        if (arr[i] instanceof Array) {//判断是否为多维数组
          return ifArrVal(arr[i].urls, value);
        } else {
          if (arr[i].urls == value) {
            return 1;//存在
          }
        }
      }
      return -1;//不存在
    }
    function a(t) {
      var a = !1
      var o = e.route || e.__route__ || null
      for (let i in t) {
        var url = "zh_wzp/pages" + t[i].url.slice(2, t[i].url.length)
        t[i].urls = "zh_wzp/pages" + t[i].url.slice(2, t[i].url.length)
        if (obj[i] != null) {
          t[i].color = obj[i].color2
          t[i].url = obj[i].url
          t[i].sele_color = obj[i].color1
          t[i].icon = url1 + '' +obj[i].icon2
          t[i].urls = "zh_wzp/pages" + obj[i].url.slice(2, obj[i].url.length)
          t[i].name = obj[i].title
          t[i].sele_icon = url1 + '' +obj[i].icon1
        }
        if (t[i].urls == o) {

          t[i].active = true
        } else {

          t[i].active = false
        }

      }
      console.log(t)
      var arr = ifArrVal(t, o)
      if (arr == 1) {
        console.log('有这个')
        e.setData({
          sele: true,
          tabbar: t
        })
      } else {
        console.log('没有这个')
        e.setData({
          sele: false,
          tabbar: t
        })
      }
    }
    var routes = [
      {
        name: '职位',
        color: '#000',
        active: true,
        url: '../index/index',
        sele_color: '#f66925',
        icon: '../img/index.png',
        sele_icon: '../img/s_index.png',
      },
      {
        name: '找工作',
        color: '#000',
        active: false,
        url: '../look_job/index',
        sele_color: '#f66925',
        icon: '../img/job.png',
        sele_icon: '../img/s_job.png',
      },
      {
        name: '发布',
        color: '#000',
        active: false,
        sele_color: '#f66925',
        url: '../release/index',
        icon: '../img/fabu.png',
        sele_icon: '../img/s_fabu.png',
      },
      {
        name: '找人才',
        color: '#000',
        active: false,
        url: '../look_wor/index',
        sele_color: '#f66925',
        icon: '../img/wor.png',
        sele_icon: '../img/s_wor.png',
      },
      {
        name: '我的',
        color: '#000',
        url: '../logs/index',
        active: false,
        sele_color: '#f66925',
        icon: '../img/mine.png',
        sele_icon: '../img/s_mine.png',
      },
    ]
    // return route
    a(routes)
  },
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