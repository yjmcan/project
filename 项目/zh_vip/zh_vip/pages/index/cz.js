// zh_hyk/pages/index/cz.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    open: false,
    kong: true,
  },

  // form_save: function (e) {
  //   console.log(e)
  //   var form_id = e.detail.formId
  //   app.util.request({
  //     'url': 'entry/wxapp/AddFormId',
  //     data: {
  //       user_id: wx.getStorageSync('UserData').id,
  //       form_id: form_id
  //     },
  //     success: res => {
  //       console.log(res)
  //     }
  //   })
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var url = getApp().imgurl;
    var mdid = wx.getStorageSync('mdid')
    console.log(mdid)
    var uid = wx.getStorageSync('UserData').id;
    console.log(uid)
    app.util.request({
      'url': 'entry/wxapp/system',
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        that.setData({
          xtxx: res.data,
          url: url,
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
      },
    })
    //UserInfo
    app.util.request({
      'url': 'entry/wxapp/UserInfo',
      'cachetime': '0',
      data: { user_id: uid },
      success: function (res) {
        console.log('用户信息', res.data)
        that.setData({
          userInfo: res.data,
          discount: res.data.discount,
        })
        if (res.data.grade == '0') {
          wx.showModal({
            title: '提示',
            content: '开卡成为会员能享受优惠买单哦~',
          })
          setTimeout(function () {
            wx.redirectTo({
              url: '../my/login',
            })
          }, 1500)
        }
      }
    });
    //Store 
    app.util.request({
      'url': 'entry/wxapp/StoreInfo',
      'cachetime': '0',
      data: { id: mdid },
      success: function (res) {
        console.log('门店信息', res.data)
        // that.lqyhq(uid, res.data.id)
        that.setData({
          mdinfo: res.data,
        })
        wx.setNavigationBarTitle({
          title: '欢迎光临' + res.data.name,
        })
      }
    });
    // czhd
    app.util.request({
      'url': 'entry/wxapp/Czhd',
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        that.setData({
          czhd: res.data
        })
      }
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
  bindInput: function (e) {
    console.log(e.detail.value)
    this.setData({
      czje: e.detail.value
    })
    if (e.detail.value != '') {
      this.setData({
        kong: false,
      })
    }
    else {
      this.setData({
        kong: true,
      })
    }
  },
  tradeinfo: function () {
    var that = this;
    this.setData({
      open: !that.data.open
    })
  },
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail, e.detail.formId)
    var openid = getApp().getOpenId, money = e.detail.value.czje, czhd = this.data.czhd;
    var uid = wx.getStorageSync('UserData').id;
    var sjid=this.data.mdinfo.id;
    console.log(czhd)
    if (czhd.length == 0) {
      var zsmoney = 0
    }
    else if (Number(money) >= Number(this.data.czhd[czhd.length - 1].full)) {
      var czhdindex = this.jsmj(money, czhd)
      console.log(czhdindex)
      var zsmoney = Number(czhd[czhdindex].reduction)
    }
    else {
      var zsmoney = 0
    }
    console.log(openid, money, uid, zsmoney,sjid)
    // AddCzOrder
    app.util.request({
      'url': 'entry/wxapp/AddCzOrder',
      'cachetime': '0',
      data: { user_id: uid, money: money, money2: zsmoney, store_id: sjid, form_id: e.detail.formId},
      success: function (res) {
        console.log(res)
        if (res.data != '下单失败') {
          app.util.request({
            'url': 'entry/wxapp/pay2',
            'cachetime': '0',
            data: { openid: openid, money: money,order_id:res.data },
            success: function (res) {
              console.log(res)
              // 支付
              wx.requestPayment({
                'timeStamp': res.data.timeStamp,
                'nonceStr': res.data.nonceStr,
                'package': res.data.package,
                'signType': res.data.signType,
                'paySign': res.data.paySign,
                'success': function (res) {
                  console.log(res)
                  wx.showToast({
                    title: '充值成功',
                    duration: 1000
                  })
                  setTimeout(function () {
                    wx.navigateBack({

                    })
                  }, 1000)
                },
                'complete': function (res) {
                  if (res.errMsg == 'requestPayment:fail cancel') {
                    wx.showToast({
                      title: '取消支付',
                      icon: 'loading',
                      duration: 1000
                    })
                  }
                }
              })
            },
          })
        }
      }
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

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
   wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  }
})