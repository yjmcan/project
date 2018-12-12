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
    this.setData({
      showModal: true,
    })
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
    var openid = wx.getStorageSync('openid')
    var user_id = wx.getStorageSync('users').id;
    var money = this.data.money
    var sjname = this.data.store.name, sjid = this.data.store.id
    console.log(openid, money, sjname, sjid)
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
      var is_yue = 1;
    }
    if (e.detail.value.radiogroup == 'wxzf') {
      var is_yue = 2;
    }
    if (e.detail.value.radiogroup == 'jfzf') {
      var is_yue = 3;
    }
    console.log('是否余额', is_yue)
    if (form_id == '') {
      wx: wx.showToast({
        title: '网络不好',
        icon: 'loading',
        duration: 500,
        mask: true,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    } else {
      this.setData({
        zfz: true,
      })
      if (e.detail.value.radiogroup == 'yezf') {
        console.log('余额支付流程')
        app.util.request({
          'url': 'entry/wxapp/DmOrder',
          'cachetime': '0',
          data: { money: money, store_id: sjid, user_id: user_id, is_yue: is_yue, form_id: form_id },
          success: function (res) {
            that.setData({
              zfz: false,
              showModal: false,
            })
            console.log(res)
            var order_id=res.data;
            if (res.data != '下单失败') {
              // 下单
              app.util.request({
                'url': 'entry/wxapp/dmpay',
                'cachetime': '0',
                data: { order_id: order_id },
                success: function (res) {
                  console.log(res)
                    that.onShow();
                    // 打印机
                    app.util.request({
                      'url': 'entry/wxapp/dmPrint',
                      'cachetime': '0',
                      data: { order_id: order_id },
                      success: function (res) {
                        console.log(res)
                      },
                    })
                    app.util.request({
                      'url': 'entry/wxapp/dmPrint2',
                      'cachetime': '0',
                      data: { order_id: order_id },
                      success: function (res) {
                        console.log(res)
                      },
                    })
                    // 下单发送模板消息
                    app.util.request({
                      'url': 'entry/wxapp/Message2',
                      'cachetime': '0',
                      data: { openid: openid, form_id: form_id, name: sjname, money: money + '元' },
                      success: function (res) {
                        console.log(res)
                        wx.showModal({
                          title: '提示',
                          content: '支付成功',
                        })
                        // setTimeout(function () {
                        //   wx.navigateBack({
                        //     delta: 1
                        //   })
                        // }, 1000)
                      },
                    })
                },
              })
            }
          }
        })
      }
      else if (e.detail.value.radiogroup == 'jfzf') {
        console.log('积分支付流程')
        app.util.request({
          'url': 'entry/wxapp/DmOrder',
          'cachetime': '0',
          data: { money: money, store_id: sjid, user_id: user_id, is_yue: is_yue, form_id: form_id },
          success: function (res) {
            that.setData({
              zfz: false,
              showModal: false,
            })
            console.log(res)
            var order_id = res.data;
            if (res.data != '下单失败') {
              // 下单
              app.util.request({
                'url': 'entry/wxapp/dmpay',
                'cachetime': '0',
                data: { order_id: order_id,jf:dyjf },
                success: function (res) {
                  console.log(res)
                  that.onShow();
                  // 打印机
                  app.util.request({
                    'url': 'entry/wxapp/dmPrint',
                    'cachetime': '0',
                    data: { order_id: order_id },
                    success: function (res) {
                      console.log(res)
                    },
                  })
                  app.util.request({
                    'url': 'entry/wxapp/dmPrint2',
                    'cachetime': '0',
                    data: { order_id: order_id },
                    success: function (res) {
                      console.log(res)
                    },
                  })
                  // 下单发送模板消息
                  app.util.request({
                    'url': 'entry/wxapp/Message2',
                    'cachetime': '0',
                    data: { openid: openid, form_id: form_id, name: sjname, money: money + '元' },
                    success: function (res) {
                      console.log(res)
                      wx.showModal({
                        title: '提示',
                        content: '支付成功',
                      })
                      // setTimeout(function () {
                      //   wx.navigateBack({
                      //     delta: 1
                      //   })
                      // }, 1000)
                    },
                  })
                },
              })
            }
          }
        })
      }
      else {
        console.log('微信支付流程')
        app.util.request({
          'url': 'entry/wxapp/DmOrder',
          'cachetime': '0',
          data: { money: money, store_id: sjid, user_id: user_id, is_yue: is_yue, form_id: form_id },
          success: function (res) {
            that.setData({
              zfz: false,
              showModal: false,
            })
            console.log(res)
            if (res.data != '下单失败') {
              that.onShow();
              app.util.request({
                'url': 'entry/wxapp/pay3',
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
          },
        })
      }
    }
  },
  onLoad: function (options) {
    var nbcolor = wx.getStorageSync('nbcolor')
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: nbcolor,
    })
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
      var sjid = getApp().sjid
    }
    console.log('scene', scene, sjid)
    app.util.request({
      'url': 'entry/wxapp/Store',
      'cachetime': '0',
      data: { id: sjid },
      success: function (res) {
        console.log(res)
        that.setData({
          store: res.data,
          color: res.data.color
        })
        if (res.data.is_yue == '1') {
          that.setData({
            sjkqyue: true
          })
        }
        else {
          that.setData({
            sjkqyue: false
          })
        }
        if (res.data.is_jfpay == '1') {
          that.setData({
            sjkqjf: true
          })
        }
        else {
          that.setData({
            sjkqjf: false
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
  onShow: function () {
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