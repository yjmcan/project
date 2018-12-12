// zh_zbkq/pages/my/tjhxy/bdhxy.js
var app = getApp();
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
    console.log(options)
    //调用应用实例的方法获取全局数据
    var hxmuserid = decodeURIComponent(options.scene)
    this.setData({
      hxmuserid:hxmuserid
    })
    app.getUserInfo(function (userInfo) {
      //登录
      console.log(app.globalData)
      app.userlogin()
    })
  },
  bdhxy:function(){
    var that = this;
    var smuid = wx.getStorageSync('UserData').id;
    var hxmuserid = that.data.hxmuserid
    console.log('扫描人用户id:', smuid, '核销码的用户id:',hxmuserid)
    wx.showModal({
      title: '提示',
      content: '确定绑定为核销员吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          app.util.request({
            'url': 'entry/wxapp/AddVerification',
            'cachetime': '0',
            data: { user_id: hxmuserid, verification_clerk: smuid },
            success: function (res) {
              console.log(res)
              if (res.data == 1) {
                wx.showToast({
                  title: '绑定成功',
                  icon: 'success',
                  duration: 1000
                })
                setTimeout(function () {
                  wx.switchTab({
                    url: '../../index/index',
                  })
                }, 1000)
              }
            }
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
          wx.switchTab({
            url: '../../index/index',
          })
        }
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