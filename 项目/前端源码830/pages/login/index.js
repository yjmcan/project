// pages/login/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    color: 'rgb(56, 132, 254)',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // app.getUserInfo(function(userInfo){
    //   console.log(userInfo)
    // })
  },
  bindGetUserInfo:function(e){
      console.log(e)
    if (e.detail.errMsg =='getUserInfo:ok'){
      wx.request({
        // url: url +'/hyb/login/thirdLogin',
        url: getApp().siteinfo.url +'/hyb/login/updateUserInfo',
        data: {
          openid: wx.getStorageSync('openid'),
          nickName: e.detail.userInfo.nickName,
          userHead: e.detail.userInfo.avatarUrl,
        }, 
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST",
        success: res => {
          console.log(res)
          wx.reLaunch({
            url: '../index/index',
          })
        },
        fail:res=>{
          console.log(res)
        },
        complete: res => {
          console.log('执行操作')

        }
      })
    }
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