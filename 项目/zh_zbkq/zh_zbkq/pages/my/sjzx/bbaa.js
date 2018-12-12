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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
    //取平台信息
    app.util.request({
      'url': 'entry/wxapp/GetPlatform',
      'cachetime': '0',
      success: function (res) {
        console.log(res.data)
        that.setData({
          xtxx: res.data,
          url: getApp().imgurl ,
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
    app.util.request({
      'url': 'entry/wxapp/StoreLogin',
      'cachetime': '0',
      data: { user_name: that.data.name, pwd: that.data.password },
      success: function (res) {
        console.log(res)
        if (res.data == '账号不存在!' || res.data == '密码不正确!') {
          wx: wx.showModal({
            title: '提示',
            content: '当前账号未绑定操作员',
            showCancel: true,
            cancelText: '取消',
            confirmText: '确定',
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { },
          })
        } else {
          wx.setStorageSync('store_id', res.data.id)
          wx: wx.redirectTo({
            url: '../sjzx/merchant',
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { },
          })
        }
      },
    })
  },
  weixin: function (e) {
    if (this.data.werchat == false) {
      this.setData({
        werchat: true
      })
    } else if (this.data.werchat == true) {
      this.setData({
        werchat: false
      })
    }

  },
  queding: function (e) {
    this.setData({
      werchat: false
    })
    var uid = wx.getStorageSync('UserData').id;
    console.log(uid)
    app.util.request({
      'url': 'entry/wxapp/GetMdid',
      'cachetime': '0',
      data: { user_id: uid },
      success: function (res) {
        console.log(res)
        if (res.data == '') {
          wx: wx.showModal({
            title: '提示',
            content: '当前账号未绑定为操作员',
            showCancel: true,
            cancelText: '取消',
            confirmText: '确定',
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { },
          })
        }
        else if (res.data.is_check == '1') {
          wx.showModal({
            title: '提示',
            content: '您的入驻申请正在后台审核，请耐心等待',
          })
        }
        else if (res.data.is_check == '2') {
          wx.setStorageSync('store_id', res.data.id)
          console.log(wx.getStorageSync('store_id'))
          wx: wx.redirectTo({
            url: '../sjzx/merchant',
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { },
          })
        }
        else if (res.data.is_check == '3') {
          wx.showModal({
            title: '提示',
            content: '您的入驻申请已被拒绝，请联系平台处理',
          })
        }
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

  }
})