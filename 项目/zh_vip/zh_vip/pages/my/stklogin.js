// zh_hyk/pages/my/login.js
const app = getApp()
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    VerifyCode: '立即验证',
    bdsjhtext: '验证微信手机号',
    isyz: true,
    isbd: false,
    isdx: true,
    fsyzm: false,
    fwxy:true,
    radioItems: [],
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
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);
    var that = this;
    var radioItems = this.data.radioItems;
    for (var i = 0, len = radioItems.length; i < len; ++i) {
      radioItems[i].checked = radioItems[i].id == e.detail.value;
      if (radioItems[i].checked) {
        that.setData({
          zfmoney: radioItems[i].money,
          zfts: radioItems[i].days,
        })
      }
    }

    this.setData({
      radioItems: radioItems
    });
  },
  bindDateChange: function (e) {
    this.setData({
      start: e.detail.value
    })
  },
  //获取手机号
  hqsjh: function (e) {
    console.log(e.detail.value)
    this.setData({
      sjh: e.detail.value
    })
    if (e.detail.value != '') {
      this.setData({
        isyz: false
      })
    }
    else {
      this.setData({
        isyz: true
      })
    }
  },
  setVerify: function () {
    var yzm = util.getRandomNum();
    this.setData({
      yzm: yzm
    })
    var sjh = this.data.sjh;
    console.log(sjh)
    console.log(yzm)
    var t = 60;
    var that = this;
    if (!(/^0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$/.test(sjh)) || sjh.length != 11) {
      wx.showToast({
        title: '手机号错误',
        icon: 'loading',
        duration: 1000
      })
      return false;
    }
    var dsq = setInterval(function () {
      t--;
      if (t > 0) {
        that.setData({
          VerifyCode: t + " 秒",
          isyz: true,
          fsyzm: true,
        });
      }
      else {
        that.setData({
          VerifyCode: "立即验证",
          isyz: false,
          fsyzm: false,
        });
        clearInterval(dsq)
      }
    }, 1000)
    app.util.request({
      'url': 'entry/wxapp/sms',
      'cachetime': '0',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        tel: sjh,
        code: yzm
      },
      success: function (res) {
        console.log('111111111')
        console.log(res)
        if (res.data.reason == "操作成功") {
          wx.showToast({
            title: '发送成功',
            icon: 'success',
            duration: 1000
          })
        }
      },
      fail: function (res) {
        console.log("error res=")
        console.log(res.data)
      }
    });
  },
  dw: function () {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        console.log(res)
        that.setData({
          weizhi: res.address,
          jwd: res.latitude + ',' + res.longitude
        })
      },
      fail: function () {
        wx.showModal({
          title: '警告',
          content: '您点击了拒绝地理位置授权,无法正常使用功能，点击确定重新获取授权。',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              wx.openSetting({
                success: (res) => {
                  if (res.authSetting["scope.userLocation"]) {////如果用户重新同意了授权登录
                    that.dw();
                  } else {
                    that.dw();
                  }
                },
                fail: function (res) {
                }
              })
            }
          }
        })
      },
    })
  },
  getPhoneNumber: function (e) {
    var that = this;
    console.log(e)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
    if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '您未授权获取您的手机号',
        success: function (res) { }
      })
    }
    else {
      app.util.request({
        'url': 'entry/wxapp/Jiemi',
        'cachetime': '0',
        data: { sessionKey: getApp().getSK, data: e.detail.encryptedData, iv: e.detail.iv },
        success: function (res) {
          console.log('解密后的数据', res)
          if (res.data.phoneNumber != null) {
            that.setData({
              sjh: res.data.phoneNumber,
              isbd: true,
              bdsjhtext: '验证成功'
            })
          }
        }
      });
    }
  },
  formSubmit: function (e) {
    var that = this, vip_qx = this.data.xtxx.vip_qx;
    var openid = getApp().getOpenId;
    var form_id = e.detail.formId;
    var uid = wx.getStorageSync('UserData').id;
    // var money = parseFloat(this.data.zfmoney), zfts = this.data.zfts;
    // if(zfts==null){
    //   zfts=0
    // }
    console.log(uid)
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    var yzm = this.data.yzm;
    console.log('随机生成的验证码', yzm)
    var kh = e.detail.value.kh, km = e.detail.value.km,xm = e.detail.value.xm, sjh = e.detail.value.sjh, yanzm = e.detail.value.yanzm, sr = e.detail.value.sr, xxdz = e.detail.value.xxdz, xtxx = this.data.xtxx;
    console.log(xm, sjh, yanzm, sr, xxdz, xtxx,openid,kh,km)
    var warn = "";//弹框时提示的内容
    var flag = true;//判断信息输入是否完整
    if (kh == "") {
      warn = "请填写卡号！";
    } else if (km == "") {
      warn = "请填写卡密！";
    } else if (xm == "") {
      warn = "请填写姓名！";
    } else if (sjh == "") {
      warn = "请填写手机号！";
    } else if (!(/^0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$/.test(sjh)) || sjh.length != 11) {
      warn = "手机号错误！";
    } else if (yanzm == "" && that.data.isdx) {
      warn = "请填写您收到的验证码！";
    } else if (yanzm != yzm && that.data.isdx) {
      warn = "验证码不正确！";
    } else if (e.detail.value.radiogroup == '') {
      warn = '请选择购买有效期类型';
    } else {
      flag = false;
      var that = this;
      //zc
      var pages = getCurrentPages();
      console.log(pages)
      // return
      app.util.request({
        'url': 'entry/wxapp/AddVip2',
        'cachetime': '0',
        data: { user_id: uid, name: xm, tel: sjh, birthday: sr, address: xxdz, code: kh, pwd:km},
        success: function (res) {
          console.log(res.data)
          if (res.data != '卡号卡密不匹配或已绑定!') {
            wx.showModal({
              title: '恭喜成为会员',
              content: '开卡成功',
            })
            // 下单发送模板消息
            app.util.request({
              'url': 'entry/wxapp/Message2',
              'cachetime': '0',
              data: { openid: openid, form_id: form_id, code: res.data.vip_code, level_name: res.data.level_name, name: res.data.name, tel: res.data.tel },
              success: function (res) {
                console.log('msg', res)
                // setTimeout(function () {
                //   wx.navigateBack({
                //     delta: 1
                //   })
                // }, 1000)
              },
            })
            if (pages.length > 1) {

              var prePage = pages[pages.length - 2];

              prePage.changeData()
            }
            setTimeout(function () {
              wx.navigateBack({
              })
            }, 1000)
          }
          if (res.data == '卡号卡密不匹配或已绑定!') {
            wx.showModal({
              title: '提示',
              content: '卡号卡密不匹配或已绑定,请重新输入',
            })
          }
        }
      });
      // console.log(Number(xtxx.opencard))
      // if ((Number(xtxx.opencard) <= 0&&vip_qx=='2')||(vip_qx=='1'&&money==0)) {
      //   console.log('免费')
      //   app.util.request({
      //     'url': 'entry/wxapp/AddVip',
      //     'cachetime': '0',
      //     data: { user_id: uid, name: xm, tel: sjh, birthday: sr, address: xxdz,day:zfts },
      //     success: function (res) {
      //       console.log(res.data)
      //       if (res.data != 2) {
      //         wx.showModal({
      //           title: '恭喜成为会员',
      //           content: '开卡成功',
      //         })
      //         // 下单发送模板消息
      //         app.util.request({
      //           'url': 'entry/wxapp/Message2',
      //           'cachetime': '0',
      //           data: { openid: openid, form_id: form_id, code: res.data.vip_code, level_name: res.data.level_name, name: res.data.name, tel: res.data.tel },
      //           success: function (res) {
      //             console.log('msg', res)
      //             // setTimeout(function () {
      //             //   wx.navigateBack({
      //             //     delta: 1
      //             //   })
      //             // }, 1000)
      //           },
      //         })
      //         if (pages.length > 1) {

      //           var prePage = pages[pages.length - 2];

      //           prePage.changeData()
      //         }
      //         setTimeout(function () {
      //           wx.navigateBack({
      //           })
      //         }, 1000)
      //       }
      //       if (res.data == 2) {
      //         wx.showToast({
      //           title: '提交失败请重试',
      //           icon: 'loading',
      //           duration: 1000
      //         })
      //       }
      //     }
      //   });
      // }
      // else if (Number(xtxx.opencard) > 0 && vip_qx == '2') {
      //   var kkmoney = Number(xtxx.opencard)
      //   console.log(kkmoney)
      //   // AddCzOrder
      //   app.util.request({
      //     'url': 'entry/wxapp/AddCzOrder',
      //     'cachetime': '0',
      //     data: { user_id: uid, name: xm, tel: sjh, birthday: sr, address: xxdz, money: kkmoney, form_id: form_id},
      //     success: function (res) {
      //       console.log(res)
      //       if (res.data != '下单失败') {
      //         app.util.request({
      //           'url': 'entry/wxapp/pay2',
      //           'cachetime': '0',
      //           data: { openid: openid, money: kkmoney, order_id: res.data },
      //           success: function (res) {
      //             console.log(res)
      //             // 支付
      //             wx.requestPayment({
      //               'timeStamp': res.data.timeStamp,
      //               'nonceStr': res.data.nonceStr,
      //               'package': res.data.package,
      //               'signType': res.data.signType,
      //               'paySign': res.data.paySign,
      //               'success': function (res) {
      //                 console.log(res)
      //                 wx.showModal({
      //                   title: '恭喜成为会员',
      //                   content: '开卡成功',
      //                 })
      //                 if (pages.length > 1) {

      //                   var prePage = pages[pages.length - 2];

      //                   prePage.changeData()
      //                 }
      //                 setTimeout(function () {
      //                   wx.navigateBack({

      //                   })
      //                 }, 1000)
      //               },
      //               'complete': function (res) {
      //                 if (res.errMsg == 'requestPayment:fail cancel') {
      //                   wx.showToast({
      //                     title: '取消支付',
      //                     icon: 'loading',
      //                     duration: 1000
      //                   })
      //                 }
      //               }
      //             })
      //           },
      //         })
      //       }
      //     }
      //   })
      // }
      // else if (vip_qx == '1' && money > 0){
      //    console.log('开通期限要付费',money)
      //    // AddCzOrder
      //    app.util.request({
      //      'url': 'entry/wxapp/AddtimeOrder',
      //      'cachetime': '0',
      //      data: { user_id: uid, name: xm, tel: sjh, birthday: sr, address: xxdz, money: money,day:zfts, form_id: form_id },
      //      success: function (res) {
      //        console.log(res)
      //        if (res.data != '下单失败') {
      //          app.util.request({
      //            'url': 'entry/wxapp/pay4',
      //            'cachetime': '0',
      //            data: { openid: openid, money: money, order_id: res.data },
      //            success: function (res) {
      //              console.log(res)
      //              // 支付
      //              wx.requestPayment({
      //                'timeStamp': res.data.timeStamp,
      //                'nonceStr': res.data.nonceStr,
      //                'package': res.data.package,
      //                'signType': res.data.signType,
      //                'paySign': res.data.paySign,
      //                'success': function (res) {
      //                  console.log(res)
      //                  wx.showModal({
      //                    title: '恭喜成为会员',
      //                    content: '开卡成功',
      //                  })
      //                  if (pages.length > 1) {

      //                    var prePage = pages[pages.length - 2];

      //                    prePage.changeData()
      //                  }
      //                  setTimeout(function () {
      //                    wx.navigateBack({

      //                    })
      //                  }, 1000)
      //                },
      //                'complete': function (res) {
      //                  if (res.errMsg == 'requestPayment:fail cancel') {
      //                    wx.showToast({
      //                      title: '取消支付',
      //                      icon: 'loading',
      //                      duration: 1000
      //                    })
      //                  }
      //                }
      //              })
      //            },
      //          })
      //        }
      //      }
      //    })
      // }
    }
    if (flag == true) {
      wx.showModal({
        title: '提示',
        content: warn
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取用户头像等信息
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //登录
      console.log(app.globalData)
      that.setData({
        userInfo: userInfo
      })
      var uid = wx.getStorageSync('UserData').id
      console.log(uid)
    })
    //
    var start = util.formatTime(new Date).substring(0, 10).replace(/\//g, "-");
    console.log(start.toString())
    this.setData({
      date: start,
      start: start,
    });
    //取平台信息
    app.util.request({
      'url': 'entry/wxapp/system',
      'cachetime': '0',
      success: function (res) {
        console.log(res.data)
        if (res.data.is_sms == '2') {
          that.setData({
            isdx: false,
          })
        }
        that.setData({
          xtxx: res.data,
        })
        wx.setStorageSync('xtxx', res.data)
        wx.setNavigationBarColor({
          frontColor: '#ffffff',
          backgroundColor: res.data.link_color,
        })
        wx.setNavigationBarTitle({
          title: res.data.link_name + '实体卡绑定',
        })
      }
    });
    //取imglink
    app.util.request({
      'url': 'entry/wxapp/url',
      'cachetime': '0',
      success: function (res) {
        console.log(res.data)
        that.setData({
          url: res.data,
        })
        getApp().imgurl = res.data
      }
    });
    // app.util.request({
    //   'url': 'entry/wxapp/VipSet',
    //   'cachetime': '0',
    //   success: function (res) {
    //     console.log(res.data)
    //     that.setData({
    //       radioItems: res.data,
    //     })
    //   }
    // });
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