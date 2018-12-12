// zh_dianc/pages/info/sjhj.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.setNavigationBarColor(this);
    this.reLoad()
  },
  reLoad: function () {
    var that = this;
    app.util.request({
      'url': 'entry/wxapp/Url',
      'cachetime': '0',
      success: function (res1) {
        console.log(res1.data)
        app.util.request({
          'url': 'entry/wxapp/StoreInfo',
          'cachetime': '0',
          data: { store_id: getApp().sjid },
          success: function (res) {
            for (let i = 0; i < res.data.store.environment.length; i++) {
              res.data.store.environment[i] = res1.data + res.data.store.environment[i]
            }
            for (let i = 0; i < res.data.store.yyzz.length; i++) {
              res.data.store.yyzz[i] = res1.data + res.data.store.yyzz[i]
            }
            console.log(res)
            that.setData({
              store: res.data.store,
            })
          }
        })
      },
    })
  },
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id,
      urls: e.currentTarget.dataset.urls
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.reLoad()
    setTimeout(function () {
      wx.stopPullDownRefresh()
    }, 1500)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})