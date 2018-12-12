// pages/myactive/myguanzhu.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    luntext: ['活动', '标签', '主办方', '场地'],
    activeIndex: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()
    app.setNavigationBarColor(this);
    var that = this
    var db_tab = wx.getStorageSync('db_tab')
    var yes = app.contains(db_tab, '../myactive/myguanzhu')
    console.log(yes)
    if (yes != false) {
      db_tab[yes].color = 'selsects'
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
    var today = app.today_time()
    var user_id = wx.getStorageSync('userInfo').id
    console.log(user_id)
    app.util.request({
      url: 'entry/wxapp/MyFollow',
      data: {
        user_id: user_id
      },
      success: res => {
        console.log(res)
        for (let i in res.data) {
          res.data[i].end_time = app.ormatDate(res.data[i].end_time).slice(0, 16)
          res.data[i].start_time = app.ormatDate(res.data[i].start_time).slice(0, 16)
          if (res.data[i].is_close == 1) {
            if (today >= res.data[i].end_time) {
              res.data[i].sign_up = '已结束'
              res.data[i].sign_state = 'sign_over'
            } else {
              if (today >= res.data[i].start_time) {
                res.data[i].sign_up = '进行中'
                res.data[i].sign_state = 'sign_over'
              } else {
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
          my_follow: res.data,
          url: wx.getStorageSync('url')
        })
      }
    })
  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  jump_activity_info: function (e) {
    console.log(e)
    var that = this
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../activeinfo/activeinfo?id=' + id,
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