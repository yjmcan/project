// pages/my/integral_change.js
const app=getApp()
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

    // —————————————— 获取网址——————————
    app.util.request({
      "url": "entry/wxapp/Attachurl",
      'cachetime': '0',
      success: function (res) {
        that.setData({
          url: res.data
        })
      }
    })
    
    app.util.request({
      'url': 'entry/wxapp/Prize',
      'cachetime': '0',
      success: function (res) {
        console.log("积分兑换列表")
        console.log(res.data)
        if(res.data.code==200){
          that.setData({
            list: res.data.list,
            none: res.data,
          })
        }else{
          that.setData({
            none: res.data,
          })          
        }

      },
    })   
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /*进入兑换详情 */
  change_detail:function(e){
    wx: wx.navigateTo({
      url: "change_detail"
    })
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