// pages/store/money.js
const app = getApp()
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
    var that = this
    app.getUserInfo(function (userInfo) {
      console.log(userInfo)
      that.setData({
        users:userInfo
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  formSubmit: function (e) {
    var that = this
    var a = that.data
    var money = e.detail.value.money
    var zd_money = that.data.users.creditAmount
    if (money == '' || money == 0) {
      wx.showModal({
        title: '温馨提示',
        content: '请输入正确的金额',
      })
    } else if (Number(money) <10) {
      wx.showModal({
        title: '温馨提示',
        content: '最低提现金额为10元',
      })
    }else if(Number(money)>Number(zd_money)){
        wx.showModal({
          title: '温馨提示',
          content: '不能超过可提现金额',
        })
    } else {
      wx.showModal({
        title: '温馨提示',
        content: '是否确认提现',
        success:res=>{
          if (res.confirm) {
            wx.request({
              url: getApp().siteinfo.url + '/hyb/amountRecardApi/add',
              data: {
                goodsStationId: that.data.users.id,
                amount: money + ''
              },
              header: {
                "Content-Type": "application/x-www-form-urlencoded"
              },
              method: "POST",
              success: res => {
                console.log(res)
                wx.showToast({
                  title: '提现已发起',
                })
                setTimeout(function () {
                  wx.navigateBack({
                    delta: 1
                  })
                }, 1000)
              }
            })
          }
        }
      })
    }
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