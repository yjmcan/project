// zh_zbkq/pages/my/bzzx/bzzx.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: []
  },
  kindToggle: function (e) {
    var index = e.currentTarget.id, list = this.data.list;
    console.log(index)
    for (var i = 0, len = list.length; i < len; ++i) {
      if (i == index) {
        list[i].open = !list[i].open
      } else {
        list[i].open = false
      }
    }
    this.setData({
      list: list
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var xtxx = wx.getStorageSync('xtxx')
    console.log(xtxx)
    this.setData({
      xtxx: xtxx,
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: xtxx.link_color,
    })
    console.log(this);
    //取帮助信息
    app.util.request({
      'url': 'entry/wxapp/GetHelp',
      'cachetime': '0',
      success: function (res) {
        console.log(res.data)
        for(var i=0;i<res.data.length;i++){
          res.data[i].answer = res.data[i].answer.replace(/↵/g, "\n");
        }
        that.setData({
          list:res.data
        })
      }
    });
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