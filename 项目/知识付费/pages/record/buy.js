// pages/record/buy.js
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
    wx.getSystemInfo({
      success:res=>{
        that.setData({
          width: res.windowWidth,
          height: res.windowHeight,
        })
        that.saveImg()
      }
    })
  },
  // 保存第一张本地图片
  saveImg:function(img){
    console.log('保存背景图片')
    var that = this
    that.canvasOne()
    // var that = this
    // wx.downloadFile({
    //   url: '../img/one.png',
    //   success: function (res) {
    //     console.log(res)
    //     that.setData({
    //       logo1: res.tempFilePath,
    //     })
    //     that.canvasOne()
    //   }
    // })
  },
  // 生成第一张邀请卡
  canvasOne:function(e){
    var that = this
    var a = that.data
    var width = a.width
    var height = a.height
    var context = wx.createCanvasContext('firstCanvas')
    var text = '95%的明星都在用的绝密减肥方法'
    for (let i in text){
      
    }
    context.rect(0, 0, width, height)
    context.setFillStyle('#fff')
    context.fill()
    context.drawImage('../img/one.png', 0,0,width,height)
    context.fillStyle = "#787778";
    context.setFontSize(16)
    context.fillText('推荐人', 60, height / 2);
    context.fillStyle = "#bcb9bd";
    context.setFontSize(14)
    context.fillText('向你推荐一个很棒的课程', 60, height / 2 + 20);
    context.fillStyle = "#9a999b";
    context.font = 'bold'
    context.setFontSize(17)
    context.fillText('****的直播间', 20, height / 2 + 60);
    context.fillStyle = "#d0a73d";
    context.setFontSize(20)
    context.fillText('', 20, height / 2 + 90);
    context.draw()
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