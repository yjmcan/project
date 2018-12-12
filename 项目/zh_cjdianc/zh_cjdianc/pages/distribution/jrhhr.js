// zh_tcwq/pages/distribution/jrhhr.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    accountIndex: 0,
    fwxy: true,
    xymc: '申请分销商协议',
    xynr: '',
  },
  lookck: function () {
    this.setData({
      fwxy: false
    })
  },
  queren: function () {
    this.setData({
      fwxy: true
    })
  },
  bindAccountChange: function (e) {
    console.log('picker account 发生选择改变，携带值为', e.detail.value);
    this.setData({
      accountIndex: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.setNavigationBarColor(this);
    var that = this, user_id = wx.getStorageSync('users').id;
    app.util.request({
      'url': 'entry/wxapp/Url',
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        that.setData({
          url: res.data
        })
      },
    })
    //
    app.util.request({
      'url': 'entry/wxapp/CheckRetail',
      'cachetime': '0',
      success: function (res) {
        console.log(res.data)
        that.setData({
          img: res.data.img2,
          xynr: res.data.fx_details,
          fxset: res.data,
        })
      }
    });
    //邀请人
    app.util.request({
      'url': 'entry/wxapp/MySx',
      'cachetime': '0',
      data: { user_id: user_id },
      success: function (res) {
        console.log(res.data)
        if (!res.data) {
          that.setData({
            yqr: '总店'
          })
        }
        else {
          that.setData({
            yqr: res.data.name
          })
        }
      }
    });
    // app.util.request({
    //   'url': 'entry/wxapp/FxLevel',
    //   'cachetime': '0',
    //   success: function (res) {
    //     console.log(res)
    //     that.setData({
    //       accounts: res.data,
    //     })
    //   }
    // })
    // 系统设置
    app.util.request({
      'url': 'entry/wxapp/system',
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        that.setData({
          pt_name: res.data.url_name,
        })
      },
    })
  },
  tzweb: function (e) {
    console.log(e.currentTarget.dataset.index, this.data.lblist)
    var item = this.data.lblist[e.currentTarget.dataset.index]
    var sjtype = e.currentTarget.dataset.sjtype
    console.log(item)
    if (item.state == '1') {
      wx.redirectTo({
        url: item.src,
      })
    }
    if (item.state == '2') {
      wx: wx.navigateTo({
        url: '../car/car?vr=' + item.id + '&sjtype=' + sjtype,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    }
    if (item.state == '3') {
      wx.navigateToMiniProgram({
        appId: item.appid,
        success(res) {
          // 打开成功
          console.log(res)
        }
      })
    }
  },
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail)
    var that = this, name = e.detail.value.name, tel = e.detail.value.tel, cb = e.detail.value.checkbox.length;
    var user_id = wx.getStorageSync('users').id, openid = getApp().getOpenId, form_id = e.detail.formId;
    // var accountIndex = that.data.accountIndex, money = Number(that.data.accounts[accountIndex].money), djid = that.data.accounts[accountIndex].id;
    console.log(user_id, openid, form_id, name, tel)
    var warn = "";
    var flag = true;
    if (name == "") {
      warn = "请填写姓名！";
    } else if (tel == "") {
      warn = "请填写联系电话！";
    } else if (tel.length != 11) {
      warn = "手机号错误！";
    } else if (cb == 0) {
      warn = "阅读并同意《申请分销商协议》";
    } else {
      flag = false;
      wx.showLoading({
        title: '加载中...',
        mask: true,
      })
      app.util.request({
        'url': 'entry/wxapp/SaveRetail',
        'cachetime': '0',
        data: { user_id: user_id, user_name: name, user_tel: tel },
        success: function (res) {
          console.log(res)
          // if (res.data != '下单失败') {
          //   if (money > 0) {
          //     app.util.request({
          //       'url': 'entry/wxapp/Pay2',
          //       'cachetime': '0',
          //       data: { openid: openid, money: money, order_id: res.data },
          //       success: function (res) {
          //         console.log(res)
          //         wx.requestPayment({
          //           'timeStamp': res.data.timeStamp,
          //           'nonceStr': res.data.nonceStr,
          //           'package': res.data.package,
          //           'signType': res.data.signType,
          //           'paySign': res.data.paySign,
          //           'success': function (res) {
          //             console.log('这里是支付成功')
          //           },
          //           'complete': function (res) {
          //             console.log(res);
          //             if (res.errMsg == 'requestPayment:fail cancel') {
          //               wx.showToast({
          //                 title: '取消支付',
          //                 icon: 'loading',
          //                 duration: 1000
          //               })
          //             }
          //             if (res.errMsg == 'requestPayment:ok') {
          //               wx.showToast({
          //                 title: '提交成功',
          //               })
          //               setTimeout(function () {
          //                 wx.navigateBack({

          //                 })
          //               }, 1000)
          //             }
          //           }
          //         })
          //       },
          //     })
          //   }
          //   else {
          //     wx.showToast({
          //       title: '提交成功',
          //     })
          //     setTimeout(function () {
          //       wx.navigateBack({

          //       })
          //     }, 1000)
          //   }
          // }
          if (res.data == '1') {
            wx.showToast({
              title: '提交成功',
            })
            var pages = getCurrentPages(), that = this;
            console.log(pages)
            if (pages.length > 1) {

              var prePage = pages[pages.length - 2];

              prePage.reLoad()
            }
            setTimeout(function () {
              wx.navigateBack({

              })
            }, 1000)
          }
          else {
            wx.showToast({
              title: '请重试！',
              icon: 'loading'
            })
            wx.hideLoading()
          }
        }
      })
    }
    if (flag == true) {
      wx.showModal({
        title: '提示',
        content: warn
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

  // /**
  //  * 用户点击右上角分享
  //  */
  // onShareAppMessage: function () {
  //   var name = wx.getStorageSync('users').name
  //   return {
  //     title: name + '邀请你来成为合伙人',
  //     success: function (res) {
  //       // 转发成功
  //     },
  //     fail: function (res) {
  //       // 转发失败
  //     }
  //   }
  // }
})