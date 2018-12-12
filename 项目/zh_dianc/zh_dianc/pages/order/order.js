// pages/order/order.js
var app = getApp()
var util = require('../../utils/util.js')
var form_id;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    form_id: '',
    index: 0,
    inde: 0,
    array: [],
    showModal: false,
    zftype: true,
    zfz: false,
    chzf: false,
    zffs: 1,
    zfwz: '微信支付',
    btntype: 'btn_ok1',
    beizhu:'',
  },
  //订单备注
  ddbz: function (e) {
    console.log(e.detail.value)
    this.setData({
      beizhu: e.detail.value
    })
  },
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    if (e.detail.value == 'wxzf') {
      this.setData({
        zftype: true,
        chzf: false,
        zffs: 1,
        zfwz: '微信支付',
        btntype: 'btn_ok1',
      })
    }
    if (e.detail.value == 'yezf') {
      this.setData({
        zftype: false,
        chzf: false,
        zffs: 2,
        zfwz: '余额支付',
        btntype: 'btn_ok2',
      })
    }
    if (e.detail.value == 'jfzf') {
      this.setData({
        chzf: false,
        zffs: 3,
        zfwz: '积分支付',
        btntype: 'btn_ok3',
      })
    }
    if (e.detail.value == 'chzf') {
      this.setData({
        chzf: true,
        zffs: 4,
        zfwz: '餐后支付',
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
  qdzf: function () {
    console.log('确定支付')
  },
  jsmj: function (num, arr) {
    var index;
    for (let i = 0; i < arr.length; i++) {
      if (Number(num) >= Number(arr[i].full)) {
        index = i;
        break;
      }
    }
    return index
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取扫码传的桌位id
    // var tableid=wx.getStorageSync('tableid')
    var tableid = options.tableid
    console.log(tableid)
    var that = this
    // 获取桌子信息
    app.util.request({
      'url': 'entry/wxapp/Zhuohao',
      'cachetime': '0',
      data: { id: tableid },
      success: function (res) {
        console.log(res)
        that.setData({
          tabletypename: res.data.type_name,
          tablename: res.data.table_name,
          table_id: tableid
        })
      },
    })
    // 获取桌子类型
    app.util.request({
      'url': 'entry/wxapp/TableType',
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        that.setData({
          array: res.data
        })
      },
    })
    app.util.request({
      'url': 'entry/wxapp/system',
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        that.setData({
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
    if (options.preferential == null) {
      var pre = 0
    } else {
      var pre = Number(options.preferential)
    }
    console.log(pre)
    var time = util.formatTime(new Date());
    // 获取从上一个页面保存的数据
    var order = wx.getStorageSync('order')
    var store = wx.getStorageSync('store')
    console.log(order)
    console.log(store)
    if (store.is_yue == '1') {
      that.setData({
        sjkqyue: true
      })
    }
    else {
      that.setData({
        sjkqyue: false
      })
    }
    if (store.is_jfpay == '1') {
      that.setData({
        sjkqjf: true
      })
    }
    else {
      that.setData({
        sjkqjf: false
      })
    }
    var totalPrice = 0
    for (var i = 0; i < order.length; i++) {
      totalPrice += Number(order[i].money) * order[i].num;
    }
    //mj
    var zfmoney;
    app.util.request({
      'url': 'entry/wxapp/Reduction',
      'cachetime': '0',
      data: { id: store.id },
      success: function (res1) {
        console.log(res1)
        var tnmj = [];
        for (let i = 0; i < res1.data.length; i++) {
          if (res1.data[i].type == '2' || res1.data[i].type == '3') {
            tnmj.push(res1.data[i])
          }
        }
        console.log(tnmj)
        // 满减的优惠金额
        var cut = 0;
        if(tnmj.length==0){
         zfmoney = Number(totalPrice) - pre-cut;
          console.log(cut)
        }
        else{
          if (Number(totalPrice) >= Number(tnmj[tnmj.length - 1].full)) {
            console.log(that.jsmj(totalPrice, tnmj))
        var conindex = that.jsmj(totalPrice, tnmj)
            cut = Number(tnmj[conindex].reduction)
            console.log(cut)
            zfmoney = Number(totalPrice) - pre - cut;
          }
          else{
            zfmoney = Number(totalPrice) - pre - cut;
            console.log(cut)
          }
        }
        if (zfmoney <= 0) {
          zfmoney = 0.01;
        }
        that.setData({
          zfmoney: zfmoney.toFixed(2),
          cut:cut,
        })
        console.log(zfmoney)
      }
    })
    that.setData({
      order: order,
      store: store,
      color: store.color,
      types: options.types,
      totalPrice: totalPrice,
      time: time,
      pre: pre,
      coupons_id: options.coupons_id,
      vouchers_id: options.vouchers_id
    })
  },
  coupon: function (e) {
    var that = this
    console.log(that.data)
    wx: wx.navigateTo({
      url: '../coupons/mine_coupons?totalPrice=' + that.data.totalPrice + '&state=' + 2 + '&tableid=' + that.data.table_id,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })

  },
  formSubmit: function (e) {
    var beizhu=this.data.beizhu;
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    if (e.detail.value.radiogroup == 'wxzf') {
      var is_yue = 2
    }
    if (e.detail.value.radiogroup == 'yezf') {
      var is_yue = 1
    }
    if (e.detail.value.radiogroup == 'chzf') {
      var is_yue = 0
    }
    if (e.detail.value.radiogroup == 'jfzf') {
      var is_yue = 3
    }
    var that = this
    console.log(that.data)
    var store_id = that.data.store.id
    console.log(store_id)
    var order = that.data.order
    // 获取用户的openid
    var openid = wx.getStorageSync('openid')
    // 获取表单form_id
    var form_id = e.detail.formId;
    console.log(form_id)
    // user_id
    var user_id = wx.getStorageSync('users').id
    // 判断用户是否选择优惠券或者代金券
    if (that.data.coupons_id == null) {
      console.log('用户没有选择优惠券')
      var coupons_id = ''
    } else {
      console.log('用户选择了优惠券')
      // 选择的优惠券id
      var coupons_id = that.data.coupons_id
    }
    if (that.data.vouchers_id == null) {
      console.log('用户没有选择代金券')
      var voucher_id = ''
    } else {
      console.log('用户选择了代金券')
      // 选择的代金券id
      var voucher_id = that.data.vouchers_id
    }
    console.log('代金券id' + voucher_id)
    console.log('优惠券id' + coupons_id)
    //  
    var pre = that.data.pre + Number(that.data.cut)
    // 订单金额
    var totalPrice = Number(that.data.totalPrice)
    // 总金额
    var money = Number(that.data.zfmoney)
    console.log(money)
    if (e.detail.value.radiogroup == 'yezf') {
      var ye = Number(this.data.wallet);
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
      var jf = Number(this.data.total_score) / Number(this.data.jf_proportion);
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
    // var moneys = money
    // 状态
    var type = 2
    console.log(type)
    // 桌号
    var table_id = that.data.table_id
    console.log('桌号' + table_id)
    // 桌子类型
    var tabletype_id = that.data.tabletype_id
    console.log('桌子类型' + tabletype_id)
    var list = []
    order.map(function (item) {
      if (item.num > 0) {
        var obj = {};
        obj.name = item.name;
        obj.img = item.icon;
        obj.num = item.num;
        obj.money = item.money;
        obj.dishes_id = item.id;
        list.push(obj);
      }
    })
     console.log(list)
    // 店内点餐提交订单
    // 提交订单接口
    if (money <= 0) {
      wx: wx.showToast({
        title: '金额不能为0',
        icon: '',
        image: '',
        duration: 2000,
        mask: true,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    } else {
      this.setData({
        zfz: true,
      })
      app.util.request({
        'url': 'entry/wxapp/AddOrder',
        'cachetime': '0',
        data: { type: type, money: money, user_id: user_id, table_id: table_id, seller_id: store_id, coupons_id: coupons_id, voucher_id: voucher_id, preferential: pre, sz: list, is_yue: is_yue, note: beizhu, form_id: form_id, jf: dyjf,},
        success: function (res) {
          var order_id = res.data
          console.log('本次的订单id为' + order_id)
          if (order_id != "下单失败") {
            that.setData({
              zfz: false,
              showModal: false,
            })
            if (e.detail.value.radiogroup == 'yezf') {
              console.log('用户选择余额支付')
              // 下单改变订单状态
              app.util.request({
                'url': 'entry/wxapp/PayOrder',
                'cachetime': '0',
                data: { user_id: user_id, order_id: order_id, coupons_id: coupons_id, voucher_id: voucher_id },
                success: function (res) {
                  console.log(res)
                  wx.showModal({
                    title: '提示',
                    content: '支付成功',
                    showCancel: false,
                  })
                  setTimeout(function () {
                    wx.switchTab({
                      url: '../list/list'
                    })
                  }, 1000)
                  // 打印机
                  app.util.request({
                    'url': 'entry/wxapp/DnPrint',
                    'cachetime': '0',
                    data: { order_id: order_id, pay_type: '余额支付' },
                    success: function (res) {
                      console.log(res)
                    },
                  })
                  app.util.request({
                    'url': 'entry/wxapp/DnPrint2',
                    'cachetime': '0',
                    data: { order_id: order_id, pay_type: '余额支付' },
                    success: function (res) {
                      console.log(res)
                    },
                  })
                  // 支付完成发送短信给商家
                  app.util.request({
                    'url': 'entry/wxapp/SmsSet',
                    'cachetime': '0',
                    data: { store_id: store_id },
                    success: function (res) {
                      console.log(res)
                      if (res.data.is_dnsms == '1') {
                        // 支付完成发送短信给商家
                        app.util.request({
                          'url': 'entry/wxapp/sms',
                          'cachetime': '0',
                          data: { store_id: store_id },
                          success: function (res) {
                            console.log(res)

                          },
                        })
                      }
                    },
                  })
                },
              })
            }
            if (e.detail.value.radiogroup == 'jfzf') {
              console.log('用户选择积分支付')
              // 下单改变订单状态
              app.util.request({
                'url': 'entry/wxapp/PayOrder',
                'cachetime': '0',
                data: { user_id: user_id, order_id: order_id, coupons_id: coupons_id, voucher_id: voucher_id },
                success: function (res) {
                  console.log(res)
                  wx.showModal({
                    title: '提示',
                    content: '支付成功',
                    showCancel: false,
                  })
                  setTimeout(function () {
                    wx.switchTab({
                      url: '../list/list'
                    })
                  }, 1000)
                  // 打印机
                  app.util.request({
                    'url': 'entry/wxapp/DnPrint',
                    'cachetime': '0',
                    data: { order_id: order_id, pay_type: '积分支付' },
                    success: function (res) {
                      console.log(res)
                    },
                  })
                  app.util.request({
                    'url': 'entry/wxapp/DnPrint2',
                    'cachetime': '0',
                    data: { order_id: order_id, pay_type: '积分支付' },
                    success: function (res) {
                      console.log(res)
                    },
                  })
                  // 支付完成发送短信给商家
                  app.util.request({
                    'url': 'entry/wxapp/SmsSet',
                    'cachetime': '0',
                    data: { store_id: store_id },
                    success: function (res) {
                      console.log(res)
                      if (res.data.is_dnsms == '1') {
                        // 支付完成发送短信给商家
                        app.util.request({
                          'url': 'entry/wxapp/sms',
                          'cachetime': '0',
                          data: { store_id: store_id },
                          success: function (res) {
                            console.log(res)

                          },
                        })
                      }
                    },
                  })
                },
              })
            }
            if (e.detail.value.radiogroup == 'wxzf') {
              console.log('用户选择微信支付')
              // 支付接口
              app.util.request({
                'url': 'entry/wxapp/pay',
                'cachetime': '0',
                data: { openid: openid, order_id: order_id, money: money },
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
                    }, 
                    'complete': function (res) {
                      if (res.errMsg == 'requestPayment:fail cancel') {
                        wx.showToast({
                          title: '取消支付',
                        })
                        setTimeout(function () {
                          wx.switchTab({
                            url: '../list/list'
                          })
                        }, 1000)
                      }
                      if (res.errMsg == 'requestPayment:ok') {
                        wx.showModal({
                          title: '提示',
                          content: '支付成功',
                          showCancel: false,
                        })
                        setTimeout(function () {
                          wx.switchTab({
                            url: '../list/list'
                          })
                        }, 1000)
                      }
                    }
                  })
                },
              })
            }
            if (e.detail.value.radiogroup == 'chzf') {
              console.log('用户选择餐后支付')
              wx.showModal({
                title: '提示',
                content: '下单成功',
                showCancel: false,
              })
              // 打印机
              app.util.request({
                'url': 'entry/wxapp/DnPrint',
                'cachetime': '0',
                data: { order_id: order_id, pay_type: '餐后支付' },
                success: function (res) {
                  console.log(res)
                },
              })
              app.util.request({
                'url': 'entry/wxapp/DnPrint2',
                'cachetime': '0',
                data: { order_id: order_id, pay_type: '餐后支付' },
                success: function (res) {
                  console.log(res)
                },
              })
              // 支付完成发送短信给商家
              app.util.request({
                'url': 'entry/wxapp/SmsSet',
                'cachetime': '0',
                data: { store_id: store_id },
                success: function (res) {
                  console.log(res)
                  if (res.data.is_dnsms == '1') {
                    // 支付完成发送短信给商家
                    app.util.request({
                      'url': 'entry/wxapp/sms',
                      'cachetime': '0',
                      data: { store_id: store_id },
                      success: function (res) {
                        console.log(res)

                      },
                    })
                  }
                },
              })
              wx.switchTab({
                url: '../list/list'
              })
            }
          }
        },
      })
    }

  },
  bindPickerChange: function (e) {
    var that = this
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var index = e.detail.value
    that.setData({
      index: index,
      inde: 0
    })
    console.log(that.data)
    // 获取桌子类型
    app.util.request({
      'url': 'entry/wxapp/TableType',
      'cachetime': '0',
      success: function (res) {
        var tabletype_id = res.data[index].id
        app.util.request({
          'url': 'entry/wxapp/Table',
          'cachetime': '0',
          data: { type_id: tabletype_id },
          success: function (res) {
            console.log(res)
            that.setData({
              not_use: res.data,
              tabletype_id: tabletype_id,
              table_id: res.data[that.data.inde].id
            })
          },
        })
      },
    })

  },
  bindPickerChange_one: function (e) {
    var that = this
    console.log(that.data)
    if (that.data.index != 0) {
      var inde = 0
    }
    var tabletype_id = that.data.tabletype_id
    app.util.request({
      'url': 'entry/wxapp/Table',
      'cachetime': '0',
      data: { type_id: tabletype_id },
      success: function (res) {
        console.log(res)
        that.setData({
          not_use: res.data,
          table_id: res.data[that.data.inde].id
        })
      },
    })

    console.log('picker发送选择改变，携带值为', e.detail.value)
    that.setData({
      inde: e.detail.value,
      value: e.detail.value
    })
    // that.setData({
    //   table_id: that.data.not_use[that.data.inde].id
    // })
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
    app.util.request({
      'url': 'entry/wxapp/Store',
      'cachetime': '0',
      data: { id: getApp().sjid },
      success: function (res) {
        console.log(res)
        wx.setNavigationBarColor({
          frontColor: '#ffffff',
          backgroundColor: res.data.color,
        })
      },
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
})