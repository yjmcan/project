//app.js
App({
  onLaunch: function() {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  formatSeconds: function(value) {

    var theTime = parseInt(value); // 秒

    var theTime1 = 0; // 分

    var theTime2 = 0; // 小时

    if (theTime > 60) {

      theTime1 = parseInt(theTime / 60);

      theTime = parseInt(theTime % 60);

      if (theTime1 > 60) {

        theTime2 = parseInt(theTime1 / 60);

        theTime1 = parseInt(theTime1 % 60);

      }

    }

    var result = "" + parseInt(theTime) + "";
    if(result<10){
      result = "0" + result
    }else{
      result = result
    }
    if (theTime < 10 && theTime1<=0){
      var result = "" +'00:0'+ parseInt(theTime) + "";
    } else if(theTime >= 10 && theTime1 <= 0){
      var result = "" + '00:' + parseInt(theTime) + "";
    }

    if (theTime1 > 0) {

      if (parseInt(theTime1) < 10) {
        result = "" + '0' + parseInt(theTime1) + ":" + result;
      } else {
        result = "" + parseInt(theTime1) + ":" + result;
      }

    }

    if (theTime2 > 0) {

      result = "" + parseInt(theTime2) + "小时" + result;

    }

    return result;

  },
  globalData: {
    userInfo: null
  }
})