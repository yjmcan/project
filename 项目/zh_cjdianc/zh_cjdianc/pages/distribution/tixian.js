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
    cash_zhi: false,
    tx_cost:0,
    sj_cost:0,
    fwxy: true,
    xymc: '佣金提现协议',
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.setNavigationBarColor(this);
    var that = this, user_id = wx.getStorageSync('users').id;
    //MyCommission
    app.util.request({
      'url': 'entry/wxapp/MyCommission',
      'cachetime': '0',
      data: { user_id: user_id },
      success: function (res) {
        console.log(res.data)
        that.setData({
          yjdata: res.data
        })
      }
    });
    // CheckRetail
    app.util.request({
      'url': 'entry/wxapp/CheckRetail',
      'cachetime': '0',
      success: function (res) {
        console.log('CheckRetail',res.data)
        that.setData({
          fxset: res.data,
          xynr: res.data.tx_details,
        })
      },
    })
    that.setData({
      seller_id: options.seller_id
    })
  },
  bindblur: function (e) {
    var that = this
    var tx_sxf = Number(that.data.fxset.tx_rate)
    var money = Number(e.detail.value)
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
    var user_id = wx.getStorageSync('users').id;
    var zd_money = Number(that.data.fxset.tx_money)
    // 实际金额
    var sj_cost = that.data.sj_cost
    var sxf = that.data.sxf
    var moneys = Number(that.data.yjdata.ktxyj)
    // 用户名字
    var name = e.detail.value.name
    // 提现金额
    var tx_cost = that.data.tx_cost
    // 用户账号
    var account_number = e.detail.value.account_number
    // 确认用户账号
    var account_number_two = e.detail.value.account_number_two, cb = e.detail.value.checkbox.length
    console.log('zd_money', zd_money, 'sj_cost', sj_cost, 'ktxyj', moneys, 'tx_cost', tx_cost, name, account_number, account_number_two, 'user_id', user_id,cb)
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
      title = '请输入联系电话'
    } else if (account_number_two == '') {
      title = '请再次输入联系电话'
    } else if (account_number != account_number_two) {
      title = '联系电话不一致，请重新输入'
    } else if (cb == 0) {
      title = "阅读并同意《佣金提现协议》";
    } 
    if (title != '') {
      wx.showModal({
        title: '温馨提示',
        content: title,
      })
    } else {
      wx.showLoading({
        title: '加载中',
        mask:true,
      })
      app.util.request({
        url: 'entry/wxapp/SaveYjtx',
        data: {
          user_id: user_id,
          user_name: name,
          account: account_number,
          tx_cost: tx_cost,
          sj_cost: sj_cost
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
            }, 1000)
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