// zh_dianc/pages/seller/gzt.js
var app = getApp();
var dsq;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabbar: {},
    jtsy: 0,
    ztsy: 0,
    zgsy: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.editTabBar();
    var sjdsjid = wx.getStorageSync('sjdsjid')
    console.log(sjdsjid)
    var url = wx.getStorageSync('imglink')
    console.log(url)
    var that = this;
    //商家订单
    app.util.request({
      'url': 'entry/wxapp/StoreOrder',
      'cachetime': '0',
      data: { store_id: sjdsjid },
      success: function (res) {
        console.log(res)
        var djd = [], dps = [], tkdd = [];
        for (var i = 0; i < res.data.length; i++) {
          if (res.data[i].order.state == '2') {
            djd.push(res.data[i])
          }
          if (res.data[i].order.state == '3') {
            dps.push(res.data[i])
          }
          if (res.data[i].order.state == '7' || res.data[i].order.state == '8' || res.data[i].order.state == '9') {
            tkdd.push(res.data[i])
          }
        }
        console.log(djd, dps, tkdd)
        that.setData({
          djd: djd,
          dps: dps,
          tkdd: tkdd
        })
      },
    })
    //商家订单
    app.util.request({
      'url': 'entry/wxapp/AppDnOrder',
      'cachetime': '0',
      data: { store_id: sjdsjid },
      success: function (res) {
        console.log(res)
        var dzf = [], ywc = [], ygb = [];
        for (var i = 0; i < res.data.length; i++) {
          if (res.data[i].dn_state == '1') {
            dzf.push(res.data[i])
          }
          if (res.data[i].dn_state == '2') {
            ywc.push(res.data[i])
          }
          if (res.data[i].dn_state == '3') {
            ygb.push(res.data[i])
          }
        }
        console.log(dzf, ywc, ygb)
        that.setData({
          dzf: dzf,
          ywc: ywc,
          ygb: ygb,
        })
      },
    })
    //商家信息
    app.util.request({
      'url': 'entry/wxapp/store',
      'cachetime': '0',
      data: { id: sjdsjid },
      success: function (res) {
        console.log(res)
        that.setData({
          url: url,
          sjinfo: res.data
        })
      },
    })
    //今天的销售额
    app.util.request({
      'url': 'entry/wxapp/WmSale',
      'cachetime': '0',
      data: { store_id: sjdsjid },
      success: function (res) {
        console.log(res)
        that.setData({
          jtsy: res.data
        })
      },
    })
    //昨天的销售额
    app.util.request({
      'url': 'entry/wxapp/WmSale2',
      'cachetime': '0',
      data: { store_id: sjdsjid },
      success: function (res) {
        console.log(res)
        that.setData({
          ztsy: res.data
        })
      },
    })
    //总的销售额
    app.util.request({
      'url': 'entry/wxapp/WmSale3',
      'cachetime': '0',
      data: { store_id: sjdsjid },
      success: function (res) {
        console.log(res)
        that.setData({
          zgsy: res.data
        })
      },
    })
    //今日订单
    app.util.request({
      'url': 'entry/wxapp/WmOrder',
      'cachetime': '0',
      data: { store_id: sjdsjid },
      success: function (res) {
        console.log(res)
        that.setData({
          jrdd: res.data
        })
      },
    })
    //今日成交
    app.util.request({
      'url': 'entry/wxapp/WmOrder2',
      'cachetime': '0',
      data: { store_id: sjdsjid },
      success: function (res) {
        console.log(res)
        that.setData({
          jrcj: res.data
        })
      },
    })
    //访问量
    app.util.request({
      'url': 'entry/wxapp/Traffic',
      'cachetime': '0',
      data: { store_id: sjdsjid },
      success: function (res) {
        console.log(res)
        that.setData({
          fwl: res.data
        })
      },
    })
    //提醒
    if (wx.getStorageSync('yybb')) {
      dsq=setInterval(function () {
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
  djd: function () {
    wx.navigateTo({
      url: 'dd/wmdd?activeIndex=0',
    })
  },
  dps: function () {
    wx.navigateTo({
      url: 'dd/wmdd?activeIndex=1',
    })
  },
  tkdd: function () {
    wx.navigateTo({
      url: 'dd/wmdd?activeIndex=2',
    })
  },
  dzf:function(){
    wx.navigateTo({
      url: 'dd/tndd?activeIndex=0',
    })
  },
  ywc: function () {
    wx.navigateTo({
      url: 'dd/tndd?activeIndex=1',
    })
  },
  ygb: function () {
    wx.navigateTo({
      url: 'dd/tndd?activeIndex=2',
    })
  },
  tzsz: function () {
    wx.redirectTo({
      url: 'shezhi',
    })
  },
  wytx: function () {
    wx.navigateTo({
      url: 'wytx',
    })
  },
  smhx:function(){
    wx.scanCode({
      success: (res) => {
        console.log(res)
      }
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