// pages/logs/piaoquaninfo/piaoquaninfo.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    test_ticket:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()
    app.setNavigationBarColor(this);
    app.setNavigationBarColor(this);
    app.getSystem(this)
    app.getUrl(this)
    var that = this
    that.setData({
      id: options.id,
      state: options.state,
      states: options.states,
      fu_id: options.fu_id
    })
  },
  refresh: function (e) {
    var that = this
   
    var id = that.data.id
    var fu_id = that.data.fu_id
    // 获取票信息
    app.util.request({
      'url': 'entry/wxapp/PjDetails',
      'cachetime': '0',
      data: {
        ticket_id: id
      },
      success: function (res) {
        console.log(res)
        res.data.pjdetails.end_time = app.ormatDate(res.data.pjdetails.end_time).slice(0, 16)
        res.data.pjdetails.start_time = app.ormatDate(res.data.pjdetails.start_time).slice(0, 16)
        for(let i in res.data.bminfo){
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
    console.log(id)
    console.log(fu_id)
    app.util.request({
      'url': 'entry/wxapp/PjCode',
      'cachetime': '0',
      data: {
        ticket_id: id,
        fu_id: fu_id
      },
      success: function (res) {
        console.log(res)
        that.setData({
          bath: res.data
        })
      },
    })
  },
  // ————————跳转到我的票券——————————
  yaoqing: function () {
    wx: wx.navigateTo({
      url: '../../yaoqing/yaoqing',
    })
  },
  // 弹出核销码弹框
  test_ticket:function(e){
    var that = this
    var test_ticket = that.data.test_ticket
    if (test_ticket==false){
      that.setData({
        test_ticket:true
      })
    }else{
      that.setData({
        test_ticket:false
      })
    }
  },
  // 输入核销码核销
  hx_code: function (e) {
    var that = this
    var value = e.detail.value
    that.setData({
      value:value
    })
  },
  Determine:function(e){
    var that = this
    var details = that.data.details
    var value = that.data.value
    var user_id = wx.getStorageSync('userInfo').id
    app.util.request({
      url: 'entry/wxapp/ManualHx',
      data: {
        ticket_id: details.id,
        hx_code: value
      },
      success: res => {
        console.log(res)
        if (res.data == 1) {
          wx.showToast({
            title: '核销成功',
          })
          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
          }, 1500)
        } else {
          wx.showToast({
            title: '核销码错误',
          })
        }
      }
    })
  },
  // 申请退票
  apply: function (e) {
    var that = this
    var details = that.data.details
    if (details.money == 0) {
      var state = 5
    } else {
      var state = 4
    }
    var today = app.today_time()
    console.log(today)
    wx.showModal({
      title: '',
      content: '是否要退票',
      success:res=>{
        if (res.confirm) {
          console.log('用户点击确定')
          if (today >= details.start_time) {
            wx.showModal({
              title: '',
              content: '活动已经开始，无法退票',
            })
          } else {
            app.util.request({
              url: 'entry/wxapp/ApplyRefund',
              data: {
                ticket_id: details.id,
                state: state
              },
              success: res => {
                console.log(res)
                wx.showToast({
                  title: '申请成功',
                })
                setTimeout(function () {
                  wx.navigateBack({
                    delta: 1
                  })
                }, 1500)
              }
            })
          }
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
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
    that.refresh()
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
    var that = this
    that.refresh()
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