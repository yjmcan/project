// pages/order/order.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nav: [
      '全部订单',
      '待发货',
      '已完成',
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
    var user_id = wx.getStorageSync('user_info').data.userid
    var ac_index = that.data.ac_index
    // 商城订单
    wx.request({
      url: 'https://sanye.nbxiong.com/jz/showAllMallOrder.do',
      method: "POST",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: { userid: user_id },
      success: res => {
        console.log(res)
        var orders = res.data.mallorder
        that.setData({
          order: orders
        })
      },
      fail: res => {
        console.log(res)
      }
    })
  },
  reload:function(e){
    var that = this
    var user_id = wx.getStorageSync('user_info').data.userid
    var ac_index = that.data.ac_index
    if (ac_index == 0) {
     var statu = -1
    }
    if (ac_index == 1) {
      var statu = 0
      var a = '0 mallorder'
    }
    if (ac_index == 2) {
      var statu = 2
      var a = '2 mallorder'
    }
    if(statu == -1){
      that.refresh()
    }else{
      wx.request({
        url: 'https://sanye.nbxiong.com/jz/showMallOrderList.do',
        method: "POST",
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        data: { userid: user_id,statu:statu },
        success: res => {
          console.log(res)
          var orders = res.data[a]
          // res.data = JSON.stringify(res.data)
          console.log(orders)
          that.setData({
            order:orders
          })
          // for(let i in orders){
          //   wx.request({
          //     url: 'https://sanye.nbxiong.com/jz/showMallProduct.do',
          //     method: "POST",
          //     header: {
          //       "content-type": "application/x-www-form-urlencoded"
          //     },
          //     data: { productid: orders[i].productid },
          //     success: res => {
          //       orders[i].img = res.data.mallproduct.imgurl
          //       that.setData({
          //         order: orders
          //       })
          //     },
          //     fail: res => {
          //       console.log(res)
          //     }
          //   })
          // }
        },
        fail: res => {
          console.log(res)
        }
      })
    }
  },
  tabClick: function (e) {
    this.setData({
      ac_index: e.currentTarget.dataset.index,
    })
    this.reload()
  },
  // 跳转订单详情
  order_info: function (e) {
    wx.navigateTo({
      url: 'order_info?id=' + e.currentTarget.dataset.id + '&productid=' + e.currentTarget.dataset.productid
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