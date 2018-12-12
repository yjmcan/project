// zh_zbkq/pages/my/my.js
var app = getApp(), util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    issq: false,
    showModal: false,
    kgvip: false,
    isvip: false,
    issc: false,
    btnshowModal:false,
  },
  ljkk: function () {
    console.log(this.data.xtxx.is_stk)
    if (this.data.xtxx.is_stk == '1') {
      wx.showModal({
        title: '提示',
        content: '请选择开卡类型',
        confirmText: '办会员卡',
        cancelColor: '#3CC51F',
        cancelText: '绑定实卡',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            wx.navigateTo({
              url: '../my/login',
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
            wx.navigateTo({
              url: '../my/stklogin',
            })
          }
        }
      })
    }
    else {
      wx.navigateTo({
        url: '../my/login',
      })
    }
  },
  tzbj: function () {
    wx.navigateTo({
      url: 'myinfo',
    })
  },
  tzewm: function () {
    wx.navigateTo({
      url: 'ewm',
    })
  },
  xszz: function () {
    this.setData({
      showModal: true,
    })
  },
  yczz: function () {
    this.setData({
      showModal: false,
    })
  },
  glkq: function () {
    wx.showModal({
      title: '提示',
      content: '此功能正在开发中，敬请期待',
    })
  },
  sjvip: function () {
    if (this.data.issq) {
      wx.navigateTo({
        url: 'sjvip',
      })
    }
    else {
      wx.showModal({
        title: '温馨提示',
        content: '成功开通门店后方能升级VIP',
      })
    }
  },
  tjhxy: function () {
    if (this.data.issq) {
      wx.navigateTo({
        url: 'tjhxy/tjhxy',
      })
    }
    else {
      wx.showModal({
        title: '温馨提示',
        content: '成功开通门店并且发布券后方能添加核销员',
      })
    }
  },
  // 跳转小程序
  tzxcx: function (e) {
    console.log(e.currentTarget.dataset.appid)
    wx.navigateToMiniProgram({
      appId: e.currentTarget.dataset.appid,
      success(res) {
        // 打开成功
        console.log(res)
      }
    })
  },
  previewImage: function (e) {
    console.log(e.currentTarget.dataset.img)
    wx.previewImage({
      current: e.currentTarget.dataset.img, // 当前显示图片的http链接
      urls: [e.currentTarget.dataset.img] // 需要预览的图片http链接列表
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.pageOnLoad(this);
    //获取用户头像等信息
    var that = this
    var url = getApp().imgurl;
    //取平台信息
    app.util.request({
      'url': 'entry/wxapp/system',
      'cachetime': '0',
      success: function (res) {
        console.log(res.data)
        that.setData({
          xtxx: res.data,
          url: url,
        })
        that.changeData();
        wx.setStorageSync('xtxx', res.data)
        wx.setNavigationBarColor({
          frontColor: '#ffffff',
          backgroundColor: res.data.link_color,
        })
      }
    });
    app.util.request({
      'url': 'entry/wxapp/myAd',
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        that.setData({
          lblist: res.data
        })
      }
    })
    // var uid = wx.getStorageSync('UserData').id
    //this.reLoad();
  },
  tzweb: function (e) {
    console.log(e.currentTarget.dataset.index, this.data.lblist)
    var item = this.data.lblist[e.currentTarget.dataset.index]
    console.log(item)
    if (item.item == '1') {
      wx.navigateTo({
        url: item.src,
      })
    }
    if (item.item == '2') {
      wx.setStorageSync('vr', item.src2)
      wx.navigateTo({
        url: '../car/car'
      })
    }
    if (item.item == '3') {
      wx.navigateToMiniProgram({
        appId: item.appid,
        success(res) {
          // 打开成功
          console.log(res)
        }
      })
    }
  },
  reLoad: function () {
    console.log('reLoad()')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //登录
      that.setData({
        userInfo: userInfo
      })
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  bindGetUserInfo:function(res){
    console.log(res)
    if (res.detail.errMsg == "getUserInfo:ok") {
      this.setData({
        btnshowModal: false,
      })
      this.changeData();
    }
  },
  changeData: function () {
    console.log('changeData')
    var uid = wx.getStorageSync('UserData').id
    console.log(uid)
    var that = this;
    //我的券;
    app.util.request({
      'url': 'entry/wxapp/MyCoupons',
      'cachetime': '0',
      data: { user_id: uid },
      success: function (res) {
        console.log(res.data)
        that.setData({
          MyCoupons: res.data.length,
        })
      }
    });
    //UserInfo
    app.util.request({
      'url': 'entry/wxapp/UserInfo',
      'cachetime': '0',
      data: { user_id: uid },
      success: function (res1) {
        console.log('用户信息', res1.data)
        res1.data.vip_time = util.ormatDate(res1.data.vip_time)
        wx.getSetting({
          success: function (res) {
            console.log(res)
            if (res.authSetting['scope.userInfo']) {
              // 已经授权，可以直接调用 getUserInfo 获取头像昵称
              wx.getUserInfo({
                success: function (res) {
                  console.log(res.userInfo)
                  app.util.request({
                    'url': 'entry/wxapp/login',
                    'cachetime': '0',
                    data: { openid: res1.data.openid, img: res.userInfo.avatarUrl, name: res.userInfo.nickName },
                    header: {
                      'content-type': 'application/json'
                    },
                    dataType: 'json',
                    success: function (res) {
                      console.log('用户信息', res)
                      res.data.vip_time = util.ormatDate(res.data.vip_time)
                      that.setData({
                        userInfo: res.data,
                      })
                    },
                  })
                }
              })
            }
            else {
              console.log('未授权过')
              that.setData({
                btnshowModal: true,
              })
            }
          }
        })
        //Upgrade 
        // app.util.request({
        //   'url': 'entry/wxapp/Upgrade',
        //   'cachetime': '0',
        //   data: { level: res1.data.grade },
        //   success: function (res) {
        //     console.log('Upgrade', res.data)
        //     if(res.data){
        //       var sjxfje = (Number(res.data.threshold) - Number(res1.data.level_cumulative)).toFixed(2)
        //       console.log(sjxfje)
        //       var sjjd = ((Number(res1.data.level_cumulative) / Number(res.data.threshold)) * 100).toFixed(2)
        //       that.setData({
        //         Upgrade: res.data,
        //         sjxfje: sjxfje,
        //         sjjd: sjjd,
        //       })
        //     }
        //     else{
        //       that.setData({
        //         Upgrade: '',
        //         sjxfje:'',
        //         sjjd: 100,
        //       })
        //     }
        //   }
        // });
      }
    });
    if (this.data.xtxx.vip_qx == '1') {
      //IsDq
      app.util.request({
        'url': 'entry/wxapp/IsDq',
        'cachetime': '0',
        data: { user_id: uid },
        success: function (res) {
          console.log(res.data)
          that.setData({
            isdq: res.data,
          })
        }
      });
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    //jjsqzcdy
    // wx.getSetting({
    //   success: (res) => {
    //     console.log(res)
    //     if (!res.authSetting["scope.userInfo"]) {
    //       that.reLoad()
    //     }
    //   }
    // })
    // this.changeData();
    console.log(this.data._navbar.navs)
    var navs = this.data._navbar.navs
    for (var i in navs) {
      if (navs[i].url === '/zh_vip/pages/psdj/psdj' || navs[i].url === '/zh_vip/pages/ksgm/takeoutindex') {
        that.setData({
          issc: true,
        })
      }
    }
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
    this.changeData()
    setTimeout(function () {
      wx.stopPullDownRefresh()
    }, 1000)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
})