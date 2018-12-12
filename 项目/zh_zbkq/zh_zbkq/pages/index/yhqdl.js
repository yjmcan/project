// zh_zbkq/pages/index/yhqdl.js
var app = getApp();
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModal: false,
    telshowModal: false,
    kthyshowModal: false,
    sysl: 0,
    qnum: 0,
    qidarr: [],
    fwxy: true,
    jjz:true,
  },
  lookck: function () {
    this.setData({
      fwxy: false,
      kthyshowModal: false,
    })
  },
  queren: function () {
    this.setData({
      fwxy: true,
      kthyshowModal: true,
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
  formSubmit: function (e) {
    var that = this;
    var uid = wx.getStorageSync('UserData').id;
    var money = parseFloat(this.data.zfmoney), zfts = this.data.zfts;
    console.log(uid, money, zfts, e.detail.value.radiogroup)
    var vipid = e.detail.value.radiogroup
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    if (e.detail.value.radiogroup == '') {
      wx.showModal({
        title: '提示',
        content: '请选择购买类型',
      })
      return
    }
    wx.showModal({
      title: '温馨提示',
      content: '您需付费' + money + '元即可升级为VIP，' + '有效期' + zfts + '天',
      confirmText: '开通',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          if (money <= 0) {
            app.util.request({
              'url': 'entry/wxapp/SaveVipRecord',
              'cachetime': '0',
              data: { user_id: uid, money: money, note: '用户vip' },
              success: function (res) {
                console.log('SaveVipRecord', res)
              }
            });
            app.util.request({
              'url': 'entry/wxapp/ChangeUser',
              'cachetime': '0',
              data: { user_id: uid, vip_level: vipid },
              success: function (res) {
                console.log(res.data)
                if (res.data == 1) {
                  wx.showToast({
                    title: '开通成功',
                    icon: 'success',
                    duration: 1000,
                  })
                  that.setData({
                    kthyshowModal: false,
                  })
                  setTimeout(function () {
                    that.reLoad();
                  }, 1000)
                }
                else {
                  wx.showToast({
                    title: '请重试',
                    icon: 'loading',
                    duration: 1000,
                  })
                }
              }
            });
          }
          else {
            app.util.request({
              'url': 'entry/wxapp/pay',
              'cachetime': '0',
              method: "GET",
              data: {
                openid: getApp().getOpenId, money: money
              },
              success: function (res) {
                //订单生成成功，发起支付请求
                wx.requestPayment({
                  'timeStamp': res.data.timeStamp,
                  'nonceStr': res.data.nonceStr,   //字符串随机数
                  'package': res.data.package,
                  'signType': res.data.signType,
                  'paySign': res.data.paySign,
                  'success': function (res) {
                    console.log(res);//requestPayment:ok==>调用支付成功
                    //发送模板消息
                    app.util.request({
                      'url': 'entry/wxapp/SaveFxMoney',
                      'cachetime': '0',
                      data: { user_id: uid, money: money },
                      dataType: 'json',
                      success: function (res) {
                      }
                    })
                    app.util.request({
                      'url': 'entry/wxapp/SaveVipRecord',
                      'cachetime': '0',
                      data: { user_id: uid, money: money, note: '用户vip' },
                      success: function (res) {
                        console.log('SaveVipRecord', res)
                      }
                    });
                    app.util.request({
                      'url': 'entry/wxapp/ChangeUser',
                      'cachetime': '0',
                      data: { user_id: uid, vip_level: vipid },
                      success: function (res) {
                        console.log(res.data)
                        if (res.data == 1) {
                          wx.showToast({
                            title: '开通成功',
                            icon: 'success',
                            duration: 1000,
                          })
                          that.setData({
                            kthyshowModal: false,
                          })
                          setTimeout(function () {
                            that.reLoad();
                          }, 1000)
                        }
                        else {
                          wx.showToast({
                            title: '请重试',
                            icon: 'loading',
                            duration: 1000,
                          })
                        }
                      }
                    });
                  },
                  'complete': function (res) {
                    console.log(res.errMsg);
                    wx.showToast({
                      title: '取消支付',
                      icon: "loading",
                      duration: 1000
                    })
                  },
                })
              }
            })
          }
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  ljlq: function (e) {
    var isff = this.data.hyvip.is_ff, isms = this.data.hyvip.is_ms,that=this;
    console.log(this.data.kgvip, this.data.is_vip, (this.data.kgvip && this.data.is_vip), isff, isms)
    console.log('form发生了submit事件，携带数据为：', e)
    var formid = e.detail.formId;
    var uid = wx.getStorageSync('UserData').id;
    var yhqid = this.data.yhq.id
    var lqmode = this.data.yhq.lq_mode;
    console.log(lqmode)
    if (lqmode != '0' && parseFloat(this.data.yhq.lq_money) >= 0) {
      var money = parseFloat(this.data.yhq.lq_money)
    }
    else {
      var money = parseFloat(this.data.lqmoney)
    }
    if (this.data.kgvip && this.data.is_vip && isff == '2') {
      money = 0
    }
    console.log('formid', formid, uid, yhqid, money)
    if (this.data.kgvip && !this.data.is_vip && isms == '1') {
      wx.showModal({
        title: '立即开通vip会员',
        content: '开通会员后领取可享受会员特权',
        showCancel: true,
        cancelText: '开通会员',
        cancelColor: '#f44444',
        confirmText: '直接领取',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            //判断有没有领过
            app.util.request({
              'url': 'entry/wxapp/CheckLq',
              'cachetime': '0',
              data: { user_id: uid, coupons_id: yhqid },
              success: function (res) {
                console.log(res.data)
                if (res.data == 1) {
                  if (money > 0) {
                    wx.showModal({
                      title: '温馨提示',
                      content: '您需付费' + money + '元即可立即领取此券',
                      confirmText: '领取',
                      success: function (res) {
                        if (res.confirm) {
                          console.log('用户点击确定')
                          //领取优惠券
                          app.util.request({
                            'url': 'entry/wxapp/pay',
                            'cachetime': '0',
                            method: "GET",
                            data: {
                              openid: getApp().getOpenId, money: money
                            },
                            success: function (res) {
                              //订单生成成功，发起支付请求
                              wx.requestPayment({
                                'timeStamp': res.data.timeStamp,
                                'nonceStr': res.data.nonceStr,   //字符串随机数
                                'package': res.data.package,
                                'signType': res.data.signType,
                                'paySign': res.data.paySign,
                                'success': function (res) {
                                  console.log(res);//requestPayment:ok==>调用支付成功
                                  //发送模板消息
                                  app.util.request({
                                    'url': 'entry/wxapp/SaveFxMoney',
                                    'cachetime': '0',
                                    data: { user_id: uid, money: money },
                                    dataType: 'json',
                                    success: function (res) {
                                      console.log(res)
                                    }
                                  })
                                  app.util.request({
                                    'url': 'entry/wxapp/LqCoupons',
                                    'cachetime': '0',
                                    data: { user_id: uid, coupons_id: yhqid, type: '1', money: money },
                                    success: function (res) {
                                      console.log(res.data)
                                      if (res.data == 1) {
                                        //发模板消息
                                        app.util.request({
                                          'url': 'entry/wxapp/Message',
                                          'cachetime': '0',
                                          data: { coupons_id: yhqid, user_id: uid, openid: getApp().getOpenId, form_id: formid },
                                          success: function (res) {
                                            console.log('模板消息接口返回的数据', res.data)
                                          }
                                        });
                                        wx.showToast({
                                          title: '领取成功',
                                          icon: 'success',
                                          duration: 1000,
                                        })
                                        setTimeout(function () {
                                          wx.switchTab({
                                            url: '../wdq/wdq',
                                          })
                                        }, 1000)
                                      }
                                      else if (res.data == '重复领取') {
                                        wx.showModal({
                                          title: '提示',
                                          content: '您已领过此券，同一张券只能领取一次哦',
                                        })
                                      }
                                      else if (res.data == '没啦') {
                                        wx.showModal({
                                          title: '提示',
                                          content: '您来晚了，此券已经被领完了，下次赶早哦',
                                        })
                                      }
                                      else {
                                        wx.showToast({
                                          title: '请重试',
                                          icon: 'loading',
                                          duration: 1000,
                                        })
                                      }
                                    }
                                  });
                                },
                                'complete': function (res) {
                                  console.log(res.errMsg);
                                  wx.showToast({
                                    title: '取消支付',
                                    icon: "loading",
                                    duration: 1000
                                  })
                                },
                              })
                            }
                          })
                        } else if (res.cancel) {
                          console.log('用户点击取消')
                        }
                      }
                    })
                  }
                  else {
                    app.util.request({
                      'url': 'entry/wxapp/LqCoupons',
                      'cachetime': '0',
                      data: { user_id: uid, coupons_id: yhqid, type: '2' },
                      success: function (res) {
                        console.log(res.data)
                        if (res.data == 1) {
                          //发模板消息
                          app.util.request({
                            'url': 'entry/wxapp/Message',
                            'cachetime': '0',
                            data: { coupons_id: yhqid, user_id: uid, openid: getApp().getOpenId, form_id: formid },
                            success: function (res) {
                              console.log('模板消息接口返回的数据', res.data)
                            }
                          });
                          wx.showToast({
                            title: '领取成功',
                            icon: 'success',
                            duration: 1000,
                          })
                          setTimeout(function () {
                            wx.switchTab({
                              url: '../wdq/wdq',
                            })
                          }, 1000)
                        }
                        else if (res.data == '重复领取') {
                          wx.showModal({
                            title: '提示',
                            content: '您已领过此券，同一张券只能领取一次哦',
                          })
                        }
                        else if (res.data == '没啦') {
                          wx.showModal({
                            title: '提示',
                            content: '您来晚了，此券已经被领完了，下次赶早哦',
                          })
                        }
                        else {
                          wx.showToast({
                            title: '请重试',
                            icon: 'loading',
                            duration: 1000,
                          })
                        }
                      }
                    });
                  }
                }
                else if (res.data == 2) {
                  wx.showModal({
                    title: '提示',
                    content: '您已领过此券，同一张券只能领取一次哦',
                  })
                }
                else if (res.data == 3) {
                  wx.showModal({
                    title: '提示',
                    content: '您来晚了，此券已经被领完了，下次赶早哦',
                  })
                }
              }
            });
          } else if (res.cancel) {
            console.log('用户点击取消')
            that.setData({
              kthyshowModal: true,
            })
          }
        },
        fail: function (res) { },
        complete: function (res) { },
      })
    }
    else {
      if ((this.data.kgvip && this.data.is_vip) || !this.data.kgvip) {
        //判断有没有领过
        app.util.request({
          'url': 'entry/wxapp/CheckLq',
          'cachetime': '0',
          data: { user_id: uid, coupons_id: yhqid },
          success: function (res) {
            console.log(res.data)
            if (res.data == 1) {
              if (money > 0) {
                wx.showModal({
                  title: '温馨提示',
                  content: '您需付费' + money + '元即可立即领取此券',
                  confirmText: '领取',
                  success: function (res) {
                    if (res.confirm) {
                      console.log('用户点击确定')
                      //领取优惠券
                      app.util.request({
                        'url': 'entry/wxapp/pay',
                        'cachetime': '0',
                        method: "GET",
                        data: {
                          openid: getApp().getOpenId, money: money
                        },
                        success: function (res) {
                          //订单生成成功，发起支付请求
                          wx.requestPayment({
                            'timeStamp': res.data.timeStamp,
                            'nonceStr': res.data.nonceStr,   //字符串随机数
                            'package': res.data.package,
                            'signType': res.data.signType,
                            'paySign': res.data.paySign,
                            'success': function (res) {
                              console.log(res);//requestPayment:ok==>调用支付成功
                              //发送模板消息
                              app.util.request({
                                'url': 'entry/wxapp/SaveFxMoney',
                                'cachetime': '0',
                                data: { user_id: uid, money: money },
                                dataType: 'json',
                                success: function (res) {
                                  console.log(res)
                                }
                              })
                              app.util.request({
                                'url': 'entry/wxapp/LqCoupons',
                                'cachetime': '0',
                                data: { user_id: uid, coupons_id: yhqid, type: '1', money: money },
                                success: function (res) {
                                  console.log(res.data)
                                  if (res.data == 1) {
                                    //发模板消息
                                    app.util.request({
                                      'url': 'entry/wxapp/Message',
                                      'cachetime': '0',
                                      data: { coupons_id: yhqid, user_id: uid, openid: getApp().getOpenId, form_id: formid },
                                      success: function (res) {
                                        console.log('模板消息接口返回的数据', res.data)
                                      }
                                    });
                                    wx.showToast({
                                      title: '领取成功',
                                      icon: 'success',
                                      duration: 1000,
                                    })
                                    setTimeout(function () {
                                      wx.switchTab({
                                        url: '../wdq/wdq',
                                      })
                                    }, 1000)
                                  }
                                  else if (res.data == '重复领取') {
                                    wx.showModal({
                                      title: '提示',
                                      content: '您已领过此券，同一张券只能领取一次哦',
                                    })
                                  }
                                  else if (res.data == '没啦') {
                                    wx.showModal({
                                      title: '提示',
                                      content: '您来晚了，此券已经被领完了，下次赶早哦',
                                    })
                                  }
                                  else {
                                    wx.showToast({
                                      title: '请重试',
                                      icon: 'loading',
                                      duration: 1000,
                                    })
                                  }
                                }
                              });
                            },
                            'complete': function (res) {
                              console.log(res.errMsg);
                              wx.showToast({
                                title: '取消支付',
                                icon: "loading",
                                duration: 1000
                              })
                            },
                          })
                        }
                      })
                    } else if (res.cancel) {
                      console.log('用户点击取消')
                    }
                  }
                })
              }
              else {
                app.util.request({
                  'url': 'entry/wxapp/LqCoupons',
                  'cachetime': '0',
                  data: { user_id: uid, coupons_id: yhqid, type: '2' },
                  success: function (res) {
                    console.log(res.data)
                    if (res.data == 1) {
                      //发模板消息
                      app.util.request({
                        'url': 'entry/wxapp/Message',
                        'cachetime': '0',
                        data: { coupons_id: yhqid, user_id: uid, openid: getApp().getOpenId, form_id: formid },
                        success: function (res) {
                          console.log('模板消息接口返回的数据', res.data)
                        }
                      });
                      wx.showToast({
                        title: '领取成功',
                        icon: 'success',
                        duration: 1000,
                      })
                      setTimeout(function () {
                        wx.switchTab({
                          url: '../wdq/wdq',
                        })
                      }, 1000)
                    }
                    else if (res.data == '重复领取') {
                      wx.showModal({
                        title: '提示',
                        content: '您已领过此券，同一张券只能领取一次哦',
                      })
                    }
                    else if (res.data == '没啦') {
                      wx.showModal({
                        title: '提示',
                        content: '您来晚了，此券已经被领完了，下次赶早哦',
                      })
                    }
                    else {
                      wx.showToast({
                        title: '请重试',
                        icon: 'loading',
                        duration: 1000,
                      })
                    }
                  }
                });
              }
            }
            else if (res.data == 2) {
              wx.showModal({
                title: '提示',
                content: '您已领过此券，同一张券只能领取一次哦',
              })
            }
            else if (res.data == 3) {
              wx.showModal({
                title: '提示',
                content: '您来晚了，此券已经被领完了，下次赶早哦',
              })
            }
          }
        });
      }
      else {
        console.log('开启了vip并且不是vip')
        this.setData({
          kthyshowModal: true,
        })
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('优惠券详情onLoad', this)
    var that = this;
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //登录
      console.log(app.globalData)
      app.userlogin(function (userdata) {
        console.log(userdata)
        that.reLoad();
      })
    })
    //分享
    wx.showShareMenu({
      withShareTicket: true,
      success: function (res) {
        // 分享成功
        console.log('shareMenu share success')
        console.log('分享', res)
      },
      fail: function (res) {
        // 分享失败
        console.log(res)
      }
    })
    var url = options.imgurl
    console.log(options, url)
    //取优惠券详情;
    app.util.request({
      'url': 'entry/wxapp/CouponsInfo',
      'cachetime': '0',
      data: { coupons_id: options.yhqid },
      success: function (res) {
        console.log(res.data)
        if (res.data.name == '通用券') {
          res.data.cost = parseInt(res.data.cost)
        }
        wx.setNavigationBarTitle({
          title: res.data.md_name + res.data.name,
        })
        that.setData({
          url: url,
          yhq: res.data,
          sysl: Number(res.data.number) - Number(res.data.lq_num)
        })
        //取平台信息
        app.util.request({
          'url': 'entry/wxapp/GetPlatform',
          'cachetime': '0',
          success: function (res) {
            console.log(res.data)
            if (that.data.yhq.lq_mode == '1' || that.data.yhq.lq_mode == '3') {
              that.setData({
                fxqnum: that.data.yhq.zf_num,
                qnum: Number(that.data.yhq.zf_num)
              })
            }
            else {
              that.setData({
                fxqnum: res.data.fxq_num,
                qnum: Number(res.data.fxq_num)
              })
            }
            that.setData({
              ptxx: res.data,
              lqmoney: res.data.lq_cost,
            })
            console.log(res.data.fx_content.indexOf('num'))
            if (res.data.fx_content.indexOf('num') > -1) {
              console.log('num')
              var arr = res.data.fx_content.split('num');
              console.log(arr)
              that.setData({
                isnum: true,
                text1: arr[0],
                text2: arr[1]
              })
            }
            else {
              console.log('nnum')
              that.setData({
                isnum: false,
                text1: res.data.fx_content,
                text2: ''
              })
            }
          }
        });
      }
    });
    //poster;
    app.util.request({
      'url': 'entry/wxapp/CouponsPoster',
      'cachetime': '0',
      data: { coupons_id: options.yhqid },
      success: function (res) {
        console.log(res)
        that.setData({
          yhqcode: res.data
        })
      }
    });
  },
  reLoad: function () {
    var that = this;
    var uid = wx.getStorageSync('UserData').id;
    //取平台是否开启vip
    app.util.request({
      'url': 'entry/wxapp/GetVip',
      'cachetime': '0',
      success: function (res) {
        console.log(res.data)
        that.setData({
          hyvip: res.data,
          jjz:false
        })
        if (res.data.status == '1') {
          console.log('关闭了vip')
          that.setData({
            kgvip: false,
          })
        }
        else {
          console.log('开启了vip')
          that.setData({
            kgvip: true,
          })
          app.util.request({
            'url': 'entry/wxapp/GetVipSet',
            'cachetime': '0',
            success: function (res) {
              console.log(res.data)
              that.setData({
                radioItems: res.data,
              })
            }
          });
        }
        //取用户信息
        app.util.request({
          'url': 'entry/wxapp/GetUserInfo',
          'cachetime': '0',
          data: { user_id: uid },
          success: function (res) {
            console.log(res.data)
            that.setData({
              userinfo: res.data,
            })
            if (res.data.is_vip == '1') {
              console.log('是vip')
              that.setData({
                is_vip: true,
              })
            }
            else {
              console.log('不是vip')
              that.setData({
                is_vip: false,
              })
            }
          }
        });
      }
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.setNavigationBarTitle({
      title: '优惠券详情'
    })
  },
  mflq: function (e) {
    console.log('form发生了submit事件，携带数据为：', e)
    var formid = e.detail.formId;
    console.log('formid', formid)
    console.log(this.data)
    if ((this.data.kgvip && this.data.hyvip.is_mfvip == '1' && this.data.is_vip) || !this.data.kgvip || this.data.hyvip.is_mfvip == '2') {
      if (this.data.qnum == 0) {
        var uid = wx.getStorageSync('UserData').id;
        var yhqid = this.data.yhq.id
        console.log(uid, yhqid)
        //领取优惠券
        app.util.request({
          'url': 'entry/wxapp/LqCoupons',
          'cachetime': '0',
          data: { user_id: uid, coupons_id: yhqid, type: '2' },
          success: function (res) {
            console.log(res.data)
            if (res.data == 1) {
              //发模板消息
              app.util.request({
                'url': 'entry/wxapp/Message',
                'cachetime': '0',
                data: { coupons_id: yhqid, user_id: uid, openid: getApp().getOpenId, form_id: formid },
                success: function (res) {
                  console.log('模板消息接口返回的数据', res.data)
                }
              });
              wx.showToast({
                title: '领取成功',
                icon: 'success',
                duration: 1000,
              })
              setTimeout(function () {
                wx.switchTab({
                  url: '../wdq/wdq',
                })
              }, 1000)
            }
            else if (res.data == '重复领取') {
              wx.showModal({
                title: '提示',
                content: '您已领过此券，同一张券只能领取一次哦',
              })
            }
            else if (res.data == '没啦') {
              wx.showModal({
                title: '提示',
                content: '您来晚了，此券已经被领完了，下次赶早哦',
              })
            }
            else {
              wx.showToast({
                title: '请重试',
                icon: 'loading',
                duration: 1000,
              })
            }
          }
        });
      }
      else {
        this.setData({
          showModal: true,
        })
      }
    }
    else {
      console.log('开启了vip并且不是vip')
      this.setData({
        kthyshowModal: true,
      })
    }
  },
  yczz: function () {
    this.setData({
      showModal: false,
    })
  },
  yckthy: function () {
    this.setData({
      kthyshowModal: false,
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('优惠券详情onShow')
    wx.showShareMenu({
      withShareTicket: true,
      success: function (res) {
        // 分享成功
        console.log('shareMenu share success')
        console.log('分享', res)
      },
      fail: function (res) {
        // 分享失败
        console.log(res)
      }
    })
    var uid = wx.getStorageSync('UserData').id
    console.log(uid)
    var that = this;
    //取平台信息
    app.util.request({
      'url': 'entry/wxapp/GetPlatform',
      'cachetime': '0',
      success: function (res) {
        console.log(res.data)
        if (res.data.is_lq == '2') {
          //取用户信息
          app.util.request({
            'url': 'entry/wxapp/GetUserInfo',
            'cachetime': '0',
            data: { user_id: uid },
            success: function (res) {
              console.log(res.data)
              if (res.data.lq_tel == '') {
                that.setData({
                  telshowModal: true,
                })
              }
              else {
                that.setData({
                  telshowModal: false,
                })
              }
            }
          });
        }
      }
    });
  },
  getPhoneNumber: function (e) {
    var that = this;
    var uid = wx.getStorageSync('UserData').id
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
              telshowModal: false,
            })
            //保存手机号
            app.util.request({
              'url': 'entry/wxapp/SaveLqTel',
              'cachetime': '0',
              data: { user_id: uid, lq_tel: res.data.phoneNumber },
              success: function (res) {
                console.log(res.data)
                if (res.data == 1) {
                  wx.showToast({
                    title: '验证成功',
                    duration: 1000,
                  })
                }
              }
            });
          }
        }
      });
    }
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
    var that = this;
    return {
      title: '快来抢' + that.data.yhq.md_name + that.data.yhq.name + '啦!',
      path: 'zh_zbkq/pages/index/yhqdl?yhqid=' + that.data.yhq.id + '&imgurl=' + that.data.url,
      imageUrl: that.data.yhqcode,
      success: function (res) {
        console.log('分享成功后的数据', res)
        if (res.shareTickets) {
          console.log(res.shareTickets[0])
          // console.log
          wx.getShareInfo({
            shareTicket: res.shareTickets[0],
            success: function (res1) {
              console.log(res1, res1.encryptedData)
              //jm;
              if (that.data.qidarr.length < Number(that.data.fxqnum)) {
                app.util.request({
                  'url': 'entry/wxapp/Jiemi',
                  'cachetime': '0',
                  data: { sessionKey: getApp().getSK, data: res1.encryptedData, iv: res1.iv },
                  success: function (res) {
                    console.log('解密后的数据', res)
                    if (util.in_array(res.data.openGId, that.data.qidarr) == 2) {
                      that.data.qidarr.push(res.data.openGId)
                      that.setData({
                        qnum: Number(that.data.fxqnum) - that.data.qidarr.length,
                        qidarr: that.data.qidarr
                      })
                      if (that.data.qidarr.length == Number(that.data.fxqnum)) {
                        that.setData({
                          showModal: false,
                        })
                      }
                    }
                    else {
                      console.log('此qid已存在')
                    }
                    console.log(that.data.qidarr)
                  }
                });
              }
            },
            fail: function (res) { console.log(res) },
            complete: function (res) { console.log(res) }
          })
        }
        else {
          console.log('shareTickets不存在', res)
        }
      },
      fail: function (res) {
        // 分享失败
        console.log(res)
      }
    }
  }
})