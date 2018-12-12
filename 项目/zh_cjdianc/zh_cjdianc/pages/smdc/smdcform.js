// zh_dianc/pages/takeout/takeoutform.js
var app = getApp();
var util = require('../../utils/util.js');
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var qqmapsdk;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    share_modal_active:false,
    activeradio:'',
    hbshare_modal_active: false,
    hbactiveradio:'',
    isloading:true,
    navbar: ['外卖配送', '到店自取'],
    fwxy:true, 
    xymc:'到店自取服务协议',
    xynr:'',
    selectedindex: 0,
    color: '#019fff',
    checked: false,
    cart_list: [],
    wmindex: 0,
    wmtimearray: ['尽快送达'],
    cjindex: 0,
    cjarray: ['1份', '2份', '3份', '4份', '5份', '6份', '7份', '8份', '9份', '10份', '10份以上'],
    mdoaltoggle: true,
    total: 0,
    showModal: false,
    zfz: false,
    zfwz: '',
    btntype: 'btn_ok1',
    yhqkdje:0,
    hbkdje:0,
  },
  showcart: function () {
    var that = this;
    this.setData({
      share_modal_active: !that.data.share_modal_active,
    })
  },
  closecart: function () {
    var page = this;
    page.setData({
      share_modal_active: false,
    });
  },
  hbshowcart: function () {
    var that = this;
    this.setData({
      hbshare_modal_active: !that.data.hbshare_modal_active,
    })
  },
  hbclosecart: function () {
    var page = this;
    page.setData({
      hbshare_modal_active: false,
    });
  },
  openxy:function(){
    this.setData({
      fwxy:false,
    })
  },
  queren: function () {
    this.setData({
      fwxy: true,
    })
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      wmindex: e.detail.value
    })
  },
  bindcjPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      cjindex: e.detail.value
    })
  },
  selectednavbar: function (e) {
    console.log(e)
    var that = this;
    this.setData({
      selectedindex: e.currentTarget.dataset.index
    })
    var s = this.data.psfbf;
    console.log(s)
    1 == e.currentTarget.dataset.index ? this.setData({
      psf: 0,
    }) : this.setData({
      psf: s
    }),
      that.gettotalprice()
  },
  checkboxChange: function (e) {
    var that = this;
    this.setData({
      checked: !that.data.checked,
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
    if (e.detail.value == 'chzf') {
      this.setData({
        zffs: 4,
        zfwz: '餐后支付',
        btntype: 'btn_ok4',
      })
    }
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
  tjddformSubmit: function (e) {
    console.log(e)
    this.setData({
      form_id2: e.detail.formId
    })
    this.setData({
      showModal: true,
    })
    // var that = this, address = this.data.address, i = this.data.selectedindex;
    // console.log(address, i)
    // if (i == 0 && address == null) {
    //   wx.showModal({
    //     title: '提示',
    //     content: '请选择收货地址',
    //   })
    //   return false
    // }
    // else if (i == 0 && !this.data.dzisnormall) {
    //   wx.showModal({
    //     title: '提示',
    //     content: '当前选择的收货地址超出商家配送距离,请选择其他地址',
    //     showCancel: false,
    //     success: function (res) {
    //       wx.navigateTo({
    //         url: '../wddz/xzdz',
    //       })
    //     }
    //   })
    // }
    // else if (i == 0 && this.data.dzisnormall){
    //   this.setData({
    //     showModal: true,
    //   })
    // }
    // else if (i == 1) {
    //   var username = that.data.name, tel = this.data.mobile, checked = this.data.checked;
    //   console.log(username, tel)
    //   if (username == '' || tel == '') {
    //     wx.showModal({
    //       title: '提示',
    //       content: '到店自提必须填写收货人和联系电话！',
    //     })
    //     return false
    //   }
    //   if (!checked) {
    //     wx.showModal({
    //       title: '提示',
    //       content: '请阅读并同意《到店自取服务协议》',
    //     })
    //     return false
    //   }
    //   this.setData({
    //     showModal: true,
    //   })
    // }
  },
  yczz: function () {
    this.setData({
      showModal: false,
    })
  },
  mdoalclose: function () {
    this.setData({
      mdoaltoggle: true,
    })
  },
  bindDateChange: function (e) {
    console.log('date 发生 change 事件，携带值为', e.detail.value, this.data.datestart)
    this.setData({
      date: e.detail.value
    })
    if (e.detail.value == this.data.datestart) {
      console.log('日期没有修改')
      this.setData({
        timestart: util.formatTime(new Date).substring(11, 16)
      })
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
  hbradioChange: function (e) {
    this.setData({
      hbradioChange: e.detail.value,
    })
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  },
  xzq: function (e) {
    console.log(e.currentTarget.dataset, this.data.gwcinfo.money, this.data.CouponSet.yhq_set)
    if (Number(e.currentTarget.dataset.full) > this.data.gwcinfo.money) {
      wx.showModal({
        title: '提示',
        content: '您的消费金额不满足此优惠券条件',
      })
      return false;
    }
    if (this.data.CouponSet.yhq_set=='1'){
      this.setData({
        share_modal_active: false,
        activeradio: e.currentTarget.dataset.rdid,
        yhqkdje: e.currentTarget.dataset.kdje,
      })
    }
    else{
      this.setData({
        share_modal_active: false,
        activeradio: e.currentTarget.dataset.rdid,
        yhqkdje: e.currentTarget.dataset.kdje,
        hbactiveradio: '',
        hbkdje: 0,
      })
    }
    this.gettotalprice();
  },
  xzhb: function (e) {
    console.log(e.currentTarget.dataset, this.data.gwcinfo.money, this.data.CouponSet.yhq_set)
    if (Number(e.currentTarget.dataset.full) > this.data.gwcinfo.money) {
      wx.showModal({
        title: '提示',
        content: '您的消费金额不满足此红包条件',
      })
      return false;
    }
    if (this.data.CouponSet.yhq_set == '1'){
      this.setData({
        hbshare_modal_active: false,
        hbactiveradio: e.currentTarget.dataset.rdid,
        hbkdje: e.currentTarget.dataset.kdje,
      })
    }
    else{
      wx.showModal({
        title: '提示',
        content: '优惠券与红包不可同时享用',
      })
      this.setData({
        hbshare_modal_active: false,
        hbactiveradio: e.currentTarget.dataset.rdid,
        hbkdje: e.currentTarget.dataset.kdje,
        activeradio: '',
        yhqkdje:0,
      })
    }
    this.gettotalprice();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.setNavigationBarColor(this);
    console.log(options)
    this.setData({
      tableid: options.tableid,
      drid: options.drid
    })
    var that = this, storeid = options.storeid, user_id = wx.getStorageSync('users').id, mycar;
    if (options.drid != null) {
      mycar = 'mycar2'
    }
    if (options.drid == null) {
      mycar = 'mycar'
    }
    console.log(mycar)
    wx.removeStorageSync('note')
    // UserInfo
    app.util.request({
      'url': 'entry/wxapp/UserInfo',
      'cachetime': '0',
      data: { user_id: user_id },
      success: function (res) {
        console.log(res)
        that.setData({
          userInfo: res.data
        })
      }
    })
    app.util.request({
      'url': 'entry/wxapp/Zhuohao',
      'cachetime': '0',
      data: { id: options.tableid },
      success: function (res) {
        console.log(res)
        that.setData({
          type_name: res.data.type_name,
          table_name: res.data.table_name,
        })
      }
    })
    app.util.request({
      'url': 'entry/wxapp/MyCoupons',
      'cachetime': '0',
      data: { store_id: storeid, user_id: user_id },
      success: function (res) {
        console.log(res.data)
        var arr = [],hbarr=[];
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].coupon_type != '1' && res.data[i].type=='1') {
            arr.push(res.data[i])
          }
          if (res.data[i].coupon_type != '1' && res.data[i].type == '2'){
            hbarr.push(res.data[i])
          }
        }
        console.log(arr,hbarr)
        that.setData({
          Coupons: arr,
          hbarr: hbarr,
        })
      },
    })
    /* */
    app.util.request({
      'url': 'entry/wxapp/CouponSet',
      'cachetime': '0',
      success: function (res) {
        console.log(res.data)
        that.setData({
          CouponSet: res.data
        })
      },
    })
    // app.util.request({
    //   'url': 'entry/wxapp/System',
    //   'cachetime': '0',
    //   success: function (res) {
    //     console.log(res)
    //     that.setData({
    //       System: res.data,
    //     })
    //     // 实例化API核心类
    //     qqmapsdk = new QQMapWX({
    //       key: res.data.map_key
    //     });
    //   }
    // });
    app.util.request({
      'url': 'entry/wxapp/StoreInfo',
      'cachetime': '0',
      data: { store_id: storeid, type: 1 },
      success: function (res) {
        console.log(res.data)
        var StoreInfo = res.data;
        var loc = res.data.store.coordinates.split(',')
        var sjstart = { lng: Number(loc[1]), lat: Number(loc[0]) }
        console.log(sjstart)
        if (StoreInfo.storeset.is_zt == '2') {
          that.setData({
            navbar: ['外卖配送'],
          })
        }
        if (StoreInfo.storeset.is_chzf == '1') {
          that.setData({
            chzf: true,
          })
        }
        if (StoreInfo.storeset.is_wxzf == '1') {
          that.setData({
            wxzf: true,
          })
        }
        if (getApp().xtxx.is_yuepay == '1' &&StoreInfo.storeset.is_yuepay == '1') {
          that.setData({
            kqyue: true,
          })
        }
        that.setData({
          // url: getApp().imgurl,
          psfarr: res.data.psf,
          reduction: res.data.reduction,
          store: res.data.store,
          storeset: res.data.storeset,
          sjstart: sjstart,
          xynr: res.data.storeset.ztxy,
        })
        app.util.request({
          'url': 'entry/wxapp/'+mycar,
          'cachetime': '0',
          data: {
            store_id: storeid, user_id: user_id,type:2
          },
          success: function (res) {
            console.log(res)
            app.util.request({
              'url': 'entry/wxapp/IsNew',
              data: {
                store_id: storeid, user_id: user_id
              },
              'cachetime': '0',
              success: function (res) {
                console.log(res.data)
                if (StoreInfo.storeset.xyh_open == '1' &&res.data == 1) {
                  that.setData({
                    xyhmoney: StoreInfo.storeset.xyh_money,
                    isnewuser: '1',
                  })
                }
                else {
                  that.setData({
                    xyhmoney: 0,
                    isnewuser: '2',
                  })
                }
                that.countMj()
                // that.gettotalprice()
              },
            })
            that.setData({
              cart_list: res.data.res,
              gwcinfo: res.data,
              gwcprice: res.data.money,
            })
          }
        })
      },
    })
  },
  gettotalprice: function () {
    var that = this, gwcprice = this.data.gwcprice, mjmoney = this.data.mjmoney, xyhmoney = this.data.xyhmoney, yhqkdje = this.data.yhqkdje, hbkdje = this.data.hbkdje;
    var totalyh = (Number(mjmoney) + Number(xyhmoney) + Number(yhqkdje) + Number(hbkdje)).toFixed(2),
      totalPrice = (Number(gwcprice) - totalyh).toFixed(2);
    if (totalPrice < 0) {
      totalPrice = 0
    }
    console.log('gwcprice', gwcprice, 'mjmoney', mjmoney, 'xyhmoney', xyhmoney, 'totalyh', totalyh, 'totalPrice', totalPrice, 'yhqkdje', yhqkdje, 'hbkdje', hbkdje)
    that.setData({
      totalyh: totalyh,
      totalPrice: totalPrice,
      isloading:false,
    })
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
  countMj: function () {
    var that = this, gwcprice = this.data.gwcprice, reduction = this.data.reduction.reverse(), mjindex = that.jsmj(gwcprice, reduction), isnewuser = this.data.isnewuser;
    console.log(gwcprice, reduction, mjindex, isnewuser)
    var mjmoney = 0
    if (reduction.length > 0 && mjindex!=null&& isnewuser == '2') {
      mjmoney = reduction[mjindex].reduction
    }
    this.setData({
      reduction: reduction,
      mjindex: mjindex,
      mjmoney: mjmoney,
    })
    this.gettotalprice()
  },
  formSubmit: function (e) {
    var zffs = this.data.zffs
    console.log(e, zffs)
    if (zffs == null) {
      wx.showModal({
        title: '提示',
        content: '请选择支付方式',
      })
      return false
    }
    var list = [], cart_list = this.data.cart_list;
    cart_list.map(function (item) {
      if (item.num > 0) {
        var obj = {};
        obj.name = item.name;
        obj.img = item.logo;
        obj.num = item.num;
        obj.money = item.money;
        obj.dishes_id = item.good_id;
        obj.spec = item.spec;
        list.push(obj);
      }
    })
    console.log(list)
    var that = this;
    var openid = getApp().getOpenId;
    console.log('form发生了submit事件，携带数据为：', e.detail.value.radiogroup, this.data.activeradio, this.data.hbactiveradio,)
    var table_id = this.data.tableid, form_id = e.detail.formId, form_id2 = this.data.form_id2, uid = wx.getStorageSync('users').id, sjid = this.data.store.id, money = this.data.totalPrice, totalyh = this.data.totalyh, box_money = this.data.gwcinfo.box_money, mj_money = this.data.mjmoney, xyh_money = this.data.xyhmoney, order_type = parseInt(this.data.selectedindex) + 1, note = this.data.note, tableware = this.data.cjarray[this.data.cjindex], delivery_time, yhq_money = this.data.yhqkdje, coupon_id = this.data.activeradio, coupon_id2 = this.data.hbactiveradio, yhq_money2 = this.data.hbkdje;
    console.log('桌子id', table_id,openid, form_id, form_id2, uid, sjid, '实付', money, '总优惠', totalyh, '包装费', box_money, '满减金额', mj_money, '新用户money', xyh_money, '优惠券', yhq_money, '红包', yhq_money2, '订单类型', order_type,'留言', note, 'sz', list, '餐具数量',tableware)
    if (e.detail.value.radiogroup == 'yezf') {
      var ye = Number(this.data.userInfo.wallet), total = Number(money);
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
    if (e.detail.value.radiogroup == 'chzf') {
      var pay_type = 5;
    }
    console.log('支付方式', pay_type)
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
        'url': 'entry/wxapp/AddDnOrder',
        'cachetime': '0',
        data: { table_id: table_id, user_id: uid, store_id: sjid, money: money, discount: totalyh, mj_money: mj_money, xyh_money: xyh_money, note: note, type: 2,form_id: form_id, form_id2: form_id2, pay_type: pay_type, sz: list, tableware: tableware, yhq_money:yhq_money,yhq_money2:yhq_money2, coupon_id:coupon_id,coupon_id2:coupon_id2},
        success: function (res) {
          console.log(res)
          var order_id = res.data;
          that.setData({
            zfz: false,
            showModal: false,
          })
          if (e.detail.value.radiogroup == 'yezf') {
            console.log('余额支付流程')
            if (order_id == '已开台') {
              wx.showModal({
                title: '提示',
                content: '对不起，此桌已开台',
              })
            }
            else if (order_id != '下单失败') {
              that.setData({
                mdoaltoggle: false,
              })
              setTimeout(function () {
                wx.reLaunch({
                  url: '../wddd/order?status=4',
                })
              }, 1000)
              // 下单发送模板消息
              //WcDrShop
              if (that.data.drid != null) {
                console.log(that.data.drid)
                app.util.request({
                  'url': 'entry/wxapp/WcDrShop',
                  'cachetime': '0',
                  data: { id: that.data.drid },
                  success: function (res) {
                    console.log(res)
                  },
                })
              }
            }
            else {
              wx.showToast({
                title: '支付失败',
                icon: 'loading',
              })
            }
          }
          // else if (e.detail.value.radiogroup == 'jfzf') {
          //   console.log('积分支付流程')
          //   if (res.data != '下单失败') {
          //     wx.showToast({
          //       title: '支付成功',
          //     })
          //     setTimeout(function () {
          //       wx.redirectTo({
          //         url: '../my/wddd/order',
          //       })
          //     }, 1000)
          //     // 下单发送模板消息
          //     app.util.request({
          //       'url': 'entry/wxapp/Message',
          //       'cachetime': '0',
          //       data: { openid: openid, form_id: form_id, store_name: sjname, money: money + '元' },
          //       success: function (res) {
          //         console.log(res)
          //         wx.showToast({
          //           title: '支付成功',
          //           duration: 2000
          //         })
          //       },
          //     })
          //   }
          //   else {
          //     wx.showToast({
          //       title: '支付失败',
          //       icon: 'loading',
          //     })
          //   }
          // }
          if (e.detail.value.radiogroup == 'chzf') {
            console.log('餐后支付流程')
            if (order_id == '已开台') {
              wx.showModal({
                title: '提示',
                content: '对不起，此桌已开台',
              })
            }
            else if (order_id != '下单失败') {
              that.setData({
                mdoaltoggle: false,
              })
              setTimeout(function () {
                wx.reLaunch({
                  url: '../wddd/order',
                })
              }, 1000)
              // 下单发送模板消息
              //WcDrShop
              if (that.data.drid != null) {
                console.log(that.data.drid)
                app.util.request({
                  'url': 'entry/wxapp/WcDrShop',
                  'cachetime': '0',
                  data: { id: that.data.drid },
                  success: function (res) {
                    console.log(res)
                  },
                })
              }
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
              if (order_id == '已开台') {
                wx.showModal({
                  title: '提示',
                  content: '对不起，此桌已开台',
                })
              }
              else if (order_id != '下单失败') {
                app.util.request({
                  'url': 'entry/wxapp/pay',
                  'cachetime': '0',
                  data: { openid: openid, money: money, order_id: order_id },
                  success: function (res) {
                    console.log(res)
                    //WcDrShop
                    if (that.data.drid != null) {
                      console.log(that.data.drid)
                      app.util.request({
                        'url': 'entry/wxapp/WcDrShop',
                        'cachetime': '0',
                        data: { id: that.data.drid },
                        success: function (res) {
                          console.log(res)
                        },
                      })
                    }
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
                            wx.reLaunch({
                              url: '../wddd/order',
                            })
                          }, 1000)
                        }
                        if (res.errMsg == 'requestPayment:ok') {
                          that.setData({
                            mdoaltoggle: false,
                          })
                          setTimeout(function () {
                            wx.reLaunch({
                              url: '../wddd/order?status=4',
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
    var note=wx.getStorageSync('note')
    console.log(note)
    this.setData({
      note:note
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

  }
})