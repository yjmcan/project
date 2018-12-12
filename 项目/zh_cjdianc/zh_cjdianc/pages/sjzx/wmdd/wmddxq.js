// zh_cjdianc/pages/sjzx/wmddxq.js
var app = getApp();
var util = require('../../../utils/util.js');
var QQMapWX = require('../../../utils/qqmap-wx-jssdk.js');
var qqmapsdk;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    color: '#34aaff',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.setNavigationBarColor(this);
    console.log(options)
    var that = this;
    app.util.request({
      'url': 'entry/wxapp/OrderInfo',
      'cachetime': '0',
      data: { order_id: options.oid },
      success: function (res) {
        console.log(res.data)
        that.setData({
          odinfo: res.data
        })
      },
    })
  },
  maketel: function (t) {
    var a = t.currentTarget.dataset.tel;
    wx.makePhoneCall({
      phoneNumber: a,
    })
  },
  copyText: function (t) {
    var a = t.currentTarget.dataset.text;
    wx.setClipboardData({
      data: a,
      success: function () {
        wx.showToast({
          title: "已复制"
        })
      }
    })
  },
  location: function (t) {
    var lat = t.currentTarget.dataset.lat, lng = t.currentTarget.dataset.lng, address = t.currentTarget.dataset.address;
    console.log(lat,lng)
    wx.openLocation({
      latitude: parseFloat(lat),
      longitude: parseFloat(lng),
      address: address,
      name: '位置'
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

  }
})