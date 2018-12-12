  //logs.js
const util = require('../../utils/util.js')

Page({
  data: {
    logs: []
  },
  onLoad: function () {
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(log => {
        return util.formatTime(new Date(log))
      })
    })
  },
  tj:function(e){
    wx.navigateTo({
      url: 'tab',
    })
  },
  xx: function (e) {
    wx.navigateTo({
      url: 'xx',
    })
  },
  zj: function (e) {
    wx.navigateTo({
      url: 'zj',
    })
  },
  sz:function(e){
    wx.showActionSheet({
      itemList: ['工作', '休息'],
      success: function (res) {
        console.log(res.tapIndex)
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },
})
