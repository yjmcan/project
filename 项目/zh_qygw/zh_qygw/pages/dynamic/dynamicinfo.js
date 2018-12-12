// pages/dynamic/dynamicinfo.js
var app = getApp();
var Data = require('../../utils/util.js');
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
    console.log(options);
    that.setData({
      id: options.id
    })
    var id = options.id;
    // —————————————————————————————— 获取网址——————————————————————————————
    app.util.request({
      'url': 'entry/wxapp/Url',
      'cachetime': '0',
      success: function (res) {
        // —————————————————————————————— 异步保存网址前缀——————————————————————————————
        wx.setStorageSync('url', res.data)
        that.setData({
          url: res.data
        })
      },
    })

    // ———————————————————————————产品详情————————————————————————————
    app.util.request({
      'url': 'entry/wxapp/ProductDetails',
      'cachetime': '0',
      data: { id: id },
      success: function (res) {
        console.log("产品详情")
        console.log(res.data)
        that.setData({
          proinfo: res.data
        })
      },
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