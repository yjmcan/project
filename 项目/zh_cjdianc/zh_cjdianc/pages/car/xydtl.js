// zh_cjdianc/pages/car/xydtl.js
var app = getApp();
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
    console.log(options)
    app.setNavigationBarColor(this);
    wx.setNavigationBarTitle({
      title: options.title,
    })
    if (options.title == "会员特权说明") {
      this.setData({
        nodes: getApp().xtxx.hy_details.replace(/\<img/gi, '<img style="width:100%;height:auto" ')
      })
    }
    if (options.title == "充值服务协议") {
      this.setData({
        nodes: getApp().xtxx.cz_notice.replace(/\<img/gi, '<img style="width:100%;height:auto" ')
      })
    }
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