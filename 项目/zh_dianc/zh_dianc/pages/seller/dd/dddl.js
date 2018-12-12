// zh_dianc/pages/seller/dddl.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
  dw: function (e) {
    console.log(e.currentTarget.dataset)
    wx.openLocation({
      latitude: Number(e.currentTarget.dataset.lat),
      longitude: Number(e.currentTarget.dataset.lng),
      scale: 28,
      address: e.currentTarget.dataset.wz
    })
  },
  tel: function (e) {
    console.log(e.currentTarget.dataset.tel)
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.tel,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     console.log(options)
     var imglink = wx.getStorageSync('imglink')
     var that = this;
     var wmddid = options.ddid;
     console.log(wmddid,imglink)
     app.util.request({
       'url': 'entry/wxapp/OrderInfo',
       'cachetime': '0',
       data: { id: wmddid },
       success: function (res) {
         console.log(res)
         that.setData({
           wmdd: res.data,
           url: imglink,
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