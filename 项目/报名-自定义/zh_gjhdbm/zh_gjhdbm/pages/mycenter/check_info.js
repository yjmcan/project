// zh_gjhdbm/pages/mycenter/check_info.js
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
    app.setNavigationBarColor(this);
    app.getSystem(this)
    app.getUrl(this)
    console.log(options)
    that.setData({
      options: options
    })
    // 获取票信息
    app.util.request({
      'url': 'entry/wxapp/PjDetails',
      'cachetime': '0',
      data: {
        ticket_id: options.id
      },
      success: function (res) {
        console.log(res)
        res.data.pjdetails.end_time = app.ormatDate(res.data.pjdetails.end_time).slice(0, 16)
        res.data.pjdetails.start_time = app.ormatDate(res.data.pjdetails.start_time).slice(0, 16)
        res.data.pjdetails.time = app.ormatDate(res.data.pjdetails.time).slice(0, 16)
        for (let i in res.data.bminfo) {
          if (res.data.bminfo[i].name == '上传图片') {
            console.log(res.data.bminfo[i].value.split(","))
            that.setData({
              img_list: res.data.bminfo[i].value.split(",")
            })
          }
        }
        that.setData({
          details: res.data.pjdetails,
          bminfo: res.data.bminfo
        })
      },
    })
  },
  //拒绝报名
  refuse: function (e) {
    var that = this
    var state = that.data.options.state
    var ticket_id = that.data.options.id
    var details = that.data.details
    var money = details.money
    console.log(money)
    wx.showModal({
      title: '',
      content: '是否拒绝该用户报名',
      success:res=>{
        if (res.confirm) {
          if (money <= 0) {
            app.util.request({
              url: 'entry/wxapp/ApplyRefund',
              data: { state: 6, ticket_id: ticket_id },
              success: res => {
                console.log(res)
                if (res.data == 1) {
                  wx.showToast({
                    title: '操作成功',
                    duration: 2000
                  })
                  setTimeout(function () {
                    wx.navigateBack({
                      delta: 1
                    })
                  }, 2000)
                }
              }
            })
          } else {
            app.util.request({
              url: 'entry/wxapp/Refund',
              data: { state: 6, ticket_id: ticket_id },
              success: res => {
                console.log(res)
                if (res.data == 1) {
                  wx.showToast({
                    title: '操作成功',
                    duration: 2000
                  })
                  setTimeout(function () {
                    wx.navigateBack({
                      delta: 1
                    })
                  }, 2000)
                }
              }
            })
          }
        }
      }
    })
  },
  // 通过退票
  agree_ticket: function (e) {
    var that = this
    var state = that.data.options.state
    var ticket_id = that.data.options.id
    wx.showModal({
      title: '',
      content: '是否通过退票',
      success:res=>{
        if (res.confirm) {
          app.util.request({
            url: 'entry/wxapp/Refund',
            data: { ticket_id: ticket_id },
            success: res => {
              console.log(res)
              if (res.data == 1) {
                wx.showToast({
                  title: '操作成功',
                  duration: 2000
                })
                setTimeout(function () {
                  wx.navigateBack({
                    delta: 1
                  })
                }, 2000)
              }
            }
          })
        }
      }
    })
  },
  // 拒绝退票
  refuse_ticket: function (e) {
    var that = this
    var details = that.data.details
    wx.showModal({
      title: '',
      content: '是否通过退票',
      success: res => {
        if (res.confirm) {
          app.util.request({
            url: 'entry/wxapp/ApplyRefund',
            data: { state: 2, ticket_id: details.ticket_id },
            success: res => {
              console.log(res)
              if (res.data == 1) {
                wx.showToast({
                  title: '操作成功',
                  duration: 2000
                })
                setTimeout(function () {
                  wx.navigateBack({
                    delta: 1
                  })
                }, 2000)
              }
            }
          })
        }
      }
    })
  },
  // 通过报名
  agree: function (e) {
    var that = this
    var state = that.data.options.state
    var ticket_id = that.data.options.id
    if (state == 1) {
      app.util.request({
        url: 'entry/wxapp/UpdPj',
        data: { state: 2, ticket_id: ticket_id },
        success: res => {
          console.log(res)
          if (res.data == 1) {
            wx.showToast({
              title: '操作成功',
              duration: 2000
            })
            setTimeout(function () {
              wx.navigateBack({
                delta: 1
              })
            }, 2000)
          }
        }
      })
    }
  },
    // 拨打电话
    phone: function(e) {
      var that = this
      var bminfo = that.data.bminfo
      function IndexDemo(star1) {
        var s = star1.indexOf('手机');
        return (s);
      }
      for (let i in bminfo) {
        console.log(bminfo[i])
        if (IndexDemo(bminfo[i].name) == 0) {
          wx.makePhoneCall({
            phoneNumber: bminfo[i].value,
          })
        }
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
  // onShareAppMessage: function () {

  // }
})