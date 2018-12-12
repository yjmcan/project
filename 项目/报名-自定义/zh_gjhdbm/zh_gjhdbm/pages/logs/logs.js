// pages/logs/logs.js
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
  onLoad: function(options) {
    var that = this
    app.setNavigationBarColor(this);
    wx.hideShareMenu()
    var db_tab = wx.getStorageSync('db_tab')
    var yes = app.contains(db_tab, '../logs/logs')
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
    var user_id = wx.getStorageSync('userInfo').id
    that.setData({
      url: wx.getStorageSync('url')
    })
    // 分销设置
    app.util.request({
      url: 'entry/wxapp/GetFxSet',
      success: res => {
        console.log(res)
        that.setData({
          GetFxSet: res.data
        })
      }
    })
    // 获取系统设置
    app.util.request({
      'url': 'entry/wxapp/getSystem',
      'cachetime': '0',
      success: function(res) {
        console.log('这是系统设置')
        console.log(res)
        wx.setNavigationBarTitle({
          title: res.data.pt_name
        })
        that.setData({
          system: res.data
        })
      },
    })
    // 票券统计
    app.util.request({
      'url': 'entry/wxapp/TicketCount',
      'cachetime': '0',
      data: {
        user_id: user_id
      },
      success: function(res) {
        console.log(res)
        that.setData({
          ticket: res.data[0]
        })
      },
    })
    // wx.getUserInfo({
    //   success: res => {
    //     app.globalData.userInfo = res.userInfo
    //     that.setData({
    //       userInfo: res.userInfo,
    //       hasUserInfo: true
    //     })
    //   }
    // })
  },
  // ————————验票二维码——————————
  myyanpiao: function() {
    // 允许从相机和相册扫码
    wx.scanCode({
      success: (res) => {
        console.log(res)
        var path = res.path
        var arr = path.slice(42)
        console.log(arr)
        wx.navigateTo({
          url: 'inspect_ticket?arr=' + arr,
        })
      }
    })
  },
  // ————————跳转到我的票券——————————
  mypiao: function() {
    wx: wx.navigateTo({
      url: '../piaoquan/piaoquan',
    })
  },
  participate: function(e) {
    wx: wx.navigateTo({
      url: '../piaoquan/piaoquan?activeIndex=' + 1,
    })
  },
  audit: function(e) {
    wx: wx.navigateTo({
      url: '../piaoquan/piaoquan?activeIndex=' + 2,
    })
  },
  ticket_success: function(e) {
    wx: wx.navigateTo({
      url: '../piaoquan/piaoquan?activeIndex=' + 3,
    })
  },
  refund_ticket: function(e) {
    wx: wx.navigateTo({
      url: '../piaoquan/piaoquan?activeIndex=' + 4,
    })
  },
  // 留言管理
  liuyan: function(e) {
    wx.navigateTo({
      url: '../myactive/myliuyan',
    })
  },
  add_markting: function(e) {
    var that = this
    var user_id = that.data.user_id
    app.util.request({
      'url': 'entry/wxapp/GetSponsor',
      'cachetime': '0',
      data: {
        user_id: user_id
      },
      success: function(res) {
        console.log('这是获取主办方资料')
        console.log(res)
        if (res.data == false) {
          // 没有认证
          wx.showModal({
            title: '创建主办方',
            content: '您还没有进行填写主办方信息',
            success: function(res) {
              if (res.confirm) {
                console.log('用户点击确定')
                wx.navigateTo({
                  url: '../mycenter/edit',
                })
              }
            }
          })
        } else {
          wx.navigateTo({
            url: 'add_markting',
          })
        }
      },
    })

  },
  // ————————跳转到关注页面——————————
  myguanzhu: function() {
    wx: wx.navigateTo({
      url: '../myactive/myguanzhu',
    })
  },

  // ————————跳转到我的活动——————————
  myactive: function() {
    wx: wx.navigateTo({
      url: '../myactive/myactive',
    })
  },

  // ————————跳转到收入页面——————————
  myshouru: function() {
    wx: wx.navigateTo({
      url: '../mycenter/myshouru',
    })
  },

  // ————————跳转到认证管理——————————
  myliuyan: function() {
    // 留言管理界面
    // wx: wx.navigateTo({
    //   url: '../myactive/myliuyan',
    // })
    var that = this
    var user_id = that.data.user_id
    app.util.request({
      'url': 'entry/wxapp/GetSponsor',
      'cachetime': '0',
      data: {
        user_id: user_id
      },
      success: function(res) {
        console.log('这是获取主办方资料')
        console.log(res)
        if (res.data == false) {
          // 没有认证
          wx.showModal({
            title: '创建主办方',
            content: '您还没有进行填写主办方信息',
            success: function(res) {
              if (res.confirm) {
                console.log('用户点击确定')
                wx.navigateTo({
                  url: '../mycenter/edit?status=' + 1,
                })
              }
            }
          })
        } else {
          wx: wx.navigateTo({
            url: '../authentication/authentication',
          })
        }
      },
    })

  },

  // ————————跳转到我的留言——————————
  mycenter: function() {
    wx: wx.navigateTo({
      url: '../mycenter/edit',
    })
  },
  // 分销中心
  fenxiao: function(e) {
    var that = this
    var user_id = wx.getStorageSync("userInfo").id
    // 查看是否是分销商
    app.util.request({
      url: 'entry/wxapp/MyDistribution',
      data: {
        user_id: user_id
      },
      success: res => {
        console.log(res)
        if (res.data == false) {
          wx.navigateTo({
            url: '../distribution/examine',
          })

        } else {
          if (res.data.state == 1) {
            wx.showModal({
              title: '温馨提示',
              content: '系统正在审核中，请稍后再试',
            })
          } else if (res.data.state == 2) {
            wx.navigateTo({
              url: '../distribution/distribution',
            })
          } else if (res.data.state == 3) {
            wx.showModal({
              title: '温馨提示',
              content: '您的申请已被拒绝',
            })
          }
        }

      }
    })
  },
  // ————————第四个跳转——————————
  wode: function() {
    var that = this
    var db_tab = that.data.db_tab
    wx: wx.reLaunch({
      url: db_tab[3].src,
    })
  },

  // ————————跳转到发布活动——————————
  fabu: function() {
    wx: wx.reLaunch({
      url: '../fabu/fabu',
    })
  },
  // ————————跳转到首页——————————
  index: function() {
    var that = this
    var db_tab = that.data.db_tab
    wx: wx.reLaunch({
      url: db_tab[0].src,
    })
  },
  // ————————第二个跳转——————————
  classifination: function(e) {
    var that = this
    var db_tab = that.data.db_tab
    wx: wx.reLaunch({
      url: db_tab[1].src,
    })
  },
  // ————————第三个跳转——————————
  mine_activity: function(e) {
    var that = this
    var db_tab = that.data.db_tab
    wx: wx.reLaunch({
      url: db_tab[2].src,
    })
  },
  group: function(e) {
    wx.navigateTo({
      url: 'group_order?state=' + 1,
    })
  },
  // ————————跳转到发布活动——————————
  check: function() {
    wx: wx.navigateTo({
      url: '../mycenter/check',
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this
    app.getUserInfo(function (userInfo) {
      that.setData({
        userInfo: userInfo,
        user_id: userInfo.id
      })
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})