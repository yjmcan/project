// pages/index/classfication.js
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
      var name = options.name
      that.setData({
        name:name
      })
      that.refresh()
  },
  refresh: function (e) {
    var that = this
    var name = that.data.name
    // 所有商品
    wx.request({
      url: 'https://sanye.nbxiong.com/jz/getServiceProductListByType.do',
      method: "POST",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        type: name
      },
      success: res => {
        console.log(res)
        that.setData({
          list: res.data.serviceproduct
        })
      },
      fail: res => {
        console.log(res)
      }
    })
  },
  // 跳转服务详情
  service :function(e){
    wx.navigateTo({
      url: 'service?id=' + e.currentTarget.dataset.id,
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