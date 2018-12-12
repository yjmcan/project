// pages/shop_order/order_info.js
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
    var that = this
    var order_id = options.id
    var id = options.productid
    wx.request({
      url: 'https://sanye.nbxiong.com/jz/showMallProduct.do',
      method: "POST",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: { productid: id},
      success: res => {
        that.setData({
          shop_info: res.data.mallproduct
        })
      },
      fail: res => {
        console.log(res)
      }
    })
    wx.request({
      url: 'https://sanye.nbxiong.com/jz/showMallOrder.do',
      method: "POST",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: { orderid: order_id},
      success: res => {
        console.log(res)
        res.data.mallorder.createdate = getApp().ormatDate(res.data.mallorder.createdate)
        that.setData({
          order: res.data.mallorder
        })
       
      },
      fail: res => {
        console.log(res)
      }
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