// pages/mycenter/myshouru.js
var app = getApp()
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
    var that = this
    that.setData({
      income: options.income,
      activity_id: options.activity_id
    })
    that.aboud()
  },
  aboud:function(e){
    var that = this
    app.setNavigationBarColor(this);
    //获取用户信息
    app.getUserInfo(function (userInfo) {
      console.log(userInfo)
      that.setData({
        user_id: userInfo.id,
        money: userInfo.money
      })
      that.refresh()
    })
  },
  refresh: function (e) {
    var that = this
    wx.hideShareMenu()
    var user_id = that.data.user_id
    var income = that.data.income
    if (income==1){
      var activity_id = that.data.activity_id
      app.util.request({
        url: 'entry/wxapp/Hdsr',
        data: {
          activity_id: activity_id
        },
        success: res => {
          console.log(res)
          if (res.data.total_money==null){
            res.data.total_money=0
          }
          if (res.data.js_money == null) {
            res.data.js_money = 0
          }
          if (res.data.djs_money == null) {
            res.data.djs_money = 0
          }
          that.setData({
            total_money: res.data.total_money,
            js_money: res.data.js_money,
            djs_money: res.data.djs_money
          })
        }
      })
    }else{
      app.util.request({
        url: 'entry/wxapp/Djsmoney',
        data: {
          user_id: user_id
        },
        success: res => {
          console.log(res)
          if (res.data.djsmoney == null) {
            res.data.djsmoney = 0
          }
          that.setData({
            djsmoney: res.data.djsmoney
          })
        }
      })
    //   app.util.request({
    //     url: 'entry/wxapp/MyIncome',
    //     data: {
    //       user_id: user_id
    //     },
    //     success: res => {
    //       console.log(res)
    //       that.setData({
    //         money: res.data.money
    //       })
    //     }
    //   })
    }
   
    
  },
  withdrawals:function(e){
    wx.navigateTo({
      url: 'withdrawals',
    })
  },
  inform:function(e){
    wx.navigateTo({
      url: 'inform?status='+1,
    })
  },
  settled:function(e){
    var that= this
    var activity_id = that.data.activity_id
    var djs_money = that.data.djs_money
    wx.navigateTo({
      url: 'settled?activity_id=' + activity_id + '&djs_money=' + djs_money,
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
    var that = this
    that.aboud()
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
  // onShareAppMessage: function () {

  // }
})