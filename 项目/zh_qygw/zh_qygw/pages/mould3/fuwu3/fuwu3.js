// zh_qygw/pages/mould3/fuwu3/fuwu3.js
var app = getApp();
var Data = require('../../../utils/util.js');
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
    var that = this;
    //----------------------------------关于我们----------------------------------
    app.util.request({
      'url': 'entry/wxapp/GetAbout',
      'cachetime': '0',
      success: function (res) {
        console.log(res.data)
        that.setData({
          aboutus: res.data
        })
      }
    })
    // ———————————————————————————版权————————————————————————————
    app.util.request({
      'url': 'entry/wxapp/GetPlatform',
      'cachetime': '0',
      success: function (res) {
        console.log("版权")
        console.log(res.data)
        that.setData({
          copyrit: res.data
        })
      },
    })
  },

  // ——————————————调到方案页面————————————————
  news3: function (e) {
    wx: wx.reLaunch({
      url: '../news3/news3',
    })
  },
  // ——————————————调到方案页面————————————————
  home3: function (e) {
    console.log(111)
    wx: wx.reLaunch({
      url: '../../home/home',
    })
  },
  // ————————————————————————————拨打电话——————————————————
  phone: function (e) {
    var phone = this.data.aboutus.link_tel;
    console.log(phone)
    wx.makePhoneCall({
      phoneNumber: phone
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