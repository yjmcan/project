// zh_dianc/pages/seller/dd.js
var app = getApp();
var dsq;
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
    app.editTabBar();
    var that=this;
    if (options.activeIndex){
      this.setData({
        activeIndex: parseInt(options.activeIndex)
      })
    }
    var sjdsjid = wx.getStorageSync('sjdsjid')
    console.log(sjdsjid)
    var url = wx.getStorageSync('imglink')
    console.log(url)
    // Store
    app.util.request({
      'url': 'entry/wxapp/Store',
      'cachetime': '0',
      data: { id: sjdsjid },
      success: function (res) {
        console.log('商家信息',res)
          that.setData({
            store:res.data,
            url:url,
          })
      }
    })
    //提醒
    if (wx.getStorageSync('yybb')) {
      dsq = setInterval(function () {
        app.util.request({
          'url': 'entry/wxapp/NewOrder',
          'cachetime': '0',
          data: { store_id: sjdsjid },
          success: function (res) {
            console.log(res)
            if (res.data == 1) {
              wx.playBackgroundAudio({
                dataUrl: wx.getStorageSync('url2') + 'addons/zh_dianc/template/images/wm.wav',
                title: '语音播报',
              })
            }
            if (res.data == 2) {
              wx.playBackgroundAudio({
                dataUrl: wx.getStorageSync('url2') + 'addons/zh_dianc/template/images/dn.wav',
                title: '语音播报',
              })
            }
            if (res.data == 3) {
              wx.playBackgroundAudio({
                dataUrl: wx.getStorageSync('url2') + 'addons/zh_dianc/template/images/yy.wav',
                title: '语音播报',
              })
            }
          },
        })
      }, 10000)
    }
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
    clearInterval(dsq)
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