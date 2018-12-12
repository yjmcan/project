// zh_hyk/pages/i/index.js
var app = getApp()
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var util = require('../../utils/util.js');
var qqmapsdk;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    open: false,
    sqlq: false,
  },
  form_save: function (e) {
    console.log(e)
   
  },
  ljkk: function () {
    var that = this, userInfo = this.data.userInfo;
    if (userInfo.img == '' || userInfo.nickname == '') {
      wx.navigateTo({
        url: '/zh_vip/pages/index/getdl',
      })
      return
    }
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
  tradeinfo: function (e) {
    console.log(e.currentTarget.dataset.id)
    var that = this;
    var index = e.currentTarget.dataset.id, list = this.data.unreceive, list1 = this.data.received;
    console.log(index)
    for (var i = 0, len = list.length; i < len; ++i) {
      if (list[i].id == index) {
        list[i].open = !list[i].open
      } else {
        list[i].open = false
      }
    }
    for (var i = 0, len = list1.length; i < len; ++i) {
      if (list1[i].id == index) {
        list1[i].open = !list1[i].open
      } else {
        list1[i].open = false
      }
    }
    this.setData({
      unreceive: list,
      received: list1,
    });
  },
  sqlq: function () {
    console.log('sqlq')
    var that = this;
    this.setData({
      sqlq: !that.data.sqlq,
    })
  },
  maketel: function (e) {
    console.log(e.currentTarget.dataset.tel)
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.tel,
    })
  },
  ckwz: function (e) {
    console.log(e.currentTarget.dataset.jwd)
    var jwd = e.currentTarget.dataset.jwd.split(',')
    console.log(jwd)
    var that = this
    wx.openLocation({
      latitude: Number(jwd[0]),
      longitude: Number(jwd[1]),
      name: that.data.mdinfo.name,
      address: that.data.mdinfo.address
    })
  },
  qhmd: function () {
    wx.navigateTo({
      url: 'qhmd',
    })
  },
  md: function () {
    console.log(this.data.userInfo, this.data.xtxx.vip_qx, this.data.isdq)
    if (this.data.userInfo.grade == '0') {
      wx.showModal({
        title: '提示',
        content: '请点击立即开卡，开卡后使用此功能',
      })
      return
    }
    if (this.data.userInfo.grade != '0' && this.data.xtxx.vip_qx == '1' && this.data.isdq == '1') {
      wx.showModal({
        title: '提示',
        content: '您的会员卡已到期，请点击立即续费后使用此功能',
      })
      return
    }
    wx.navigateTo({
      url: 'md',
    })
  },
  cz: function (e) {
    var form_id = e.detail.formId
    app.util.request({
      'url': 'entry/wxapp/AddFormId',
      data: {
        user_id: wx.getStorageSync('UserData').id,
        form_id: form_id
      },
      success: res => {
        console.log(res)
      }
    })
    if (this.data.userInfo.grade == '0') {
      wx.showModal({
        title: '提示',
        content: '请点击立即开卡，开卡后使用此功能',
      })
      return
    }
    if (this.data.userInfo.grade != '0' && this.data.xtxx.vip_qx == '1' && this.data.isdq == '1') {
      wx.showModal({
        title: '提示',
        content: '您的会员卡已到期，请点击立即续费后使用此功能',
      })
      return
    }
    wx.navigateTo({
      url: 'cz',
    })
  },
  mflq: function (e) {
    console.log(e.currentTarget.dataset.id, e.currentTarget.dataset.lqdj, this.data.userInfo.level_type)
    console.log(this.data.userInfo, this.data.xtxx.vip_qx, this.data.isdq)
    var form_id = e.detail.formId
    console.log(wx.getStorageSync('UserData').id)
    app.util.request({
      'url': 'entry/wxapp/AddFormId',
      data: {
        user_id: wx.getStorageSync('UserData').id,
        form_id: form_id
      },
      success: res => {
        console.log(res)
      }
    })
    if (this.data.userInfo.grade == '0') {
      wx.showModal({
        title: '提示',
        content: '请点击立即开卡，开卡后领券',
      })
      return
    }
    if (this.data.userInfo.grade != '0' && this.data.xtxx.vip_qx == '1' && this.data.isdq == '1') {
      wx.showModal({
        title: '提示',
        content: '您的会员卡已到期，请点击立即续费后领券',
      })
      return
    }
    var that = this;
    var uid = wx.getStorageSync('UserData').id;
    var sjid = wx.getStorageSync('mdid')
    console.log(uid, sjid)
    if (Number(that.data.userInfo.level_type) < Number(e.currentTarget.dataset.lqdj)) {
      wx.showModal({
        title: '提示',
        content: '您的会员等级不足以领此券哦~',
      })
      return
    }
    that.setData({
      lqdisabledid: e.currentTarget.dataset.id
    })
    //AddCoupons
    app.util.request({
      'url': 'entry/wxapp/AddCoupons',
      'cachetime': '0',
      data: { user_id: uid, coupons_id: e.currentTarget.dataset.id },
      success: function (res) {
        console.log(res.data)
        if (res.data == 1) {
          wx.showToast({
            title: '领取成功',
          })
          setTimeout(function () {
            that.lqyhq(uid, sjid)
          }, 1000)
        }
        else {
          that.setData({
            lqdisabledid: ''
          })
          wx.showToast({
            title: '网络问题',
          })
        }
      }
    });
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
  topjumps: function (e) {
    var that = this
    console.log(e)
    var form_id = e.detail.formId
    app.util.request({
      'url': 'entry/wxapp/AddFormId',
      data: {
        user_id: wx.getStorageSync('UserData').id,
        form_id: form_id
      },
      success: res => {
        console.log(res)
      }
    })
    var appid = e.detail.target.dataset.appid;
    var src = e.detail.target.dataset.src, src2 = e.detail.target.dataset.websrc
    var type = e.detail.target.dataset.item
    console.log(appid, src,src2, type)
    if (type == 1) {
      console.log(src)
      if (src == '/zh_vip/pages/index/cz' || src =='/zh_vip/pages/index/md'){
        if (this.data.userInfo.grade == '0') {
          wx.showModal({
            title: '提示',
            content: '请点击立即开卡，开卡后使用此功能',
          })
          return
        }
        if (this.data.userInfo.grade != '0' && this.data.xtxx.vip_qx == '1' && this.data.isdq == '1') {
          wx.showModal({
            title: '提示',
            content: '您的会员卡已到期，请点击立即续费后使用此功能',
          })
          return
        }
      }
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
  jumps: function (e) {
    var that = this
    var name = this.data.xtxx.qhmd_name
    var appid = this.data.xtxx.qhmd_appid
    var src = this.data.xtxx.qhmd_url, src2 = this.data.xtxx.qhmd_url2
    var type = this.data.xtxx.qhmd_type
    console.log(name, appid, src, type)
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
    console.log('onLoad()', options)
    app.pageOnLoad(this);
    //获取用户头像等信息
    var that = this
    //取平台信息
    app.util.request({
      'url': 'entry/wxapp/system',
      'cachetime': '0',
      success: function (res) {
        console.log(res.data)
        //调用应用实例的方法获取全局数据
        app.getUserInfo(function (userInfo) {
          //登录
          // console.log(app.globalData)
          console.log(userInfo)
          if (userInfo.img == '' || userInfo.nickname == '') {
            wx.navigateTo({
              url: '/zh_vip/pages/index/getdl',
            })
          }
          that.setData({
            userInfo: userInfo,
          })
          if (res.data.vip_qx == '1') {
            //IsDq
            app.util.request({
              'url': 'entry/wxapp/IsDq',
              'cachetime': '0',
              data: { user_id: userInfo.id },
              success: function (res) {
                console.log(res.data)
                that.setData({
                  isdq: res.data,
                })
              }
            });
          }
          var scene = decodeURIComponent(options.scene)
          console.log('scene', scene)
          if (scene != 'undefined') {
            that.StoreInfo(scene)
          }
          else {
            that.reLoad(userInfo.id)
          }
          // var uid = wx.getStorageSync('UserData').id
        })
        that.setData({
          xtxx: res.data,
        })
        wx.setStorageSync('xtxx', res.data)
        // 实例化API核心类
        qqmapsdk = new QQMapWX({
          key: res.data.mapkey
        });
        wx.setNavigationBarColor({
          frontColor: '#ffffff',
          backgroundColor: res.data.link_color,
        })
        wx.setNavigationBarTitle({
          title: res.data.link_name,
        })
      }
    });
    //取imglink
    app.util.request({
      'url': 'entry/wxapp/url',
      'cachetime': '0',
      success: function (res) {
        console.log(res.data)
        that.setData({
          url: res.data,
        })
        getApp().imgurl = res.data
      }
    });
    //DelAllCoupons
    app.util.request({
      'url': 'entry/wxapp/DelAllCoupons',
      'cachetime': '0',
      success: function (res) {
        console.log('DelAllCoupons', res.data)
      }
    });
    //TopNav
    app.util.request({
      'url': 'entry/wxapp/TopNav',
      'cachetime': '0',
      success: function (res) {
        console.log('TopNav', res.data)
        that.setData({
          TopNav: res.data,
        })
      }
    });
  },
  //默认门店
  reLoad: function (uid) {
    var that = this
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        console.log(res)
        //Store 
        app.util.request({
          'url': 'entry/wxapp/Store',
          'cachetime': '0',
          data: { lat: res.latitude, lng: res.longitude },
          success: function (res) {
            console.log('门店信息', res.data)
            that.lqyhq(uid, res.data.id)
            wx.setStorageSync('mdid', res.data.id)
            that.setData({
              mdinfo: res.data,
            })
          }
        });
      },
      fail: function () {
        wx.showModal({
          title: '警告',
          content: '您点击了拒绝授权,无法正常使用功能，点击确定重新获取授权。',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              wx.openSetting({
                success: (res) => {
                  if (res.authSetting["scope.userLocation"]) {////如果用户重新同意了授权登录
                    that.onLoad()
                  } else {
                    that.onLoad();
                  }
                },
                fail: function (res) {
                }
              })
            }
          }
        })
      },
    })
  },
  StoreInfo: function (id) {
    var that = this
    var uid = wx.getStorageSync('UserData').id;
    console.log(uid)
    //Store 
    app.util.request({
      'url': 'entry/wxapp/StoreInfo',
      'cachetime': '0',
      data: { id: id },
      success: function (res) {
        console.log('门店信息', res.data)
        that.setData({
          sxwb: false,
        })
        setTimeout(function () {
          that.lqyhq(uid, res.data.id)
        }, 1000)
        wx.setStorageSync('mdid', res.data.id)
        that.setData({
          mdinfo: res.data,
        })
        wx.showToast({
          title: '刷新成功',
        })
      }
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  changeData: function () {
    console.log('changeData')
    var uid = wx.getStorageSync('UserData').id
    console.log(uid)
    var that = this;
    //UserInfo
    app.util.request({
      'url': 'entry/wxapp/UserInfo',
      'cachetime': '0',
      data: { user_id: uid },
      success: function (res) {
        console.log('用户信息', res.data)
        that.setData({
          userInfo: res.data,
        })
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
  lqyhq: function (uid, sjid) {
    var that = this;
    //Coupons
    app.util.request({
      'url': 'entry/wxapp/Coupons',
      'cachetime': '0',
      data: { user_id: uid, store_id: sjid },
      success: function (res) {
        console.log('优惠券信息', res.data)
        // that.setData({
        //   yhqarr: res.data,
        // })
        let idDataSet = that.getIdDataSet(res.data.ok);
        that.classify(res.data.all, idDataSet);
      }
    });
  },
  getIdDataSet: function (jsonArr) {
    let dataset = new Array();
    let len = jsonArr.length;
    for (let i = 0; i < len; i++) {
      dataset.push(jsonArr[i].coupons_id);
    }
    return dataset;
    console.log(dataset)
  },
  classify: function (origin, comp) {
    let received = new Array();
    let unreceive = new Array();
    let len = origin.length;
    for (let i = 0; i < len; i++) {
      if (comp.indexOf(origin[i].id) === -1) {
        unreceive.push(origin[i]);
      } else {
        received.push(origin[i]);
      }
    }
    console.log(unreceive, received)
    this.setData({
      unreceive: unreceive,
      received: received,
      sxwb: true,
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('onshow()')
    // this.changeData();
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
    var uid = wx.getStorageSync('UserData').id, mdid = wx.getStorageSync('mdid');
    this.changeData();
    if (this.data.sxwb) {
      console.log(this.data.sxwb)
      this.StoreInfo(mdid)
    }
    else {
      console.log(this.data.sxwb)
    }
    // this.reLoad(uid);
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // wx.showToast({
    //   title: '上拉触底',
    // })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})