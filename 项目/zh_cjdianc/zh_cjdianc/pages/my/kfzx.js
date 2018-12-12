// zh_zbkq/pages/my/kfzx.js
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
  tel:function(){
    var that=this;
    wx.makePhoneCall({
      phoneNumber: that.data.tel //仅为示例，并非真实的电话号码
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.setNavigationBarColor(this);
    wx.setNavigationBarTitle({
      title: options.title,
    })
    var that = this;
    console.log(wx.getStorageSync('answer'));
    that.setData({
      answer: wx.getStorageSync('answer')
    })
    //取平台信息
    // app.util.request({
    //   'url': 'entry/wxapp/system',
    //   'cachetime': '0',
    //   success: function (res) {
    //     console.log(res.data)
    //    that.setData({
    //      tel: res.data.tel
    //    })
    //   }
    // });
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
})