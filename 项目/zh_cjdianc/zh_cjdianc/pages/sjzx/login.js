// zh_dianc/pages/seller/login.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    disabled: true,
    zh: '',
    mm: '',
    logintext: '登录',
    werchat: false
  },
  tel:function(){
    var that=this;
    wx.makePhoneCall({
      phoneNumber: that.data.xtxx.tel,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.setNavigationBarColor(this);
    var that = this;
    console.log(this);
    // wx.setNavigationBarColor({
    //   frontColor: '#ffffff',
    //   backgroundColor: wx.getStorageSync('color'),
    //   animation: {
    //     duration: 0,
    //     timingFunc: 'easeIn'
    //   }
    // })
    app.util.request({
      'url': 'entry/wxapp/system',
      'cachetime': '0',
      success: function (res) {
        console.log(res.data)
        that.setData({
          xtxx: res.data
        })
      }
    });
  },
  name: function (e) {
    console.log(e)
    this.setData({
      name: e.detail.value
    })
  },
  password: function (e) {
    console.log(e)
    this.setData({
      password: e.detail.value
    })
  },
  sign: function (e) {
    var that=this;
    console.log(this.data)
    wx.showLoading({
      title: "正在提交",
      mask: !0
    }),
    app.util.request({
      'url': 'entry/wxapp/StoreLogin',
      'cachetime': '0',
      data: { user: that.data.name, password: that.data.password },
      success: function (res) {
        console.log(res)
        if (res.data.storeid != null) {
          wx.setStorageSync('sjdsjid', res.data.storeid)
          wx.redirectTo({
            url: 'wmdd/wmdd'
          })
        }
        else {
          wx.showModal({
            title: '提示',
            content: res.data,
          })
        }
      },
    })
  },
  weixin: function (e) {
    var uid = wx.getStorageSync('users').id;
    console.log(uid)
    wx.showModal({
      title: '提示',
      content: '确定使用此微信号绑定的操作员身份登录吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          // wx.redirectTo({
          //   url: 'wmdd',
          // })
          app.util.request({
            'url': 'entry/wxapp/StoreWxLogin',
            'cachetime': '0',
            data: { user_id: uid },
            success: function (res) {
              console.log(res)
              if (res.data.id != null) {
                wx.setStorageSync('sjdsjid', res.data.id)
                wx.redirectTo({
                  url: 'wmdd/wmdd'
                })
              }
              else {
                wx.showModal({
                  title: '提示',
                  content: res.data,
                })
              }
            },
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  }
})