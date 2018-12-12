// zh_hyk/pages/my/login.js
const app = getApp()
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
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
  formSubmit: function (e) {
    var that = this, vip_qx = this.data.xtxx.vip_qx;
    var openid = getApp().getOpenId;
    var form_id = e.detail.formId;
    var uid = wx.getStorageSync('UserData').id;
    var money = parseFloat(this.data.zfmoney), zfts = this.data.zfts;
    console.log(wx.getStorageSync('UserData').id)
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
    if(zfts==null){
      zfts=0
    }
    console.log(uid)
    console.log('form发生了submit事件，携带数据为：', e.detail.value,vip_qx,money,zfts)
    var  xtxx = this.data.xtxx;
    console.log(xtxx,openid)
    var warn = "";//弹框时提示的内容
    var flag = true;//判断信息输入是否完整
    if (e.detail.value.radiogroup == '') {
      warn = '请选择购买有效期类型';
    } else {
      flag = false;
      var that = this;
      //zc
      var pages = getCurrentPages();
      console.log(pages)
      if (vip_qx=='1'&&money==0) {
        console.log('免费') 
        app.util.request({
          'url': 'entry/wxapp/UpdTimeOrder',
          'cachetime': '0',
          data: { user_id: uid, form_id:form_id,money:money , day:zfts },
          success: function (res) {
            console.log(res.data)
            if (res.data != '下单失败') {
              wx.showModal({
                title: '提示',
                content: '会员卡续费成功',
              })
              // 下单发送模板消息
              // app.util.request({
              //   'url': 'entry/wxapp/Message2',
              //   'cachetime': '0',
              //   data: { openid: openid, form_id: form_id, code: res.data.vip_code, level_name: res.data.level_name, name: res.data.name, tel: res.data.tel },
              //   success: function (res) {
              //     console.log('msg', res)
              //     // setTimeout(function () {
              //     //   wx.navigateBack({
              //     //     delta: 1
              //     //   })
              //     // }, 1000)
              //   },
              // })
              if (pages.length > 1) {

                var prePage = pages[pages.length - 2];

                prePage.changeData()
              }
              setTimeout(function () {
                wx.navigateBack({
                })
              }, 1000)
            }
            if (res.data == 2) {
              wx.showToast({
                title: '提交失败请重试',
                icon: 'loading',
                duration: 1000
              })
            }
          }
        });
      }
      else if (vip_qx == '1' && money > 0){
         console.log('开通期限要付费',money)
         // AddCzOrder
         app.util.request({
           'url': 'entry/wxapp/UpdTimeOrder',
           'cachetime': '0',
           data: { user_id: uid, money: money,day:zfts, form_id: form_id },
           success: function (res) {
             console.log(res)
             if (res.data != '下单失败') {
               app.util.request({
                 'url': 'entry/wxapp/pay4',
                 'cachetime': '0',
                 data: { openid: openid, money: money, order_id: res.data },
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
                       wx.showModal({
                         title: '提示',
                         content: '会员卡续费成功',
                       })
                       if (pages.length > 1) {

                         var prePage = pages[pages.length - 2];

                         prePage.changeData()
                       }
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
      }
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
          title: res.data.link_name + '会员卡续费',
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
    app.util.request({
      'url': 'entry/wxapp/VipSet',
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

  }
})