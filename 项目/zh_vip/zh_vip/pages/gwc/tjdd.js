var app = getApp();
var util = require('../../utils/util.js');
Page({
  data: {
    totalprice: 0,
    address: null,
    express_price: 0,
    content: "",
    offline: 0,
    express_price_1: 0,
    name: "",
    mobile: "",
    integral_radio: 1,
    new_total_price: 0,
    show_card: !1,
    payment: 0,
    show_payment: !1,
    send_type: 0,
    total: 0,
    showModal: false,
    zffs: 1,
    zfz: false,
    zfwz: '微信支付',
    btntype: 'btn_ok1',
    kqyue: true,
    kqjf: true,
    listarr: ['代金券', '折扣券'],
    activeIndex: 0,
    qlq: true,
    djq: [],
    zkq: [],
    kdje: 0,
    radioChange: '',
  },
  //点击切换排序
  tabClick: function (e) {
    var that = this;
    var index = e.currentTarget.id
    console.log(index)
    this.setData({
      activeIndex: e.currentTarget.id,
    });
  },
  qlq: function () {
    console.log(this.data)
    // if (this.data.xfje == 0) {
    //   wx.showToast({
    //     title: '请输入消费金额',
    //     icon: 'loading',
    //     duration: 1000,
    //   })
    //   return
    // }
    this.setData({
      qlq: false,
    })
  },
  qdzz: function () {
    this.setData({
      qlq: true
    })
  },
  lqyhq: function (uid, sjid) {
    var that = this;
    //Coupons
    app.util.request({
      'url': 'entry/wxapp/MyCoupons2',
      'cachetime': '0',
      data: { user_id: uid, store_id: sjid },
      success: function (res) {
        console.log('优惠券信息', res.data)
        var received = res.data;
        var djq = [], zkq = [];
        for (let i = 0; i < received.length; i++) {
          if (received[i].type == '1' && received[i].state == '2') {
            djq.push(received[i]);
          }
          if (received[i].type == '2' && received[i].state == '2') {
            zkq.push(received[i]);
          }
        }
        console.log(djq, zkq)
        that.setData({
          djq: djq,
          zkq: zkq,
        })
      }
    });
  },
  ////
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
  yczz: function () {
    this.setData({
      showModal: false,
    })
  },
  qrmd: function (e) {
    var address = this.data.address, i = this.data.offline;
    console.log(address,i)
    if(i==0&&address==null){
      wx.showModal({
        title: '提示',
        content: '请选择收货地址',
      })
      return false
    }
    this.setData({
      form_id2: e.detail.formId
    })
    // if (xfje == 0) {
    //   wx.showModal({
    //     title: '提示',
    //     content: '消费金额不能为0哦~',
    //   })
    //   return false
    // }
    this.setData({
      showModal: true,
    })
  },
  onLoad: function (t) {
    console.log(wx.getStorageSync('cart_list'))
    this.setData({
      cart_list: wx.getStorageSync('cart_list')
    })
    var that = this;
    var url = getApp().imgurl;
    app.util.request({
      'url': 'entry/wxapp/system',
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        that.setData({
          xtxx: res.data,
          url: url,
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
    //UserInfo
    var store_id = wx.getStorageSync('mdid'), user_id = wx.getStorageSync('UserData').id;
    that.lqyhq(user_id, store_id)
    app.util.request({
      'url': 'entry/wxapp/UserInfo',
      'cachetime': '0',
      data: { user_id: user_id },
      success: function (res) {
        console.log('用户信息', res.data)
        if (res.data.discount != null) {
          var discount = Number(res.data.discount)
        }
        else {
          var discount = 100
        }
        that.setData({
          userInfo:res.data,
          discount: discount,
          integral: res.data.integral,
        })
        app.util.request({
          'url': 'entry/wxapp/MallSet',
          'cachetime': '0',
          data: { store_id: store_id },
          success: function (res) {
            console.log('门店设置', res.data)
            res.data.freight = Number(res.data.freight)
            res.data.full = Number(res.data.full)
            that.setData({
              mdset: res.data,
              freight: res.data.freight
            })
            that.gettotalprice();
          }
        });
      }
    });
    //Store 
    app.util.request({
      'url': 'entry/wxapp/StoreInfo',
      'cachetime': '0',
      data: { id: store_id },
      success: function (res) {
        console.log('门店信息', res.data)
        that.setData({
          mdinfo: res.data,
        })
      }
    });
    var nowtime = util.formatTime(new Date)
    var date = util.formatTime(new Date).substring(0, 10).replace(/\//g, "-");
    var time = util.formatTime(new Date).substring(11, 16);
    console.log(nowtime,date.toString(),time.toString())
    this.setData({
      datestart:date,
      timestart:time,
      date: date,
      time:time
    })
  },
  bindDateChange: function (e) {
    console.log('date 发生 change 事件，携带值为', e.detail.value, this.data.datestart)
    this.setData({
      date: e.detail.value
    })
    if (e.detail.value == this.data.datestart) {
      console.log('日期没有修改')
    }
    else {
      console.log('修改了日期')
      this.setData({
        timestart: "00:01"
      })
    }
  },
  bindTimeChange: function (e) {
    console.log('time 发生 change 事件，携带值为', e.detail.value)
    this.setData({
      time: e.detail.value
    })
  },
  radioChange: function (e) {
    this.setData({
      radioChange: e.detail.value,
    })
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  },
  xzq: function (e) {
    console.log(e.currentTarget.dataset, this.data.xj)
    if (Number(e.currentTarget.dataset.full) > this.data.xj) {
      wx.showModal({
        title: '提示',
        content: '您的商品小计金额不满足此优惠券条件',
      })
      return false;
    }
    this.setData({
      activeradio: e.currentTarget.dataset.rdid,
      yhqnum: 1,
      yhqfull: e.currentTarget.dataset.full,
      yhqname: e.currentTarget.dataset.type,
      yhqkdje: e.currentTarget.dataset.kdje,
    })
    if (e.currentTarget.dataset.type == '代金券') {
      this.setData({
        kdje: Number( e.currentTarget.dataset.kdje),
      })
    }
    if (e.currentTarget.dataset.type == '折扣券') {
      this.setData({
        kdje: Number(((1 - Number(e.currentTarget.dataset.kdje) * 0.1) * Number(this.data.xj)).toFixed(2)),
      })
    }
    this.gettotalprice();
  },
  gettotalprice: function () {
    var yf = this.data.freight, full = this.data.mdset.full, discount = this.data.discount, kdje = this.data.kdje;
    console.log(yf, full, discount,kdje)
    var that = this, a = 0, c = that.data.cart_list;
    for (var e in c) a += c[e].money * c[e].num;
    var xj = Number(a.toFixed(2))
    console.log(xj)
    if (xj >= full) {
      yf = 0;
    }
    var yprice = Number((xj + yf) .toFixed(2))
    var pre = Number((yprice * (100-discount) / 100).toFixed(2)),pre2=kdje;
    var totalprice = Number(((yprice*discount/100)-pre2).toFixed(2));
    if (totalprice <= 0) {
      totalprice = 0
    }
    console.log(yf,yprice, totalprice,pre,pre2)
    that.setData({
      yprice: yprice,
      pre:pre,
      pre2:pre2,
      yf: yf,
      xj: xj,
      totalprice: totalprice
    })
  },
  bindkeyinput: function (t) {
    this.setData({
      content: t.detail.value
    })
  },
  KeyName: function (t) {
    this.setData({
      name: t.detail.value
    })
  },
  KeyMobile: function (t) {
    this.setData({
      mobile: t.detail.value
    })
  },
  getOffline: function (t) {
    console.log(t)
    var a = this;
    a.setData({
      offline: t.target.dataset.index
    })
    var s = this.data.mdset.freight;
    1 == t.target.dataset.index ? this.setData({
      offline: 1,
      freight: 0,
    }) : this.setData({
      offline: 0,
      freight: s
    }),
      a.gettotalprice()
  },
  formSubmit: function (e) {
    var list = [], cart_list = this.data.cart_list;
    cart_list.map(function (item) {
      if (item.num > 0) {
        var obj = {};
        obj.name = item.name;
        obj.img = item.logo;
        obj.num = item.num;
        obj.money = item.money;
        obj.good_id = item.good_id;
        obj.car_id = item.id;
        obj.spec = item.spec;
        list.push(obj);
      }
    })
    console.log(list)
    var that = this;
    var openid = getApp().getOpenId;
    console.log('form发生了submit事件，携带数据为：', e.detail.value.radiogroup)
    var form_id = e.detail.formId, form_id2 = this.data.form_id2, uid = wx.getStorageSync('UserData').id, sjid = wx.getStorageSync('mdid'), xfje = this.data.yprice, money = this.data.totalprice, freight = this.data.yf, note = this.data.content, zhe = this.data.pre, sjname = this.data.mdinfo.name, yhqid = this.data.radioChange, quan = this.data.kdje, is_zt =parseInt(this.data.offline)+1,ztdate=this.data.date,zttime=this.data.time;
    if (this.data.address!=null){
     var address = this.data.address.area + this.data.address.address, username = this.data.address.user_name, tel = this.data.address.tel;
    }
    else{
      var address = '', username = '', tel = '';
    }
    // if (this.data.isyhq) {
    //   var yhqid = this.data.radioChange
    //   var quan = this.data.kdje
    // }
    // else {
    //   var yhqid = '';
    //   var quan = 0;
    // }
    if (is_zt == 1) { is_zt = 2 }
    else{
      is_zt = 1
    }
    if (is_zt == 1) {
      username = that.data.name, tel = this.data.mobile;
      if(username==''||tel==''){
        wx.showModal({
          title: '提示',
          content: '到店自提必须填写收货人和联系电话！',
        })
        return false
      }
    }
    console.log(openid, form_id,form_id2, uid, sjid, '总价', xfje, '实付', money, '运费', freight, 'zhe', zhe, 'quan', quan, '优惠券id', yhqid, sjname,'收货人',username,'收获电话',tel,'收货地址',address,'留言',note,'is_zt',is_zt,'sz',list,'自提时间',ztdate,zttime)
    if (e.detail.value.radiogroup == 'yezf') {
      var ye = Number(this.data.userInfo.wallet), total = Number(this.data.totalprice);
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
      var jf = Number(this.data.integral) / Number(this.data.jf_proportion), sfmoney = Number(this.data.totalprice);
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
    if (e.detail.value.radiogroup == 'yezf') {
      var is_yue = 2;
    }
    if (e.detail.value.radiogroup == 'wxzf') {
      var is_yue = 1;
    }
    if (e.detail.value.radiogroup == 'jfzf') {
      var is_yue = 3;
    }
    console.log('是否余额', is_yue)
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
      if (e.detail.value.radiogroup == 'yezf') {
        console.log('余额支付流程')
        // 下单
        app.util.request({
          'url': 'entry/wxapp/AddShopOrder',
          'cachetime': '0',
          data: { price: xfje, money: money, store_id: sjid, user_id: uid, pay_type: is_yue, preferential: zhe, preferential2: quan, coupons_id: yhqid, note: note, address: address, user_name: username, tel: tel, is_zt: is_zt, freight: freight, sz: list, zt_time: ztdate + ' ' + zttime, form_id2: form_id2, form_id: form_id},
          success: function (res) {
            console.log(res)
            var order_id = res.data;
            that.setData({
              zfz: false,
              showModal: false,
            })
            if (res.data != '下单失败') {
              wx.showToast({
                title: '支付成功',
              })
              setTimeout(function () {
                wx.redirectTo({
                  url: '../my/wddd/order',
                })
              }, 1000)
              // // 打印机
              // app.util.request({
              //   'url': 'entry/wxapp/dmPrint',
              //   'cachetime': '0',
              //   data: { order_id: order_id },
              //   success: function (res) {
              //     console.log(res)
              //   },
              // })
              // app.util.request({
              //   'url': 'entry/wxapp/dmPrint2',
              //   'cachetime': '0',
              //   data: { order_id: order_id },
              //   success: function (res) {
              //     console.log(res)
              //   },
              // })
              // 下单发送模板消息
              app.util.request({
                'url': 'entry/wxapp/Message',
                'cachetime': '0',
                data: { openid: openid, form_id: form_id, store_name: sjname, money: money + '元' },
                success: function (res) {
                  console.log(res)
                  wx.showToast({
                    title: '支付成功',
                    duration: 2000
                  })
                  // setTimeout(function () {
                  //   wx.navigateBack({
                  //     delta: 1
                  //   })
                  // }, 1000)
                },
              })
            }
            else {
              wx.showToast({
                title: '支付失败',
                icon: 'loading',
              })
            }
          },
        })
      }
      else if (e.detail.value.radiogroup == 'jfzf') {
        console.log('积分支付流程')
        // 下单
        app.util.request({
          'url': 'entry/wxapp/AddShopOrder',
          'cachetime': '0',
          data: { price: xfje, money: money, store_id: sjid, user_id: uid, pay_type: is_yue, preferential: zhe, preferential2: quan, coupons_id: yhqid, jf: dyjf, note: note, address: address, user_name: username, tel: tel, is_zt: is_zt, freight: freight, sz: list, zt_time: ztdate + ' ' + zttime, form_id2: form_id2, form_id: form_id },
          success: function (res) {
            console.log(res)
            var order_id = res.data;
            that.setData({
              zfz: false,
              showModal: false,
            })
            if (res.data != '下单失败') {
              wx.showToast({
                title: '支付成功',
              })
              setTimeout(function () {
                wx.redirectTo({
                  url: '../my/wddd/order',
                })
              }, 1000)
              // 下单发送模板消息
              app.util.request({
                'url': 'entry/wxapp/Message',
                'cachetime': '0',
                data: { openid: openid, form_id: form_id, store_name: sjname, money: money + '元' },
                success: function (res) {
                  console.log(res)
                  wx.showToast({
                    title: '支付成功',
                    duration: 2000
                  })
                },
              })
            }
            else {
              wx.showToast({
                title: '支付失败',
                icon: 'loading',
              })
            }
          },
        })
      }
      else {
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
          app.util.request({
            'url': 'entry/wxapp/AddShopOrder',
            'cachetime': '0',
            data: { price: xfje, money: money, store_id: sjid, user_id: uid, pay_type: is_yue, preferential: zhe, preferential2: quan, coupons_id: yhqid, note: note, address: address, user_name: username, tel: tel, is_zt: is_zt, freight: freight, sz: list, zt_time: ztdate + ' ' + zttime, form_id2: form_id2, form_id: form_id},
            success: function (res) {
              console.log(res)
              var order_id = res.data;
              if (res.data != '下单失败') {
                app.util.request({
                  'url': 'entry/wxapp/pay3',
                  'cachetime': '0',
                  data: { openid: openid, money: money, order_id: res.data },
                  success: function (res) {
                    console.log(res)
                    that.setData({
                      zfz: false,
                      showModal: false,
                    })
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
                          setTimeout(function () {
                            wx.redirectTo({
                              url: '../my/wddd/order',
                            })
                          }, 1000)
                        }
                        if (res.errMsg == 'requestPayment:ok') {
                          wx.showToast({
                            title: '支付成功',
                            duration: 1000
                          })
                          setTimeout(function () {
                            wx.redirectTo({
                              url: '../my/wddd/order',
                            })
                          }, 1000)
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
    }
  },
  // dingwei: function () {
  //   var t = this;
  //   wx.chooseLocation({
  //     success: function (a) {
  //       e = a.longitude,
  //         s = a.latitude,
  //         t.setData({
  //           location: a.address
  //         })
  //     },
  //     fail: function (e) {
  //       a.getauth({
  //         content: "需要获取您的地理位置授权，请到小程序设置中打开授权",
  //         success: function (a) {
  //           a && (a.authSetting["scope.userLocation"] ? t.dingwei() : wx.showToast({
  //             title: "您取消了授权",
  //             image: "/images/icon-warning.png"
  //           }))
  //         }
  //       })
  //     }
  //   })
  // },
  // orderSubmit: function (e) {
  //   var s = this,
  //     i = s.data.offline,
  //     o = {};
  //   if (0 == i) {
  //     if (!s.data.address || !s.data.address.id) return void wx.showToast({
  //       title: "请选择收货地址",
  //       image: "/images/icon-warning.png"
  //     });
  //     o.address_id = s.data.address.id
  //   } else {
  //     if (o.address_name = s.data.name, o.address_mobile = s.data.mobile, !s.data.shop.id) return void wx.showModal({
  //       title: "警告",
  //       content: "请选择门店",
  //       showCancel: !1
  //     });
  //     if (o.shop_id = s.data.shop.id, !o.address_name || void 0 == o.address_name) return void s.showToast({
  //       title: "请填写收货人",
  //       image: "/images/icon-warning.png"
  //     });
  //     if (!o.address_mobile || void 0 == o.address_mobile) return void s.showToast({
  //       title: "请填写联系方式",
  //       image: "/images/icon-warning.png"
  //     });
  //     if (!/^1\d{10}$/.test(o.address_mobile)) return void wx.showModal({
  //       title: "提示",
  //       content: "手机号格式不正确",
  //       showCancel: !1
  //     })
  //   }
  //   o.offline = i;
  //   var d = s.data.form;
  //   if (1 == d.is_form) {
  //     var r = d.list;
  //     for (var n in r) if ("date" == r[n].type && (r[n].
  //       default = r[n].
  //         default ? r[n].
  //           default :
  //         s.data.time), "time" == r[n].type && (r[n].
  //           default = r[n].
  //             default ? r[n].
  //               default :
  //             "00:00"), 1 == r[n].required) if ("radio" == r[n].type || "checkboxc" == r[n].type) {
  //               var c = !1;
  //               for (var l in r[n].default_list) 1 == r[n].default_list[l].is_selected && (c = !0);
  //               if (!c) return wx.showModal({
  //                 title: "提示",
  //                 content: "请填写" + d.name + "，加‘*’为必填项",
  //                 showCancel: !1
  //               }),
  //                 !1
  //             } else if (!r[n].
  //               default || void 0 == r[n].
  //                 default) return wx.showModal({
  //                   title:
  //                   "提示",
  //                   content: "请填写" + d.name + "，加‘*’为必填项",
  //                   showCancel: !1
  //                 }),
  //                   !1
  //   }
  //   o.form = JSON.stringify(d),
  //     s.data.cart_id_list && (o.cart_id_list = JSON.stringify(s.data.cart_id_list)),
  //     s.data.goods_info && (o.goods_info = JSON.stringify(s.data.goods_info)),
  //     s.data.picker_coupon && (o.user_coupon_id = s.data.picker_coupon.user_coupon_id),
  //     s.data.content && (o.content = s.data.content),
  //     wx.showLoading({
  //       title: "正在提交",
  //       mask: !0
  //     }),
  //     1 == s.data.integral_radio ? o.use_integral = 1 : o.use_integral = 2,
  //     o.payment = s.data.payment,
  //     a.request({
  //       url: t.order.submit,
  //       method: "post",
  //       data: o,
  //       success: function (i) {
  //         if (0 == i.code) {
  //           setTimeout(function () {
  //             wx.hideLoading()
  //           },
  //             1e3),
  //             setTimeout(function () {
  //               s.setData({
  //                 options: {}
  //               })
  //             },
  //               1);
  //           var d = i.data.order_id;
  //           0 == o.payment && a.request({
  //             url: t.order.pay_data,
  //             data: {
  //               order_id: d,
  //               pay_type: "WECHAT_PAY"
  //             },
  //             success: function (t) {
  //               0 != t.code ? 1 != t.code || s.showToast({
  //                 title: t.msg,
  //                 image: "/images/icon-warning.png"
  //               }) : wx.requestPayment({
  //                 timeStamp: t.data.timeStamp,
  //                 nonceStr: t.data.nonceStr,
  //                 package: t.data.package,
  //                 signType: t.data.signType,
  //                 paySign: t.data.paySign,
  //                 success: function (t) { },
  //                 fail: function (t) { },
  //                 complete: function (t) {
  //                   "requestPayment:fail" != t.errMsg && "requestPayment:fail cancel" != t.errMsg ? "requestPayment:ok" != t.errMsg ? wx.redirectTo({
  //                     url: "/pages/order/order?status=-1"
  //                   }) : s.data.goods_card_list.length > 0 ? s.setData({
  //                     show_card: !0
  //                   }) : wx.redirectTo({
  //                     url: "/pages/order/order?status=-1"
  //                   }) : wx.showModal({
  //                     title: "提示",
  //                     content: "订单尚未支付",
  //                     showCancel: !1,
  //                     confirmText: "确认",
  //                     success: function (t) {
  //                       t.confirm && wx.redirectTo({
  //                         url: "/pages/order/order?status=0"
  //                       })
  //                     }
  //                   })
  //                 }
  //               })
  //             }
  //           }),
  //             2 == o.payment && a.request({
  //               url: t.order.pay_data,
  //               data: {
  //                 order_id: d,
  //                 pay_type: "HUODAO_PAY",
  //                 form_id: e.detail.formId
  //               },
  //               success: function (t) {
  //                 0 == t.code ? wx.redirectTo({
  //                   url: "/pages/order/order?status=-1"
  //                 }) : s.showToast({
  //                   title: t.msg,
  //                   image: "/images/icon-warning.png"
  //                 })
  //               }
  //             })
  //         }
  //         if (1 == i.code) return wx.hideLoading(),
  //           void s.showToast({
  //             title: i.msg,
  //             image: "/images/icon-warning.png"
  //           })
  //       }
  //     })
  // },
  // onReady: function () { },
  //选择地址
  onShow: function () {
    var user_id = wx.getStorageSync('UserData').id, that = this;
    //MyDefaultAddress
    app.util.request({
      'url': 'entry/wxapp/MyDefaultAddress',
      'cachetime': '0',
      data: { user_id: user_id },
      success: function (res) {
        console.log(res.data)
        if (res.data) {
          res.data.area = res.data.area.replace(/,/g, "")
          that.setData({
            address: res.data,
            mobile: res.data.tel,
            name: res.data.user_name
          })
        }
      }
    });
  },
  // getOrderData: function (i) {
  //   var o = this,
  //     d = "";
  //   if (o.data.address && o.data.address.id && (d = o.data.address.id), i.cart_id_list) {
  //     JSON.parse(i.cart_id_list);
  //     wx.showLoading({
  //       title: "正在加载",
  //       mask: !0
  //     }),
  //       a.request({
  //         url: t.order.submit_preview,
  //         data: {
  //           cart_id_list: i.cart_id_list,
  //           address_id: d,
  //           longitude: e,
  //           latitude: s
  //         },
  //         success: function (t) {
  //           if (wx.hideLoading(), 0 == t.code) {
  //             var a = t.data.shop_list,
  //               e = {};
  //             1 == a.length && (e = a[0]),
  //               o.setData({
  //                 total_price: parseFloat(t.data.total_price),
  //                 goods_list: t.data.list,
  //                 cart_id_list: t.data.cart_id_list,
  //                 address: t.data.address,
  //                 express_price: parseFloat(t.data.express_price),
  //                 coupon_list: t.data.coupon_list,
  //                 shop_list: a,
  //                 shop: e,
  //                 name: t.data.address ? t.data.address.name : "",
  //                 mobile: t.data.address ? t.data.address.mobile : "",
  //                 send_type: t.data.send_type,
  //                 level: t.data.level,
  //                 new_total_price: parseFloat(t.data.total_price),
  //                 integral: t.data.integral,
  //                 goods_card_list: t.data.goods_card_list,
  //                 form: t.data.form,
  //                 is_payment: t.data.is_payment
  //               }),
  //               1 == t.data.send_type && o.setData({
  //                 offline: 0
  //               }),
  //               2 == t.data.send_type && o.setData({
  //                 offline: 1
  //               }),
  //               o.getPrice()
  //           }
  //           1 == t.code && wx.showModal({
  //             title: "提示",
  //             content: t.msg,
  //             showCancel: !1,
  //             confirmText: "返回",
  //             success: function (t) {
  //               t.confirm && wx.navigateBack({
  //                 delta: 1
  //               })
  //             }
  //           })
  //         }
  //       })
  //   }
  //   i.goods_info && (wx.showLoading({
  //     title: "正在加载",
  //     mask: !0
  //   }), a.request({
  //     url: t.order.submit_preview,
  //     data: {
  //       goods_info: i.goods_info,
  //       address_id: d,
  //       longitude: e,
  //       latitude: s
  //     },
  //     success: function (t) {
  //       if (wx.hideLoading(), 0 == t.code) {
  //         var a = t.data.shop_list,
  //           e = {};
  //         1 == a.length && (e = a[0]),
  //           o.setData({
  //             total_price: t.data.total_price,
  //             goods_list: t.data.list,
  //             goods_info: t.data.goods_info,
  //             address: t.data.address,
  //             express_price: parseFloat(t.data.express_price),
  //             coupon_list: t.data.coupon_list,
  //             shop_list: a,
  //             shop: e,
  //             name: t.data.address ? t.data.address.name : "",
  //             mobile: t.data.address ? t.data.address.mobile : "",
  //             send_type: t.data.send_type,
  //             level: t.data.level,
  //             new_total_price: t.data.total_price,
  //             integral: t.data.integral,
  //             goods_card_list: t.data.goods_card_list,
  //             form: t.data.form,
  //             is_payment: t.data.is_payment
  //           }),
  //           1 == t.data.send_type && o.setData({
  //             offline: 0
  //           }),
  //           2 == t.data.send_type && o.setData({
  //             offline: 1
  //           }),
  //           o.getPrice()
  //       }
  //       1 == t.code && wx.showModal({
  //         title: "提示",
  //         content: t.msg,
  //         showCancel: !1,
  //         confirmText: "返回",
  //         success: function (t) {
  //           t.confirm && wx.navigateBack({
  //             delta: 1
  //           })
  //         }
  //       })
  //     }
  //   }))
  // },
  // copyText: function (t) {
  //   var a = t.currentTarget.dataset.text;
  //   a && wx.setClipboardData({
  //     data: a,
  //     success: function () {
  //       page.showToast({
  //         title: "已复制内容"
  //       })
  //     },
  //     fail: function () {
  //       page.showToast({
  //         title: "复制失败",
  //         image: "/images/icon-warning.png"
  //       })
  //     }
  //   })
  // },
  // showCouponPicker: function () {
  //   var t = this;
  //   t.data.coupon_list && t.data.coupon_list.length > 0 && t.setData({
  //     show_coupon_picker: !0
  //   })
  // },
  // pickCoupon: function (t) {
  //   var a = this,
  //     e = t.currentTarget.dataset.index;
  //   "-1" == e || -1 == e ? a.setData({
  //     picker_coupon: !1,
  //     show_coupon_picker: !1
  //   }) : a.setData({
  //     picker_coupon: a.data.coupon_list[e],
  //     show_coupon_picker: !1
  //   }),
  //     a.getPrice()
  // },
  // numSub: function (t, a, e) {
  //   return 100
  // },
  showShop: function (t) {
    var a = this;
    a.setData({
      show_shop: !0
    })
    // a.dingwei(),
    //   a.data.shop_list && a.data.shop_list.length >= 1 && a.setData({
    //     show_shop: !0
    //   })
  },
  ycshow_shop: function () {
    this.setData({
      show_shop: !1
    })
  },
  // pickShop: function (t) {
  //   var a = this,
  //     e = t.currentTarget.dataset.index;
  //   "-1" == e || -1 == e ? a.setData({
  //     shop: !1,
  //     show_shop: !1
  //   }) : a.setData({
  //     shop: a.data.shop_list[e],
  //     show_shop: !1
  //   }),
  //     a.getPrice()
  // },
  // integralSwitchChange: function (t) {
  //   var a = this;
  //   0 != t.detail.value ? a.setData({
  //     integral_radio: 1
  //   }) : a.setData({
  //     integral_radio: 2
  //   }),
  //     a.getPrice()
  // },
  // integration: function (t) {
  //   var a = this.data.integral.integration;
  //   wx.showModal({
  //     title: "积分使用规则",
  //     content: a,
  //     showCancel: !1,
  //     confirmText: "我知道了",
  //     confirmColor: "#ff4544",
  //     success: function (t) {
  //       t.confirm && console.log("用户点击确定")
  //     }
  //   })
  // },
  // getPrice: function () {
  //   var t = this,
  //     a = t.data.total_price,
  //     e = t.data.express_price,
  //     s = t.data.picker_coupon,
  //     i = t.data.integral,
  //     o = t.data.integral_radio,
  //     d = t.data.level,
  //     r = t.data.offline;
  //   s && (a -= s.sub_price),
  //     i && 1 == o && (a -= parseFloat(i.forehead)),
  //     d && (a = a * d.discount / 10),
  //     a <= .01 && (a = .01),
  //     0 == r && (a += e),
  //     t.setData({
  //       new_total_price: parseFloat(a.toFixed(2))
  //     })
  // },
  // cardDel: function () {
  //   this.setData({
  //     show_card: !1
  //   }),
  //     wx.redirectTo({
  //       url: "/pages/order/order?status=1"
  //     })
  // },
  // cardTo: function () {
  //   this.setData({
  //     show_card: !1
  //   }),
  //     wx.redirectTo({
  //       url: "/pages/card/card"
  //     })
  // },
  // formInput: function (t) {
  //   var a = this,
  //     e = t.currentTarget.dataset.index,
  //     s = a.data.form,
  //     i = s.list;
  //   i[e].
  //     default = t.detail.value,
  //     s.list = i,
  //     a.setData({
  //       form: s
  //     })
  // },
  // selectForm: function (t) {
  //   var a = this,
  //     e = t.currentTarget.dataset.index,
  //     s = t.currentTarget.dataset.k,
  //     i = a.data.form,
  //     o = i.list;
  //   if ("radio" == o[e].type) {
  //     var d = o[e].default_list;
  //     for (var r in d) r == s ? d[s].is_selected = 1 : d[r].is_selected = 0;
  //     o[e].default_list = d
  //   }
  //   "checkbox" == o[e].type && (1 == (d = o[e].default_list)[s].is_selected ? d[s].is_selected = 0 : d[s].is_selected = 1, o[e].default_list = d),
  //     i.list = o,
  //     a.setData({
  //       form: i
  //     })
  // },
  // showPayment: function () {
  //   this.setData({
  //     show_payment: !0
  //   })
  // },
  // payPicker: function (t) {
  //   var a = t.currentTarget.dataset.index;
  //   this.setData({
  //     payment: a
  //   })
  // },
  // payClose: function () {
  //   this.setData({
  //     show_payment: !1
  //   })
  // }
});