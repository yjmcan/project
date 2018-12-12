// pages/fukuan/fukuan.js
var app = getApp();
var form_id;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    money: 0.00,
    qzf: true,
    showModal: false,
    zffs: 1,
    zfz: false,
    zfwz: '微信支付',
    btntype: 'btn_ok1',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    if (e.detail.value == 'wxzf') {
      this.setData({
        zffs: 1,
        zfwz: '微信支付',
        btntype: 'btn_ok1',
      })
    }
    if (e.detail.value == 'yezf') {
      this.setData({
        zffs: 2,
        zfwz: '余额支付',
        btntype: 'btn_ok2',
      })
    }
    if (e.detail.value == 'jfzf') {
      this.setData({
        zffs: 3,
        zfwz: '积分支付',
        btntype: 'btn_ok3',
      })
    }
  },
  xszz: function () {
    var that = this, userinfo = this.data.userinfo;
    console.log(userinfo)
    if (userinfo.img == '' || userinfo.name == '') {
      wx.navigateTo({
        url: '../smdc/getdl',
      })
    }
    else {
      this.setData({
        showModal: true,
      })
    }
  },
  yczz: function () {
    this.setData({
      showModal: false,
    })
  },
  money: function (e) {
    var money;
    console.log(e.detail.value)
    if (e.detail.value != '') {
      money = e.detail.value
    }
    else {
      money = 0
    }
    this.setData({
      money: parseFloat(money).toFixed(2)
    })
  },
  formSubmit: function (e) {
    var that = this
    form_id = e.detail.formId
    that.setData({
      form_id: form_id
    })
    var openid = this.data.userinfo.openid;
    var user_id = this.data.userinfo.id;
    var money = this.data.money
    var sjid = this.data.storeinfo.store.id
    console.log(openid,user_id, money, sjid)
    if (money == 0) {
      wx.showModal({
        title: '提示',
        content: '付款金额不能等于0',
      })
      return false
    }
    console.log('form发生了submit事件，携带数据为：', e.detail.value.radiogroup)
    if (e.detail.value.radiogroup == 'yezf') {
      var ye = Number(this.data.wallet), money = Number(this.data.money);
      console.log(ye, money)
      if (ye < money) {
        wx.showToast({
          title: '余额不足支付',
          icon: 'loading',
        })
        return
      }
    }
    var dyjf = 0;
    if (e.detail.value.radiogroup == 'jfzf') {
      var jf = Number(this.data.total_score) / Number(this.data.jf_proportion), money = Number(this.data.money);
      dyjf = money * Number(this.data.jf_proportion);
      console.log(jf, money, dyjf)
      if (jf < money) {
        wx.showToast({
          title: '积分不足支付',
          icon: 'loading',
        })
        return
      }
    }
    if (e.detail.value.radiogroup == 'yezf') {
      var pay_type = 2;
    }
    if (e.detail.value.radiogroup == 'wxzf') {
      var pay_type = 1;
    }
    if (e.detail.value.radiogroup == 'jfzf') {
      var pay_type = 3;
    }
    console.log('pay_type', pay_type)
    if (form_id == '') {
      wx.showToast({
        title: '没有获取到formid',
        icon: 'loading',
        duration: 1000,
      })
    } else {
      this.setData({
        zfz: true,
      })
      app.util.request({
        'url': 'entry/wxapp/DmOrder',
        'cachetime': '0',
        data: { money: money, store_id: sjid, user_id: user_id, pay_type: pay_type },
        success: function (res) {
          that.setData({
            zfz: false,
            showModal: false,
          })
          console.log(res)
          if (res.data != '下单失败') {
            // that.onShow();
            if (e.detail.value.radiogroup == 'yezf') {
              console.log('余额支付流程')
              that.onShow1();
              wx.showModal({
                title: '提示',
                content: '支付成功',
              })
            }
            else if (e.detail.value.radiogroup == 'jfzf') {
              console.log('积分支付流程')
            }
            else {
              console.log('微信支付流程')
              app.util.request({
                'url': 'entry/wxapp/pay',
                'cachetime': '0',
                data: { openid: openid, money: money, order_id: res.data },
                success: function (res) {
                  console.log(res)
                  wx.requestPayment({
                    'timeStamp': res.data.timeStamp,
                    'nonceStr': res.data.nonceStr,
                    'package': res.data.package,
                    'signType': res.data.signType,
                    'paySign': res.data.paySign,
                    'success': function (res) {
                      console.log(res.data)
                      console.log(res)
                      console.log(form_id)
                    },
                    'complete': function (res) {
                      console.log(res);
                      if (res.errMsg == 'requestPayment:fail cancel') {
                        wx.showToast({
                          title: '取消支付',
                          icon: 'loading',
                          duration: 1000
                        })
                      }
                      if (res.errMsg == 'requestPayment:ok') {
                        that.onShow1();
                        wx.showModal({
                          title: '提示',
                          content: '支付成功',
                        })
                      }
                    }
                  })
                },
              })
            }
          }
        },
      })
    }
  },
  onLoad: function (options) {
    app.setNavigationBarColor(this);
    this.setData({
      money: parseFloat(0).toFixed(2)
    })
    var that = this;
    console.log(options)
    var scene = decodeURIComponent(options.scene)
    if (scene != 'undefined') {
      console.log('扫码进入')
      var sjid = scene
    }
    else {
      var sjid = options.storeid
    }
    console.log('scene', scene, sjid)
    app.getUserInfo(function (userinfo) {
      console.log(userinfo)
      that.onShow1();
      that.setData({
        userinfo: userinfo,
      })
    })
    app.util.request({
      'url': 'entry/wxapp/StoreInfo',
      'cachetime': '0',
      data: { store_id: sjid },
      success: function (res) {
        console.log(res)
        var StoreInfo = res.data;
        that.setData({
          storeinfo: res.data,
        })
        // if (StoreInfo.storeset.is_hdfk == '1') {
        //   that.setData({
        //     hdfk: true,
        //   })
        // }
        if (getApp().xtxx.is_yuepay == '1' &&StoreInfo.storeset.is_yuepay == '1') {
          that.setData({
            kqyue: true,
          })
        }
      },
    })
    // 网址信息
    app.util.request({
      'url': 'entry/wxapp/Url',
      'cachetime': '0',
      success: function (res) {
        // console.log(res.data)
        that.setData({
          url: res.data
        })
      },
    })
    app.util.request({
      'url': 'entry/wxapp/system',
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        that.setData({
          ptxx: res.data,
          jf_proportion: res.data.jf_proportion,
        })
        if (res.data.is_yue == '1') {
          that.setData({
            ptkqyue: true
          })
        }
        else {
          that.setData({
            ptkqyue: false
          })
        }
        if (res.data.is_jfpay == '1') {
          that.setData({
            ptkqjf: true
          })
        }
        else {
          that.setData({
            ptkqjf: false
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
  onShow1: function () {
    var that = this;
    var user_id = wx.getStorageSync('users').id
    // 积分
    app.util.request({
      'url': 'entry/wxapp/UserInfo',
      'cachetime': '0',
      data: { user_id: user_id },
      success: function (res) {
        console.log(res)
        that.setData({
          wallet: res.data.wallet,
          total_score: res.data.total_score,
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
    var that = this
    // pageNum = 1;
    that.onLoad()
    wx.stopPullDownRefresh();
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