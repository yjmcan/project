// zh_dianc/pages/takeout/takeoutform.js
var app = getApp();
var util = require('../../utils/util.js');
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var qqmapsdk;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    share_modal_active: false,
    activeradio: '',
    hbshare_modal_active: false,
    hbactiveradio: '',
    group_id: '',
    isloading: true,
    navbar: [],
    fwxy: true,
    xymc: '到店自取服务协议',
    xynr: '',
    selectedindex: 0,
    color: '#019fff',
    checked: true,
    cart_list: [],
    wmindex: 0,
    wmtimearray: ['尽快送达'],
    cjindex: 0,
    cjarray: ['1份', '2份', '3份', '4份', '5份', '6份', '7份', '8份', '9份', '10份', '10份以上'],
    mdoaltoggle: true,
    total: 0,
    showModal: false,
    zffs: 1,
    zfz: false,
    zfwz: '微信支付',
    btntype: 'btn_ok1',
    yhqkdje: 0,
    hbkdje: 0,
    note: ''
  },
  openxy: function () {
    this.setData({
      fwxy: false,
    })
  },
  queren: function () {
    this.setData({
      fwxy: true,
    })
  },
  checkboxChange: function (e) {
    var that = this;
    this.setData({
      checked: !that.data.checked,
    })
  },
  ckwz: function (e) {
    console.log(e.currentTarget.dataset.jwd)
    var jwd = e.currentTarget.dataset.jwd.split(',')
    console.log(jwd)
    var that = this
    wx.openLocation({
      latitude: Number(jwd[0]),
      longitude: Number(jwd[1]),
      name: that.data.store.name,
      address: that.data.store.address
    })
  },
  radioChange1: function (e) {
    console.log('radio1发生change事件，携带value值为：', e.detail.value)
    if (e.detail.value == 'wxzf') {
      this.setData({
        zffs: 1,
        zfwz: '微信支付',
        btntype: 'btn_ok1',
      })
    }
    if (e.detail.value == 'yezf') {
      this.setData({
        zffs: 2,
        zfwz: '余额支付',
        btntype: 'btn_ok2',
      })
    }
    if (e.detail.value == 'jfzf') {
      this.setData({
        zffs: 3,
        zfwz: '积分支付',
        btntype: 'btn_ok3',
      })
    }
    if (e.detail.value == 'hdfk') {
      this.setData({
        zffs: 4,
        zfwz: '货到付款',
        btntype: 'btn_ok4',
      })
    }
  },
  KeyName: function (t) {
    this.setData({
      name: t.detail.value
    })
  },
  KeyMobile: function (t) {
    this.setData({
      mobile: t.detail.value
    })
  },
  note: function (t) {
    this.setData({
      note: t.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.setNavigationBarColor(this);
    console.log(wx.getStorageSync('users'))
    var that = this,
      store_id = options.store_id,
      goods_id = options.goods_id,
      openid = wx.getStorageSync('users').openid,
      user_id = wx.getStorageSync('users').id;
    console.log(options)
    that.setData({
      user_id: user_id,
      openid: openid,
      options: options
    })
    app.util.request({
      'url': 'entry/wxapp/UserInfo',
      'cachetime': '0',
      data: {
        user_id: user_id
      },
      success: function (res) {
        var date = util.formatTime(new Date).substring(0, 10).replace(/\//g, "-");
        console.log(res, date.toString())
        if (res.data.dq_time != '' && res.data.dq_time >= date.toString()) {
          res.data.ishy = 1
        }
        that.setData({
          userInfo: res.data,
          mobile: res.data.user_tel ? res.data.user_tel : '',
          name: res.data.user_name ? res.data.user_name : ''
        })
      }
    })
    // 获取拼团分类
    app.util.request({
      'url': 'entry/wxapp/GroupType',
      'cachetime': '0',
      success: res => {
        console.log('分类列表', res)
        that.setData({
          nav_array: res.data
        })
      }
    })
    app.util.request({
      'url': 'entry/wxapp/GoodsInfo',
      'cachetime': '0',
      data: {
        goods_id: goods_id
      },
      success: function (res) {
        console.log(res)
        if (options.type == 1) {
          res.data.goods.yh = (Number(res.data.goods.y_price) - Number(res.data.goods.dd_price)).toFixed(2)
          res.data.goods.money = (1 * Number(res.data.goods.dd_price)).toFixed(2)
        } else {
          res.data.goods.yh = (Number(res.data.goods.y_price) - Number(res.data.goods.pt_price)).toFixed(2)
          res.data.goods.money = (1 * Number(res.data.goods.pt_price)).toFixed(2)
        }
        that.setData({
          QgGoodInfo: res.data.goods,
          isloading: false,
        })
      },
    })
    app.util.request({
      'url': 'entry/wxapp/StoreInfo',
      'cachetime': '0',
      data: {
        store_id: store_id
      },
      success: function (res) {
        console.log(res.data)
        res.data.storeset.wmps_name = res.data.storeset.wmps_name != '' ? res.data.storeset.wmps_name : '外卖配送'
        var StoreInfo = res.data;
        var loc = res.data.store.coordinates.split(',')
        var sjstart = {
          lng: Number(loc[1]),
          lat: Number(loc[0])
        }
        that.setData({
          // url: getApp().imgurl,
          psfarr: res.data.psf,
          reduction: res.data.reduction,
          store: res.data.store,
          storeset: res.data.storeset,
          sjstart: sjstart,
          xynr: res.data.storeset.ztxy,
        })
      },
    })
  },

  tjddformSubmit: function (e) {
    console.log(e)
    var user_id = wx.getStorageSync('users').id;
    // app.util.request({
    //   'url': 'entry/wxapp/AddFormId',
    //   'cachetime': '0',
    //   data: {
    //     user_id: user_id,
    //     form_id: e.detail.formId
    //   },
    //   success: function (res) {
    //     console.log(res.data)
    //   },
    // })
    // var username = this.data.name,
    //   tel = this.data.mobile;
    // console.log(username, tel)
    // if (username == '' || tel == '' || username == null || tel == null) {
    //   wx.showModal({
    //     title: '提示',
    //     content: '请填写联系人人和联系电话！',
    //   })
    //   return false
    // }
    this.setData({
      showModal: true,
    })
  },
  //购买
  alone_pay: function (e) {
    var that = this
    that.setData({
      showModal: false,
    })
    wx.showLoading({
      title: '正在支付',
      mark: true
    })
    var a = that.data
    var goods_info = a.QgGoodInfo
    var nav_array = a.nav_array
    var store_id = goods_info.store_id
    var user_id = a.user_id
    var goods_id = goods_info.id
    var logo = goods_info.logo
    var goods_name = goods_info.name
    // 支付方式  1为微信支付 2为余额支付 3为到店
    if (a.zfwz=='微信支付'){
      var pay_type=1
    }else if (a.zfwz == '余额支付') {
      var pay_type = 2
    }
    for (let i in nav_array) {
      if (nav_array[i].id == goods_info.type_id) {
        var goods_type = nav_array[i].name
      }
    }
    if (a.options.type == 1) {
      var price = goods_info.dd_price
      var goods_num = 1
      var money = Number(goods_num) * Number(price)
    } else {
      var price = goods_info.pt_price
      var goods_num = 1
      var money = Number(goods_num) * Number(price)
    }
    var receive_name = a.name
    var receive_tel = a.mobile
    var receive_address = a.store.address
    var note = a.note
    console.log(goods_info)
    console.log('用户id', user_id)
    console.log('商家id', store_id)
    if (Number(a.userInfo.wallet)<money&&pay_type==2){
      wx.hideLoading()
        wx.showModal({
          title: '',
          content: '您的余额不足',
        })
    } else if (that.confirm_info() == true) {
      app.util.request({
        url: 'entry/wxapp/SaveGroupOrder',
        data: {
          store_id: store_id,
          user_id: user_id,
          goods_id: goods_id,
          logo: logo,
          goods_name: goods_name,
          goods_type: goods_type,
          price: price,
          goods_num: goods_num,
          money: money,
          receive_name: receive_name,
          receive_tel: receive_tel,
          receive_address: receive_address,
          note: note,
          type: a.options.type,
          pay_type: pay_type,
          kt_num: a.options.kt_num,
          group_id: a.options.group_id,
          dq_time: a.options.end_time,
          xf_time: a.options.xf_time
        },
        success: res => {
          console.log(res)
          if (pay_type == 1) {
            that.pay(res.data, money)
          } else {
            that.ye_pay(res.data, money)
          }

        }
      })
    } else {
      wx.hideLoading()
    }
    
  },
  // 确认信息完整
  confirm_info: function (e) {
    var that = this
    var a = that.data
    console.log(a)
    if (a.mobile == null || a.mobile == '') {
      wx.showModal({
        title: '温馨提示',
        content: '请输入您的联系电话',
      })
    } else if (a.name == null || a.name == '') {
      wx.showModal({
        title: '温馨提示',
        content: '请输入您的姓名',
      })
    } else {
      return true
    }
  },
  // 调用支付
  pay: function (order_id, money) {
    var that = this
    console.log('调用微信支付')
    var a = that.data
    var openid = a.openid
    app.util.request({
      url: 'entry/wxapp/GroupPay',
      data: { order_id: order_id, money: money, openid: openid },
      success: res => {
        console.log(res)
        wx.requestPayment({
          'timeStamp': res.data.timeStamp,
          'nonceStr': res.data.nonceStr,
          'package': res.data.package,
          'signType': res.data.signType,
          'paySign': res.data.paySign,
          'success': function (res) {
            console.log(res)
            wx.hideLoading()
            wx.showToast({
              title: '支付成功',
            })
            setTimeout(function () {
              wx.redirectTo({
                url: '/zh_cjdianc/pages/collage/order'
              })
            }, 1500)
          },
          'fail': function (res) {
            console.log(res)
            wx.showLoading({
              title: '支付失败',
            })
            setTimeout(function () {
              wx.hideLoading()
              wx.navigateBack({
                delta: 2
              })
            }, 1500)
          }
        })
      }
    })
  },
  // 调用支付
  ye_pay: function (order_id, money) {
    var that = this
    console.log('调用余额支付')
    var a = that.data
    var openid = a.openid
    app.util.request({
      url: 'entry/wxapp/GroupYePay',
      data: { order_id: order_id},
      success: res => {
        console.log(res)
        if (res.data == 1) {
          wx.hideLoading()
          wx.showToast({
            title: '支付成功',
          })
          setTimeout(function () {
            wx.redirectTo({
              url: '/zh_cjdianc/pages/collage/order'
            })
          }, 1500)
        }else{
          wx.hideLoading()
          wx.showToast({
            title: '支付失败',
          })
          setTimeout(function () {
            wx.navigateBack({
              delta: 2
            })
          }, 1500)
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
  onShow: function () { },

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