// pages/index/home.js
var app = getApp();
var Data = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperCurrent: 0,
    indicatorDots: false,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    slide: [
      { img: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1513057315830&di=28c50097b1b069b2de68f70d625df8e2&imgtype=0&src=http%3A%2F%2Fimgsrc.baidu.com%2Fimgad%2Fpic%2Fitem%2Fa8014c086e061d95cb1b561170f40ad162d9cabe.jpg', },
      { img: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=570437944,358180613&fm=27&gp=0.jpg', }
    ],
    msgList: [
      { title: '欢迎进入官方小程序' },
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
    // ——————————————————————————————获取用户登录信息——————————————————————————————
    wx.login({
      success: function (res) {
        console.log('这是登录所需要的code')
        console.log(res.code)
        var code = res.code
        wx.setStorageSync("code", code)
        wx.getUserInfo({
          success: function (res) {
            // ——————————————————————————————异步保存用户登录信息——————————————————————————————
            wx.setStorageSync("user_info", res.userInfo)
            // ——————————————————————————————用户登录的名字——————————————————————————————
            var nickName = res.userInfo.nickName
            // ——————————————————————————————用户登录的头像——————————————————————————————
            var avatarUrl = res.userInfo.avatarUrl
            console.log('用户名字')
            console.log(res.userInfo.nickName)
            console.log('用户头像')
            console.log(res.userInfo.avatarUrl)
            app.util.request({
              'url': 'entry/wxapp/openid',
              'cachetime': '0',
              data: { code: code },
              success: function (res) {
                // 异步保存session-key
                console.log(res)
                wx.setStorageSync("key", res.data.session_key)
                //  ——————————————————————————————需要上传给后台的值 包括名字和头像——————————————————————————————
                var img = avatarUrl
                var name = nickName
                // 异步保存用户openid
                wx.setStorageSync("openid", res.data.openid)
                var openid = res.data.openid
                console.log('这是用户的openid')
                console.log(openid)
                // —————————————————————————————— 获取用户登录信息——————————————————————————————
                app.util.request({
                  'url': 'entry/wxapp/Login',
                  'cachetime': '0',
                  data: { openid: openid, img: img, nickname: name },
                  success: function (res) {
                    console.log('这是用户的登录信息')
                    console.log(res)
                    // ——————————————————————————————异步保存用户信息——————————————————————————————
                    wx.setStorageSync('users', res.data)
                    wx.setStorageSync('uniacid', res.data.uniacid)
                  },
                })
              },
            })
          }
        })
      }
    })
    console.log(that.data)

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
        // —————————————————————————————— 异步保存网址前缀——————————————————————————————
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

    //—————————————————————————————— 切换模板——————————————————————————————
    app.util.request({
      'url': 'entry/wxapp/GetPlatform',
      'cachetime': '0',
      success: function (res) {
        console.log(res.data)
        that.setData({
          style: res.data.style          
        });
        if (res.data.style==4){
          wx.setNavigationBarColor({
            frontColor: '#ffffff',
            backgroundColor: '#000000',
            animation: {
              duration: 400,
              timingFunc: 'easeIn'
            }
          })
        }

      },
    })
    // —————————————————————————————— 第四套模板图片——————————————————————————————
    app.util.request({
      'url': 'entry/wxapp/GetSitUrl',
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        wx.setStorageSync('url', res.data)
        that.setData({
          urlwf: res.data
        })
      },
    })

    //——————————————————————————————产品分类——————————————————————————————
    app.util.request({
      'url': 'entry/wxapp/GetNav', 
      'cachetime': '0',
      success: function (res) {
        console.log(res.data)
        var navfen = res.data;
        that.setData({
          fenlei: res.data
        })
      },
    })

    // ——————————————————————————————关于我们——————————————————————————————
    app.util.request({
      'url': 'entry/wxapp/GetAbout',
      'cachetime': '0',
      success: function (res) {
        console.log(res.data)
        that.setData({
          aboutus: res.data
        })
        
      },
    })

    // ——————————————————————————————产品列表——————————————————————————————
    app.util.request({
      'url': 'entry/wxapp/ProductList',
      'cachetime': '0',
      success: function (res) {
        console.log(res.data)
        that.setData({
          product: res.data
        })
      },
    })

    // ——————————————————————————————方案列表——————————————————————————————
    app.util.request({
      'url': 'entry/wxapp/ProgrammeList',
      'cachetime': '0',
      success: function (res) {
        console.log(res.data)
        that.setData({
          program: res.data.slice(0, 1)
        })
      },
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
        wx.setNavigationBarTitle({
          title: res.data.xcx_name
        })
      },
    })
    
    // ——————————————————————————————动态列表——————————————————————————————
    app.util.request({
      'url': 'entry/wxapp/InformationList',
      'cachetime': '0',
      success: function (res) {
        console.log(res.data)
        var dong = res.data
        for (var i = 0; i < dong.length;i++){
          // console.log("这是截取的时间年月："+dong[i].time.slice(0,7))
          // console.log("这是截取的时间日：" + dong[i].time.slice(8,10))
          that.setData({
            dynamic: res.data,
            dynamicyear: dong[i].time.slice(0, 7),
            dynamicday: dong[i].time.slice(8, 10),
        })
        }
        
      },
    })
  },


  // ———————————轮播滑动事件———————————
  swiperChange: function (e) {
    this.setData({
      swiperCurrent: e.detail.current
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
  ahout1: function (e) {
    wx: wx.reLaunch({
      url: '../about/about',
    })
  },

  // ------------------------------第二套模板的事件---------------------------
  // ————调到方案页面————
  fangan2: function (e) {
    wx: wx.reLaunch({
      url: '../mould2/fangan2/fangan2',
    })
  },
  we2: function (e) {
    wx: wx.reLaunch({
      url: '../mould2/we/we',
    })
  },

  // ------------------------------第三套模板的事件---------------------------
  // ————————调到方案页面————————
  news3: function (e) {
    wx: wx.reLaunch({
      url: '../mould3/news3/news3',
    })
  },
  fuwu3: function (e) {
    wx: wx.reLaunch({
      url: '../mould3/fuwu3/fuwu3',
    })
  },
  kaifa3: function (e) {
    wx: wx.navigateTo({
      url: '../mould3/kaifa3/kaifa3',
    })
  },
  anli3: function (e) {
    wx: wx.navigateTo({
      url: '../mould3/anli3/anli3',
    })
  },
  yunying3: function (e) {
    wx: wx.navigateTo({
      url: '../mould3/yunying3/yunying3',
    })
  },
  promise3: function (e) {
    wx: wx.navigateTo({
      url: '../mould3/promise3/promise3',
    })
  },
  contact3: function (e) {
    wx: wx.navigateTo({
      url: '../mould3/contact3/contact3',
    })
  },
  guanggao3: function (e) {
    wx: wx.navigateTo({
      url: '../mould3/yemian3/guanggao3',
    })
  },

  more: function (e) {
    wx: wx.navigateTo({
      url: '../mould3/yemian3/comment3',
    })
  },

  // ------------------------------第4套模板的事件---------------------------
  women4: function (e) {
    wx: wx.navigateTo({
      url: '../mould4/women4',
    })
  },
  youqing4: function (e) {
    wx: wx.navigateTo({
      url: '../mould4/youqing4',
    })
  },
  you4: function (e) {
    wx: wx.navigateTo({
      url: '../mould4/you4',
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
  onShareAppMessage: function () {
  
  }
})