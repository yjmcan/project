// zh_cjdianc/pages/collage/yz_code.js
const app = getApp()
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
    var that = this
    app.setNavigationBarColor(that);
    var scene = decodeURIComponent(options.scene)
    // if (options.scene == null) {
    //   var arr = options.arr
    //   var bool = arr.indexOf("%");
    //   if (bool > 0) {
    //     console.log('包含')
    //     var aa = arr.split("%");
    //     var ticket_id = aa[0]
    //     var fu_id = aa[1].slice(2)
    //     console.log(aa)
    //     console.log(ticket_id)
    //     console.log(fu_id)
    //   } else {
    //     var ticket_id = arr.split(",")[0]
    //     var fu_id = arr.split(",")[1]
    //   }
    // } else {
    //   var arr = options.arr
    //   var ticket_id = arr.split(",")[0]
    //   var fu_id = arr.split(",")[1]
    // }
    
    app.getUserInfo(function (userInfo) {
      console.log(userInfo)
      that.setData({
        userInfo: userInfo,
        order_id:scene
      })
    })
  },
  add_market: function (e) {
    var that = this
    var user_id = that.data.userInfo.id
    var order_id = that.data.order_id
    app.util.request({
      'url': 'entry/wxapp/GroupVerification',
      'cachetime': '0',
      data: {
        order_id: order_id,
        user_id: user_id
      },
      success: function (res) {
        console.log(res)
        if (res.data == '核销成功') {
          wx.showToast({
            title: '核销成功',
          })
          setTimeout(function () {
            wx.reLaunch({
              url: '../Liar/loginindex',
            })
          }, 1500)
        } else {
          wx.showToast({
            title: '核销失败',
          })
          setTimeout(function () {
            wx.reLaunch({
              url: '../Liar/loginindex',
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