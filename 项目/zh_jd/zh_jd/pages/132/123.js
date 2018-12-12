// pages/dingdan/dingdan.js
var app = getApp()
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: ['1间', '2间', '3间', '4间', '5间', '6间', '7间', '8间', '9间', '10间', '11间', '12间'],
    index: 0,
    coupon: 0,
    coupons_id: '',
    nn:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    // --------------------------入驻的日期
    var startDate = wx.getStorageSync('startDate')
    var uese_id = wx.getStorageSync('users').id
    console.log(startDate)
    app.util.request({
      'url': 'entry/wxapp/orderlist',
      'cachetime': '0',
      data: { user_id: uese_id },
      success:function(res){
        var order = res.data
        var order_no = []
        for(let i in order){
          if (order[i].arrival_time.slice(0,10) == startDate){
            console.log(order[i])
            order_no.push(order[i])
          }
        }
        if(order_no.length>0){
          wx:wx.showModal({
            title: '提示',
            content: '您已经定了今天的房间了',
            showCancel: true,
            cancelText: '取消',
            cancelColor: '',
            confirmText: '确定',
            confirmColor: '',
            success: function(res) {},
            fail: function(res) {},
            complete: function(res) {},
          })
        }
      }
    })
    var endDate = wx.getStorageSync('endDate')
    var that = this
    // 剩余房间数
    var sy_num = options.sy_num
    // 是否开启入驻押金  2为开启 1为关闭
    var is_deposit = options.is_deposit
    // 是否可以退押金 
    var is_refund = options.is_refund
    // 押金
    if (is_deposit == 2) {
      var yj_cost = Number(options.yj_cost)
      var is_yj = 1
    } else {
      var yj_cost = 0
      var is_yj = 2
    }
    // 查看会员的折扣
    var discount = wx.getStorageSync('users').discount
    // 是否是会员 1为非会员 2为会员
    var types = wx.getStorageSync('users').type
    if (types == 1) {
      var discounts = 1
      var dis = 0
      that.setData({
        discount: 1,
        dis: 0
      })
    } else {
      if (discount == '' || discount == null) {
        var discounts = 1
        var dis = 0
        that.setData({
          discount: 1,
          dis: 0
        })
      } else {
        var discounts = Number(wx.getStorageSync('users').discount) / 10
        var dis = 1 - discounts
        that.setData({
          discount: discounts,
          dis: dis,
        })
      }
    }
    var time = util.formatTime(new Date());
    // --------------------改变导航栏颜色----------------------
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: wx.getStorageSync('platform_color'),
      animation: {
        duration: 0,
        timingFunc: 'easeIn'
      }
    })
    // 这是酒店的id
    var hotel_id = wx.getStorageSync('hotel')
    // 住的天数
    var day = options.time
    // 价格
    var price = options.price
    // ----------------------------------1为到店付  2为在线付
    // 单间房间价格
    var price = Number(options.price)
    // 入住天数
    var day_num = Number(options.time)
    // 优惠券金额
    var coupon_cost = that.data.coupon
    // 押金金额
    var yj_cost = yj_cost
    that.setData({
      sy_num: sy_num,
      price: price,
      stime: startDate,
      etime: endDate,
      day: day,
      total_num: options.num,
      room_id: options.id,
      room_name: options.name,
      name: options.name,
      hotel_name: options.hotel_name,
      hotel_id: hotel_id,
      ys_state: options.ys_state,
      is_yj: is_yj,
      is_deposit: is_deposit,
      is_refund: is_refund,
      yj_cost: yj_cost,
      oid: options.oid
    })
    var that = this
    app.util.request({
      'url': 'entry/wxapp/gethotel',
      'cachetime': '0',
      success: function (res) {
        for (var i = 0; i < res.data.length; i++) {
          if (hotel_id == res.data[i].id) {
            that.setData({
              room: res.data[i]
            })
            wx.setNavigationBarTitle({
              title: res.data[i].name
            })
          }
        }
      },
    })
    that.setData({
      day: day,
      price: price,
      day_num: day_num,
      coupon_cost: coupon_cost,
    })
    that.refresh()
    // 获取房间信息
  },
  hanshu:function(e){
    app.util.request({
      'url': 'entry/wxapp/pay2',
      'cachetime': '0',
      data: { openid: openid, money: total_price },
      success: function (res) {
        console.log(res)
        // ---------需要传给后台的值------------
        // var out_trade_no = res.data.n
        var out_trade_no = res.data.n
        wx.requestPayment({
          'timeStamp': res.data.y.timeStamp,
          'nonceStr': res.data.y.nonceStr,
          'package': res.data.y.package,
          'signType': res.data.y.signType,
          'paySign': res.data.y.paySign,
          'success': function (res) {
            //  提交订单
            app.util.request({
              'url': 'entry/wxapp/addorder',
              'cachetime': '0',
              data: {
                is_yj: that.data.is_yj,
                user_id: uese_id,
                online_price: that.data.room_price,
                seller_id: hotel_id,
                seller_name: hotel_name,
                arrival_time: start_time,
                departure_time: end_time,
                tel: user_tel,
                days: days,
                name: user_name,
                room_type: room_name,
                room_num: room_num,
                type: oid,
                persist: cerated_time,
                goods_id: room_id,
                dis_cost: total_price,
                coupons_id: coupons_id,
                zk_cost: zk_cost,
                zfyj_cost: yj_cost,
                yhq_cost: yhq_cost,
                out_trade_no: out_trade_no
              },
              success: function (res) {
                console.log('这是查询房间数量')
                console.log(res)
                var order_id = res.data
                var length = typeof (order_id)
                console.log(length)
                if (length == "string") {
                  console.log('order_id')
                  wx: wx.showModal({
                    title: '提示',
                    content: order_id,
                    showCancel: true,
                    cancelText: '取消',
                    cancelColor: '',
                    confirmText: '确定',
                    confirmColor: '',
                    success: function (res) { },
                    fail: function (res) { },
                    complete: function (res) { },
                  })
                } else {
                  console.log(order_id)
                  app.util.request({
                    'url': 'entry/wxapp/UpdateRoomNum',
                    'cachetime': '0',
                    data: { order_id: order_id },
                    success: function (res) {
                      console.log(res)
                    }
                  })
                  app.util.request({
                    'url': 'entry/wxapp/checkprint',
                    'cachetime': '0',
                    data: { seller_id: hotel_id },
                    success: function (res) {
                      if (res.data == 2) {
                        app.util.request({
                          'url': 'entry/wxapp/print',
                          'cachetime': '0',
                          data: { order_id: order_id },
                          success: function (res) {
                          }
                        })
                      }
                    }
                  })
                  // 会员等级
                  app.util.request({
                    'url': 'entry/wxapp/memberlevel',
                    'cachetime': '0',
                    data: { user_id: user_id },
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
                          setTimeout(function () {
                            wx.reLaunch({
                              url: '../shouye/shouye',
                            })
                          }, 1000)
                          wx.showToast({
                            title: '支付成功',
                            duration: 1000
                          })
                        }
                      })
                      app.util.request({
                        'url': 'entry/wxapp/sms',
                        'cachetime': '0',
                        data: { seller_id: hotel_id },
                        success: function (res) {
                          // setTimeout(function () {
                          //   wx.reLaunch({
                          //     url: '../shouye/shouye',
                          //   })
                          // }, 1000)
                        },
                      })
                      app.util.request({
                        'url': 'entry/wxapp/sendmail',
                        'cachetime': '0',
                        data: { seller_id: hotel_id },
                        success: function (res) {
                          setTimeout(function () {
                          }, 1000)
                        },
                      })
                    },
                  })
                }

              },
            })
          },

          'fail': function (res) {
            // console.log(res);
            wx.showToast({
              title: '支付失败',
              duration: 1000
            })
          },
        })
      },
    })
  },
  refresh:function(e){
    var that = this
    console.log(that.data)
    var sy_num = that.data.sy_num
    // 房间数量
    var nn = that.data.nn
    // 入住天数
    var day_num = that.data.day_num
    // 单间房间价格
    var price = that.data.price
    // 优惠券金额
    var coupon = that.data.coupon
    // 付款方式
    var oid = that.data.oid
    // 会员折扣
    var discounts = that.data.discount
    // 房间总价格
    var room_price = 0
    // 到店付
    if (oid == 1) {
      room_price = price * day_num * nn
      var discount_cost = room_price * discounts - coupon
      var rebate_cost = room_price - room_price * discounts
      that.setData({
        discount_cost: discount_cost.toFixed(2),
        rebate_cost: rebate_cost.toFixed(2),
        coupon_cost: (rebate_cost + coupon).toFixed(2),
        room_price: room_price
      })
    } else {
      // 计算折扣的价格
      var prix = []
      var shoping = 0
      app.util.request({
        'url': 'entry/wxapp/getroomcost',
        'cachetime': '0',
        data: { room_id: that.data.room_id, start: that.data.stime, end: that.data.etime },
        success: function (res) {
          console.log(res)
          res.data.map(function (item) {
            var arr = {}
            arr.price = Number(item.mprice)
            prix.push(arr)
          })
          for (var i in prix) {
            room_price += (prix[i].price);
          }
          room_price = room_price * nn
          var discount_cost = room_price * discounts - coupon
          var rebate_cost = room_price - room_price * discounts
          that.setData({
            discount_cost: discount_cost.toFixed(2),
            rebate_cost: rebate_cost.toFixed(2),
            coupon_cost: (rebate_cost + coupon).toFixed(2),
            room_price: room_price,
          })
        },
      })
    }
   
  },
  // 使用优惠券
  coupon: function (e) {
    wx: wx.navigateTo({
      url: '../coupon/coupon?hotel_id=' + this.data.hotel_id + '&money=' + this.data.discount_cost,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  bindPickerChange: function (e) {
    var num = Number(e.detail.value)
    console.log(num)
    if (num > 0) {
      var nn = num + 1
    } else {
      var nn = 1
    }
    var sy_num = this.data.sy_num
    if (sy_num>=nn){

      this.setData({
        nn: nn,
        index: e.detail.value
      })
      this.refresh()
    }else{
      wx: wx.showModal({
        title: '提示',
        content: '没有这么多房间了喔',
        showCancel: true,
        cancelText: '取消',
        cancelColor: '',
        confirmText: '确定',
        confirmColor: '',
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    }
  },
  // 提交订单
  formSubmit: function (e) {
    var that = this
    // 优惠券id
    var coupons_id = that.data.coupons_id
    // 优惠券抵扣的金额
    var yhq_cost = that.data.coupon
    // 折扣的金额
    var zk_cost = that.data.rebate
    // 折扣
    var discount = that.data.discount
    // 房间的价格  不包括押金
    var rebate = that.data.rebate
    // 应该付款的总金额
    var total_price = that.data.discount_cost
    if (total_price <= 0) {
      total_price = 0.01
    }
    console.log(total_price)
    // 是否开启到店付支付押金
    var is_deposit = that.data.is_deposit
    // 用户应该支付的押金
    var yj_cost = that.data.yj_cost
    total_price = Number(total_price) + Number(yj_cost)
    console.log(total_price)
    // 获取提交的form_id
    var form_id = e.detail.formId
    // console.log('用户的form——id是' + form_id)
    // 判断用户输入的名字以及手机号
    var user_tel = e.detail.value.user_tel
    var user_name = e.detail.value.user_name
    // console.log(user_name.length)
    if (user_name.length == 0) {
      wx: wx.showToast({
        title: '请输入名字',
        icon: '',
        image: '',
        duration: 1500,
        mask: true,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    } else if (user_name.length > 4) {
      wx.showToast({
        title: '名字太长啦',
        icon: 'success',
        duration: 1500
      })
    } else if (user_name.length <= 4) {
      if (user_tel.length > 0) {
        // -------------------------------------判断用户输入的手机号是否正确
        var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
        if (user_tel.length == 0) {
          wx.showToast({
            title: '手机号不能为空',
            icon: 'success',
            duration: 1500
          })
          return false;
        } else if (user_tel.length < 11) {
          wx.showToast({
            title: '手机号长度有误！',
            icon: 'success',
            duration: 1500
          })
          return false;
        } else if (!myreg.test(user_tel)) {
          wx.showToast({
            title: '手机号格式错误！',
            icon: 'success',
            duration: 1500
          })
          return false;
        } else {
          // 用户的openid
          var openid = wx.getStorageSync('users').openid
          // 用户的id
          var uese_id = wx.getStorageSync('users').id
          // 得到用户入住的天数
          var days = that.data.day
          // 得到该房型的剩余数量
          var total_num = that.data.total_num
          // 得到该订单的金额以及用户下单的房间数
          if (that.data.nn == null) {
            var room_num = 1
          } else {
            var room_num = that.data.nn
          }
          // 得到用户入住酒店的时间起止
          var start_time = that.data.stime
          var end_time = that.data.etime
          // console.log(start_time + ' ' + end_time)
          // 获取商家的id以及名字
          var hotel_id = that.data.hotel_id
          var hotel_name = that.data.room.name

          // 获取房间的id级房间型号
          var room_id = that.data.room_id
          var room_name = that.data.room_name

          // 用户输入的名字以及手机号
          var user_tel = e.detail.value.user_tel
          var user_name = e.detail.value.user_name

          // 判断用户选择的是到店付还是在线付
          var oid = that.data.oid
          var ys_state = that.data.ys_state
          // 判断保留的日期
          if (oid == 1) {
            var cerated_time = that.data.etime
          } else {
            var cerated_time = that.data.stime
          }
          // 开启入驻押金之后
          if (is_deposit == 2) {

          }
          if (total_num < room_num) {
            wx: wx.showToast({
              title: '该房型剩余' + total_num + '间',
              icon: '',
              image: '',
              duration: 1000,
              mask: true,
              success: function (res) { },
              fail: function (res) { },
              complete: function (res) { },
            })
          } else {
            if (form_id == '') {
              wx: wx.showToast({
                title: '网络有波动',
                icon: '',
                image: '',
                duration: 1000,
                mask: true,
                success: function (res) { },
                fail: function (res) { },
                complete: function (res) { },
              })
            } else {
              if (oid == 1) {
                var user_id = wx.getStorageSync('users').id
                // console.log('用户选择到店付')
                if (is_deposit == 2) {
                  if (ys_state == 2 || ys_state == 3) {
                    // 支付押金的接口
                    app.util.request({
                      'url': 'entry/wxapp/pay2',
                      'cachetime': '0',
                      data: { openid: openid, money: yj_cost },
                      success: function (res) {
                        console.log(res)
                        // ---------需要传给后台的值------------
                        var out_trade_no = res.data.n
                        wx.requestPayment({
                          'timeStamp': res.data.y.timeStamp,
                          'nonceStr': res.data.y.nonceStr,
                          'package': res.data.y.package,
                          'signType': res.data.y.signType,
                          'paySign': res.data.y.paySign,
                          'success': function (res) {
                            //  提交订单
                            app.util.request({
                              'url': 'entry/wxapp/addorder',
                              'cachetime': '0',
                              data: {
                                is_yj: that.data.is_yj,
                                user_id: uese_id,
                                online_price: that.data.room_price,
                                seller_id: hotel_id,
                                seller_name: hotel_name,
                                arrival_time: start_time,
                                departure_time: end_time,
                                tel: user_tel,
                                days: days,
                                name: user_name,
                                room_type: room_name,
                                room_num: room_num,
                                type: oid,
                                persist: cerated_time,
                                goods_id: room_id,
                                dis_cost: total_price,
                                coupons_id: coupons_id,
                                zk_cost: zk_cost,
                                yhq_cost: yhq_cost,
                                zfyj_cost: yj_cost,
                                out_trade_no: out_trade_no
                              },
                              success: function (res) {
                                console.log('这是查询房间数量')
                                console.log(res)
                                var order_id = res.data
                                var length = typeof (order_id)
                                console.log(length)
                                if (length == "string") {
                                  console.log('order_id')
                                  wx: wx.showModal({
                                    title: '提示',
                                    content: order_id,
                                    showCancel: true,
                                    cancelText: '取消',
                                    cancelColor: '',
                                    confirmText: '确定',
                                    confirmColor: '',
                                    success: function (res) { },
                                    fail: function (res) { },
                                    complete: function (res) { },
                                  })
                                } else {
                                  app.util.request({
                                    'url': 'entry/wxapp/UpdateRoomNum',
                                    'cachetime': '0',
                                    data: { order_id: order_id },
                                    success: function (res) {
                                      console.log('这是改变房间数量')
                                      console.log(res)
                                    },
                                  })
                                  if (res.data != "error") {
                                    app.util.request({
                                      'url': 'entry/wxapp/message',
                                      'cachetime': '0',
                                      data: { form_id: form_id, id: order_id, openid: openid },
                                      success: function (res) {
                                        app.util.request({
                                          'url': 'entry/wxapp/sms',
                                          'cachetime': '0',
                                          data: { seller_id: hotel_id },
                                          success: function (res) {
                                            setTimeout(function () {
                                              wx.reLaunch({
                                                url: '../yuding/yuding?start_time=' + start_time + '&end_time=' + end_time + '&day=' + that.data.day + '&money=' + total_price + '&room_name=' + room_name + '&hotel_name=' + hotel_name
                                              })
                                            }, 1000)
                                          },
                                        })
                                      },
                                    })
                                  } else {
                                    // 发送模板消息
                                    app.util.request({
                                      'url': 'entry/wxapp/message',
                                      'cachetime': '0',
                                      data: { form_id: form_id, id: order_id, openid: openid },
                                      success: function (res) {
                                      },
                                    })
                                    wx: wx.showToast({
                                      title: '订单生成失败',
                                      icon: '',
                                      image: '',
                                      duration: 1000,
                                      mask: true,
                                      success: function (res) { },
                                      fail: function (res) { },
                                      complete: function (res) { },
                                    })
                                  }
                                }

                              },
                            })
                          },

                          'fail': function (res) {
                            // console.log(res);
                            wx.showToast({
                              title: '支付失败',
                              duration: 1000
                            })
                          },
                        })
                      },
                    })
                  } else {
                    app.util.request({
                      'url': 'entry/wxapp/addorder',
                      'cachetime': '0',
                      data: {
                        is_yj: that.data.is_yj,
                        user_id: uese_id,
                        online_price: that.data.room_price,
                        seller_id: hotel_id,
                        seller_name: hotel_name,
                        arrival_time: start_time,
                        departure_time: end_time,
                        tel: user_tel,
                        days: days,
                        name: user_name,
                        room_type: room_name,
                        room_num: room_num,
                        type: oid,
                        persist: cerated_time,
                        goods_id: room_id,
                        dis_cost: total_price,
                        coupons_id: coupons_id,
                        zk_cost: zk_cost,
                        yhq_cost: yhq_cost
                      },
                      success: function (res) {
                        console.log('这是查询房间数量')
                        console.log(res)
                        var order_id = res.data
                        var length = typeof (order_id)
                        console.log(length)
                        if (length == "string") {
                          wx: wx.showModal({
                            title: '提示',
                            content: order_id,
                            showCancel: true,
                            cancelText: '取消',
                            cancelColor: '',
                            confirmText: '确定',
                            confirmColor: '',
                            success: function (res) { },
                            fail: function (res) { },
                            complete: function (res) { },
                          })
                        } else {
                          if (res.data != "error") {
                            app.util.request({
                              'url': 'entry/wxapp/UpdateRoomNum',
                              'cachetime': '0',
                              data: { order_id: order_id },
                              success: function (res) {
                                console.log('这是改变房间数量')
                                console.log(res)
                              },
                            })
                            app.util.request({
                              'url': 'entry/wxapp/message',
                              'cachetime': '0',
                              data: { form_id: form_id, id: order_id, openid: openid },
                              success: function (res) {
                                // console.log(res)
                                app.util.request({
                                  'url': 'entry/wxapp/sms',
                                  'cachetime': '0',
                                  data: { seller_id: hotel_id },
                                  success: function (res) {
                                    setTimeout(function () {
                                      // console.log('这是发送短信')
                                      // console.log(res)
                                      // console.log('这是商家id' + hotel_id)
                                      wx.reLaunch({
                                        url: '../yuding/yuding?start_time=' + start_time + '&end_time=' + end_time + '&day=' + that.data.day + '&money=' + total_price + '&room_name=' + room_name + '&hotel_name=' + hotel_name
                                      })
                                    }, 1000)
                                  },
                                })
                              }
                            })
                          } else {
                            // 
                            app.util.request({
                              'url': 'entry/wxapp/message',
                              'cachetime': '0',
                              data: { form_id: form_id, id: order_id, openid: openid },
                              success: function (res) {
                                // console.log(res)
                              },
                            })
                            wx: wx.showToast({
                              title: '订单生成失败',
                              icon: '',
                              image: '',
                              duration: 1000,
                              mask: true,
                              success: function (res) { },
                              fail: function (res) { },
                              complete: function (res) { },
                            })
                          }
                        }

                      },
                    })
                  }

                } else {
                  //  提交订单
                  app.util.request({
                    'url': 'entry/wxapp/addorder',
                    'cachetime': '0',
                    data: {
                      is_yj: that.data.is_yj,
                      user_id: uese_id,
                      online_price: that.data.room_price,
                      seller_id: hotel_id,
                      seller_name: hotel_name,
                      arrival_time: start_time,
                      departure_time: end_time,
                      tel: user_tel,
                      days: days,
                      name: user_name,
                      room_type: room_name,
                      room_num: room_num,
                      type: oid,
                      persist: cerated_time,
                      goods_id: room_id,
                      dis_cost: total_price,
                      coupons_id: coupons_id,
                      zk_cost: zk_cost,
                      yhq_cost: yhq_cost
                    },
                    success: function (res) {
                      console.log('这是查询房间数量')
                      console.log(res)
                      var order_id = res.data
                      var length = typeof (order_id)
                      console.log(length)
                      if (length == "string") {
                        wx: wx.showModal({
                          title: '提示',
                          content: order_id,
                          showCancel: true,
                          cancelText: '取消',
                          cancelColor: '',
                          confirmText: '确定',
                          confirmColor: '',
                          success: function (res) { },
                          fail: function (res) { },
                          complete: function (res) { },
                        })
                      } else {
                        if (res.data != "error") {
                          app.util.request({
                            'url': 'entry/wxapp/UpdateRoomNum',
                            'cachetime': '0',
                            data: { order_id: order_id },
                            success: function (res) {
                              console.log('这是改变房间数量')
                              console.log(res)
                            },
                          })
                          app.util.request({
                            'url': 'entry/wxapp/message',
                            'cachetime': '0',
                            data: { form_id: form_id, id: order_id, openid: openid },
                            success: function (res) {
                              // console.log(res)
                              app.util.request({
                                'url': 'entry/wxapp/sms',
                                'cachetime': '0',
                                data: { seller_id: hotel_id },
                                success: function (res) {
                                  setTimeout(function () {
                                    // console.log('这是发送短信')
                                    // console.log(res)
                                    // console.log('这是商家id' + hotel_id)
                                    wx.reLaunch({
                                      url: '../yuding/yuding?start_time=' + start_time + '&end_time=' + end_time + '&day=' + that.data.day + '&money=' + total_price + '&room_name=' + room_name + '&hotel_name=' + hotel_name
                                    })
                                  }, 1000)
                                },
                              })
                            }
                          })
                        } else {
                          // 
                          app.util.request({
                            'url': 'entry/wxapp/message',
                            'cachetime': '0',
                            data: { form_id: form_id, id: order_id, openid: openid },
                            success: function (res) {
                              // console.log(res)
                            },
                          })
                          wx: wx.showToast({
                            title: '订单生成失败',
                            icon: '',
                            image: '',
                            duration: 1000,
                            mask: true,
                            success: function (res) { },
                            fail: function (res) { },
                            complete: function (res) { },
                          })
                        }
                      }

                    },
                  })
                }

              } else {
                var user_id = wx.getStorageSync('users').id
                // if (is_deposit == 2) {
                //   if (ys_state == 1 || ys_state == 3) {
                //     this.hanshu()
                //   } else {
                //     this.hanshu()
                //   }
                // } else {
                //   this.hanshu()
                // }
                app.util.request({
                  'url': 'entry/wxapp/pay2',
                  'cachetime': '0',
                  data: { openid: openid, money: total_price },
                  success: function (res) {
                    console.log(res)
                    // ---------需要传给后台的值------------
                    // var out_trade_no = res.data.n
                    var out_trade_no = res.data.n
                    wx.requestPayment({
                      'timeStamp': res.data.y.timeStamp,
                      'nonceStr': res.data.y.nonceStr,
                      'package': res.data.y.package,
                      'signType': res.data.y.signType,
                      'paySign': res.data.y.paySign,
                      'success': function (res) {
                        //  提交订单
                        app.util.request({
                          'url': 'entry/wxapp/addorder',
                          'cachetime': '0',
                          data: {
                            is_yj: that.data.is_yj,
                            user_id: uese_id,
                            online_price: that.data.room_price,
                            seller_id: hotel_id,
                            seller_name: hotel_name,
                            arrival_time: start_time,
                            departure_time: end_time,
                            tel: user_tel,
                            days: days,
                            name: user_name,
                            room_type: room_name,
                            room_num: room_num,
                            type: oid,
                            persist: cerated_time,
                            goods_id: room_id,
                            dis_cost: total_price,
                            coupons_id: coupons_id,
                            zk_cost: zk_cost,
                            zfyj_cost: yj_cost,
                            yhq_cost: yhq_cost,
                            out_trade_no: out_trade_no
                          },
                          success: function (res) {
                            console.log('这是查询房间数量')
                            console.log(res)
                            var order_id = res.data
                            var length = typeof (order_id)
                            console.log(length)
                            if (length == "string") {
                              console.log('order_id')
                              wx: wx.showModal({
                                title: '提示',
                                content: order_id,
                                showCancel: true,
                                cancelText: '取消',
                                cancelColor: '',
                                confirmText: '确定',
                                confirmColor: '',
                                success: function (res) { },
                                fail: function (res) { },
                                complete: function (res) { },
                              })
                            } else {
                              console.log(order_id)
                              app.util.request({
                                'url': 'entry/wxapp/UpdateRoomNum',
                                'cachetime': '0',
                                data: { order_id: order_id },
                                success: function (res) {
                                  console.log(res)
                                }
                              })
                              app.util.request({
                                'url': 'entry/wxapp/checkprint',
                                'cachetime': '0',
                                data: { seller_id: hotel_id },
                                success: function (res) {
                                  if (res.data == 2) {
                                    app.util.request({
                                      'url': 'entry/wxapp/print',
                                      'cachetime': '0',
                                      data: { order_id: order_id },
                                      success: function (res) {
                                      }
                                    })
                                  }
                                }
                              })
                              // 会员等级
                              app.util.request({
                                'url': 'entry/wxapp/memberlevel',
                                'cachetime': '0',
                                data: { user_id: user_id },
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
                                      setTimeout(function () {
                                        wx.reLaunch({
                                          url: '../shouye/shouye',
                                        })
                                      }, 1000)
                                      wx.showToast({
                                        title: '支付成功',
                                        duration: 1000
                                      })
                                    }
                                  })
                                  app.util.request({
                                    'url': 'entry/wxapp/sms',
                                    'cachetime': '0',
                                    data: { seller_id: hotel_id },
                                    success: function (res) {
                                      // setTimeout(function () {
                                      //   wx.reLaunch({
                                      //     url: '../shouye/shouye',
                                      //   })
                                      // }, 1000)
                                    },
                                  })
                                  app.util.request({
                                    'url': 'entry/wxapp/sendmail',
                                    'cachetime': '0',
                                    data: { seller_id: hotel_id },
                                    success: function (res) {
                                      setTimeout(function () {
                                      }, 1000)
                                    },
                                  })
                                },
                              })
                            }

                          },
                        })
                      },

                      'fail': function (res) {
                        // console.log(res);
                        wx.showToast({
                          title: '支付失败',
                          duration: 1000
                        })
                      },
                    })
                  },
                })
              }
            }
          }
        }
      } else {
        wx.showToast({
          title: '请输入手机号',
          icon: 'success',
          duration: 1500
        })
      }
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
   this.refresh()
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