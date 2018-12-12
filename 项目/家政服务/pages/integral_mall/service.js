// pages/index/service.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var id = options.id
    that.setData({
      id:id
    })
    that.refresh()
  },
  refresh:function(e){
    var that = this
    var id = that.data.id
    // 积分商城
    wx.request({
      url: 'https://sanye.nbxiong.com/jz/showMallProduct.do',
      method: "POST",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: { productid:id},
      success: res => {
        console.log(res)
        res.data.mallproduct.productdetailimgs = res.data.mallproduct.productdetailimgs.split(";")
        that.setData({
          score_info: res.data.mallproduct
        })
      },
      fail: res => {
        console.log(res)
      }
    })
  },
  // 预约
  service: function (e) {
    wx.navigateTo({
      url: 'exchange?id='+this.data.id,
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