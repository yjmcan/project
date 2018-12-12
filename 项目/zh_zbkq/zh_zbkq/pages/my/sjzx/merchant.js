// zh_tcwq/pages/merchant/merchant.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    iszd: false,
  },
  qxzd: function () {
    this.setData({
      iszd: false,
    })
  },
  dkxf: function (e) {
    this.setData({
      iszd: true,
    })
  },
  // --------------------------------------选择的置顶信息-------------------------------------
  selected: function (e) {
    var that = this
    var uid = wx.getStorageSync('UserData').id, index = e.currentTarget.id, openid = getApp().getOpenId, sjid = wx.getStorageSync('store_id');
    var stick = that.data.stick, money = stick[index].money, xfts = stick[index].days;
    that.setData({
      iszd: false,
    })
    console.log(Number(money), openid, xfts, sjid)
    if (Number(money) <= 0) {
      app.util.request({
        'url': 'entry/wxapp/RzXf',
        'cachetime': '0',
        data: { id: sjid, day: xfts },
        success: function (res) {
          console.log(res)
          if(res.data==1){
            wx.showModal({
              title: '提示',
              content: '续费成功',
              showCancel: false,
            })
            //RzOrder
            app.util.request({
              'url': 'entry/wxapp/RzOrder',
              'cachetime': '0',
              data: { user_id: uid, store_id: sjid, day: xfts, money: money },
              success: function (res) {
                console.log(res)
              }
            });
          }
        },
      })
      setTimeout(function () {
        that.refresh1()
      }, 1000)
    }
    else {
      app.util.request({
        'url': 'entry/wxapp/Pay',
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
              wx.showModal({
                title: '提示',
                content: '支付成功',
                showCancel: false,
              })
              //RzOrder
              app.util.request({
                'url': 'entry/wxapp/RzOrder',
                'cachetime': '0',
                data: { user_id: uid, store_id: sjid, day: xfts, money: money },
                success: function (res) {
                  console.log(res)
                }
              });
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
                app.util.request({
                  'url': 'entry/wxapp/RzXf',
                  'cachetime': '0',
                  data: { id: sjid, day: xfts },
                  success: function (res) {
                    console.log(res)
                  },
                })
                setTimeout(function () {
                  that.refresh1()
                }, 1000)
              }
            }
          })
        },
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.hideShareMenu()
    // wx.setNavigationBarColor({
    //   frontColor: '#ffffff',
    //   backgroundColor: wx.getStorageSync('color'),
    //   animation: {
    //     duration: 0,
    //     timingFunc: 'easeIn'
    //   }
    // })
    // var money = wx.getStorageSync('users').money
    // if (money == null) {
    //   var money = 0
    // }
    // var url = wx.getStorageSync('url')
    // that.setData({
    //   url: url
    // })
    // var formatDate = function (date) {
    //   var y = date.getFullYear();
    //   var m = date.getMonth() + 1;
    //   m = m < 10 ? '0' + m : m;
    //   var d = date.getDate();
    //   d = d < 10 ? ('0' + d) : d;
    //   return y + '-' + m + '-' + d;
    // };
    // app.util.request({
    //   'url': 'entry/wxapp/StoreInfo',
    //   'cachetime': '0',
    //   data: { id: options.id },
    //   success: function (res) {
    //     console.log(res)
    //     that.setData({
    //       seller: res.data.store[0]
    //     })
    //     that.refresh()

    //   },
    // })
    app.util.request({
      'url': 'entry/wxapp/GetVip',
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        that.setData({
          vupset: res.data,
          url: getApp().imgurl,
        })
      },
    })
    // -------------------------------获取置顶费用-------------------------
    app.util.request({
      'url': 'entry/wxapp/RzSet',
      'cachetime': '0',
      success: res => {
        console.log(res);
        that.setData({
          stick: res.data,
        })
      }
    })
    app.util.request({
      'url': 'entry/wxapp/StoreKh',
      'cachetime': '0',
      data: { md_id: wx.getStorageSync('store_id') },
      success: res => {
        console.log(res);
        that.setData({
          wdkh: res.data,
        })
      }
    })
    console.log(wx.getStorageSync('store_id'))
    this.refresh1();
  },
  refresh1: function () {
    var that = this;
    var store_id = wx.getStorageSync('store_id')
    console.log(store_id)
    app.util.request({
      'url': 'entry/wxapp/StoreInfo',
      'cachetime': '0',
      data: { store_id: store_id },
      success: function (res) {
        console.log(res)
        res.data.rzdq_time = res.data.rzdq_time.substring(0, 10)
        that.setData({
          StoreInfo: res.data
        })
        //取用户信息
        app.util.request({
          'url': 'entry/wxapp/GetUserInfo',
          'cachetime': '0',
          data: { user_id: res.data.user_id },
          success: function (res) {
            console.log(res.data)
            that.setData({
              userinfo: res.data,
            })
          }
        });
        // that.refresh()

      },
    })
  },
  // refresh: function (e) {
  //   var that = this
  //   console.log(that.data.seller)
  //   this.setData({
  //     dqdate: app.ormatDate(that.data.seller.dq_time).substring(0, 10),
  //   })
  //   function getNowFormatDate() {
  //     var date = new Date();
  //     var seperator1 = "/";
  //     var seperator2 = ":";
  //     var month = date.getMonth() + 1;
  //     var strDate = date.getDate();
  //     if (month >= 1 && month <= 9) {
  //       month = "0" + month;
  //     }
  //     if (strDate >= 0 && strDate <= 9) {
  //       strDate = "0" + strDate;
  //     }
  //     var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
  //       + " " + date.getHours() + seperator2 + date.getMinutes()
  //       + seperator2 + date.getSeconds();
  //     return currentdate;
  //   }
  //   var time = getNowFormatDate().slice(0, 10)
  //   console.log(time)
  //   var store_id = that.data.seller.id
  //   app.util.request({
  //     'url': 'entry/wxapp/StoreOrder',
  //     'cachetime': '0',
  //     data: {
  //       store_id: store_id
  //     },
  //     success: function (res) {
  //       console.log(res)
  //       var formatDate1 = function (date) {
  //         var y = date.getFullYear();
  //         var m = date.getMonth() + 1;
  //         m = m < 10 ? '0' + m : m;
  //         var d = date.getDate();
  //         d = d < 10 ? ('0' + d) : d;
  //         return y + '-' + m + '-' + d;
  //       };
  //       var day1 = new Date();
  //       day1.setTime(day1.getTime() - 24 * 60 * 60 * 1000);
  //       var s1 = formatDate1(day1).replace(/-/g, "/");
  //       console.log(s1)
  //       if (res.data.length != 0) {
  //         var store_money = res.data
  //         var profit = 0
  //         var yestoday = []
  //         var today = []
  //         for (let i in store_money) {
  //           store_money[i].time = app.ormatDate(store_money[i].time).slice(0, 10).replace(/-/g, "/")
  //           if (store_money[i].state == '4') {
  //             profit += Number(store_money[i].money)
  //             if (s1 == store_money[i].time) {
  //               console.log('有昨天的订单')
  //               yestoday.push(store_money[i])
  //             }
  //             if (time == store_money[i].time) {
  //               console.log('有今天的订单')
  //               console.log(store_money[i])
  //               today.push(store_money[i])
  //             }
  //           }
  //         }
  //         var yes_profit = 0
  //         for (let i in yestoday) {
  //           yes_profit += Number(yestoday[i].money)
  //         }
  //         var toady_profit = 0
  //         for (let i in today) {
  //           toady_profit += Number(today[i].money)
  //         }
  //         that.setData({
  //           profit: profit.toFixed(2),
  //           yes_profit: yes_profit,
  //           toady_profit: toady_profit
  //         })
  //         // app.util.request({
  //         //   'url': 'entry/wxapp/StoreTiXian',
  //         //   'cachetime': '0',
  //         //   data: {
  //         //     store_id: store_id
  //         //   },
  //         //   success: function (res) {
  //         //     var order = res.data
  //         //     var tixian = 0
  //         //     for (let i in order) {
  //         //       tixian += Number(order[i].tx_cost)
  //         //     }
  //         //     that.setData({
  //         //       tixian: tixian.toFixed(2)
  //         //     })
  //         //     that.setData({
  //         //       profit: (profit-tixian).toFixed(2),
  //         //       yes_profit: yes_profit,
  //         //       toady_profit: toady_profit
  //         //     })
  //         //   }
  //         // })

  //       } else {
  //         that.setData({
  //           profit: 0,
  //           yes_profit: 0,
  //           toady_profit: 0
  //         })
  //       }

  //     }
  //   })
  // },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  yemx: function (e) {
    var that = this;
    wx.navigateTo({
      url: 'wallet/wallet?store_id=' + that.data.seller.id,
    })
  },
  // 我的店铺
  more: function (e) {
    console.log(e)
    var store_id = this.data.seller.id
    wx: wx.navigateTo({
      url: '../sellerinfo/sellerinfo?id=' + store_id,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  cash: function (e) {
    wx: wx.navigateTo({
      url: '../logs/cash?&state=' + 2 + '&store_id=' + this.data.seller.id + '&profit=' + this.data.seller.wallet,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  fuck: function (e) {
    wx: wx.navigateTo({
      url: '../logs/publish?store_id=' + this.data.seller.id,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  // ——————————————
  customer: function (e) {
    wx: wx.navigateTo({
      url: 'customer/customer?user_id=' + this.data.seller.id,
    })
  },
  sent: function (e) {
    wx: wx.navigateTo({
      url: 'sent?user_id=' + this.data.seller.id,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  mechat: function (e) {
    wx: wx.navigateTo({
      url: '../logs/index?user_id=' + this.data.seller.id,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  mine_shop: function (e) {
    wx: wx.navigateTo({
      url: 'commodity?store_id=' + this.data.seller.id,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  interests: function (e) {
    wx: wx.showModal({
      title: '提示',
      content: '此功能暂未开放',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '',
      confirmText: '确定',
      confirmColor: '',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  vip: function (e) {
    wx: wx.showModal({
      title: '提示',
      content: '此功能暂未开放',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '',
      confirmText: '确定',
      confirmColor: '',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  tuichu: function (e) {
    wx.removeStorage({
      key: 'store_id',
      success: function (res) {
        wx.showToast({
          title: '退出登陆',
        })
        setTimeout(function () {
          wx: wx.navigateBack({
            delta: 1,
          })
        }, 2000)
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // this.onLoad()
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