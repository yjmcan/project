// pages/index/info.js
const app = getApp()
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
    color: 'rgb(56, 132, 254)', //56 132 253
    region: ['广东省', '广州市', '海珠区'],
    region1: ['广东省', '广州市', '海珠区'],
    speed:70,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    console.log(options)
    app.users(function(a) {
      console.log(a)
      var a = a
      that.setData({
        users: a,
        goodsStationId:options.id,
        speed:80
      })
      that.info()
    })

  },
  info: function(e) {
    var that = this
    var a = that.data.users
    that.setData({
      speed:90
    })
    // 获取货站信息
    wx.request({
      url: getApp().siteinfo.url +'/hyb/goodsStationApi/get',
      data: {
        goodsStationId: that.data.goodsStationId,
        loginGoodsStationId: a.id
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      success: res => {
        var store_info = res.data.data
        console.log(store_info)
        store_info.inStorePhoto = store_info.inStorePhoto.split(",")
        store_info.idCarePhoto = store_info.idCarePhoto.split(",")
        store_info.nowSource = store_info.nowSource.replace("↵", "\n")
        store_info.stationDetails = store_info.stationDetails.replace("↵", "\n")
        that.setData({
          store_info: store_info,
          speed:100
        })
      }
    })
  },
  address: function(e) {
    var that = this
    wx.openLocation({
      latitude: Number(that.data.store_info.latitude),
      longitude: Number(that.data.store_info.longitude),
      scale: 28,
      name: that.data.store_info.name,
      address: that.data.store_info.address
    })
  },
  maketel: function(t) {
    wx.makePhoneCall({
      phoneNumber: this.data.store_info.phone,
    })
  },
  shoucang: function(e) {
    var that = this
    wx.request({
      url: getApp().siteinfo.url +'/hyb/stationCollect/add',
      data: {
        collectUserId: this.data.users.id,
        createUserId: this.data.store_info.id
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      success: res => {
        console.log(res)
        that.info()
      }
    })
  },
  cancel_collection: function (e) {
    var that = this
    wx.request({
      url: getApp().siteinfo.url +'/hyb/stationCollect/cancel',
      data: {
        collectUserId: this.data.users.id,
        createUserId: this.data.store_info.id
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      success: res => {
        console.log(res)
        that.info()
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})