// zh_cjdianc/pages/hyk/kthy.js
var app = getApp();
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fwxy: true,
    radioItems: [],
    showModal: false,
    zffs: 1,
    zfz: false,
    zfwz: '微信支付',
    btntype: 'btn_ok1',
    isbd:false,
    bdsjhtext: '验证微信手机号',
  },
  getPhoneNumber: function (e) {
    var that = this;
    console.log(e)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
    if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '您未授权获取您的手机号',
        success: function (res) { }
      })
    }
    if (e.detail.errMsg == 'getPhoneNumber:ok') {
      app.util.request({
        'url': 'entry/wxapp/Jiemi',
        'cachetime': '0',
        data: { sessionKey: getApp().getSK, data: e.detail.encryptedData, iv: e.detail.iv },
        success: function (res) {
          console.log('解密后的数据', res)
          if (res.data.phoneNumber != null) {
            that.setData({
              sjh: res.data.phoneNumber,
              isbd: true,
              bdsjhtext: '验证成功'
            })
          }
        }
      });
    }
  },
  yczz: function () {
    this.setData({
      showModal: false,
    })
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
    if (e.detail.value == 'hdfk') {
      this.setData({
        zffs: 4,
        zfwz: '货到付款',
        btntype: 'btn_ok4',
      })
    }
  },
  tjddformSubmit: function (e) {
    console.log(e.detail,'formid', e.detail.formId, this.data.radioItems)
    var user_id = wx.getStorageSync('users').id;
    // app.util.request({
    //   'url': 'entry/wxapp/AddFormId',
    //   'cachetime': '0',
    //   data: { user_id: user_id, form_id: e.detail.formId },
    //   success: function (res) {
    //     console.log(res.data)
    //   },
    // })
    if (this.data.radioItems.length==0){
      wx.showModal({
        title: '提示',
        content: '对不起！暂无添加优惠套餐，无法购买',
      })
      return
    }
    if (e.detail.value.lxr == '' || e.detail.value.tel == '' || e.detail.value.tel.length!='11'){
      wx.showModal({
        title: '提示',
        content: '请完善会员信息或手机号不正确',
      })
      return
    }
    this.setData({
      showModal: true,
      lxr: e.detail.value.lxr,
      tel: e.detail.value.tel,
    })
  },
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);
    var that = this;
    var radioItems = this.data.radioItems;
    for (var i = 0, len = radioItems.length; i < len; ++i) {
      radioItems[i].checked = radioItems[i].id == e.detail.value;
      if (radioItems[i].checked) {
        that.setData({
          zfmoney: radioItems[i].money,
          month: radioItems[i].days,
        })
      }
    }

    this.setData({
      radioItems: radioItems
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.setNavigationBarColor(this);
    var nowtime = util.formatTime(new Date)
    var date = util.formatTime(new Date).substring(0, 10).replace(/\//g, "-");
    var time = util.formatTime(new Date).substring(11, 16);
    console.log(nowtime, date.toString(), time.toString())
    var that = this, user_id = wx.getStorageSync('users').id;
    this.setData({
      xtxx: getApp().xtxx
    })
    if (getApp().xtxx.is_yuepay == '1'){
      this.setData({
        kqyue:true
      })
    }
    //取平台信息
    app.util.request({
      'url': 'entry/wxapp/GetHyqx',
      'cachetime': '0',
      success: function (res) {
        console.log(res.data)
        if (res.data.length > 0) {
          res.data[0].checked = true;
          that.setData({
            radioItems: res.data,
            zfmoney: res.data[0].money,
            month: res.data[0].days
          })
        }
      }
    });
    // UserInfo
    app.util.request({
      'url': 'entry/wxapp/UserInfo',
      'cachetime': '0',
      data: { user_id: user_id },
      success: function (res) {
        console.log(res)
        if (res.data.dq_time == '' || res.data.dq_time<date.toString()){
          res.data.ishy = 2
        }
        else{
          that.setData({
            kttext: '立即续费'
          })
        }
        that.setData({
          userInfo: res.data,
          lxr: res.data.user_name,
          tel: res.data.user_tel
        })
      }
    })
  },
  formSubmit: function (e) {
    var that = this, form_id = e.detail.formId;
    var openid = this.data.userInfo.openid;
    var user_id = this.data.userInfo.id;
    var money = Number(this.data.zfmoney), month = this.data.month,lxr=this.data.lxr,tel=this.data.tel
    console.log(openid, user_id, money, form_id,month,lxr,tel)
    if (e.detail.value.radiogroup == 'yezf') {
      var ye = Number(this.data.userInfo.wallet), total = money;
      console.log(ye, total)
      if (ye < total) {
        wx.showToast({
          title: '余额不足支付',
          icon: 'loading',
        })
        return
      }
    }
    // var dyjf = 0;
    // if (e.detail.value.radiogroup == 'jfzf') {
    //   var jf = Number(this.data.integral) / Number(this.data.jf_proportion), sfmoney = Number(this.data.totalprice);
    //   dyjf = (sfmoney * Number(this.data.jf_proportion)).toFixed(2);
    //   console.log(jf, sfmoney, dyjf)
    //   if (jf < sfmoney) {
    //     wx.showToast({
    //       title: '积分不足支付',
    //       icon: 'loading',
    //     })
    //     return
    //   }
    // }
    if (e.detail.value.radiogroup == 'yezf') {
      var pay_type = 2;
    }
    if (e.detail.value.radiogroup == 'wxzf') {
      var pay_type = 1;
    }
    if (e.detail.value.radiogroup == 'jfzf') {
      var pay_type = 3;
    }
    if (e.detail.value.radiogroup == 'hdfk') {
      var pay_type = 4;
    }
    console.log('支付方式', pay_type)
    // return
    if (form_id == '') {
      wx: wx.showToast({
        title: '没有获取到formid',
        icon: 'loading',
        duration: 1000,
      })
    } else {
      this.setData({
        zfz: true,
      })
      //下单
      app.util.request({
        'url': 'entry/wxapp/AddHyOrder',
        'cachetime': '0',
        data: { user_id: user_id, money: money, month: month, pay_type: pay_type, user_name:lxr, user_tel:tel },
        success: function (res) {
          console.log(res)
          var order_id = res.data;
          that.setData({
            zfz: false,
            showModal: false,
          })
          if (e.detail.value.radiogroup == 'yezf') {
            console.log('余额流程')
            if (order_id != '下单失败') {
              wx.showModal({
                title: '提示',
                content: '购买成功',
              })
              app.globalData.userInfo = null
              setTimeout(function () {
                wx.navigateBack({
                  
                })
              }, 1000)
            }
            else {
              wx.showToast({
                title: '支付失败',
                icon: 'loading',
              })
            }
          }
          if (e.detail.value.radiogroup == 'hdfk') {
            console.log('货到付款流程')
            if (order_id != '下单失败') {
              that.setData({
                mdoaltoggle: false,
              })
              setTimeout(function () {
                wx.reLaunch({
                  url: '../wddd/order',
                })
              }, 1000)
            }
            else {
              wx.showToast({
                title: '支付失败',
                icon: 'loading',
              })
            }
          }
          if (e.detail.value.radiogroup == 'wxzf') {
            console.log('微信支付流程')
            if (money == 0) {
              wx.showModal({
                title: '提示',
                content: '0元买单请选择其他方式支付',
              })
              that.setData({
                zfz: false,
              })
            }
            else {
              // 下单
              if (order_id != '下单失败') {
                app.util.request({
                  'url': 'entry/wxapp/pay',
                  'cachetime': '0',
                  data: { openid: openid, money: money, order_id: order_id, type: 3 },
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
                            content: '购买成功',
                          })
                          app.globalData.userInfo = null
                          setTimeout(function () {
                            wx.navigateBack({

                            })
                          }, 1000)
                        }
                      }
                    })
                  },
                })
              }
            }
          }
        },
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

  }
})