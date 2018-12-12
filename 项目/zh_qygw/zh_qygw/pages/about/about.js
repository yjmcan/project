// pages/about/about.js
var app = getApp();
var Data = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    yanzheng: true,
    mapp:false,
    markers: [{
      iconPath: "/resources/others.png",
      id: 0,
      latitude: 23.099994,
      longitude: 113.324520,
      width: 50,
      height: 50
    }],
    polyline: [{
      points: [{
        longitude: 113.3245211,
        latitude: 23.10229
      }, {
        longitude: 113.324520,
        latitude: 23.21229
      }],
      color: "#FF0000DD",
      width: 2,
      dottedLine: true
    }],
    controls: [{
      id: 1,
      iconPath: '/resources/location.png',
      position: {
        left: 0,
        top: 300 - 50,
        width: 50,
        height: 50
      },
      clickable: true
    }]

  },

  // ——————地图————————
  regionchange(e) {
    console.log(e.type)
  },
  markertap(e) {
    console.log(e.markerId)
  },
  controltap(e) {
    console.log(e.controlId)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //----------------------------------关于我们----------------------------------
    app.util.request({
      'url': 'entry/wxapp/GetAbout',
      'cachetime': '0',
      success: function (res) {
        console.log(res.data)
        var city = res.data.coordinates.split(',');
        that.setData({
          markers: [{
            iconPath: "/resources/others.png",
            id: 0,
            latitude: city[0],
            longitude: city[1],
            width: 50,
            height: 50
          }],
          polyline: [{
            points: [{
              longitude: city[1],
              latitude: city[0]
            }, {
              longitude: city[1],
              latitude: city[0]
            }],
            color: "#FF0000DD",
            width: 2,
            dottedLine: true
          }],
          controls: [{
            id: 1,
            iconPath: '/resources/location.png',
            position: {
              left: 0,
              top: 300 - 50,
              width: 50,
              height: 50
            },
            clickable: true
          }],
          latitude: city[0],
          longitude: city[1],
          aboutus: res.data

        })
      },
    })

    //----------------------------------是否开启短信验证---------------------------------
    app.util.request({
      'url': 'entry/wxapp/GetSms',
      'cachetime': '0',
      success: function (res) {
        console.log(res.data)
        console.log(res.data.is_sms)
        that.setData({
          duanxin: res.data
        })
      },
    })
  },
  shanhu: function (e) {
    var that = this;
    that.setData({
      yanzheng: true,
      mapp:false,
    })
  },
  zhuce: function (e) {
    var that = this;
    that.setData({
      yanzheng: false,
      mapp:true
    })
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
  dynamic1: function (e) {
    wx: wx.reLaunch({
      url: '../dynamic/dynamic',
    })
  },

  // ———————————跳转到我们页面———————————
  home: function (e) {
    wx: wx.reLaunch({
      url: '../home/home',
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
  // ————————————————————————————拨打电话——————————————————
  phone: function (e) {
    var phone = this.data.aboutus.link_tel;
    console.log(phone)
    wx.makePhoneCall({
      phoneNumber: phone
    })
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
    var uname = e.detail.value.uname;//input输入的手机号的值
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
      that.setData({
        yanzheng: true,
        mapp:false
      })
      wx: wx.navigateTo({
        url: 'consult?telphone=' + tel,
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