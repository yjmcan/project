// pages/mycenter/check.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    luntext: ['报名审核', '退票审核'],
    activeIndex: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()
    app.setNavigationBarColor(this);
    var that = this
    var that = this
    var db_tab = wx.getStorageSync('db_tab')
    var yes = app.contains(db_tab, '../mycenter/check')
    console.log(yes)
    if (yes != false) {
      db_tab[yes].color = 'selsects'
      console.log(db_tab)
    }
    that.setData({
      yes: yes,
      db_tab: db_tab
    })
    // that.refresh()
  },
  refresh: function (e) {
    var that = this
    var user_id = wx.getStorageSync('userInfo').id
    var activeIndex = that.data.activeIndex
    if (activeIndex == 0) {
      var state = 1
    } else {
      var state = 4
    }
    app.util.request({
      url: 'entry/wxapp/PjCheck',
      data: {
        state: state,
        user_id: user_id
      },
      success: res => {
        console.log(res)
        var sign_up_examine = res.data
        for (let i in sign_up_examine) {
          sign_up_examine[i].time = app.ormatDate(sign_up_examine[i].time)
        }
        that.setData({
          sign_up_examine: sign_up_examine,
          state:state
        })
      }
    })
  },
  tabClick: function (e) {
    var that = this
    var index = e.currentTarget.id
    var activeIndex = that.data.activeIndex
    if (index != activeIndex) {
      that.setData({
        activeIndex: index
      })
      that.refresh()
    }
  },
  check_info: function (e) {
    var that = this
    var index = e.currentTarget.dataset.id
    var state = that.data.state
    console.log(state)
    var sign_up_examine = that.data.sign_up_examine
    var info = sign_up_examine[index]
    console.log(info)
    wx.navigateTo({
      url: 'check_info?id=' + info.id + '&hd_title=' + info.hd_title + '&img=' + info.img + '&name=' + info.name + '&tk_name=' + info.tk_name +'&time='+info.time+'&state='+state,
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