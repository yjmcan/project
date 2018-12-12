// zh_wxc/pages/my/mywait.js
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
    var that=this;
    // var waitid = options.user_id;
    // console.log(waitid)

  },
  refresh:function(e){
    var that = this
    var user_id = wx.getStorageSync('users').id
    app.util.request({
      url: 'entry/wxapp/WaitScore',
      'cachetime': '0',
      data: {
        user_id: user_id
      },
      success: function (res) {
        var con = res.data
        console.log(res.data)
        that.setData({
          con: con
        })
      },
    })
  },
  /*进入评论页面 */
  onEvaluate:function(e){
    var id=e.currentTarget.dataset.id;
    console.log(e)
    wx: wx.navigateTo({
      url: 'evaluate?order_id='+id,
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
    this.refresh()
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