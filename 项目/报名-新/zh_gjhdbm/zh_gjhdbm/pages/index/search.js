// zh_gjhdbm/pages/index/search.js
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
     url : wx.getStorageSync('url')
    })
  },
  // 搜索
  search: function (e) {
    console.log(e)
    var that = this
    // 输入的搜索字符
    var details = e.detail.value
    if (details != '') {
      app.util.request({
        url: 'entry/wxapp/ActivityList',
        data: {
          keywords: details
        },
        success: res => {
          console.log(res)
          if (res.data.length > 0) {
            that.setData({
              search: true,
              search_list: res.data
            })
          } 
        }
      })
    } else {
      that.setData({
        search: false
      })
    }
  },
  info: function (e) {
    console.log(e)
    var id = e.currentTarget.id
    wx.navigateTo({
      url: '../activeinfo/activeinfo?id=' + id
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