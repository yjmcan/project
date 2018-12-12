// zh_gjhdbm/pages/authentication/authentication.js
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
    var that = this
    wx.hideShareMenu()
    app.setNavigationBarColor(this);
    that.refresh()
    var db_tab = wx.getStorageSync('db_tab')
    var yes = app.contains(db_tab, '../authentication/authentication')
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
  },
  refresh:function(e){
    var that = this
    //获取用户信息
    app.getUserInfo(function (userInfo) {
      // console.log(userInfo)
      var user_id = userInfo.id
      app.util.request({
        'url': 'entry/wxapp/GetUserInfo',
        'cachetime': '0',
        data:{
          user_id: user_id
        },
        success: function (res) {
          console.log('这是GetUserInfo')
          console.log(res)
          that.setData({
            rz_type: res.data.rz_type,
            sh:res.data.sh,
            id:res.data.id
          })
        },
      })
    })
  },
  select:function(e){
    wx.navigateTo({
      url: 'select?id='+0,
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
    var that = this
    that.refresh()
    wx.stopPullDownRefresh()
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