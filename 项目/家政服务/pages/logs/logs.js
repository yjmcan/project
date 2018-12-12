//logs.js
const util = require('../../utils/util.js')
var app = getApp()
Page({
  data: {
    logs: []
  },
  onLoad: function () {
    var that = this
    // that.setData({
    //   logs: (wx.getStorageSync('logs') || []).map(log => {
    //     return util.formatTime(new Date(log))
    //   })
    // })
    app.getUserInfo(function (userInfo) {
      console.log(userInfo)
      that.setData({
        userInfo: userInfo,
      })
    })
    var user_id = wx.getStorageSync('user_info').data.userid
    // 用户信息
    wx.request({
      url: 'https://sanye.nbxiong.com/jz/getUserInfo.do',
      method: "POST",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: { userid: user_id },
      success: res => {
        console.log(res)
        that.setData({
          user_info: res.data.user
        })
      },
      fail: res => {
        console.log(res)
      }
    })
    // wx.getUserInfo({
    //   withCredentials: false,
    //   success: res => {
    //     console.log(res)
    //     that.setData({
    //       user_info: res.userInfo
    //     })
    //   }
    // })
  },
  // 跳转我的家政
  order_jz:function(e){
    wx.navigateTo({
      url: '../order/order',
    })
  },
  // 商城订单
  shop_order:function(e){
    wx.navigateTo({
      url: '../shop_order/shop_order',
    })
  },
  // 回收订单
  exchange:function(e){
    wx.navigateTo({
      url: '../exchange/exchange',
    })
  },
  // 选择地址
  address:function(e){
    wx.chooseAddress({
      success: function (res) {
        console.log(res.userName)
        console.log(res.postalCode)
        console.log(res.provinceName)
        console.log(res.cityName)
        console.log(res.countyName)
        console.log(res.detailInfo)
        console.log(res.nationalCode)
        console.log(res.telNumber)
      }
    })
  },
  // 我的卡次
  kaci:function(e){
    wx.navigateTo({
      url: '../kaci/kaci',
    })
  },
  // 我的反馈
  feed: function (e) {
    wx.navigateTo({
      url: '../feedback/index',
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    var that = this
    var user_id = wx.getStorageSync('user_info').data.userid
    if (res.from === 'button') {
    }
    return {
      title: '',
      success: function (res) {
        console.log(res)
        // 转发成功
        wx.request({

          url: 'https://sanye.nbxiong.com/jz/toShare.do',
          method: "POST",
          header: {
            "content-type": "application/x-www-form-urlencoded"
          },
          data: {
            userid: user_id
          },
          success: res => {
            console.log(res)
            wx.showToast({
              title: '分享成功',
            })
          },
          fail: res => {
            console.log(res)
          }
        })
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})
