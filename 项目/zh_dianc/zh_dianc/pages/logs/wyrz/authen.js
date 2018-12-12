// zh_hdbm/pages/logs/authen/authen.js
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
      var that = this;
      app.util.request({
        'url': 'entry/wxapp/system',
        'cachetime': '0',
        success: function (res) {
          console.log(res)
          that.setData({
            cjwt: res.data.cjwt
          })
        },
      })
      that.reload()
  },
  reload:function(e){
    var that = this
    var user_id = wx.getStorageSync('users').id;//用户user_id
    console.log('用户的user_id'+user_id)
    app.util.request({
      'url': 'entry/wxapp/MyRuZhu',
      'cachetime': '0',
      data: { user_id: user_id},
      success: function (res) {
        console.log(res)
        if(!res.data){
          that.setData({
            is_rz:4
          })
        }
        else if(res.data.state=='1'){
          that.setData({
            is_rz: 1
          })
        }
        else if (res.data.state == '2') {
          that.setData({
            is_rz: 2
          })
        }
        else if (res.data.state == '3') {
          that.setData({
            is_rz:3
          })
        }
      },
    })
  },
  select:function(e){
    wx: wx.navigateTo({
      url: 'prise',
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
    this.reload()
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
    this.reload()
    wx.stopPullDownRefresh()
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