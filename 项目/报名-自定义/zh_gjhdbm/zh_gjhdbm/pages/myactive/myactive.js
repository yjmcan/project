// pages/myactive/myactive.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    luntext: ['全部', '进行中', '已结束', '违规'],
    activeIndex: 0,
    page: 1,
    my_activity: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()
    app.setNavigationBarColor(this);
    var that = this
    app.getSystem(this)
    app.getUrl(this)
    var db_tab = wx.getStorageSync('db_tab')
    var yes = app.contains(db_tab, '../myactive/myactive')
    console.log(yes)
    if (yes != false) {
      db_tab[yes].color = 'selsects'
      db_tab[yes].img = db_tab[yes].icon1
      console.log(db_tab)
    } 
    that.setData({
      yes: yes,
      db_tab: db_tab
    })
    that.refresh()
  },
  refresh: function (e) {
    var that = this
    var user_id = wx.getStorageSync('userInfo').id
    var today = app.today_time()
    var url = wx.getStorageSync('url')
    var my_activity = that.data.my_activity
    var page = that.data.page
    app.util.request({
      url: 'entry/wxapp/MyActivity',
      data: {
        user_id: user_id,
        page: page
      },
      success: res => {
        console.log(res)
        if (res.data.length > 0) {
          my_activity = my_activity.concat(res.data)
          for (let i in res.data) {
            res.data[i].end_time = app.ormatDate(res.data[i].end_time).slice(0, 16)
            res.data[i].start_time = app.ormatDate(res.data[i].start_time).slice(0, 16)
            if (res.data[i].is_close == 1) {
              if (today >= res.data[i].end_time) {
                res.data[i].sign_up = '已结束'
                res.data[i].sign_state = 'sign_over'
              } else {
                if (today >= res.data[i].start_time){
                 res.data[i].sign_up = '进行中'
                 res.data[i].sign_state = 'sign_up'
               }else{
                  res.data[i].sign_up = '报名中'
                  res.data[i].sign_state = 'sign_up'
               }
              }
            } else {
              res.data[i].sign_up = '已结束'
              res.data[i].sign_state = 'sign_over'
            }

          }
          that.setData({
            page: page + 1,
            my_activity: my_activity,
            my_activitys: my_activity
          })
        } else {
          that.setData({
            my_activity: my_activity,
            my_activitys: my_activity
          })
        }
      }
    })
  },
  tabClick: function (e) {
    var that = this
    var index = e.currentTarget.id
    var my_activitys = that.data.my_activitys
    var today = app.today()
    if (index == 0) {
      that.setData({
        my_activity: that.data.my_activitys
      })
    } else if (index == 1) {
      var my_activity = []
      for (let i in my_activitys) {
        if (today > my_activitys[i].start_time) {
          my_activity.push(my_activitys[i])
        }
      }
      that.setData({
        my_activity: my_activity
      })
    } else if (index == 2) {
      var my_activity = []
      for (let i in my_activitys) {
        if (today > my_activitys[i].end_time) {
          my_activity.push(my_activitys[i])
        }
      }
      that.setData({
        my_activity: my_activity
      })
    } else if (index == 3) {
      var my_activity = []
      for (let i in my_activitys) {
        if (my_activitys[i].status == 3) {
          my_activity.push(my_activitys[i])
        }
      }
      that.setData({
        my_activity: my_activity
      })
    }
    that.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  my_activity: function (e) {
    console.log(e)
    var that = this
    var id = e.currentTarget.dataset.id
    var my_activity = that.data.my_activity
    for (let i in my_activity) {
      if (id == my_activity[i].id) {
        var activity = my_activity[i]
      }
    }
    wx.navigateTo({
      url: '../activemanage/activemanage?id=' + id + '&activity_type=' + activity.activity_type + '&end_time=' + activity.end_time + '&sign_up=' + activity.sign_up + '&total_ticket=' + activity.total_ticket + '&gz_num=' + activity.gz_num + '&title=' + activity.title + '&logo=' + activity.logo + '&url=' + that.data.url + '&is_close=' + activity.is_close + '&hx_code=' + activity.hx_code + '&zd_money=' + activity.zd_money,
    })
  },
  // ————————第四个跳转——————————
  wode: function () {
    var that = this
    var db_tab = that.data.db_tab
    wx: wx.reLaunch({
      url: db_tab[3].src,
    })
  },

  // ————————跳转到发布活动——————————
  fabu: function () {
    wx: wx.reLaunch({
      url: '../fabu/fabu',
    })
  },
  // ————————跳转到首页——————————
  index: function () {
    var that = this
    var db_tab = that.data.db_tab
    wx: wx.reLaunch({
      url: db_tab[0].src,
    })
  },
  // ————————第二个跳转——————————
  classifination: function (e) {
    var that = this
    var db_tab = that.data.db_tab
    wx: wx.reLaunch({
      url: db_tab[1].src,
    })
  },
  // ————————第三个跳转——————————
  mine_activity: function (e) {
    var that = this
    var db_tab = that.data.db_tab
    wx: wx.reLaunch({
      url: db_tab[2].src,
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
    var that= this
   that.setData({
     page: 1,
     my_activity: []
   })
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
    that.setData({
      my_activity: [],
      page: 1,
      activeIndex: 0
    })
    that.refresh()
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this
    that.refresh()
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})