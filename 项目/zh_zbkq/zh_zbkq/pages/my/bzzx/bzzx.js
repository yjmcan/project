// zh_zbkq/pages/my/bzzx/bzzx.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [
      {
        id: 'form',
        name: '优惠券的帮助中心',
        open: false,
        pages: '优惠券的帮助中心主要显示用户可能回碰到的问题,正在开发中，敬请期待'
      },
      {
        id: 'form',
        name: '优惠券的帮助中心',
        open: false,
        pages: '优惠券的帮助中心主要显示用户可能回碰到的问题,正在开发中，敬请期待'
      },
      {
        id: 'form',
        name: '优惠券的帮助中心',
        open: false,
        pages: '优惠券的帮助中心主要显示用户可能回碰到的问题,正在开发中，敬请期待'
      },
    ]
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
    console.log(this);
    //取帮助信息
    app.util.request({
      'url': 'entry/wxapp/GetHelp',
      'cachetime': '0',
      success: function (res) {
        console.log(res.data)
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