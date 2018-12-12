// zh_qygw/pages/mould3/home3/home3.js
var app = getApp();
var Data = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperCurrent: 0,
    slide:[
      { logo:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1515489136409&di=7938786a97aa7dee3e73fc2b74452a6e&imgtype=0&src=http%3A%2F%2Fimg15.3lian.com%2F2015%2Fh1%2F295%2Fd%2F143.jpg'},
      { logo:'http://img.zcool.cn/community/018b07595dc532a8012193a33d91dd.jpg@2o.jpg'},
      { logo: 'http://img.taopic.com/uploads/allimg/121019/234917-121019231h258.jpg' },
    ],
    msgList:[
      { title:'欢迎进入官方小程序'},
      { title: '超值套餐等着您' },
    ],
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

    // —————————————————————————————— 获取网址——————————————————————————————
    app.util.request({
      'url': 'entry/wxapp/Url',
      'cachetime': '0',
      success: function (res) {
        // ————————— 异步保存网址前缀——————————
        wx.setStorageSync('url', res.data)
        that.setData({
          url: res.data
        })
      },
    })

    //—————————————————————————————— 幻灯片——————————————————————————————
    app.util.request({
      'url': 'entry/wxapp/GetSlide',
      'cachetime': '0',
      success: function (res) {
        console.log(res.data)
        that.setData({
          yswiper: res.data
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
  // —————————————轮播的滑动事件———————————
  swiperChange: function (e) {
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  // ——————————————调到方案页面————————————————
  news3: function (e) {
    wx: wx.reLaunch({
      url: '../news3/news3',
    })
  },
  fuwu3: function (e) {
    wx: wx.reLaunch({
      url: '../fuwu3/fuwu3',
    })
  },
  kaifa3: function (e) {
    wx: wx.navigateTo({
      url: '../kaifa3/kaifa3',
    })
  },
  anli3: function (e) {
    wx: wx.navigateTo({
      url: '../anli3/anli3',
    })
  },
  yunying3: function (e) {
    wx: wx.navigateTo({
      url: '../yunying3/yunying3',
    })
  },
  promise3: function (e) {
    wx: wx.navigateTo({
      url: '../promise3/promise3',
    })
  },
  contact3: function (e) {
    wx: wx.navigateTo({
      url: '../contact3/contact3',
    })
  },
  guanggao3: function (e) {
    wx: wx.navigateTo({
      url: '../yemian3/guanggao3',
    })
  },

  more: function (e) {
    wx: wx.navigateTo({
      url: '../yemian3/comment3',
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