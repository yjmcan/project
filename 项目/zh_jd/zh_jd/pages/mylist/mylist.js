//index.js
//获取应用实例
var sliderWidth = 60; // 需要设置slider的宽度，用于计算中间位置
var app = getApp()
var util = require('../../utils/util.js');
Page({
  data: {
    modalHidden: true,
    tabs: ["全部","未付款", "待入住", "已完成", "已取消",],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    userInfo: {},
    hidden: true,
    modalHidden: true,
    quxiaodingdan: false,
    shanchu: true,
    shanHidden: true

  },
  onLoad: function () {
    var that = this;
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: wx.getStorageSync('platform_color'),
      animation: {
        duration: 0,
        timingFunc: 'easeIn'
      }
    })
    // 获取当前系统时间
    function getNowFormatDate() {
      var date = new Date();
      var seperator1 = "-";
      var seperator2 = ":";
      var month = date.getMonth() + 1;
      var strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
        + " " + date.getHours() + seperator2 + date.getMinutes()
        + seperator2 + date.getSeconds();
      return currentdate;
    }
    var time = getNowFormatDate().slice(0, 10)
    that.setData({
      time: time
    })
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
    // 用户的id
    var uese_id = wx.getStorageSync('users').id
    // 获取订单列表
    // app.util.request({
    //   'url': 'entry/wxapp/orderlist',
    //   'cachetime': '0',
    //   data: { user_id: uese_id },
    //   success: function (res) {
    //     console.log(res)
    //     that.setData({
    //       slide: res.data
    //     })
    //   },
    // })

    that.reload()
  },
  // 下拉刷新
  onPullDownRefresh() {
    var that = this
    // pageNum = 1;
    that.onLoad()
    wx.stopPullDownRefresh();
  },
  reload: function () {
    var that = this;
    var time = that.data.time
    function getel(startname) {
      return startname = startname.slice(0, 10)
    }
    var user_id = wx.getStorageSync('users').id
    // 获取订单列表
    app.util.request({
      'url': 'entry/wxapp/orderlist',
      'cachetime': '0',
      data: { user_id: user_id },
      success: function (res) {
        if (res.data == '') {
          that.setData({
            order: false
          })
        } else {
          that.setData({
            orders: true,
            order: res.data
          })
        }
        var order = res.data
        console.log(order)
       
        var payment = [], check = [], cancel = [], Already = [], cancels = [], apply = [], refund=[]
        // 待付款
        for (var i = 0; i < order.length; i++) {
          order[i].arrival_time = getel(order[i].arrival_time)
          order[i].departure_time = getel(order[i].departure_time)
          order[i].zfyj_cost = Number(order[i].zfyj_cost)
          // 未付款
          if (order[i].status == '0') {
            payment.push(res.data[i])
            that.setData({
              payment: payment, check: check, cancel: cancel, Already: Already, order: order, apply: apply, refund: refund
            })

          }
          // 待退款  已退款
          if (order[i].status == '5' || order[i].status == '6' || order[i].status == '7') {
            refund.push(res.data[i])
            that.setData({
              payment: payment, check: check, cancel: cancel, Already: Already, order: order, apply: apply, refund: refund
            })

          }
          // 已付款
          if (order[i].status == '1') {
            if (time < order[i].arrival_time) {
              var order_id = order[i].id
              check.push(order[i])
            } else {
              check.push(order[i])
              that.setData({
                payment: payment, check: check, cancel: cancel, Already: Already, cancels: cancels, apply: apply, refund: refund
              })
            }
          }
          // 已取消订单
          if (order[i].status == '2') {
            cancels.push(order[i])
            that.setData({
              payment: payment, check: check, cancel: cancel, Already: Already, cancels: cancels, apply: apply, refund: refund
            })
          }
          // 已完成待评价
          if (order[i].status == '4' || order[i].status == '3' || order[i].status == '8') {
            cancel.push(order[i])
            that.setData({
              payment: payment, check: check, cancel: cancel, Already: Already, cancels: cancels, apply: apply, refund: refund
            })
          }
        }
        that.setData({
          order: order
        })
      },
    })
    app.util.request({
      'url': 'entry/wxapp/gethotel',
      'cachetime': '0',
      success: function (res) {
        var hotel = res.data
        that.setData({
          hotel: hotel
        })
      }
    })
  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  one_list: function () {
    wx.navigateTo({
      url: '../onelist/onelist',
    })
  },
  modalBindcancel: function (e) {
    var that = this;
    that.setData({
      modalHidden: true,
    })
  },
  modalBindaconfirm: function (e) {
    var that = this;
    var order_id = e.currentTarget.dataset.oid
    app.util.request({
      'url': 'entry/wxapp/cancelorder',
      'cachetime': '0',
      data: { order_id: order_id },
      success: function (res) {
        that.setData({
          modalHidden: true,
        })
        that.reload()
      },
    })
  },
  // --------------------点击退押金------------------
  click7: function (e) {
    var that = this
    var order_id = e.currentTarget.dataset.oid
    var seller_id = e.currentTarget.id
    var hotel = that.data.hotel
    for (let i in hotel) {
      if (hotel[i].id == seller_id) {
        if (hotel[i].is_refund == 1) {
          wx: wx.showModal({
            title: '退款提示',
            content: '该商家押金不可退',
            showCancel: true,
            cancelText: '取消',
            cancelColor: '',
            confirmText: '确定',
            confirmColor: '',
            success: function (res) {
              that.reload()
            },
            fail: function (res) { },
            complete: function (res) {
            },
          })
        } else {
          app.util.request({
            'url': 'entry/wxapp/apply',
            'cachetime': '0',
            data: { order_id: order_id },
            success: function (res) {
              if (res.data == 1) {
                wx: wx.showModal({
                  title: '退款提示',
                  content: '您已经申请退款',
                  showCancel: true,
                  cancelText: '取消',
                  cancelColor: '',
                  confirmText: '确定',
                  confirmColor: '',
                  success: function (res) { 
                    that.reload()
                  },
                  fail: function (res) { },
                  complete: function (res) { },
                })
              }
            },
          })
        }
      } 
    }
  },
  // 点击支付
  formSubmit: function (e) {
    var that = this
    var form_id = e.detail.formId
    var openid = wx.getStorageSync('users').openid
    var order_id = e.currentTarget.dataset.oid
    for (var i = 0; i < that.data.order.length; i++) {
      if (order_id == that.data.order[i].id) {
        var money = that.data.order[i].dis_cost
      }
    }
    if (form_id == '') {
      wx: wx.showToast({
        title: '不可以',
        icon: '',
        image: '',
        duration: 1000,
        mask: true,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    } else {
      app.util.request({
        'url': 'entry/wxapp/pay',
        'cachetime': '0',
        data: { openid: openid, money: money },
        success: function (res) {
          wx.requestPayment({
            'timeStamp': res.data.timeStamp,
            'nonceStr': res.data.nonceStr,
            'package': res.data.package,
            'signType': res.data.signType,
            'paySign': res.data.paySign,
            'success': function (res) {
              wx.showToast({
                title: '支付成功',
                duration: 1000
              })
              app.util.request({
                'url': 'entry/wxapp/roomnum',
                'cachetime': '0',
                data: { order_id: order_id },
                success: function (res) {
                }
              })
              // 改变订单状态
              app.util.request({
                'url': 'entry/wxapp/completeorder',
                'cachetime': '0',
                data: { order_id: order_id },
                success: function (res) {
                  app.util.request({
                    'url': 'entry/wxapp/message',
                    'cachetime': '0',
                    data: { form_id: form_id, id: order_id, openid: openid },
                    success: function (res) {
                      that.reload()
                    },
                  })
                  app.util.request({
                    'url': 'entry/wxapp/sms',
                    'cachetime': '0',
                    success: function (res) {
                      setTimeout(function () {
                        wx.reLaunch({
                          url: '../shouye/shouye',
                        })
                      }, 1000)
                    },
                  })

                },
              })
            },

            'fail': function (res) {
              wx.showToast({
                title: '支付失败',
                duration: 1000
              })
              // app.util.request({
              //   'url': 'entry/wxapp/message',
              //   'cachetime': '0',
              //   data: { form_id: form_id, id: order_id, openid: openid },
              //   success: function (res) {
              //     setTimeout(function () {
              //       wx.reLaunch({
              //         url: '../shouye/shouye',
              //       })
              //     }, 1000)
              //   },
              // })
              setTimeout(function () {
                wx.reLaunch({
                  url: '../shouye/shouye',
                })
              },
              )

            },
          })
        },
      })
    }

  },
  // 点击取消订单
  click1: function (e) {
    var that = this
    var order_id = e.currentTarget.dataset.oid
    var num = e.currentTarget.dataset.num
    console.log(num)
    app.util.request({
      'url': 'entry/wxapp/cancelorder',
      'cachetime': '0',
      data: { order_id: order_id },
      success: function (res) {
        that.setData({
          modalHidden: true,
        })
        that.reload()
      },
    })
    app.util.request({
      'url': 'entry/wxapp/AddRoomNums',
      'cachetime': '0',
      data: { order_id: order_id },
      success: function (res) {
        that.setData({
          modalHidden: true,
        })
      },
    })
  },
  // 点击订单完成
  click5: function (e) {
    var that = this
    var order_id = e.currentTarget.dataset.oid
    app.util.request({
      'url': 'entry/wxapp/wcOrder',
      'cachetime': '0',
      data: { order_id: order_id },
      success: function (res) {
        console.log(res)
        that.reload()
      },
    })
  },
  // 点击申请退款
  click6: function (e) {
    var that = this
    var order_id = e.currentTarget.dataset.oid
    var out_trade_no = e.currentTarget.dataset.order_no
    console.log(order_id)
    console.log(out_trade_no)
    app.util.request({
      'url': 'entry/wxapp/apply',
      'cachetime': '0',
      data: { order_id: order_id, out_trade_no: out_trade_no},
      success: function (res) {
        that.reload()
      },
    })
  },
  // 点击发表评价
  click2: function (e) {
    var that = this
    var order_id = e.currentTarget.dataset.oid
    var cancel = that.data.cancel
    for (var i = 0; i < cancel.length; i++) {
      if (cancel[i].id == order_id) {
        var seler_id = cancel[i].seller_id
        wx: wx.navigateTo({
          url: '../dingevaluate/dingevaluate?order_id=' + order_id + "&seller_id=" + seler_id,
        })
      }
    }
  },
  click3: function (e) {
    var that = this;
    var order_id = e.currentTarget.dataset.oid
    app.util.request({
      'url': 'entry/wxapp/delorder',
      'cachetime': '0',
      data: { order_id: order_id },
      success: function (res) {
        that.reload(),
          that.onLoad()
      },
    })
  },
  click4: function (e) {
    var that = this;
    var order_id = e.currentTarget.dataset.oid
    wx.showModal({
      title: '提示',
      content: '确定删除吗？',
      success:function(res){
        if(res.confirm){
          app.util.request({
            'url': 'entry/wxapp/delorder',
            'cachetime': '0',
            data: { order_id: order_id },
            success: function (res) {
              that.setData({
                modalHidden: true,
              })
              that.reload()
            },
          })
        }
      }
    })
  },
  details: function (e) {
    var that = this
    var order_id = e.currentTarget.dataset.xid
    var order = that.data.order
    for (var i = 0; i < order.length; i++) {
      if (order[i].id == order_id) {
        wx: wx.navigateTo({
          url: '../ruzhu/ruzhu?order_id=' + order_id
        })
      }
    }

  },
  modalChange: function () {
    this.setData({ modalHidden: true, quxiaodingdan: true, shanchu: false })
  },
  modalcancel: function () {
    this.setData({ modalHidden: true })
  },

  shanChange: function () {
    this.setData({ shanHidden: true, quxiaodingdan: false, shanchu: true })
  },
  shancancel: function () {
    this.setData({ shanHidden: true })
  }

});