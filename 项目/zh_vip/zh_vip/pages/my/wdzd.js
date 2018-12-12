// zh_hyk/pages/my/wdzd.js
var app = getApp()
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ['钱包明细', '支付账单'],
    activeIndex: 0,
    banertext: '钱包明细',
    bdtext: '可用余额(元)',
    issx:false,
  },
  bindDateChange: function (e) {
    var that=this;
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value,
      issx:true,
    })
    var uid = wx.getStorageSync('UserData').id;
    //MyOrder
    app.util.request({
      'url': 'entry/wxapp/MyOrder',
      'cachetime': '0',
      data: { user_id: uid, time: e.detail.value},
      success: function (res) {
        console.log('wdzd', res.data)
        that.setData({
          zfzd: res.data,
        })
      }
    });
    //RechargeList
    app.util.request({
      'url': 'entry/wxapp/RechargeList',
      'cachetime': '0',
      data: { user_id: uid, time: e.detail.value },
      success: function (res) {
        console.log('qbmx', res.data)
        that.setData({
          qbmx: res.data,
        })
      }
    });
  },
  tabClick: function (e) {
    var that=this;
    this.setData({
      activeIndex: e.currentTarget.id
    });
    if (e.currentTarget.id == 0) {
      this.setData({
        banertext: '钱包明细',
        // bdtext: '可用积分',
        // htext:that.data.userInfo.integral,
      });
    }
    if (e.currentTarget.id == 1) {
      this.setData({
        banertext: '支付账单',
        // bdtext: '可用余额(元)',
        // htext: that.data.userInfo.wallet
      });
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.pageOnLoad(this);
    var end = util.formatTime(new Date).substring(0, 10).replace(/\//g, "-");
    console.log(end.toString())
    this.setData({
      date: end,
      end: end,
    });
    var xtxx = wx.getStorageSync('xtxx')
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: xtxx.link_color,
    })
    this.reLoad();
  },
  reLoad: function () {
    var that = this;
    var url = getApp().imgurl;
    var uid = wx.getStorageSync('UserData').id;
    //MyOrder
    app.util.request({
      'url': 'entry/wxapp/MyOrder',
      'cachetime': '0',
      data: { user_id: uid },
      success: function (res) {
        console.log('wdzd', res.data)
        that.setData({
          zfzd: res.data,
          url: url,
        })
      }
    });
    //RechargeList
    app.util.request({
      'url': 'entry/wxapp/RechargeList',
      'cachetime': '0',
      data: { user_id: uid },
      success: function (res) {
        console.log('qbmx', res.data)
        that.setData({
          qbmx: res.data,
        })
      }
    });
    //UserInfo
    app.util.request({
      'url': 'entry/wxapp/UserInfo',
      'cachetime': '0',
      data: { user_id: uid },
      success: function (res) {
        console.log('用户信息', res.data)
        that.setData({
          userInfo: res.data,
          htext: res.data.wallet,
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
    this.reLoad();
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
    this.reLoad();
    this.setData({
      issx:false,
    })
    wx.stopPullDownRefresh();
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