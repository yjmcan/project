// pages/logs/bill.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nav: [
      "", "", "", "", "", "", "", "", "", "",
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.hideShareMenu()
    that.location(options.id)
    //====================================获取系统设置=============================================//
    app.getSystem(function (getSystem) {
      console.log(getSystem)
      that.setData({
        getSystem: getSystem,
        color: getSystem.color
      })
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: getSystem.color,
      })
    })
  },

  location: function (id) {
    var that = this
    app.util.request({
      url: 'entry/wxapp/OrderInfo',
      data: {
        order_id: id
      },
      success: res => {
        console.log(res)
        // if (res.data.goods_info != '') {
        //   res.data.goods_info = res.data.goods_info.split("#")
        //   var goods = res.data.goods_info
        //   var goodNum = []
        //   goods.map(function (item) {
        //     console.log(item)
        //     var a = {}
        //     a.name = item.match(/(\S*)数量:/)[1];
        //     a.num = item.match(/数量:(\S*)价格/)[1];
        //     a.price = item.match(/价格(\S*)/)[1];
        //     goodNum.push(a)
        //   })
        //   console.log(goodNum)
        // }
        res.data.time = app.ormatDate(res.data.time)
        res.data.price = (Number(res.data.yh_money) + Number(res.data.goods_price)).toFixed(2)
        that.setData({
          order_info: res.data
        })
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