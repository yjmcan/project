// zh_gjhdbm/pages/mycenter/settled.js
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
    var that = this
    app.setNavigationBarColor(this);
    that.setData({
      activity_id: options.activity_id,
      djs_money: options.djs_money
    })
    that.refresh()
  },
  refresh:function(e){
    var that = this
    var activity_id = that.data.activity_id
    app.util.request({
      'url': 'entry/wxapp/HdUnsettled',
      'cachetime': '0',
      data:{
        activity_id: activity_id
      },
      success: function (res) {
        console.log(res)
        for(let i in res.data){
          res.data[i].time = app.ormatDate(res.data[i].time).slice(0,16)
        }
        that.setData({
          HdUnsettled: res.data
        })
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