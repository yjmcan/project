//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
  },
  onLoad: function (options) {
    app.setNavigationBarColor(this);
    var that = this
    app.util.request({
      'url': 'entry/wxapp/system',
      'cachetime': '0',
      success: function (res) {
        that.setData({
          system: res.data
        })
      },
    })
    console.log(options)
    that.setData({
      state: options.state
    })
  },
  formSubmit: function (e) {
    var user_id = wx.getStorageSync('users').id;
    app.util.request({
      'url': 'entry/wxapp/AddFormId',
      'cachetime': '0',
      data: { user_id: user_id, form_id: e.detail.formId },
      success: function (res) {
        console.log(res.data)
      },
    })
    wx.navigateTo({
      url: 'info?form_id=' + e.detail.formId + '&state=' + this.data.state,
    })
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
