// zh_gjhdbm/pages/logs/piaoquaninfo/add_mark.js
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
    console.log(options)
    app.setNavigationBarColor(this);
      var that = this
      var hx_id = options.scene
      //获取用户信息
      app.getUserInfo(function (userInfo) {
        console.log(userInfo)
        var user_id = userInfo.id
        that.setData({
          user_id: user_id,
          hx_id: hx_id
        })
      })
  },
  add_market:function(e){
    var that = this
    var user_id = that.data.hx_id
    var hx_id = that.data.user_id
    app.util.request({
      'url': 'entry/wxapp/AddVerification',
      'cachetime': '0',
      data:{
        user_id: user_id,
        hx_id: hx_id
      },
      success: function (res) {
        console.log(res)
        if(res.data==1){
          wx.showToast({
            title: '添加成功',
          })
          setTimeout(function () {
            wx.redirectTo({
              url: '../index/index',
            })
          }, 1500)
        }else{
          wx.showToast({
            title: res.data,
          })
          setTimeout(function(){
            wx.redirectTo({
              url: '../index/index',
            })
          },1500)
        }
      },
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