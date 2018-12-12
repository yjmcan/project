// pages/reserve/reserve.js
var app = getApp()
var form_id;
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: '',
    index: 0,
    jindex: 0,
    time: '12:00',
    array: [],
    jcrsarray: ['1人', '2人', '3人', '4人', '5人', '6人', '7人', '8人', '9人', '10人', '10人以上',],
    showModal: false,
    zftype: true,
    zffs: 1,
    zfz: false,
    zfwz: '微信支付',
    btntype: 'btn_ok1',
    mdoaltoggle:true,
    radioItems: [
      { name: '只订座', value: '0', checked: true },
      { name: '提前选商品', value: '1' }
    ],
    items: [{ name: '先生', value: 1, checked: true }, { name: '女士', value: 2 }]
  },
  radioChange1: function (e) {
    console.log('radio111发生change事件，携带value值为：', e.detail.value);

    var radioItems = this.data.radioItems;
    for (var i = 0, len = radioItems.length; i < len; ++i) {
      radioItems[i].checked = radioItems[i].value == e.detail.value;
    }

    this.setData({
      radioItems: radioItems
    });
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
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    this.setData({
      zflx: e.detail.value
    })
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
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  bindTimeChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      time: e.detail.value
    })
  },
  bindjcrsChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      jindex: e.detail.value
    })
  },
  formSubmit: function (e) {
    var that = this, uid = wx.getStorageSync('users').id;
    form_id = e.detail.formId
    that.setData({
      form_id: form_id
    })
    app.util.request({
      'url': 'entry/wxapp/AddFormId',
      'cachetime': '0',
      data: { user_id: uid, form_id: e.detail.formId },
      success: function (res) {
        console.log(res.data)
      },
    })
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    var array = this.data.array
    console.log(array)
    if (array.length == 0) {
      wx.showModal({
        title: '提示',
        content: '商家暂未添加桌位类型，暂时不能预定',
      })
      return
    }
    var openid = getApp().getOpenId;
    var sjname = this.data.store.name
    var storeid = this.data.store.id, is_yydc = this.data.StoreInfo.storeset.is_yydc;
    var date = e.detail.value.datepicker, time = e.detail.value.timepicker, lxr = e.detail.value.lxr, jcrs = e.detail.value.jcrs, tel = e.detail.value.tel, beizhu = e.detail.value.beizhu, ydtype = e.detail.value.radioChange1;
    if (e.detail.value.zwpicker != null) {
      var zwtype = e.detail.value.zwpicker.name,
        zwid = e.detail.value.zwpicker.id, zdxf = e.detail.value.zwpicker.zd_cost, ydcost = parseFloat(e.detail.value.zwpicker.yd_cost);
    }
    else {
      var zwtype = '', zwid = '', zdxf = 0, ydcost = 0;
    }
    if (is_yydc == '1' && ydtype == '1') {
      var money = (ydcost + Number(this.data.gwcprice)).toFixed(2)
    }
    else {
      var money = ydcost
    }
    if (ydtype == '1' && this.data.cart_list.length == 0) {
      wx.showModal({
        title: '提示',
        content: '请前往选择商品',
      })
      return
    }
    console.log(money, openid, sjname, uid, storeid, date, time, zwtype, zwid, lxr, jcrs, tel, ydcost, beizhu, ydtype, is_yydc)
    that.setData({
      totalprice: money,
      ydcost: ydcost,
      forminfo: e.detail.value
    })
    var warn = "";
    var flag = true;
    if (lxr == "") {
      warn = "请填写您的姓名！";
    } else if (jcrs == '') {
      warn = "请选择您的就餐人数"
    } else if (tel == "") {
      warn = "请填写您的手机号！";
    } else if (tel.length < 7) {
      warn = "手机号格式不正确";
    } else {
      flag = false;
      that.setData({
        showModal: true,
      })
    }
    if (flag == true) {
      wx.showModal({
        title: '提示',
        content: warn
      })
    }
  },
  qdzf: function (e) {
    var that = this;
    var forminfo = this.data.forminfo, zflx = this.data.zffs;
    var openid = getApp().getOpenId;
    var sjname = this.data.store.name
    var uid = wx.getStorageSync('users').id;
    if (zflx == '2') {
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
    app.util.request({
      'url': 'entry/wxapp/AddFormId',
      'cachetime': '0',
      data: { user_id: uid, form_id: e.detail.formId },
      success: function (res) {
        console.log(res.data)
      },
    })
    var storeid = this.data.store.id, is_yydc = this.data.StoreInfo.storeset.is_yydc;
    var date = this.data.date, time = this.data.time, lxr = forminfo.lxr, jcrs = forminfo.jcrs, tel = forminfo.tel, beizhu = forminfo.beizhu, ydtype = forminfo.radioChange1, sex = forminfo.sexradiogroup;
    if (forminfo.zwpicker != null) {
      var zwtype = forminfo.zwpicker.name,
        zwid = forminfo.zwpicker.id, zdxf = forminfo.zwpicker.zd_cost, ydcost = parseFloat(forminfo.zwpicker.yd_cost);
    }
    else {
      var zwtype = '', zwid = '', zdxf = 0, ydcost = 0;
    }
    var list = [], cart_list = this.data.cart_list, money = this.data.totalprice;
    if (ydtype == '1') {
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
    }
    console.log(money, cart_list, list)
    console.log(openid, sjname, uid, storeid, date, time, zwtype, zwid, lxr, jcrs, tel, ydcost, beizhu, ydtype, is_yydc, sex)
    console.log(forminfo, form_id, zflx)
    this.setData({
      zfz: true,
    })
    app.util.request({
      'url': 'entry/wxapp/AddYyOrder',
      'cachetime': '0',
      data: {
        store_id: storeid, user_id: uid, delivery_time: date + ' ' + time, pay_type: zflx, sex: sex, sz: list,
        table_id: zwid, deposit: ydcost, name: lxr, tel: tel, tableware: jcrs, note: beizhu, money: money,
      },
      success: function (res) {
        console.log(res)
        var order_id = res.data;
        if (res.data != '下单失败') {
          that.setData({
            zfz: false,
            showModal: false,
          })
          if (zflx == 2) {
            console.log('余额支付流程')
            that.setData({
              mdoaltoggle: false,
            })
            setTimeout(function () {
              wx.redirectTo({
                url: 'reserveinfo?oid=' + order_id,
              })
            }, 1000)
          }
          if (zflx == 1) {
            console.log('微信支付流程')
            if (Number(money) > 0) {
              app.util.request({
                'url': 'entry/wxapp/pay',
                'cachetime': '0',
                data: { openid: openid, money: money, order_id: order_id },
                success: function (res) {
                  console.log(res)
                  //  var ydcode = res.data.b
                  // 支付
                  wx.requestPayment({
                    'timeStamp': res.data.timeStamp,
                    'nonceStr': res.data.nonceStr,
                    'package': res.data.package,
                    'signType': res.data.signType,
                    'paySign': res.data.paySign,
                    'success': function (res) {
                      console.log(res)
                    },
                    'complete': function (res) {
                      console.log(res)
                      if (res.errMsg == 'requestPayment:fail cancel') {
                        wx.showToast({
                          title: '取消支付',
                          icon: 'loading'
                        })
                        that.setData({
                          zfz: false,
                        })
                      }
                      if (res.errMsg == 'requestPayment:ok') {
                        that.setData({
                          mdoaltoggle: false,
                        })
                        setTimeout(function () {
                          wx.redirectTo({
                            url: 'reserveinfo?oid=' + order_id,
                          })
                        }, 1000)
                      }
                    }
                  })
                },
              })
            }
            else{
              that.setData({
                mdoaltoggle: false,
              })
              setTimeout(function () {
                wx.redirectTo({
                  url: 'reserveinfo?oid=' + order_id,
                })
              }, 1000)
            }
          }
        }
        else {
          wx.showToast({
            title: '请重试',
            icon: 'loading',
            duration: 1000,
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.setNavigationBarColor(this);
    var that = this, storeid = options.storeid;
    var end = util.formatTime(new Date).substring(0, 10).replace(/\//g, "-");
    var user_id = wx.getStorageSync('users').id
    console.log(storeid, end.toString(), user_id)
    this.setData({
      date: end,
      storeid: storeid,
      zuid: user_id
    })
    // app.util.request({
    //   'url': 'entry/wxapp/system',
    //   'cachetime': '0',
    //   success: function (res) {
    //     console.log(res)
    //     that.setData({
    //       ptxx: res.data,
    //       jf_proportion: res.data.jf_proportion,
    //     })
    //     if (res.data.is_yue == '1') {
    //       that.setData({
    //         ptkqyue: true
    //       })
    //     }
    //     else {
    //       that.setData({
    //         ptkqyue: false
    //       })
    //     }
    //     if (res.data.is_jfpay == '1') {
    //       that.setData({
    //         ptkqjf: true
    //       })
    //     }
    //     else {
    //       that.setData({
    //         ptkqjf: false
    //       })
    //     }
    //   },
    // })
    // 积分
    app.util.request({
      'url': 'entry/wxapp/UserInfo',
      'cachetime': '0',
      data: { user_id: user_id },
      success: function (res) {
        console.log(res)
        that.setData({
          userInfo: res.data,
          wallet: res.data.wallet,
          total_score: res.data.total_score,
        })
      }
    })
    app.util.request({
      'url': 'entry/wxapp/TableType',
      'cachetime': '0',
      data: { store_id: storeid },
      success: function (res) {
        console.log(res)
        that.setData({
          array: res.data,
        })
      },
    })
    app.util.request({
      'url': 'entry/wxapp/StoreInfo',
      'cachetime': '0',
      data: { store_id: storeid, type: 2 },
      success: function (res) {
        console.log(res.data)
        var StoreInfo = res.data;
        if (StoreInfo.storeset.is_hdfk == '1') {
          that.setData({
            hdfk: true,
          })
        }
        if (getApp().xtxx.is_yuepay == '1' &&StoreInfo.storeset.is_yuepay == '1') {
          that.setData({
            kqyue: true,
          })
        }
        that.setData({
          StoreInfo: StoreInfo,
          store: StoreInfo.store,
          time: StoreInfo.store.time
        })
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
    var that = this, storeid = this.data.storeid, user_id = wx.getStorageSync('users').id;
    app.util.request({
      'url': 'entry/wxapp/mycar',
      'cachetime': '0',
      data: {
        store_id: storeid, user_id: user_id, type: 2
      },
      success: function (res) {
        console.log(res)
        that.setData({
          cart_list: res.data.res,
          gwcinfo: res.data,
          gwcprice: res.data.money,
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

  }
})