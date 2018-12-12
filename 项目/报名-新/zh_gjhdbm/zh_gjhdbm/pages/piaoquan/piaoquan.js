// pages/logs/piaoquan/piaoquan.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    luntext: ['全部', '待参加', '审核中', '已验票', '退票'],
    activeIndex: 0,
    page:1,
    my_tickets:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()
    app.setNavigationBarColor(this);
    var that = this
    var db_tab = wx.getStorageSync('db_tab')
    var yes = app.contains(db_tab, '../piaoquan/piaoquan')
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
    
    that.setData({
      db_tab: db_tab
    })
    if (options.activeIndex==null){

    }else{
      var activeIndex = options.activeIndex
      that.setData({
        activeIndex: activeIndex
      })
    }
   
    that.refresh()
  },
  refresh:function(e){
    var that= this
    var page = that.data.page
    var activeIndex = that.data.activeIndex
    var user_id = wx.getStorageSync('userInfo').id
    var state
    if (activeIndex==0){
      state = ''
    } else if (activeIndex==1){
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
      'url': 'entry/wxapp/MyTickets',
      'cachetime': '0',
      data: { user_id: user_id, state: state,page:page},
      success: function (res) {
        console.log(res)
        if(res.data.length>0){
          that.setData({
            page:page+1,
            many:true
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
              
              // if (res.data[i].state == 4 || res.data[i].state==5){
              //   res.data[i].state = '已退票'
              //   res.data[i].states = 2
              // }else{
              //   res.data[i].state = '有效'
              //   res.data[i].states = 1
              // }
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
        }else{
          that.setData({
            page: page,
            many: false
          })
        }
      },
    })
  },
  // ————————跳转到我的票券详情——————————
  piaoinfo: function(e) {
    console.log(e)
    var id = e.currentTarget.dataset.id
    var state = e.currentTarget.dataset.state
    var states = e.currentTarget.dataset.states
    var fu_id = e.currentTarget.dataset.fu_id
    wx: wx.navigateTo({
      url: '../piaoquaninfo/piaoquaninfo?id=' + id + '&state=' + state + '&states=' + states + '&fu_id=' + fu_id,
    })
  },

  tabClick: function (e) {
    this.setData({
      activeIndex: e.currentTarget.id,
      page:1,
      my_tickets:[]
    });
    this.refresh()
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
    var that = this
    that.setData({
      page:1,
      my_tickets:[]
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