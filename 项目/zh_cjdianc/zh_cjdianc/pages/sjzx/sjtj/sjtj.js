// zh_cjdianc/pages/sjzx/dpgl.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    jrdd:'0',
    jrcj:'0'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this, sjdsjid = wx.getStorageSync('sjdsjid');
    console.log(sjdsjid, wx.getStorageSync('system'))
    this.setData({
      wm_name: wx.getStorageSync('system').wm_name||'外卖',
      dc_name: wx.getStorageSync('system').dc_name || '店内',
    })
    app.setNavigationBarColor(this);
    app.sjdpageOnLoad(this);
    app.util.request({
      'url': 'entry/wxapp/StoreStatistics',
      'cachetime': '0',
      data: { store_id:sjdsjid},
      success: function (res) {
        console.log(res.data)
        that.setData({
          wmdd: res.data
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
  
  }
})