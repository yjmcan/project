// zh_gjhdbm/pages/logs/piaoquaninfo/add_mark.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    app.setNavigationBarColor(this);
    var that = this
    if (options.scene == null) {
      var arr = options.arr
      var bool = arr.indexOf("%");
      if (bool > 0) {
        console.log('包含')
        var aa = arr.split("%");
        var ticket_id = aa[0]
        var fu_id = aa[1].slice(2)
        console.log(aa)
        console.log(ticket_id)
        console.log(fu_id)
      }else{
        var ticket_id = arr.split(",")[0]
        var fu_id = arr.split(",")[1]
      }
    } else {
      var arr = options.arr
      var ticket_id = arr.split(",")[0]
      var fu_id = arr.split(",")[1]
    }
    // console.log(arr)
    // var bool = arr.indexOf("%");
    // if (bool > 0) {
    //   console.log('包含')
    //   var aa = arr.split("%");
    //   var ticket_id = aa[0]
    //   var fu_id = aa[1].slice(2)
    //   console.log(aa)
    //   console.log(ticket_id)
    //   console.log(fu_id)
    // } else {
    //   console.log('不包含')
    //   var ticket_id = arr.split(",")[0]
    //   var fu_id = arr.split(",")[1]
    // }
    console.log('票券id' + ' ' + ticket_id)
    console.log('活动发布人id' + ' ' + fu_id)
    var that = this
    // 验票人的id
    //获取用户信息
    app.getUserInfo(function (userInfo) {
      that.setData({
        user_id: userInfo.id,
        ticket_id: ticket_id
      })
      app.util.request({
        'url': 'entry/wxapp/AddVerification',
        'cachetime': '0',
        data: {
          user_id: user_id,
          hx_id: user_id
        },
        success: function (res) {
          console.log(res)
          
        },
      })
    })
   
  },
  add_market: function (e) {
    var that = this
    var user_id = that.data.user_id
    var ticket_id = that.data.ticket_id
    console.log(ticket_id)
    console.log(user_id)
    app.util.request({
      'url': 'entry/wxapp/IsHx',
      'cachetime': '0',
      data: {
        ticket_id: ticket_id,
        user_id: user_id
      },
      success: function (res) {
        console.log(res)
        if (res.data == 1) {
          wx.showToast({
            title: '核销成功',
          })
          setTimeout(function () {
            wx.redirectTo({
              url: '../index/index',
            })
          }, 1500)
        } else {
          wx.showToast({
            title: '核销失败',
          })
          setTimeout(function () {
            wx.redirectTo({
              url: '../index/index',
            })
          }, 1500)
        }
      },
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