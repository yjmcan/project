// zh_vip/pages/vipseller/vipseller.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
  scan: function (e) {
    var storeid = wx.getStorageSync('sjdsjid'), acountid = wx.getStorageSync('acountid');
    // var path = "zh_vip/pages/my/wdck/hx?scene=2"
    // var tnurl = '/' + path
    // wx.navigateTo({
    //   url: tnurl + '&storeid=' + storeid,
    // })
    wx.scanCode({
      success: (res) => {
        console.log(res)
        var path = res.path
        var tnurl = '/' + path
        wx.navigateTo({
          url: tnurl + '&storeid=' + storeid + '&acountid=' + acountid,
        })
      },
      fail: (res) => {
        console.log('扫码fail')
        // wx.showToast({
        //   title: '二维码错误',
        //   image:'../images/x.png'
        // })
      }
    })
  },
  tcdl:function(){
    wx.showModal({
      title: '提示',
      content: '确定退出登录吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.removeStorageSync('sjdsjid')
          wx.reLaunch({
            url: '../my',
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var sjdsjid = wx.getStorageSync('sjdsjid')
    var that = this;
    //Store 
    app.util.request({
      'url': 'entry/wxapp/StoreInfo',
      'cachetime': '0',
      data: { id: sjdsjid },
      success: function (res) {
        console.log('门店信息', res.data)
        that.setData({
          mdinfo: res.data,
        })
        wx.setNavigationBarTitle({
          title: res.data.name,
        })
      }
    });
    //Statistical
    app.util.request({
      'url': 'entry/wxapp/Statistical',
      'cachetime': '0',
      data: { store_id: sjdsjid },
      success: function (res) {
        console.log('账目', res.data)
        that.setData({
          zmxx: res.data,
        })
      }
    });
  },

  // —————————跳转到会员页面———————————
  vipuser:function(e){
    wx:wx.redirectTo({
      url: 'vipuser/vipuser',
    })
  },
  jqqd: function (e) {
    wx.showModal({
      title: '提示',
      content: '程序员回家过年了，敬请期待',
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