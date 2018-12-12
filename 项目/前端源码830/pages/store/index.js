// pages/store/index.js
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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // var users = wx.getStorageSync('users')
    // users.inStorePhoto = users.inStorePhoto.split(",")
    // this.setData({
    //   users: users
    // })
  },
  money: function(e) {
    wx.navigateTo({
      url: 'money',
    })
  },
  put_forword: function(e) {
    wx.navigateTo({
      url: 'put_forword',
    })
  },
  jilu: function (e) {
    wx.navigateTo({
      url: 'score',
    })
  },
  modify:function(e){
      wx.navigateTo({
        url: '../admission/info',
      })
  },
  renew: function (e) {
   if(this.data.users.statu==6){
     wx.navigateTo({
       url: '../admission/index',
     })
   }else{
     wx.showModal({
       title: '温馨提示',
       content: '您的入驻未到期',
     })
   }
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
    var that = this
    app.users(function (a) {
      console.log(a)
      if (a.statu ==4){
        wx.showModal({
          title: '温馨提示',
          content: '请等待系统审核通过',
        })
        setTimeout(function(){
          wx.redirectTo({
            url: '../logs/index',
          },1500)
        })
      } else {
        a.inStorePhoto = a.inStorePhoto.split(",")
        a.startTime = app.ormatDate(a.startTime).slice(0,11)
        a.endTime = app.ormatDate(a.endTime).slice(0, 11)
        that.setData({
          users: a
        })
      }
    })
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