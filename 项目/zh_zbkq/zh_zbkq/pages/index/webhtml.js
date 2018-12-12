// zh_zbkq/pages/index/webhtml.js
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
   var that = this;
   if (options.vr_src){
     that.setData({
       weburl: options.vr_src
     })
   }
   else{
   app.util.request({
     'url': 'entry/wxapp/GetAdInfo',
     'cachetime': '0',
     data: { ad_id: options.weburl },
     success: function (res) {
       console.log(res)
       that.setData({
         weburl: res.data.wb_src
       })
     },
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