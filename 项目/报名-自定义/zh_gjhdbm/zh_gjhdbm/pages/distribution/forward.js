// zh_hdbm/pages/cash/cash.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hidden3: false,
    hidden4: true,
    button: true,
    cash_zhi2: false,
    cash_zhi: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    app.setNavigationBarColor(this);
    that.setData({
      color: wx.getStorageSync('platform').color
    })
    // 动态设置顶部导航栏颜色
    // wx.setNavigationBarColor({
    //   frontColor: '#ffffff',
    //   backgroundColor: wx.getStorageSync('platform').color,
    // })
    wx.hideShareMenu()
    var user_id = wx.getStorageSync('userInfo').id
    // 获取系统设置
    app.util.request({
      'url': 'entry/wxapp/GetFxSet',
      'cachetime': '0',
      success: function (res) {
        console.log('这是系统设置')
        console.log(res)
        that.setData({
          system: res.data
        })
      },
    })
    // 获取可提现金额
    app.util.request({
      'url': 'entry/wxapp/CountCommission',
      'cachetime': '0',
      data: {
        user_id: user_id,
      },
      success: function (res) {
        console.log('这是可提现金额')
        console.log(res)
        that.setData({
          price: res.data.ktx
        })
      },
    })
  },
  bindblur: function (e) {
    var that = this
    var tx_sxf = that.data.system.tx_rate
    var money = e.detail.value
    var sxf = money * (tx_sxf / 100)
    var sj_cost = money - sxf
    sj_cost = sj_cost.toFixed(2)
    sxf = sxf.toFixed(2)
    that.setData({
      tx_cost: money,
      sxf: sxf,
      sj_cost: sj_cost
    })
  },
  formSubmit: function (e) {
    var that = this
    console.log(e)
    console.log(that.data)
    var zd_money = Number(that.data.system.zd_money)
    // 实际金额
    var sj_cost = that.data.sj_cost
    var sxf = that.data.sxf
    var moneys = Number(that.data.price)
    // 用户名字
    var name = e.detail.value.name
    // 提现金额
    var tx_cost = that.data.tx_cost
    // 用户账号
    var account_number = e.detail.value.account_number
    // 确认用户账号
    var account_number_two = e.detail.value.account_number_two
    // 用户id
    var user_id = that.data.user_id

    var title = ''
    if (tx_cost == '' || tx_cost <= 0) {
      title = '请输入提现金额'
    } else if (tx_cost > moneys) {
      title = '不能超过可提现金额'
    } else if (tx_cost < zd_money) {
      title = '没有到提现门槛'
    } else if (name == '') {
      title = '请输入姓名'
    } else if (account_number == '') {
      title = '请输入微信账号'
    } else if (account_number_two == '') {
      title = '请再次输入微信账号'
    } else if (account_number != account_number_two) {
      title = '账号输入有误，请重述'
    }
    if (title != '') {
      wx.showModal({
        title: '温馨提示',
        content: title,
      })
    } else {
      app.util.request({
        url: 'entry/wxapp/Yjtx',
        data: {
          account: account_number_two,
          tx_cost: tx_cost,
          sj_cost: sj_cost,
          user_name: name,
          user_id:wx.getStorageSync('userInfo').id
        },
        success: res => {
          console.log(res)
          if (res.data == 1) {
            wx.showToast({
              title: '发起提现申请',
            })
            setTimeout(function () {
              wx.navigateBack({
                delta: 1
              })
            }, 1500)
          }
        }
      })
    }
  },
  inform: function (e) {
    wx.navigateTo({
      url: 'inform?status=' + 2,
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
    var that = this
    console.log(that.data)

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
  // onShareAppMessage: function () {

  // }
})