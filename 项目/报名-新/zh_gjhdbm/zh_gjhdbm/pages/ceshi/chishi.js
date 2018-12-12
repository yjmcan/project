// zh_gjhdbm/pages/ceshi/chishi.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    app.setNavigationBarColor(this);
    // wx.downloadFile({
    //   url: 'https://zhycms.com/attachment/images/147/2018/04/UvIViq8qfvnX8oCHh878HNjOXIWIJi.png', //仅为示例，并非真实的资源
    //   success: function (res) {
    //     console.log(res)
    //     that.setData({
    //       acti_logo: res.tempFilePath
    //     })
    //     const ctx = wx.createCanvasContext('myCanvas')
    //     ctx.save()
    //     ctx.beginPath()
    //     ctx.arc(320, 300, 20, 0, 2 * Math.PI)
    //     ctx.clip()
    //     ctx.setFillStyle('#f66925')
    //     ctx.fill()
    //     // ctx.drawImage(res.tempFilePath, 30, 30)
    //     ctx.drawImage(res.tempFilePath, 300, 280, 40, 40)
    //     ctx.restore()
    //     ctx.draw()
    //   }
    // })
    
  },
  bindblur: function (e) {
    var that = this
    var value = e.detail.value
    var regRule = /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g;
    console.log(value.match(regRule))
    if (value.match(regRule)) {
      value = value.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, "");
      console.log('系统检测到输入了表情')
      console.log("不支持表情");
    }
    console.log(value)
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