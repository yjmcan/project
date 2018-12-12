// zh_dianc/pages/personal/problem.js
var a = getApp();
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    carte: [
      // {
      //   img1:'../../img/personal/chongzhi.png',
      //   name:'充值中心',
      //   img2:'',
      //   border:'border_bottom',
      //   bindtap:'recharge'
      // },
      // {
      //   img1: '../../img/personal/lingqu.png',
      //   name: '领取优惠券',
      //   img2: '',
      //   border: 'border_bottom',
      //   bindtap: 'receive'
      // },
      // {
      //   img1: '../../img/personal/jifen.png',
      //   name: '积分商城',
      //   img2: '',
      //   bindtap: 'integral'
      // },
      {
        img1: '../../img/personal/kefu.png',
        name: '客服与投诉',
        img2: '',
        margin: 'margin_top',
        border: 'border_bottom',
        bindtap: 'customer'
      },
      // {
      //   img1: '../../img/personal/fankui.png',
      //   name: '反馈',
      //   img2: '',
      //   border: 'border_bottom',
      //   bindtap: 'feedback'
      // },
      // {
      //   img1: '../../img/personal/shezhi.png',
      //   name: '设置',
      //   img2: '',
      //   border: 'border_bottom',
      //   bindtap: 'set_up'
      // },
      {
        img1: '../../img/personal/bangzhu.png',
        name: '帮助中心',
        img2: '',
        border: 'border_bottom',
        bindtap: 'help'
      },
      // {
      //   img1: '../../img/personal/ruzhu.png',
      //   name: '我要入驻',
      //   img2: '',
      //   border: 'border_bottom',
      //   bindtap: 'help'
      // },
      // {
      //   img1: '../../img/personal/seller.png',
      //   name: '商家入口',
      //   img2: '',
      //   margin: 'margin_top',
      //   bindtap: 'seller'
      // },
    ],
    top: '-420'
  },
  wdsc: function () {
    wx.navigateTo({
      url: '../extra/wdsc',
    })
  },
  wddd:function(){
    wx.navigateTo({
      url: '../wddd/order',
    })
  },
  wddz: function () {
    wx.navigateTo({
      url: '../wddz/xzdz',
    })
  },
  wdyy: function () {
    wx.navigateTo({
      url: '../reserve/order',
    })
  },
  wdqg: function () {
    wx.navigateTo({
      url: '../xsqg/order',
    })
  },
  wdpt: function () {
    wx.navigateTo({
      url: '../collage/order',
    })
  },
  wdyhq: function () {
    wx.navigateTo({
      url: 'myyhq',
    })
  },
  help:function(){
    wx.navigateTo({
      url: 'bzzx',
    })
  },
  seller: function () {
    wx.navigateTo({
      url: '../sjzx/login',
    })
  },
  fx: function () {
    wx.navigateTo({
      url: '../distribution/index',
    })
  },
  jfsc: function () {
    wx.navigateTo({
      url: '../integral/integral',
    })
  },
  czzx: function () {
    wx.navigateTo({
      url: '../wallet/walletadd',
    })
  },
  tzhy: function () {
    wx.navigateTo({
      url: '../hyk/hyk',
    })
  },
  bindGetUserInfo: function (res) {
    console.log(res)
    if (res.detail.errMsg == "getUserInfo:ok") {
      this.setData({
        hydl: false,
      })
      this.changeData();
    }
  },
  changeData: function () {
    var that = this;
    //获取头像和名字
    wx.getSetting({
      success: function (res) {
        console.log(res)
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function (res) {
              console.log(res)
              a.util.request({
                'url': 'entry/wxapp/login',
                'cachetime': '0',
                data: { openid: getApp().getOpenId, img: res.userInfo.avatarUrl, name: res.userInfo.nickName },
                header: {
                  'content-type': 'application/json'
                },
                dataType: 'json',
                success: function (res) {
                  console.log('用户信息', res)
                  // that.setData({
                  //   userInfo: res.data,
                  // })
                },
              })
              var userInfo = res.userInfo
              console.log(userInfo)
              that.setData({
                avatarUrl: userInfo.avatarUrl,
                nickName: userInfo.nickName
              })
            }
          })
        }
        else {
          console.log('未授权过')
          that.setData({
            hydl: true,
          })
        }
      }
    })
  },
  jumps: function (e) {
    var that = this
    var id = e.currentTarget.dataset.id, name = e.currentTarget.dataset.name;
    var appid = e.currentTarget.dataset.appid
    var src = e.currentTarget.dataset.src, src2 = e.currentTarget.dataset.wb_src
    var type = e.currentTarget.dataset.type
    console.log(id, name, appid, src, src2, type)
    if (type == 1) {
      console.log(src)
      wx: wx.navigateTo({
        url: src,
      })
    } else if (type == 2) {
      wx.setStorageSync('vr', src2)
      wx: wx.navigateTo({
        url: '../car/car',
      })
    } else if (type == 3) {
      wx.navigateToMiniProgram({
        appId: appid,
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    a.setNavigationBarColor(this);
    a.pageOnLoad(this);
    this.changeData();
    var that = this, user_id = wx.getStorageSync('users').id;
    console.log(user_id)
    a.util.request({
      'url': 'entry/wxapp/MyCoupons',
      'cachetime': '0',
      data: { user_id: user_id },
      success: function (res) {
        console.log(res.data)
        that.setData({
          yhnum:res.data.length
        })
      },
    })
    a.util.request({
      'url': 'entry/wxapp/system',
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        that.setData({
          system: res.data
        })
      },
    })
    a.util.request({
      'url': 'entry/wxapp/CheckRetail',
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        that.setData({
          fxset: res.data
        })
      },
    })
    a.util.request({
      'url': 'entry/wxapp/Signset',
      'cachetime': '0',
      success: function (res) {
        console.log('签到设置', res)
        that.setData({
          qdset: res.data,
        })
      }
    })
    //home轮播图和开屏公告
    a.util.request({
      'url': 'entry/wxapp/ad',
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        var toplb = [];
        for (var i = 0; i < res.data.length; i++) {
          if (res.data[i].type == '7') {
            toplb.push(res.data[i])
          }
        }
        console.log(toplb)
        that.setData({
          lblist: toplb,
        })
      },
    })
    //llz
    a.util.request({
      'url': 'entry/wxapp/Llz',
      'cachetime': '0',
      data: { type: '3,4' },
      success: function (res) {
        console.log(res)
        var dbllz = [], zbllz = [];
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].type == 3) {
            dbllz.push(res.data[i])
          }
          if (res.data[i].type == 4) {
            zbllz.push(res.data[i])
          }
        }
        that.setData({
          dbllz: dbllz,
          zbllz: zbllz
        })
      },
    })
    wx.getSystemInfo({
      success: function (res) {
        console.log(res.model)
        console.log(res.pixelRatio)
        console.log(res.windowWidth)
        console.log(res.windowHeight)
        console.log(res.language)
        console.log(res.version)
        console.log(res.platform)
        if (res.platform != 'android') {
          that.setData({
            top: '-330'
          })
        }
      }
    })
  },
  // 反馈
  feedback: function (e) {
    wx.navigateTo({
      url: 'feedback',
    })
  },
  // 充值中心
  wallet: function (e) {
    wx.navigateTo({
      url: '../wallet/wallet',
    })
  },
  // 设置
  set_up: function (e) {
    wx.navigateTo({
      url: 'set_up',
    })
  },
  // 领取优惠券
  receive: function (e) {
    wx.navigateTo({
      url: 'receive',
    })
  },
  // 积分商城
  integral: function (e) {
    wx.navigateTo({
      url: '../integral/myintegral',
    })
  },
  // 签到
  sign_in: function (e) {
    wx.navigateTo({
      url: 'rankings',
    })
  },
  // 商家入驻
  sjrz:function(e){
    var that = this
    var user_id = wx.getStorageSync("users").id
    a.util.request({
      'url': 'entry/wxapp/CheckRz',
      'cachetime': '0',
      data: { user_id: user_id },
      success: function (res) {
        console.log(res.data)
        if(res.data!=false){
          if (res.data.state == 1) {
            wx.showModal({
              title: '',
              content: '系统正在审核中',
            })
          } else if (res.data.state == 2) {
            wx.showModal({
              title: '',
              content: '您已经入驻过了',
            })
          } else if (res.data.state == 3) {
            wx.showModal({
              title: '',
              content: '您的入驻申请已被拒绝，点击确定进行编辑',
              success: res => {
                if (res.confirm) {
                  wx.navigateTo({
                    url: '../ruzhu/index?state=' + '3',
                  })
                }
              }
            })
          } else {
            wx.showModal({
              title: '',
              content: '您的入驻已经到期,请联系平台管理员续费',
            })
          }
        }else{
          wx.navigateTo({
            url: '../ruzhu/index',
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
    var that = this
    var user_id = wx.getStorageSync('users').id
    var date = util.formatTime(new Date).substring(0, 10).replace(/\//g, "-");
    console.log(date.toString())
    // 积分
    a.util.request({
      'url': 'entry/wxapp/UserInfo',
      'cachetime': '0',
      data: { user_id: user_id },
      success: function (res) {
        console.log(res)
        if (res.data.dq_time != '' && res.data.dq_time >= date.toString()) {
          res.data.ishy = 1
        }
        that.setData({
          userInfo: res.data
        })
      }
    })
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
})