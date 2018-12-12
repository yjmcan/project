// pages/index/info.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nav:[
     {
        name:'待抢单'
     },
      {
        name:'待取送'
      },
      {
        name:'待完成'
      }
    ],
    ac_index:0,
    color:"#459cf9"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.nav_data()
    console.log(typeof(1))
    // app.util.request({
    //   'url': 'entry/wxapp/system',
    //   'cachetime': '0',
    //   success: function (res) {
    //    console.log(res)
    //   },
    // })
    wx.getHCEState({
      success: function (res) {
        console.log(res.errCode)
      }
    })
  },
  nav_data:function(e){
    var that = this
    var a = that.data
    var nav = a.nav
    var color = a.color
    var ac_index = a.ac_index
    console.log(ac_index)
    for (let i in nav) {
      if (i == ac_index) {
        nav[i].color = '#459cf9'
      } else {
        nav[i].color = '#333'
      }
    }
    console.log(nav)
    that.setData({
      nav: nav
    })
  },
  nav:function(e){
    this.setData({
      ac_index:e.currentTarget.dataset.index
    })
    this.nav_data()
  },
  // 跳转路线详情
  route:function(e){
    wx.navigateTo({
      url: 'info',
    })
  },
  // 跳转订单详情
  order_info:function(e){
    wx.navigateTo({
      url: 'order_info',
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