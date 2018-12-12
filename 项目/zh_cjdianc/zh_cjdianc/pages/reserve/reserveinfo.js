// zh_cjdianc/pages/wddd/ddxq.js
var app = getApp();
var util = require('../../utils/util.js');
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var qqmapsdk;
Page({

  /**
   * 页面的初始数据
   */
  data: {
     color:'#34aaff',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.setNavigationBarColor(this);
     console.log(options)
     var that=this;
     app.util.request({
       'url': 'entry/wxapp/OrderInfo',
       'cachetime': '0',
       data: { order_id:options.oid},
       success: function (res) {
         console.log(res.data)
         that.setData({
           odinfo: res.data
         })
       },
     })
  },
  maketel:function(t){
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
  location: function () {
    var jwd = this.data.odinfo.store.coordinates.split(','), t = this.data.odinfo.store;
    console.log(jwd)
    wx.openLocation({
      latitude: parseFloat(jwd[0]),
      longitude: parseFloat(jwd[1]),
      address: t.address,
      name: t.name
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