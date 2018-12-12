// zh_dianc/pages/logs/qd/pm.js
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
    var that = this;
    var user_id = wx.getStorageSync('users').id
    //user
    app.util.request({
      'url': 'entry/wxapp/userinfo',
      'cachetime': '0',
      data: { user_id: user_id },
      success: function (res1) {
        console.log('user', res1)
        that.setData({
          userinfo: res1.data,
        })
        //pm
        app.util.request({
          'url': 'entry/wxapp/Rank',
          'cachetime': '0',
          success: function (res) {
            console.log('rank', res)
            that.setData({
              rank: res.data,
            })
            for (let i = 0; i < res.data.length; i++){
              if(res1.data.id==res.data[i].id){
                that.setData({
                  pm:i+1
                })
              }
            }
          }
        })
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