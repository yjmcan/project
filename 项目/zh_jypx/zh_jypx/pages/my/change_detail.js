// pages/my/change_detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: ['东西湖', '汉口', '武昌', '汉阳']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  
  /*下拉选择 */
  bindPickerChange: function (e) {
    console.log(this.data.array)
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      s_index: e.detail.value,
    })
  },

  /*核销二维码 */
  // onCode:function(e){
  //   wx.scanCode({
  //     onlyFromCamera:false,
  //     success:function(res){
  //       console.log(res)
  //     }
  //   })
  // },

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