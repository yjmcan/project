// zh_cjdianc/pages/seller/getnumdl.js
var app = getApp()
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    wx.setNavigationBarTitle({
      title: '排队详情',
    })
    var that = this
    that.setData({
      id: options.id
    })
    app.setNavigationBarColor(this);
    app.getimgUrl(this)
    app.getUserInfo(function (userinfo) {
      console.log(userinfo)
    })
    app.util.request({
      'url': 'entry/wxapp/StoreInfo',
      'cachetime': '0',
      data: {
        store_id: options.storeid
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          storeinfo: res.data.store
        })
      },
    })
    this.reLoad()
  },
  reLoad:function(){
    var that = this
    app.util.request({
      'url': 'entry/wxapp/NumberDetails',
      'cachetime': '0',
      data: {
        num_id: that.data.id
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          NumberDetail: res.data
        })
      },
    })
  },
  seller_info: function (e) {
    // wx.navigateTo({
    //   url: 'infomation',
    // })
    var jwd = this.data.storeinfo.coordinates.split(','), t = this.data.storeinfo;
    console.log(jwd)
    wx.openLocation({
      latitude: parseFloat(jwd[0]),
      longitude: parseFloat(jwd[1]),
      address: t.address,
      name: t.name
    })
  },
  maketel: function () {
    var that = this;
    wx.makePhoneCall({
      phoneNumber: that.data.storeinfo.tel,
    })
  }, 
  refresh:function(){
    wx.startPullDownRefresh({
      
    })
  },
  formSubmit: function (e) {
    var that = this, uid = wx.getStorageSync('users').id;
    app.util.request({
      'url': 'entry/wxapp/AddFormId',
      'cachetime': '0',
      data: { user_id: uid, form_id: e.detail.formId },
      success: function (res) {
        console.log(res.data, uid)
      },
    })
    wx.showModal({
      title: '提示',
      content: '确定取消排号吗？',
      success: function (s) {
        if (s.cancel) return !0;
        s.confirm && (wx.showLoading({
          title: "操作中"
        }), app.util.request({
          'url': 'entry/wxapp/DelNumber',
          'cachetime': '0',
          data: { num_id: that.data.id },
          success: function (res) {
            console.log(res.data)
            if (res.data) {
              wx.showToast({
                title: '取消成功',
                icon: 'success',
                mask: true,
                duration: 1000,
              })
              setTimeout(function () {
                wx.redirectTo({
                  url: 'getnum?storeid=' + that.data.storeinfo.id,
                })
              }, 1000)
            }
            else {
              wx.showToast({
                title: '请重试',
                icon: 'loading',
                duration: 1000,
              })
            }
          },
        }))
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
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.reLoad()
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {
  
  // }
})