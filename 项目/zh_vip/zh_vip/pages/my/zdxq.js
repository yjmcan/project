// zh_hyk/pages/my/zdxq.js
var app = getApp()
var util = require('../../utils/util.js');
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
    var that=this;
    var xtxx = wx.getStorageSync('xtxx')
    console.log(xtxx)
    this.setData({
      xtxx: xtxx,
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: xtxx.link_color,
    })
    console.log(options.zdid)
    //MyOrderInfo
    app.util.request({
      'url': 'entry/wxapp/MyOrderInfo',
      'cachetime': '0',
      data: { order_id: options.zdid },
      success: function (res) {
        console.log('zdinfo', res.data)
        that.setData({
          zdinfo: res.data,
          yhze: Number(res.data.preferential) + Number(res.data.preferential2)
        })
      }
    });
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