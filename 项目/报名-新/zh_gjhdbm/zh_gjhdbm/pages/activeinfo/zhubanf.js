// pages/activeinfo/zhubanf.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    guanzhu:false,
    quxiaogz:true,
    my_activity:[],
    page:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()
    app.setNavigationBarColor(this);
    var that = this
    that.setData({
      sponsor: options.sponsor,
      rz_type: options.rz_type
    })
    // 获取网址
    app.util.request({
      'url': 'entry/wxapp/url',
      'cachetime': '0',
      success: function (res) {
        console.log('这是网址')
        console.log(res)
        wx.setStorageSync('url', res.data)
        that.setData({
          url: res.data
        })
      },
    })
    that.GetSponsorInfo()
  },
  GetSponsorInfo:function(e){
    var that = this
    var sponsor = that.data.sponsor
    console.log(sponsor)
    app.util.request({
      'url': 'entry/wxapp/GetSponsorInfo',
      'cachetime': '0',
      data: { name: sponsor},
      success: function (res) {
        console.log(res)
        that.setData({
          sponsor_info:res.data
        })
        that.refresh()
      },
    })
  },
  refresh: function (e) {
    var that = this
    var user_id = that.data.sponsor_info.user_id
    var today = app.today()
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
                res.data[i].sign_up = '报名中'
                res.data[i].sign_state = 'sign_up'
              }
            } else {
              res.data[i].sign_up = '已结束'
              res.data[i].sign_state = 'sign_over'
            }

          }
          that.setData({
            page: page + 1,
            my_activity: my_activity,
          })
        } else {
          that.setData({
            my_activity: my_activity,
          })
        }
      }
    })
  },
  guanzhu:function(){
    this.setData({
      guanzhu:true,
      quxiaogz: false
    })
    wx.showToast({
      title: '已关注成功',
      icon: 'success',
      duration: 2000
    })
  },
  quxiaogz: function () {
    this.setData({
      quxiaogz: true,
      guanzhu:false
    })
    wx.showToast({
      title: '已取消关注',
      icon: 'success',
      duration: 2000
    })
  },
  my_activity: function (e) {
    console.log(e)
    var that = this
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../activeinfo/activeinfo?id=' + id 
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
      my_activity: [],
      page: 1,
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