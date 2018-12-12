// pages/logs/tab.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ac_index: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    wx.hideShareMenu()

    //====================================获取系统设置=============================================//
    app.getSystem(function(getSystem) {
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
    var qs_id = wx.getStorageSync('qs').id
    app.util.request({
      url: 'entry/wxapp/OrderStatistics',
      data: {
        qs_id: qs_id
      },
      success: res => {
        console.log(res)
        that.setData({
          Statistics: res.data
        })
      }
    })
    app.util.request({
      url: 'entry/wxapp/MoneyStatistics',
      data: {
        qs_id: qs_id
      },
      success: res => {
        console.log(res)
        that.setData({
          MoneyStatistics: res.data
        })
      }
    })
  },
  sele: function(e) {
    var that = this
    var ac_index = that.data.ac_index
    if (ac_index == 0) {
      that.setData({
        ac_index: 1
      })
    } else {
      that.setData({
        ac_index: 0
      })
    }
  },
  day_order: function(e) {
    var a = e.currentTarget.dataset
    wx.navigateTo({
      url: 'day_order?type=' + a.type+'&num='+a.num+'&price='+a.price,
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