// pages/about/consult.js
var app = getApp();
var Data = require('../../utils/util.js');
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
    var that = this;
    console.log(options);
    that.setData({
      telphone: options.telphone
    })
  },

  // -------------------------------获取微信绑定的手机号-------------------------------
  getPhoneNumber: function (e) {
    var that = this
    var sessionKey = wx.getStorageSync('key')
    var iv = e.detail.iv
    var data = e.detail.encryptedData
    console.log(sessionKey)
    console.log(iv)
    console.log(data)
    app.util.request({
      'url': 'entry/wxapp/jiemi',
      'cachetime': '0',
      data: { sessionKey: sessionKey, iv: iv, data: data },
      success: function (res) {
        console.log(res)
        that.setData({
          num: res.data.phoneNumber,
          tel_code: true
        })
      },
    })
  },

  // 立即申请表单提交
  formSubmit: function (e) {
    var that = this;
    console.log(that.data);
    console.log(that.data.telphone)
    var num = that.data.num;//获取的微信手机号
    var yz_tel = that.data.telphone;//从上个验证页面传过来的手机号
    var produnt_name = e.detail.value.proname;
    var user_name = e.detail.value.username;
    var link_tel = e.detail.value.contel;
    var zx_content = e.detail.value.context;
    if (produnt_name == '' || produnt_name==null){
      wx: wx.showToast({
        title: '产品名称为空',
        icon: '',
        image: '',
        duration: 2000,
        mask: true,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    } else if (user_name == '' || user_name == null){
      wx: wx.showToast({
        title: '您的称呼为空',
        icon: '',
        image: '',
        duration: 2000,
        mask: true,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    } else if (link_tel == '' || link_tel == null) {
      wx: wx.showToast({
        title: '手机号为空',
        icon: '',
        image: '',
        duration: 2000,
        mask: true,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    } else if (link_tel.length!=11) {
      wx: wx.showToast({
        title: '手机号错误',
        icon: '',
        image: '',
        duration: 2000,
        mask: true,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    } else if (yz_tel == null || yz_tel==''){
      if (num == '' || num == null){
        wx: wx.showToast({
          title: '请获取手机号',
          icon: '',
          image: '',
          duration: 2000,
          mask: true,
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) { },
        })
      }else{
        app.util.request({
          'url': 'entry/wxapp/SaveZx',
          'cachetime': '0',
          data: {
            produnt_name: produnt_name,
            user_name: user_name,
            link_tel: link_tel,
            zx_content: zx_content,
            yz_tel: num
          },
          success: function (res) {
            console.log(res.data)
            wx: wx.navigateTo({
              url: 'success',
            })
          },
        })
      }
      
    } else{
      app.util.request({
        'url': 'entry/wxapp/SaveZx',
        'cachetime': '0',
        data: {
          produnt_name: produnt_name,
          user_name: user_name,
          link_tel: link_tel,
          zx_content: zx_content,
          yz_tel: yz_tel
        },
        success: function (res) {
          console.log(res.data)
          wx: wx.navigateTo({
            url: 'success',
          })
        },
      })
    }
    
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