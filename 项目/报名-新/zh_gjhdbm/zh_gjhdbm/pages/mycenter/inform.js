// zh_gjhdbm/pages/mycenter/inform.js
const app = getApp()
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
    var status = options.status
    // 获取系统设置
    app.util.request({
      'url': 'entry/wxapp/getSystem',
      'cachetime': '0',
      success: function (res) {
        console.log('这是系统设置')
        console.log(res)
        if (status==1){
          that.setData({
            nodes: res.data.tx_notice
          })
        } else if (status == 2){
          that.setData({
            nodes: res.data.fwf_notice
          })
        } else if (status == 3) {
          that.setData({
            nodes: res.data.rz_notice
          })
        } else if (status == 4) {
          that.setData({
            nodes: res.data.fb_notice
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