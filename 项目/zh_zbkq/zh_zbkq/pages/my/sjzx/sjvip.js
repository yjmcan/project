// zh_zbkq/pages/my/sjvip.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    radioItem: [
      { name: '一周0.01元', value: '0', checked: true },
      { name: '一月1.00元', value: '1'},
      { name: '半年仅5.00元', value: '2'},
      { name: '一年仅10.00元', value: '3'}
    ],
    radioItems:[],
    fwxy:true,
    hyflck:'第三方萨芬撒旦法守法撒发射方式送达方式第三方萨芬撒旦法守法撒发射方式送达方式第三方萨芬撒旦法守法撒发射方式送达方式'
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
    var that=this;
    var radioItems = this.data.radioItems;
    for (var i = 0, len = radioItems.length; i < len; ++i) {
      radioItems[i].checked = radioItems[i].id == e.detail.value;
      if (radioItems[i].checked){
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
    var uid = wx.getStorageSync('UserData').id, store_id = wx.getStorageSync('store_id');
    var money = parseFloat(this.data.zfmoney),zfts=this.data.zfts;
    console.log(uid,store_id, money,zfts, e.detail.value.radiogroup)
    var vipid = e.detail.value.radiogroup
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    if (e.detail.value.radiogroup==''){
      wx.showModal({
        title: '提示',
        content: '请选择购买类型',
      })
      return
    }
    wx.showModal({
      title: '温馨提示',
      content: '您需付费' + money + '元即可升级为VIP，'+'有效期'+zfts+'天',
      confirmText: '开通',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          if(money<=0){
            app.util.request({
              'url': 'entry/wxapp/SaveVipRecord',
              'cachetime': '0',
              data: { user_id: uid, money: money, note: '商家vip' },
              success: function (res) {
                console.log('SaveVipRecord', res)
              }
            });
            app.util.request({
              'url': 'entry/wxapp/ChangeStore',
              'cachetime': '0',
              data: { store_id: store_id, vip_level:vipid },
              success: function (res) {
                console.log(res.data)
                if (res.data == 1) {
                  wx.showToast({
                    title: '续费成功',
                    icon: 'success',
                    duration: 1000,
                  })
                  setTimeout(function () {
                    var pages = getCurrentPages();
                    var prevPage = pages[pages.length - 2];  //上一个页面
                    prevPage.refresh1()
                    wx.navigateBack({
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
              }
            });
          }
          else{
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
                      data: { user_id: uid, money: money, note: '商家vip' },
                      success: function (res) {
                        console.log('SaveVipRecord', res)
                      }
                    });
                    app.util.request({
                      'url': 'entry/wxapp/ChangeStore',
                      'cachetime': '0',
                      data: { store_id: store_id, vip_level:vipid },
                      success: function (res) {
                        console.log(res.data)
                        if (res.data == 1) {
                          wx.showToast({
                            title: '续费成功',
                            icon: 'success',
                            duration: 1000,
                          })
                          setTimeout(function () {
                            var pages = getCurrentPages();
                            var prevPage = pages[pages.length - 2];  //上一个页面
                            prevPage.refresh1()
                            wx.navigateBack({
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var url = getApp().imgurl;
    //取平台是否开启vip
    app.util.request({
      'url': 'entry/wxapp/GetVip',
      'cachetime': '0',
      success: function (res) {
        console.log(res.data)
        that.setData({
          url:url,
          vip: res.data,
        })
      }
    });
    app.util.request({
      'url': 'entry/wxapp/GetVipSet2',
      'cachetime': '0',
      success: function (res) {
        console.log(res.data)
        that.setData({
          radioItems: res.data,
        })
      }
    });
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
})