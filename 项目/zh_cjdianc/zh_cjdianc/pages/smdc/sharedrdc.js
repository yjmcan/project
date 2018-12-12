// zh_cjdianc/pages/smdc/sharedrdc.js
var app = getApp()
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
  sxsj: function () {
    this.reLoad()
  },
  reLoad: function () {
    var that = this, storeid = this.data.storeid, uid = this.data.zuid, drid = this.data.drid;
    console.log(storeid, uid, drid)
    app.util.request({
      'url': 'entry/wxapp/DrShopList',
      'cachetime': '0',
      data: { store_id: storeid, user_id: uid, dr_id: drid },
      success: function (res) {
        console.log(res.data)
        that.setData({
          drlsit: res.data,
        })
      },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.setNavigationBarColor(this);
    app.getUserInfo(function (userinfo) {
      console.log(userinfo)
      if (userinfo.id == options.uid) {
        wx.redirectTo({
          url: 'drdc?storeid=' + options.storeid + '&tableid=' + options.tableid,
        })
      }
      that.setData({
        userinfo: userinfo,
      })
    })
    console.log(options)
    this.setData({
      drid: options.drid,
      storeid: options.storeid,
      zuid: options.uid,
      tableid: options.tableid,
    })
    app.util.request({
      'url': 'entry/wxapp/StoreInfo',
      'cachetime': '0',
      data: { store_id: options.storeid, type: 1 },
      success: function (res) {
        console.log(res.data)
        that.setData({
          store:res.data.store,
        })
      },
    })
    app.util.request({
      'url': 'entry/wxapp/DrShopList',
      'cachetime': '0',
      data: { store_id: options.storeid, user_id: options.uid, dr_id: options.drid },
      success: function (res) {
        console.log(res.data)
        that.setData({
          drlsit: res.data,
          drid: options.drid,
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
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})