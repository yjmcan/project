// zh_gjhdbm/pages/fill_info/fill_info.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sign_up: [{
        name: '姓名'
      },
      {
        name: '手机号'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    app.setNavigationBarColor(this);
    console.log(options)
    that.setData({
      options: options
    })
    app.getUserInfo(function(userInfo) {
      console.log(userInfo)
      that.setData({
        user_id: userInfo.id,
        openid: userInfo.openid
      })
    })
    that.refresh()
  },
  refresh: function(e) {
    var that = this
    // 获取拼团分类
    app.util.request({
      'url': 'entry/wxapp/GroupType',
      'cachetime': '0',
      success: res => {
        console.log('分类列表', res)
        that.setData({
          nav_array: res.data,
        })
      }
    })
    // 商品详情
    app.util.request({
      'url': 'entry/wxapp/GoodsInfo',
      'cachetime': '0',
      data: {
        goods_id: that.data.options.id,
      },
      success: res => {
        console.log('商品详情', res)
        that.setData({
          goods: res.data.goods
        })
      }
    })
  },
  /*
      提交表单
  */
  // formSubmit: function (e) {
  //   var that = this

  // },
  //购买
  formSubmit: function (e) {
    wx.showLoading({
      title: '正在提交报名',
      mark: true
    })
    var that = this
    that.setData({
      place_num:2,
      name: e.detail.value.name,
      tel: e.detail.value.tel,
    })
    var a = that.data
    var goods = a.goods
    var options = a.options
    var nav_array = a.nav_array
    var user_id = a.user_id
    for (let i in nav_array) {
      if (nav_array[i].id == goods.type_id) {
        var goods_type = nav_array[i].name
      }
    }
    var goods_num = 1
    if (options.type == 1) {
      var price = goods.dd_price
    } else {
      var price = goods.pt_price
    }
    var money = price
    if (that.confirm_info() == true) {
      app.util.request({
        url: 'entry/wxapp/SaveGroupOrder',
        data: {
          user_id: user_id,
          goods_id: goods.id,
          logo: goods.logo,
          goods_name: goods.name,
          goods_type: goods_type,
          price: price,
          goods_num: 1,
          money: money,
          receive_name: e.detail.value.name,
          receive_tel: e.detail.value.tel,
          receive_address: goods.address,
          type: a.options.type,
          pay_type: 1,
          kt_num: a.options.kt_num,
          group_id: options.group_id,
          dq_time: goods.end_time,
          xf_time: goods.xf_time,
          activity_type: goods.activity_type,
          coordinates: goods.coordinates
        },
        success: res => {
          console.log(res)
          console.log('确定调用')
          that.pay(res.data, money)
        }
      })
    }

  },
  // 确认信息完整
  confirm_info: function(e) {
    var that = this
    var a = that.data
    console.log(a)
    if (a.name == null || a.name == '') {
      wx.showModal({
        title: '温馨提示',
        content: '请输入您的姓名',
      })
      that.setData({
        place_num: 1
      })
      wx.hideLoading()
    } else if (a.tel == null || a.tel == '') {
      wx.showModal({
        title: '温馨提示',
        content: '请输入您的联系电话',
      })
      that.setData({
        place_num:1
      })
      wx.hideLoading()
    } else {
      return true
    }
  },
  // 调用支付
  pay: function(order_id, money) {
    var that = this
    console.log('调用微信支付')
    var a = that.data
    var openid = a.openid
    app.util.request({
      url: 'entry/wxapp/GroupPay',
      data: {
        order_id: order_id,
        money: money,
        openid: openid
      },
      success: res => {
        console.log(res)
        wx.requestPayment({
          'timeStamp': res.data.timeStamp,
          'nonceStr': res.data.nonceStr,
          'package': res.data.package,
          'signType': res.data.signType,
          'paySign': res.data.paySign,
          'success': function(res) {
            console.log(res)
            wx.hideLoading()
            wx.showToast({
              title: '支付成功',
            })
            setTimeout(function () {
              that.setData({
                place_num: 2
              })
              // wx.redirectTo({
              //   url: '../logs/group_order',
              // })
              wx.navigateTo({
                url: 'index',
              })
            }, 1500)
          },
          'fail': function(res) {
            console.log(res)
            wx.showLoading({
              title: '支付失败',
            })
            setTimeout(function() {
              wx.hideLoading()
              that.setData({
                place_num: 2
              })
              wx.reLaunch({
                url: '../index/index',
              })
            }, 1500)
          }
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})