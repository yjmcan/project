// pages/program/program.js
var app = getApp();
var Data = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    luntext: ['综合', '最新', '综合', '最新', '综合', '最新',],
    activeIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // —————————————————————————————— 获取网址——————————————————————————————
    app.util.request({
      'url': 'entry/wxapp/Url',
      'cachetime': '0',
      success: function (res) {
        // —————————————————————————————— 异步保存网址前缀——————————————————————————————
        wx.setStorageSync('url', res.data)
        that.setData({
          url: res.data
        })
      },
    })
    //—————————————————————————————— 方案分类 ——————————————————————————————
    app.util.request({
      'url': 'entry/wxapp/getProgrammeType',
      'cachetime': '0',
      success: function (res) {
        console.log("产品分类数据")
        console.log(res.data)
        for (var i = 0; i < res.data.length; i++) {
          var id = res.data[0].id
          console.log(id)
          that.setData({
            infortype: res.data
          })
          app.util.request({
            'url': 'entry/wxapp/ProgrammeList',
            'cachetime': '0',
            data: { type_id: id },
            success: function (res) {
              console.log("产品列表数据")
              console.log(res.data)
              that.setData({
                infortypelist: res.data
              })
            },
          })
        }

      },
    })
  },
  proinfo: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.id
    console.log(index)
    console.log(that.data.infortypelist)
    var fanglistid = that.data.infortypelist;
    for (var i = 0; i < fanglistid.length; i++) {
      if (fanglistid[i].id == fanglistid[index].id) {
        wx: wx.navigateTo({
          url: 'programinfo?id=' + fanglistid[i].id,
        })
      }
    }
  },
  tabClick: function (e) {
    var that = this;
    console.log(e.currentTarget.id)
    var index = e.currentTarget.dataset.index
    var id = e.currentTarget.id
    app.util.request({
      'url': 'entry/wxapp/ProgrammeList',
      'cachetime': '0',
      data: { type_id: id },
      success: function (res) {
        console.log("方案列表数据")
        console.log(res.data)
        that.setData({
          activeIndex: index,
          infortypelist: res.data
        })
      },
    })
  },

  // ———————————跳转到产品页面———————————
  product1: function (e) {
    wx: wx.reLaunch({
      url: '../product/product',
    })
  },
  // ———————————跳转到方案页面———————————
  home: function (e) {
    wx: wx.reLaunch({
      url: '../home/home',
    })
  },

  // ———————————跳转到企业动态页面———————————
  dynamic1: function (e) {
    wx: wx.reLaunch({
      url: '../dynamic/dynamic',
    })
  },

  // ———————————跳转到我们页面———————————
  ahout1: function (e) {
    wx: wx.reLaunch({
      url: '../about/about',
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