// pages/dynamic/dynamic.js
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
    //—————————————————————————————— 产品分类 ——————————————————————————————
    app.util.request({
      'url': 'entry/wxapp/getInformationType',
      'cachetime': '0',
      success: function (res) {
        console.log("动态分类数据")
        console.log(res.data)
        for (var i = 0; i < res.data.length; i++) {
          var id = res.data[0].id
          console.log(id)
          that.setData({
            infotype: res.data
          })
          app.util.request({
            'url': 'entry/wxapp/InformationList',
            'cachetime': '0',
            data: { type_id: id },
            success: function (res) {
              console.log("动态产品列表数据")
              console.log(res.data)
              for (var i = 0; i < res.data.length; i++) {
                that.setData({
                  infotypelist: res.data,
                  timer: res.data[i].time.slice(0,10)
                })
              }
              
            },
          })
        }
      },
    })
  }, 
  dyinfo: function (e) {
    wx: wx.navigateTo({
      url: 'dynamicinfo',
    })
  },

  // ——————————导航分类切换点击事件——————————
  tabClick: function (e) {
    var that = this;
    console.log(e)
    var id = e.currentTarget.id
    var index = e.currentTarget.dataset.index
    app.util.request({
      'url': 'entry/wxapp/InformationList',
      'cachetime': '0',
      data: { type_id: id },
      success: function (res) {
        console.log("产品列表数据")
        console.log(res.data)
        that.setData({
          activeIndex: index,
          index: index,
          infotypelist: res.data
        })
      },
    })
  },
  dyinfo: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.id
    console.log(index)
    console.log(that.data.infotypelist)
    var fanglistid = that.data.infotypelist;
    for (var i = 0; i < fanglistid.length; i++) {
      if (fanglistid[i].id == fanglistid[index].id) {
        wx: wx.navigateTo({
          url: 'dynamicinfo?id=' + fanglistid[i].id,
        })
      }
    }
  },

  // ———————————跳转到产品页面———————————
  product1: function (e) {
    wx: wx.reLaunch({
      url: '../product/product',
    })
  },
  // ———————————跳转到方案页面———————————
  program1: function (e) {
    wx: wx.reLaunch({
      url: '../program/program',
    })
  },

  // ———————————跳转到企业动态页面———————————
  home: function (e) {
    wx: wx.reLaunch({
      url: '../home/home',
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