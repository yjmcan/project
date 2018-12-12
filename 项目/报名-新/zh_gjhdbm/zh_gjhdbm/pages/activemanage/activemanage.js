// pages/activemanage/activemanage.js
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
    app.getSystem(this)
    app.getUrl(this)
    var that = this
    that.setData({
      activity_id: options.id,
      options: options
    })
  },
  // 活动编辑
  edit_activity:function(e){
    wx.navigateTo({
      url: '../fabu/fabu?id=' + this.data.activity_id,
    })
  },
  // 关闭活动
  close_activity: function (e) {
    var that = this
    var activity_id = that.data.activity_id
    var is_close = that.data.options.is_close
    var options = that.data.options
    console.log(options)
    if (is_close == 1) {
      is_close = 2
    } else {
      is_close = 1
    }
    app.util.request({
      'url': 'entry/wxapp/CloseActivity',
      'cachetime': '0',
      data: { activity_id: activity_id, is_close: is_close },
      success: function (res) {
        console.log(res)
        wx.showToast({
          title: '操作成功',
        })
        setTimeout(function () {
          options.is_close = is_close
          that.setData({
            options: options
          })
        }, 1500)
      },
    })
  },
  ticket_manage: function (e) {
    var that = this
    var activity_id = that.data.activity_id
    wx.navigateTo({
      url: 'piaoquan?activity_id=' + activity_id,
    })
  },
  mine_income:function(e){
    var that= this
    var activity_id = that.data.activity_id
    var income = 1
    wx.navigateTo({
      url: '../mycenter/myshouru?income=' + income + '&activity_id=' + activity_id,
    })
  },
  // 查看核销码
  see_write_off_code:function(e){
    wx.showModal({
      title: '',
      content: this.data.options.hx_code,
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