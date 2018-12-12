// pages/logs/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    color: 'rgb(56, 132, 254)',
    user_info:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
  },

  index: function (e) {
    wx.reLaunch({
      url: '../index/index',
    })
  },
  logs: function (e) {
    wx.reLaunch({
      url: 'index',
    })
  }, 
  collection: function(e) {
    wx.navigateTo({
      url: '../collection/collection',
    })
  },
  ruzhu: function (e) {
    var that = this
    var a = that.data
    if (a.users.status==0){
      wx.showModal({
        title: '温馨提示',
        content: '您还没有入驻哦，点击确定填写入驻信息',
        success:res=>{
          if(res.confirm){
            wx.navigateTo({
              url: '../admission/index',
            })
          }
        }
      })
    } else if (a.users.status == 1){
      wx.showModal({
        title: '温馨提示',
        content: '您还没有支付哦',
        success: res => {
          if (res.confirm) {
            wx.navigateTo({
              url: '../admission/index',
            })
          }
        }
      })
    } else if (a.users.status == 2) {
      wx.showModal({
        title: '温馨提示',
        content: '系统正在审核，请稍等',
      })
    } else if (a.users.status == 3) {
      wx.showModal({
        title: '温馨提示',
        content: '您还没填写店铺信息,现在去完善吧',
        success: res => {
          if (res.confirm) {
            wx.navigateTo({
              url: '../admission/info',
            })
          }
        }
      })
    } else if (a.users.status == 5 || a.users.status == 6) {
      wx.navigateTo({
        url: '../store/index',
      })
    }
  },
  guanli: function (e) {
    wx.navigateTo({
      url: '../store/index',
    })
  },
  jilu: function (e) {
    wx.navigateTo({
      url: '../store/score',
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
    app.users(function(a){
      that.setData({
        users:a
      })
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      user_info: false
    })
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