// zh_qygw/pages/mould3/contact3/contact3.js
var app = getApp();
var Data = require('../../../utils/util.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
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
      }
    })

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
  },

  // ————————————————————————————拨打电话——————————————————
  phone: function (e) {
    var phone = this.data.aboutus.link_tel;
    console.log(phone)
    wx.makePhoneCall({
      phoneNumber: phone
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