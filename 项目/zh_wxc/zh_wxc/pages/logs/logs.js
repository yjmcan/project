//logs.js
const util = require('../../utils/util.js')
var app=getApp()

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
    var msg2 = wx.getStorageSync("users")
    
    // ———————————用户名称,头像———————————
    var userInfo = msg2.nickname;
    var avatarUrl = msg2.img;
    this.setData({
        userInfo: userInfo,
        avatarUrl: avatarUrl
    })
  },

  // ———————————跳转到首页———————————
  home:function(e){
    wx: wx.redirectTo({
      url: '../index/index',
    })
  },

  // ——————————跳转到个人中心——————————
  fabu: function (e) {
    wx: wx.redirectTo({
      url: '../fabu/fabuyewu',
    })
  },   

  // ——————————跳转到榜单——————————
  bangdan: function (e) {
    wx: wx.redirectTo({
      url: '../bangdan/bangdan',
    })
  },
  
  // ——————————跳转到消息通知——————————
  news: function (e) {
    wx: wx.navigateTo({
      url: '../logs/news',
    })
  },
  // ——————————跳转到我的钱包——————————
  mymoney: function (e) {
    wx: wx.navigateTo({      
      url: '../logs/mymoney',
    })
  },
  // ——————————跳转到我发布的——————————
  myfabu: function (e) {
    var userid = wx.getStorageSync('users').id
    console.log(userid)
    wx: wx.navigateTo({
      url: '../my/myfabu?s_id=' + userid,
    })
  },
  // ——————————跳转到我参与的——————————
  myjoin: function (e) {
    var joinid = wx.getStorageSync('users').id    
    wx: wx.navigateTo({
      url: '../my/myjoin?u_id=' + joinid,
    })
  },
  // ——————————跳转到待评价——————————
  mywait: function (e) {
    var waitid = wx.getStorageSync('users').id  
    console.log(waitid)   
    wx: wx.navigateTo({
      url: '../my/mywait?user_id=' + waitid,
    })
  },

  // ——————————跳转到常见问题——————————
  question: function (e) {
    wx: wx.navigateTo({
      url: '../question/question',
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
