// pages/order/order.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nav: [
      '全部家政',
      '未支付',
      '待服务',
      '已完成'
    ],
    ac_index: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.refresh()
  },
  refresh:function(e){
    var that = this
    var ac_index = that.data.ac_index

    var user_id = wx.getStorageSync('user_info').data.userid
    // 所有订单
    wx.request({
      url: 'https://sanye.nbxiong.com/jz/showAllServiceOrder.do',
      method: "POST",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: { userid: user_id },
      success: res => {
        console.log(res)
        // var total_order = res.data.serviceorder
        var order1 = []
        var order2 = []
        var order3 = []
        var order = res.data.serviceorder
        for (let i in order){
          if (order[i].orderstate=='-1'){
            order1.push(order[i])
          }
          if (order[i].orderstate == 1) {
            order2.push(order[i])
          }
          if (order[i].orderstate == 2) {
            order3.push(order[i])
          }
        }
        if (ac_index==0){
          that.setData({
            order:order
          })
        }
        if (ac_index ==1) {
          that.setData({
            order: order1
          })
        }
        if (ac_index == 2) {
          that.setData({
            order: order2
          })
        }
        if (ac_index == 3) {
          that.setData({
            order: order3
          })
        }
      },
      fail: res => {
        console.log(res)
      }
    })
  },
  tabClick: function (e) {
    this.setData({
      ac_index: e.currentTarget.dataset.index,
    })
    this.refresh()
  },
  pay_order:function(e){
    var that = this
    var reservemoney = e.currentTarget.dataset.reservemoney
    var order_id = e.currentTarget.dataset.orderid
    var user_id = wx.getStorageSync('user_info').data.userid
    wx.request({
      url: 'https://sanye.nbxiong.com/jz/createUnifiedOrder.do',
      method: "POST",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        userid: user_id,
        amount: reservemoney,
        intg: '0',
        orderid: order_id
      },
      success: res => {
        var pay = res.data
        console.log('这是支付')
        console.log(res)
        wx.requestPayment({
          'timeStamp': pay.timeStamp,
          'nonceStr': pay.nonceStr,
          'package': pay.package,
          'signType': pay.signType,
          'paySign': pay.paySign,
          'success': function (res) {
            // 验证支付是否成功
            wx.request({
              url: 'https://sanye.nbxiong.com/jz/generatServiceOrder.do',
              method: "POST",
              header: {
                "content-type": "application/x-www-form-urlencoded"
              },
              data: {
                serviceorderid: pay.serviceorderid,
                nonce_str: pay.nonceStr,
                sign: pay.signType,
                orderpaytype: 0,
                count: 1,
                productsize: num
              },
              success: res => {
                var pay = res.data
                console.log('这是验证支付')
                console.log(res)
                that.refresh()
              },
              fail: res => {
                console.log(res)
              }
            })
          },
          'fail': function (res) {
          }
        })
      },
      fail: res => {
        console.log(res)
      }
    })
  },
  // 删除订单
  cancel_order:function(e){
    var that = this
    var type = e.currentTarget.dataset.type
    var order_id = e.currentTarget.dataset.orderid
    var user_id = wx.getStorageSync('user_info').data.userid
    var title = ''
    if(type==1){
      title = '是否取消订单'
    }else{
      title = '是否删除订单'
    }
    wx.showModal({
      title: '提示',
      content: title,
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.request({
            url: 'https://sanye.nbxiong.com/jz/deleteServiceOrder.do',
            method: "POST",
            header: {
              "content-type": "application/x-www-form-urlencoded"
            },
            data: {
              orderid: order_id
            },
            success: res => {
              console.log('这是删除订单')
              console.log(res)
              wx.showToast({
                title: '操作成功',
              })
              that.refresh()
            },
            fail: res => {
              console.log(res)
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    
  },
  // 跳转订单详情
  order_info: function (e) {
    wx.navigateTo({
      url: '../order_info/order_info?id=' + e.currentTarget.dataset.id + '&productid=' + e.currentTarget.dataset.productid
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})