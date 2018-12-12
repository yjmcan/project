// pages/logs/piaoquan/piaoquan.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    luntext: ['全部', '待参加', '审核中', '已验票', '退票'],
    activeIndex: 0,
    page: 1,
    my_tickets: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()
    app.setNavigationBarColor(this);
    var that = this
    that.setData({
      activity_id: options.activity_id
    })

    that.refresh()
  },
  refresh: function (e) {
    var that = this
    var page = that.data.page
    var activeIndex = that.data.activeIndex
    var activity_id = that.data.activity_id
    var state
    if (activeIndex == 0) {
      state = ''
    } else if (activeIndex == 1) {
      state = '2'
    } else if (activeIndex == 2) {
      state = '1'
    } else if (activeIndex == 3) {
      state = '3'
    } else if (activeIndex == 4) {
      state = '5'
    }
    console.log(state)
    var my_tickets = that.data.my_tickets
    // 我的票券
    app.util.request({
      'url': 'entry/wxapp/HdPjlist',
      'cachetime': '0',
      data: { activity_id: activity_id, state: state, page: page },
      success: function (res) {
        console.log(res)
        if (res.data.length > 0) {
          that.setData({
            page: page + 1,
            many: true
          })
          my_tickets = my_tickets.concat(res.data)
          var today = app.today_time()
          console.log(today)
          for (let i in res.data) {
            res.data[i].end_time = app.ormatDate(res.data[i].end_time)
            if (today > res.data[i].end_time) {
              res.data[i].state = '失效'
              res.data[i].states = 2
            } else if (today <= res.data[i].end_time) {

              if (res.data[i].state == 4) {
                res.data[i].state = '已申请退票'
                res.data[i].states = 2
              } else if ( res.data[i].state == 5) {
                res.data[i].state = '已退票'
                res.data[i].states = 2
              } else {
                res.data[i].state = '有效'
                res.data[i].states = 1
              }
            }
            res.data[i].end = res.data[i].end_time.slice(0, 16)

            if (res.data[i].hd_place == 1) {
              res.data[i].hd_place = '线上活动'
            } else {
              res.data[i].hd_place = '线下活动'
            }
          }
          that.setData({
            my_tickets: my_tickets
          })
        } else {
          that.setData({
            page: page,
            many: false
          })
        }
      },
    })
  },
  // ————————跳转到我的票券详情——————————
  piaoinfo: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index
    var my_tickets = that.data.my_tickets
    var info = my_tickets[index]
    wx.navigateTo({
      url: '../mycenter/check_info?id=' + info.id + '&hd_title=' + info.hd_title + '&img=' + info.img + '&name=' + info.tk_name  + '&tk_name=' +' ' + '&time=' + info.time,
    })
  },

  tabClick: function (e) {
    this.setData({
      activeIndex: e.currentTarget.id,
      page: 1,
      my_tickets: []
    });
    this.refresh()
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
    var that = this
    that.setData({
      page: 1,
      my_tickets: []
    })
    that.refresh()
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this
    console.log('上拉触底')
    that.refresh()
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})