// zh_vip/pages/my/wdck/gkxq.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    total: 0,
    showModal: false,
    zffs: 1,
    zfz: false,
    zfwz: '微信支付',
    btntype: 'btn_ok1',
  },
  qrmd: function () {
    this.setData({
      showModal: true,
    })
  },
  yczz: function () {
    this.setData({
      showModal: false,
    })
  },
  form_save: function (e) {
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
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this, uid = wx.getStorageSync('UserData').id;
    console.log(options, uid)
    app.util.request({
      'url': 'entry/wxapp/system',
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        that.setData({
          xtxx: res.data,
          url: getApp().imgurl,
          jf_proportion: res.data.jf_proportion,
        })
        wx.setNavigationBarColor({
          frontColor: '#ffffff',
          backgroundColor: res.data.link_color,
        })
        wx.setNavigationBarTitle({
          title: res.data.link_name,
        })
        if (res.data.is_yue == '1') {
          that.setData({
            kqyue: true
          })
        }
        else {
          that.setData({
            kqyue: false
          })
        }
        if (res.data.is_jf == '1' && res.data.is_jfpay == '1') {
          that.setData({
            kqjf: true
          })
        }
        else {
          that.setData({
            kqjf: false
          })
        }
      },
    })
    app.util.request({
      'url': 'entry/wxapp/NumCardInfo',
      'cachetime': '0',
      data: { card_id: options.xqid },
      success: function (res) {
        console.log(res.data)
        that.setData({
          info: res.data,
          total: res.data.money,
        })
      },
    })
    //UserInfo
    app.util.request({
      'url': 'entry/wxapp/UserInfo',
      'cachetime': '0',
      data: { user_id: uid },
      success: function (res) {
        console.log('用户信息', res.data)
        if (res.data.discount != null) {
          var discount = res.data.discount
        }
        else {
          var discount = 100
        }
        that.setData({
          userInfo: res.data,
          discount: discount,
          integral: res.data.integral,
        })
      }
    });
  },
  radioChange1: function (e) {
    console.log('radio1发生change事件，携带value值为：', e.detail.value)
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
  formSubmit: function (e) {
    var that = this;
    console.log('form发生了submit事件，携带数据为：', e.detail.formId)
    var openid = getApp().getOpenId, money = this.data.info.money, cardid = this.data.info.id;
    var uid = wx.getStorageSync('UserData').id;
    console.log(openid, money, uid, cardid)
    if (e.detail.value.radiogroup == 'yezf') {
      var ye = Number(this.data.userInfo.wallet), total = Number(this.data.total);
      console.log(ye, total)
      if (ye < total) {
        wx.showToast({
          title: '余额不足支付',
          icon: 'loading',
        })
        return
      }
    }
    var dyjf = 0;
    if (e.detail.value.radiogroup == 'jfzf') {
      var jf = Number(this.data.integral) / Number(this.data.jf_proportion), sfmoney = Number(this.data.total);
      dyjf = (sfmoney * Number(this.data.jf_proportion)).toFixed(2);
      console.log(jf, sfmoney, dyjf)
      if (jf < sfmoney) {
        wx.showToast({
          title: '积分不足支付',
          icon: 'loading',
        })
        return
      }
    }
    if (e.detail.value.radiogroup == 'wxzf'&&money == 0) {
      wx.showModal({
        title: '提示',
        content: '0元买单请选择其他方式支付',
      })
      return
    }
    if (e.detail.value.radiogroup == 'yezf') {
      var is_yue = 2;
    }
    if (e.detail.value.radiogroup == 'wxzf') {
      var is_yue = 1;
    }
    if (e.detail.value.radiogroup == 'jfzf') {
      var is_yue = 3;
    }
    console.log('是否余额', is_yue,dyjf)
    if (e.detail.formId == '') {
      wx: wx.showToast({
        title: '没有获取到formid',
        icon: 'loading',
        duration: 1000,
      })
    } else {
      this.setData({
        zfz: true,
      })
      //AddOrder
      app.util.request({
        'url': 'entry/wxapp/PayNumCard',
        'cachetime': '0',
        data: { user_id: uid, money: money, form_id: e.detail.formId, card_id: cardid, pay_type: is_yue, jf: dyjf },
        success: function (res) {
          console.log(res)
          that.setData({
            zfz: false,
            showModal: false,
          })
          if (res.data != '下单失败') {
            if (e.detail.value.radiogroup == 'yezf') {
              console.log('余额支付流程')
              wx.showToast({
                title: '购买成功',
              })
              setTimeout(function () {
                wx.redirectTo({
                  url: 'wdck',
                })
              }, 1000)
            }
            else if (e.detail.value.radiogroup == 'jfzf') {
              console.log('积分支付流程')
              wx.showToast({
                title: '购买成功',
              })
              setTimeout(function () {
                wx.redirectTo({
                  url: 'wdck',
                })
              }, 1000)
            }
            else {
              console.log('微信支付流程')
                app.util.request({
                  'url': 'entry/wxapp/pay5',
                  'cachetime': '0',
                  data: { openid: openid, money: money, order_id: res.data },
                  success: function (res) {
                    console.log(res)
                    // 支付
                    wx.requestPayment({
                      'timeStamp': res.data.timeStamp,
                      'nonceStr': res.data.nonceStr,
                      'package': res.data.package,
                      'signType': res.data.signType,
                      'paySign': res.data.paySign,
                      'success': function (res) {
                        console.log(res)
                        wx.showToast({
                          title: '购买成功',
                          duration: 1000
                        })
                        setTimeout(function () {
                          wx.redirectTo({
                            url: 'wdck',
                          })
                        }, 1000)
                      },
                      'complete': function (res) {
                        if (res.errMsg == 'requestPayment:fail cancel') {
                          wx.showToast({
                            title: '取消支付',
                            icon: 'loading',
                            duration: 1000
                          })
                        }
                      }
                    })
                  },
                })
            }
          }
          else {
            wx.showToast({
              title: '下单失败',
              icon: 'loading',
            })
          }
        }
      })
    }
  },
  // formSubmit: function (e) {
  //   console.log('form发生了submit事件，携带数据为：', e.detail.formId)
  //   var openid = getApp().getOpenId, money = this.data.info.money, cardid = this.data.info.id;
  //   var uid = wx.getStorageSync('UserData').id;
  //   console.log(openid, money, uid, cardid)
  //   wx.showLoading({
  //     title: "正在加载",
  //     mask: !0
  //   }),
  //     //AddOrder
  //     app.util.request({
  //       'url': 'entry/wxapp/PayNumCard',
  //       'cachetime': '0',
  //       data: { user_id: uid, money: money, form_id: e.detail.formId, card_id: cardid },
  //       success: function (res) {
  //         console.log(res)
  //         if (res.data != '下单失败') {
  //           app.util.request({
  //             'url': 'entry/wxapp/pay5',
  //             'cachetime': '0',
  //             data: { openid: openid, money: money, order_id: res.data },
  //             success: function (res) {
  //               console.log(res)
  //               // 支付
  //               wx.requestPayment({
  //                 'timeStamp': res.data.timeStamp,
  //                 'nonceStr': res.data.nonceStr,
  //                 'package': res.data.package,
  //                 'signType': res.data.signType,
  //                 'paySign': res.data.paySign,
  //                 'success': function (res) {
  //                   console.log(res)
  //                   wx.showToast({
  //                     title: '购买成功',
  //                     duration: 1000
  //                   })
  //                   setTimeout(function () {
  //                     wx.redirectTo({
  //                       url: 'wdck',
  //                     })
  //                   }, 1000)
  //                 },
  //                 'complete': function (res) {
  //                   if (res.errMsg == 'requestPayment:fail cancel') {
  //                     wx.showToast({
  //                       title: '取消支付',
  //                       icon: 'loading',
  //                       duration: 1000
  //                     })
  //                   }
  //                 }
  //               })
  //             },
  //           })
  //         }
  //       }
  //     })
  // },
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