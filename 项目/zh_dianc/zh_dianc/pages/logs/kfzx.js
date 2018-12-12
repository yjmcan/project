// zh_zbkq/pages/my/kfzx.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  tel: function () {
    var that = this;
    wx.makePhoneCall({
      phoneNumber: that.data.tel //仅为示例，并非真实的电话号码
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(this);
    // 系统设置
    app.util.request({
      'url': 'entry/wxapp/system',
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        that.setData({
          bqxx: res.data,
          tel:res.data.tel
        })
        // wx.setNavigationBarTitle({
        //   title: res.data.pt_name+'客服中心'
        // })
      },
    })
    // 网址信息
    // app.util.request({
    //   'url': 'entry/wxapp/Url',
    //   'cachetime': '0',
    //   success: function (res) {
    //     // console.log(res.data)
    //     that.setData({
    //       url: res.data
    //     })
    //   },
    // })
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