//app.js
App({
  onLaunch: function () {

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
    // 登录
    wx.login({
      success: res => {
        var code = res.code;
        wx.getSetting({
          success: res => {
            wx.getUserInfo({
              success: res => {
                this.globalData.userInfo = res.userInfo;
                wx.request({
                  url: 'https://sanye.nbxiong.com/jz/Login.do',
                  method: "POST",
                  header: {
                    "content-type": "application/x-www-form-urlencoded"
                  },
                  data: {
                    encryptedData: res.encryptedData,
                    code: code,
                    iv: res.iv
                  },
                  success: function (res) {
                    console.log(res)
                    var data = res
                    cb(res)
                    wx.setStorageSync('user_info', data)
                  },
                })
              },
              fail: res => {
                wx.showModal({
                  title: '12',
                  content: '错误',
                })
              }
            })
          }
        })
      }
    })
  },
  // -----------------------------时间戳转换日期时分秒--------------------------------
  ormatDate: function (dateNum) {
    var date = new Date(dateNum);
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
  // 计算明天日期
  getTime2Time: function (date, days) {
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
  },
});