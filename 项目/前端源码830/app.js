//app.js
App({
  onLaunch: function() {

  },
  onShow: function() {
    // console.log(getCurrentPages())
  },
  onHide: function() {
    // console.log(getCurrentPages())
  },
  onError: function(msg) {
    // console.log(msg)
  },
  siteinfo: require('siteinfo.js'),
  getUserInfo: function(cb) {
    var that = this
    var appid = 'wx66cc027a02544a76'
    var secret = '853b1e4697b15da414086b66e81d5b02'
    // var url = 'http://zx.haitao123.cn'
    var url = require('siteinfo.js').url
    wx.showLoading({
      title: '正在加载',
    })
    // 登录
    wx.login({
      success: res => {
        console.log(res)
        var code = res.code;
        wx.request({
          url: url+'/hyb/login/getOpenIdByCode',
          data: {
            code: code
          },
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          method: "POST",
          success: res => {
            console.log(res)
            wx.setStorageSync('openid', res.data.data)
            wx.request({
              url: url+'/hyb/login/thirdLogin',
              data: {
                openid: res.data.data
              },
              header: {
                "Content-Type": "application/x-www-form-urlencoded"
              },
              method: "POST",
              success: res => {
                console.log(res)
                wx.setStorageSync('users', res.data.data)
                cb(res.data.data)
                wx.hideLoading()
                if (res.data.data.nickName == null) {
                  wx.navigateTo({
                    url: '../login/index',
                  })
                }

              },
              complete: res => {
                console.log('执行操作')

              }
            })
          },
          complete: res => {
            console.log('执行操作')

          }
        })
      }
    })
  },
  users: function(cb) {
    wx.request({
      url: this.globalData.url+'/hyb/login/thirdLogin',
      data: {
        openid: wx.getStorageSync('openid')
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      success: res => {
        console.log(res)
        wx.setStorageSync('users', res.data.data)
        cb(res.data.data)
        if (res.data.data.nickName == null) {
          wx.navigateTo({
            url: '../login/index',
          })
        }

      },
      complete: res => {
        console.log('执行操作')

      }
    })
  },
  globalData: {

  },
  // -----------------------------时间戳转换日期时分秒--------------------------------
  ormatDate: function(dateNum) {
    var date = new Date(dateNum);
    return date.getFullYear() + "年" + fixZero(date.getMonth() + 1, 2) + "月" + fixZero(date.getDate(), 2) + "日" + fixZero(date.getHours(), 2) + ":" + fixZero(date.getMinutes(), 2) + ":" + fixZero(date.getSeconds(), 2);

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
  today: function() {
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
  // 计算明天日期
  getTime2Time: function(date, days) {
    var d = new Date(date);
    d.setDate(d.getDate() + days);
    var month = d.getMonth() + 1;
    var day = d.getDate();
    if (month < 10) {
      month = "0" + month;
    }
    if (day < 10) {
      day = "0" + day;
    }
    var val = d.getFullYear() + "-" + month + "-" + day;
    return val;
  },
  globalData: {
    userInfo: null,
    url: require('siteinfo.js').url
  },
});