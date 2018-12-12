// zh_cjdianc/pages/wallet/walletadd.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    czhd: [],
    activeIndex:0,
    czmoney:0,
  },
  lookck: function () {
    wx.navigateTo({
      url: '../car/xydtl?title=' + '充值服务协议',
    })
  },
  tabClick: function (e) {
    var that=this;
    this.setData({
      activeIndex: e.currentTarget.id,
      czmoney: Number(that.data.czhd[e.currentTarget.id].full)
    });
  },
  tabClick1: function (e) {
    this.setData({
      activeIndex: -1,
      czmoney: 0,
    });
  },
  bindinput: function (e) {
    var money;
    console.log(e.detail.value)
    if (e.detail.value != '') {
      money = e.detail.value
    }
    else {
      money = 0
    }
    this.setData({
      czmoney: parseFloat(money)
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
  tjddformSubmit: function (e) {
    var form_id = e.detail.formId;
    console.log('form发生了submit事件，携带数据为：', e.detail, e.detail.formId)
    var openid = this.data.userinfo.openid, money = this.data.czmoney, czhd = this.data.czhd;
    var uid = this.data.userinfo.id;
    console.log(czhd)
    if (Number(money) <= 0) {
      wx.showModal({
        title: '提示',
        content: '充值金额不能小于0',
      })
      return
    }
    if (czhd.length == 0) {
      var czmoney = money
    }
    else if (Number(money) >= Number(this.data.czhd[czhd.length - 1].full)) {
      var czhdindex = this.jsmj(money, czhd)
      console.log(czhdindex)
      var czmoney = Number(money) + Number(czhd[czhdindex].reduction)
    }
    else {
      var czmoney = money
    }
    console.log(openid, money, uid, czmoney, czmoney - money)
    app.util.request({
      'url': 'entry/wxapp/AddFormId',
      'cachetime': '0',
      data: { user_id: uid, form_id: form_id },
      success: function (res) {
        console.log(res.data)
      },
    })
    wx.showLoading({
      title: '加载中',
      mask:true,
    })
    // AddCzorder
    app.util.request({
      'url': 'entry/wxapp/AddCzorder',
      'cachetime': '0',
      data: { user_id: uid, money: money,money2:czmoney-money},
      success: function (res) {
        console.log(res)
        var orderid = res.data;
        app.util.request({
          'url': 'entry/wxapp/pay',
          'cachetime': '0',
          data: { openid: openid, money: money, order_id: orderid, type: 2 },
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
              },
              'complete': function (res) {
                console.log(res)
                if (res.errMsg == 'requestPayment:fail cancel') {
                  wx.showToast({
                    title: '取消支付',
                  })
                }
                if (res.errMsg == 'requestPayment:ok') {
                  wx.showModal({
                    title: '提示',
                    content: '支付成功',
                    showCancel: false,
                  })
                  setTimeout(function () {
                    wx.navigateBack({
                    })
                  }, 1000)
                }
              }
            })
          },
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.setNavigationBarColor(this);
    var that = this
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
          userinfo: res.data
        })
      }
    })
    // czhd
    app.util.request({
      'url': 'entry/wxapp/Czhd',
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        if(res.data.length>0){
          that.setData({
            czhd: res.data,
            czmoney: res.data[0].full
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
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  }
})