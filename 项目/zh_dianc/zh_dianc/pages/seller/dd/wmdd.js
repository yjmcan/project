// zh_dianc/pages/seller/dd.js
var app = getApp();
var dsq;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabbar: {},
    tabs: ['待接单', '待配送', '退款订单','已完成'],
    activeIndex: 0,
    fwxy: true,
    date: '',
    pagenum: 1,
    ddlist: [],
    mygd: false,
    jzgd: true,
    jzwb: false,
  },
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  sousuo: function () {
    this.setData({
      pagenum: 1,
      ddlist: [],
      mygd: false,
      jzgd: true,
      jzwb: false,
    })
    this.reLoad(this.data.date)
  },
  rrjd: function (e) {
    var that = this;
    var oid = e.currentTarget.dataset.oid, istake = e.currentTarget.dataset.istake;
    console.log(oid, istake)
    if (istake == '2') {
      wx.showModal({
        title: '提示',
        content: '确定接单吗？',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            wx.showModal({
              title: '提示',
              content: '正在请求人人快递第三方接口，请耐心等待！不要重复点接单',
            })
            app.util.request({
              'url': 'entry/wxapp/RrOrder',
              'cachetime': '0',
              data: { order_id: oid },
              success: function (res) {
                console.log(res, res.data.indexOf('下单成功'))
                if (res.data.indexOf('下单成功') != -1) {
                  wx.showToast({
                    title: '接单成功',
                    duration: 1000,
                  })
                  setTimeout(function () {
                    that.setData({
                      pagenum: 1,
                      ddlist: [],
                      mygd: false,
                      jzgd: true,
                      jzwb: false,
                    })
                    that.reLoad(that.data.date)
                  }, 1000)
                }
                else {
                  wx.showModal({
                    title: '请求报错',
                    content: res.data,
                  })
                }
              },
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
    else {
      wx.showModal({
        title: '提示',
        content: '确定接单吗？',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            app.util.request({
              'url': 'entry/wxapp/JieOrder',
              'cachetime': '0',
              data: { order_id: oid },
              success: function (res) {
                console.log(res)
                if (res.data == 1) {
                  wx.showToast({
                    title: '接单成功',
                    duration: 1000,
                  })
                  setTimeout(function () {
                    that.setData({
                      pagenum: 1,
                      ddlist: [],
                      mygd: false,
                      jzgd: true,
                      jzwb: false,
                    })
                    that.reLoad(that.data.date)
                  }, 1000)
                }
              },
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },
  lookck: function (e) {
    var that=this;
    var oid = e.currentTarget.dataset.oid,istake = e.currentTarget.dataset.istake;
    console.log(oid,istake)
    if (istake == '2') {
      this.setData({
        fwxy: false
      })
      // GetOrderPrice
      app.util.request({
        'url': 'entry/wxapp/GetOrderPrice',
        'cachetime': '0',
        data: { order_id: e.currentTarget.dataset.oid },
        success: function (res) {
          console.log(res)
          console.log('uu信息', JSON.parse(res.data))
          that.setData({
            uuinfo: JSON.parse(res.data),
            oid:oid,
          })
        }
      })
    }
    else{
      wx.showModal({
        title: '提示',
        content: '确定接单吗？',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            app.util.request({
              'url': 'entry/wxapp/JieOrder',
              'cachetime': '0',
              data: { order_id: oid },
              success: function (res) {
                console.log(res)
                if (res.data == 1) {
                  wx.showToast({
                    title: '接单成功',
                    duration: 1000,
                  })
                  setTimeout(function () {
                    that.setData({
                      pagenum: 1,
                      ddlist: [],
                      mygd: false,
                      jzgd: true,
                      jzwb: false,
                    })
                    that.reLoad(that.data.date)
                  }, 1000)
                }
              },
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },
  qx: function () {
    this.setData({
      fwxy: true,
      uuinfo: '',
    })
  },
  queren: function () {
    var that = this;
    var oid = this.data.oid, uuinfo=this.data.uuinfo;
    console.log(oid, uuinfo)
    if(uuinfo!=null){
      app.util.request({
        'url': 'entry/wxapp/UuAddOrder',
        'cachetime': '0',
        data: { order_id: oid, price_token: uuinfo.price_token, total_money: uuinfo.total_money, need_paymoney: uuinfo.need_paymoney },
        success: function (res) {
          console.log(res, JSON.parse(res.data))
          if (JSON.parse(res.data).return_code == 'ok' && JSON.parse(res.data).return_msg == '订单发布成功') {
            wx.showToast({
              title: '接单成功',
              duration: 1000,
            })
            that.setData({
              fwxy: true,
              uuinfo: '',
            })
            setTimeout(function () {
              that.setData({
                pagenum: 1,
                ddlist: [],
                mygd: false,
                jzgd: true,
                jzwb: false,
              })
              that.reLoad(that.data.date)
            }, 1000)
          }
          else if (JSON.parse(res.data).return_msg == '账户余额不足，请使用在线支付方式'){
            wx.showToast({
              title: '账户余额不足',
              icon: 'loading',
            })
            that.setData({
              fwxy: true,
              uuinfo: '',
            })
          }
          else{
            wx.showToast({
              title: '网络错误',
              icon:'loading',
            })
            that.setData({
              fwxy: true,
              uuinfo: '',
            })
          }
        },
      })
    }
    else{
      wx.showToast({
        title: '网络错误',
      })
    }
  },
  tabClick: function (e) {
    this.setData({
      activeIndex: e.currentTarget.id
    });
  },
  dw:function(e){
    console.log(e.currentTarget.dataset)
   wx.openLocation({
     latitude: Number(e.currentTarget.dataset.lat),
     longitude: Number(e.currentTarget.dataset.lng),
     scale: 28,
     address: e.currentTarget.dataset.wz
   })
  },
  tel:function(e){
    console.log(e.currentTarget.dataset.tel)
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.tel,
    })
  },
  jied:function(e){
    var that=this;
    var oid = e.currentTarget.dataset.oid;
    console.log(oid);
    wx.showModal({
      title: '提示',
      content: '确定接单吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          app.util.request({
            'url': 'entry/wxapp/JieOrder',
            'cachetime': '0',
            data: { order_id: e.currentTarget.dataset.oid },
            success: function (res) {
              console.log(res)
              if (res.data == 1) {
                wx.showToast({
                  title: '接单成功',
                  duration: 1000,
                })
                setTimeout(function () {
                  that.setData({
                    pagenum: 1,
                    ddlist: [],
                    mygd: false,
                    jzgd: true,
                    jzwb: false,
                  })
                  that.reLoad(that.data.date)
                }, 1000)
              }
            },
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  wcps:function(e){
    var that = this;
    console.log('完成配送' + e.currentTarget.dataset.oid)
    wx.showModal({
      title: '提示',
      content: '确定完成配送吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          app.util.request({
            'url': 'entry/wxapp/Complete',
            'cachetime': '0',
            data: { id: e.currentTarget.dataset.oid },
            success: function (res) {
              console.log(res.data)
              if (res.data == '1') {
                wx.showToast({
                  title: '提交成功',
                  icon: 'success',
                  duration: 1000,
                })
                setTimeout(function () {
                  that.setData({
                    pagenum: 1,
                    ddlist: [],
                    mygd: false,
                    jzgd: true,
                    jzwb: false,
                  })
                  that.reLoad(that.data.date)
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
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  tgtk: function (e) {
    var that = this;
    console.log('通过退款' + e.currentTarget.dataset.oid)
    wx.showModal({
      title: '提示',
      content: '确定通过退款吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          app.util.request({
            'url': 'entry/wxapp/Tg',
            'cachetime': '0',
            data: { order_id: e.currentTarget.dataset.oid },
            success: function (res) {
              console.log(res.data)
              if (res.data == '1') {
                wx.showToast({
                  title: '提交成功',
                  icon: 'success',
                  duration: 1000,
                })
                setTimeout(function () {
                  that.setData({
                    pagenum: 1,
                    ddlist: [],
                    mygd: false,
                    jzgd: true,
                    jzwb: false,
                  })
                  that.reLoad(that.data.date)
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
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  jjtk: function (e) {
    var that = this;
    console.log('拒绝退款' + e.currentTarget.dataset.oid)
    wx.showModal({
      title: '提示',
      content: '确定拒绝退款吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          app.util.request({
            'url': 'entry/wxapp/Jj',
            'cachetime': '0',
            data: { order_id: e.currentTarget.dataset.oid },
            success: function (res) {
              console.log(res.data)
              if (res.data == '1') {
                wx.showToast({
                  title: '提交成功',
                  icon: 'success',
                  duration: 1000,
                })
                setTimeout(function () {
                  that.setData({
                    pagenum: 1,
                    ddlist: [],
                    mygd: false,
                    jzgd: true,
                    jzwb: false,
                  })
                  that.reLoad(that.data.date)
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
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  scdd: function (e) {
    var that = this;
    console.log('删除订单' + e.currentTarget.dataset.oid)
    wx.showModal({
      title: '提示',
      content: '确定删除吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          app.util.request({
            'url': 'entry/wxapp/Del',
            'cachetime': '0',
            data: { order_id: e.currentTarget.dataset.oid },
            success: function (res) {
              console.log(res.data)
              if (res.data == '1') {
                wx.showToast({
                  title: '提交成功',
                  icon: 'success',
                  duration: 1000,
                })
                setTimeout(function () {
                  that.setData({
                    pagenum: 1,
                    ddlist: [],
                    mygd: false,
                    jzgd: true,
                    jzwb: false,
                  })
                  that.reLoad(that.data.date)
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
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.editTabBar();
    var that=this;
    if (options.activeIndex){
      this.setData({
        activeIndex: parseInt(options.activeIndex)
      })
    }
    var sjdsjid = wx.getStorageSync('sjdsjid')
    console.log(sjdsjid)
    // Store
    app.util.request({
      'url': 'entry/wxapp/Store',
      'cachetime': '0',
      data: { id: sjdsjid },
      success: function (res) {
        console.log('商家信息',res)
          that.setData({
            psmode:res.data.ps_mode,
          })
      }
    })
    //提醒
    // if (wx.getStorageSync('yybb')) {
    //   dsq = setInterval(function () {
    //     app.util.request({
    //       'url': 'entry/wxapp/NewOrder',
    //       'cachetime': '0',
    //       data: { store_id: sjdsjid },
    //       success: function (res) {
    //         console.log(res)
    //         if (res.data == 1) {
    //           wx.playBackgroundAudio({
    //             dataUrl: wx.getStorageSync('url2') + 'addons/zh_dianc/template/images/wm.wav',
    //           })
    //         }
    //       },
    //     })
    //   }, 10000)
    // }
    this.reLoad(this.data.date)
  },
  reLoad:function(date){
    app.editTabBar();
    var sjdsjid = wx.getStorageSync('sjdsjid')
    console.log(sjdsjid)
    var that = this;
    //商家订单
    app.util.request({
      'url': 'entry/wxapp/StoreOrder',
      'cachetime': '0',
      data: { store_id: sjdsjid, page: that.data.pagenum, time: date },
      success: function (res) {
        console.log('分页返回的数据', res.data)
        if (res.data.length == 0) {
          that.setData({
            mygd: true,
            jzgd: true,
            jzwb: true,
          })
        }
        else {
          that.setData({
            jzgd: true,
            pagenum: that.data.pagenum + 1,
          })
        }
        var ddlist = that.data.ddlist;
        ddlist = ddlist.concat(res.data);
        var djd = [], dps = [], tkdd = [],ywc=[];
        for (var i = 0; i < ddlist.length; i++) {
          if (ddlist[i].order.state == '2') {
            djd.push(ddlist[i])
          }
          if (ddlist[i].order.state == '3') {
            dps.push(ddlist[i])
          }
          if (ddlist[i].order.state == '7' || ddlist[i].order.state == '8' || ddlist[i].order.state == '9') {
            tkdd.push(ddlist[i])
          }
          if (ddlist[i].order.state == '4' || ddlist[i].order.state == '6') {
            ywc.push(ddlist[i])
          }
        }
        console.log(djd, dps, tkdd,ywc)
        that.setData({
          djd: djd,
          dps: dps,
          tkdd: tkdd,
          ywc:ywc,
          ddlist: ddlist,
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
    clearInterval(dsq)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      date: '',
      pagenum: 1,
      ddlist: [],
      mygd: false,
      jzgd: true,
      jzwb: false,
    })
    this.reLoad(this.data.date);
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('上拉加载', this.data.pagenum)
    var that = this;
    if (!this.data.mygd && this.data.jzgd) {
      this.setData({
        jzgd: false
      })
      this.reLoad(this.data.date);
    }
    else {
      // wx.showToast({
      //   title: '没有更多了',
      //   icon: 'loading',
      //   duration: 1000,
      // })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})