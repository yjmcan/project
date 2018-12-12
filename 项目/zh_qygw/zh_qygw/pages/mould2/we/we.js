// zh_qygw/pages/mould2/we/we.js
var app = getApp();
var Data = require('../../../utils/util.js');
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
    // ———————————————————————————版权————————————————————————————
    app.util.request({
      'url': 'entry/wxapp/GetPlatform',
      'cachetime': '0',
      success: function (res) {
        console.log("版权")
        console.log(res.data)
        that.setData({
          copyrit: res.data
        })
      },
    })
    app.util.request({
      'url': 'entry/wxapp/GetAbout',
      'cachetime': '0',
      success: function (res) {
        console.log(res.data)
        that.setData({
          aboutus: res.data
        })
      }
    })
  },
  // ———————————————————拨打电话——————————————————
  phone: function (e) {
    var phone = this.data.aboutus.link_tel;
    console.log(phone)
    wx.makePhoneCall({
      phoneNumber: phone
    })
  },

  // —————————————————跳转页面——————————————————
  home: function (e) {
    wx: wx.reLaunch({
      url: '../../home/home',
    })
  },
  fangan: function (e) {
    wx: wx.reLaunch({
      url: '../fangan2/fangan2',
    })
  },

  // ——————————————获取用户输入的手机号——————————————
  huoquyz: function (e) {
    var that = this
    console.log("这是手机号" + e.detail.value)
    var tel = e.detail.value
    that.setData({
      tel: tel
    })
  },
  // ————————————————获取用户输入的验证码——————————————
  yzcode: function (e) {
    var that = this
    // console.log(e.detail.value)
    var yzcode = e.detail.value
    if (yzcode != that.data.num) {
      wx: wx.showToast({
        title: '验证码错误',
        icon: '',
        image: '',
        duration: 2000,
        mask: true,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    } else {
      that.setData({
        yzcode: yzcode
      })
    }
  },

  // ————————————————————————————点击获取验证码——————————————————————
  yanzheng: function (e) {
    var that = this
    console.log(that.data);
    var tel = that.data.tel;
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (tel == '' || tel == null) {
      wx: wx.showToast({
        title: '请输入手机号',
        icon: '',
        image: '',
        duration: 2000,
        mask: true,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    } else if (!myreg.test(tel)) {
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
    } else if (tel.length != 11) {
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
    } else {
      // 获取6位数的随机数
      var Num = "";
      for (var i = 0; i < 6; i++) {
        Num += Math.floor(Math.random() * 10);
      }
      console.log(Num)
      // 随机数传给后台
      app.util.request({
        'url': 'entry/wxapp/Sms2',
        'cachetime': '0',
        data: { code: Num, tel: tel },
        success: function (res) {
          console.log(res)
        },
      })
      that.setData({
        num: Num
      })
      var time = 60
      // 60秒倒计时
      var inter = setInterval(function () {
        that.setData({
          getmsg: time + "s后重新发送",
          send: true
        })
        time--
        if (time <= 0) {
          // 停止倒计时
          clearInterval(inter)
          that.setData({
            getmsg: "获取验证码",
            send: false,
            num: 0
          })
        }
      }, 1000)
    }
  },
  formSubmit: function (e) {
    var that = this;
    console.log(that.data)
    var tel = that.data.tel
    var num = that.data.num
    var intel = e.detail.value.tel;//input输入的手机号的值
    var numyan = e.detail.value.numyan;//input输入的验证码的值
    if (intel == '' || intel == null) {
      wx: wx.showToast({
        title: '请输入手机号',
        icon: '',
        image: '',
        duration: 2000,
        mask: true,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    } else if (intel.length != 11) {
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
    } else if (numyan == '' || numyan == null) {
      wx: wx.showToast({
        title: '请输入验证码',
        icon: '',
        image: '',
        duration: 2000,
        mask: true,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    } else if (numyan == num) {
      console.log("验证码正确")
      wx: wx.showToast({
        title: '提交成功',
        icon: '',
        image: '',
        duration: 2000,
        mask: true,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
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