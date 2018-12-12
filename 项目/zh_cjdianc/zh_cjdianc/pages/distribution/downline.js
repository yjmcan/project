// pages/distribution/downline.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ac_index: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    app.setNavigationBarColor(this);
    var that = this, user_id = wx.getStorageSync('users').id;
    //MyCommission
    app.util.request({
      'url': 'entry/wxapp/MyTeam',
      'cachetime': '0',
      data: { user_id: user_id },
      success: function (res) {
        console.log(res.data)
        that.setData({
          MyTeam: res.data
        })
      }
    });
  },
  one: function(e) {
    this.setData({
      ac_index: 0
    })
  },
  two: function(e) {
    this.setData({
      ac_index: 1
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})