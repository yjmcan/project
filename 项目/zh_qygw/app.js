//app.js
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
  util: require('we7/resource/js/util.js'),
  siteInfo: require('siteinfo.js'),

  globalData: {
    userInfo: null,
  },
});