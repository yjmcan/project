var app = getApp();
Page({
  data: {
    status: 1,
    order_list: [],
    show_no_data_tip: !1,
    hide: 1,
    qrcode: "",
    pagenum: 1,
    storelist: [],
    mygd: false,
    jzgd: true,
  },
  onLoad: function (t) {
    // e.pageOnLoad(this);
    var that = this;
    var xtxx = wx.getStorageSync('xtxx')
    var url = getApp().imgurl;
    console.log(xtxx)
    this.setData({
      xtxx: xtxx,
      url: url,
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: xtxx.link_color,
    })
    var r = this;
    console.log(t)
    r.setData({
      status: t.status
    })
    this.reLoad();
    // o = !1,
    //   a = !1,
    //   s = 2,
    //   r.loadOrderList(t.status || -1),
    //   getCurrentPages().length < 2 && r.setData({
    //     show_index: !0
    //   })
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
  reLoad: function () {
    var that = this, status = this.data.status || 1, user_id = wx.getStorageSync('UserData').id, page = this.data.pagenum;
    if (status == '4') {
      status = '4,5';
    }
    if (status == '5') {
      status = '6,7,8';
    }
    console.log(status, user_id, page)
    app.util.request({
      'url': 'entry/wxapp/MyMallOrder',
      'cachetime': '0',
      data: { state: status, user_id: user_id, page: page, pagesize: 10 },
      success: function (res) {
        console.log('分页返回的列表数据', res.data)
        if (res.data.length < 3) {
          that.setData({
            mygd: true,
            jzgd: true,
          })
        }
        else {
          that.setData({
            jzgd: true,
            pagenum: that.data.pagenum + 1,
          })
        }
        var storelist = that.data.storelist;
        storelist = storelist.concat(res.data);
        function unrepeat(arr) {
          var newarr = [];
          for (var i = 0; i < arr.length; i++) {
            if (newarr.indexOf(arr[i]) == -1) {
              newarr.push(arr[i]);
            }
          }
          return newarr;
        }
        storelist = unrepeat(storelist)
        that.setData({
          order_list: storelist,
          storelist: storelist
        })
        console.log(storelist)
      }
    });
  },
  // loadOrderList: function (o) {
  //   void 0 == o && (o = -1);
  //   var a = this;
  //   a.setData({
  //     status: o
  //   }),
  //     wx.showLoading({
  //       title: "正在加载",
  //       mask: !0
  //     }),
  //     e.request({
  //       url: t.order.list,
  //       data: {
  //         status: a.data.status
  //       },
  //       success: function (t) {
  //         0 == t.code && a.setData({
  //           order_list: t.data.list
  //         }),
  //           a.setData({
  //             show_no_data_tip: 0 == a.data.order_list.length
  //           })
  //       },
  //       complete: function () {
  //         wx.hideLoading()
  //       }
  //     })
  // },
  onReachBottom: function () {
    console.log('上拉加载', this.data.pagenum)
    var that = this;
    if (!this.data.mygd && this.data.jzgd) {
      this.setData({
        jzgd: false
      })
      this.reLoad();
    }
    else {
    }
    // var r = this;
    // a || o || (a = !0, e.request({
    //   url: t.order.list,
    //   data: {
    //     status: r.data.status,
    //     page: s
    //   },
    //   success: function (t) {
    //     if (0 == t.code) {
    //       var e = r.data.order_list.concat(t.data.list);
    //       r.setData({
    //         order_list: e
    //       }),
    //         0 == t.data.list.length && (o = !0)
    //     }
    //     s++
    //   },
    //   complete: function () {
    //     a = !1
    //   }
    // }))
  },
  orderPay: function (e) {
    var openid = getApp().getOpenId;
    var uid = wx.getStorageSync('UserData').id, oid = e.currentTarget.dataset.id, money = e.currentTarget.dataset.money;
    console.log(openid, uid, oid, money)
    wx.showLoading({
      title: "正在提交",
      mask: !0
    }),
      app.util.request({
        'url': 'entry/wxapp/pay3',
        'cachetime': '0',
        data: { openid: openid, money: money, order_id: oid },
        success: function (res) {
          console.log(res)
          wx.hideLoading()
          wx.requestPayment({
            'timeStamp': res.data.timeStamp,
            'nonceStr': res.data.nonceStr,
            'package': res.data.package,
            'signType': res.data.signType,
            'paySign': res.data.paySign,
            'success': function (res) {
              console.log(res.data)
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
                wx.showToast({
                  title: '支付成功',
                  duration: 1000
                })
                setTimeout(function () {
                  wx.redirectTo({
                    url: 'order',
                  })
                }, 1000)
              }
            }
          })
        },
      })
  },
  orderRevoke: function (e) {
    var a = this, oid = e.currentTarget.dataset.id;
    console.log(oid)
    wx.showModal({
      title: "提示",
      content: "是否取消该订单？",
      cancelText: "否",
      confirmText: "是",
      success: function (s) {
        if (s.cancel) return !0;
        s.confirm && (wx.showLoading({
          title: "操作中"
        }), app.util.request({
          'url': 'entry/wxapp/DelMallOrder',
          'cachetime': '0',
          data: { order_id: oid },
          success: function (res) {
            console.log(res.data)
            if (res.data == '1') {
              wx.showToast({
                title: '删除成功',
                icon: 'success',
                duration: 1000,
              })
              setTimeout(function () {
                wx.redirectTo({
                  url: 'order',
                })
              }, 1000)
            }
            else {
              wx.showToast({
                title: '请重试',
                icon: 'loading',
                duration: 1000,
              })
            }
          },
        }))
      }
    })
  },
  txsj: function (e) {
    var that = this;
    console.log('提醒商家' + e.currentTarget.dataset.tel)
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.tel,
    })
  },
  //申请退款
  sqtk: function (e) {
    var that = this;
    console.log('申请退款' + e.currentTarget.dataset.id)
    wx.showModal({
      title: '提示',
      content: '申请退款么',
      success: function (res) {
        if (res.cancel) return !0;
        res.confirm && (wx.showLoading({
          title: "操作中"
        }),
          app.util.request({
            'url': 'entry/wxapp/TkMallOrder',
            'cachetime': '0',
            data: { order_id: e.currentTarget.dataset.id },
            success: function (res) {
              console.log(res.data)
              if (res.data == '1') {
                wx.showToast({
                  title: '申请成功',
                  icon: 'success',
                  duration: 1000,
                })
                setTimeout(function () {
                  wx.redirectTo({
                    url: 'order?status=5',
                  })
                }, 1000)
              }
              else {
                wx.showToast({
                  title: '请重试',
                  icon: 'loading',
                  duration: 1000,
                })
              }
            },
          }))
      }
    })
  },
  qrsh: function (e) {
    var a = this, oid = e.currentTarget.dataset.id;
    console.log(oid)
    wx.showModal({
      title: "提示",
      content: "是否确认已收到货？",
      cancelText: "否",
      confirmText: "是",
      success: function (s) {
        if (s.cancel) return !0;
        s.confirm && (wx.showLoading({
          title: "操作中"
        }), app.util.request({
          'url': 'entry/wxapp/ShMallOrder',
          'cachetime': '0',
          data: { order_id: oid },
          success: function (res) {
            console.log(res.data)
            if (res.data == '1') {
              wx.showToast({
                title: '收货成功',
                icon: 'success',
                duration: 1000,
              })
              setTimeout(function () {
                wx.redirectTo({
                  url: 'order?status=4',
                })
              }, 1000)
            }
            else {
              wx.showToast({
                title: '请重试',
                icon: 'loading',
                duration: 1000,
              })
            }
          },
        }))
      }
    })
  },
  orderQrcode: function (o) {
    var a = this,
      s = a.data.order_list,
      r = o.target.dataset.index;
    wx.showLoading({
      title: "正在加载",
      mask: !0
    }),
      a.data.order_list[r].offline_qrcode ? (a.setData({
        hide: 0,
        qrcode: a.data.order_list[r].offline_qrcode
      }), wx.hideLoading()) : e.request({
        url: t.order.get_qrcode,
        data: {
          order_no: s[r].order_no
        },
        success: function (t) {
          0 == t.code ? a.setData({
            hide: 0,
            qrcode: t.data.url
          }) : wx.showModal({
            title: "提示",
            content: t.msg
          })
        },
        complete: function () {
          wx.hideLoading()
        }
      })
  },
  hide: function (t) {
    this.setData({
      hide: 1
    })
  }
});