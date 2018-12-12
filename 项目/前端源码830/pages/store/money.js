// pages/store/money.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    color: 'rgb(56, 132, 254)', //56 132 253
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  formSubmit:function(e){
      var that = this
      var a = that.data
      var money = e.detail.value.money
      if(money==''||money==0){
        wx.showModal({
          title: '温馨提示',
          content: '请输入正确的金额',
        })
      }else{
        wx.showLoading({
          title: '正在发起支付',
        })
        wx.request({
          url: getApp().siteinfo.url+'/hyb/wxPay/recharge',
          data: {
            openId: wx.getStorageSync('openid'),
            money: money
          },
          header: {
            'content-type': 'application/json'
          },
          method: 'GET',
          success: res => {
            wx.requestPayment({
              'timeStamp': res.data.timeStamp,
              'nonceStr': res.data.nonceStr,
              'package': res.data.package,
              'signType': res.data.signType,
              'paySign': res.data.paySign,
              'success': function (res) {
                console.log('支付成功')
                console.log(res)
                wx.hideLoading()
                wx.showLoading({
                  title: '支付成功',
                  mask: true
                })
                wx.navigateBack({
                  delta: 1
                })
              },

              'fail': function (res) {
                console.log('支付失败')
                wx.hideLoading()
                console.log(res)
               wx.showToast({
                 title: '支付失败',
                })
                wx.navigateBack({
                  delta: 1
                })
              },
            })
           
          }
        })
      }
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