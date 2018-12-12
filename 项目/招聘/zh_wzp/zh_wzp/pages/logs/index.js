// zh_wzp/pages/logs/index.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    itemList: [
      '离职-随时到岗',
      '在职-暂不考虑',
      '在职-考虑机会',
      '在职-月内到岗',
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.route(this)
    var that = this
    app.util.request({
      url: 'entry/wxapp/Attachurl',
      success: res => {
        console.log(res)
        that.setData({
          url: res.data
        })
      }
    })
    // 查看是否已经认证
    var user_id = wx.getStorageSync("userinfo").id
    app.util.request({
      url: 'entry/wxapp/IsAdmission',
      data:{
        user_id:user_id
      },
      success: res => {
        console.log(res)
        if(res.data==1){
          that.setData({
            admi: res.data
          })
        }else{
          that.setData({
            admi: res.data
          })
        }
        
      }
    })
    that.setData({
      color: wx.getStorageSync("color")
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: wx.getStorageSync("color"),
    })
    that.count()
  },
  count:function(e){
    var that = this
    var user_id = wx.getStorageSync("userinfo").id
    app.util.request({
      url: 'entry/wxapp/Count',
      data: {
        user_id: user_id
      },
      success: res => {
        console.log(res)
        that.setData({
          count:res.data
        })

      }
    })
  },
  users: function (e) {
    var that = this
    var user = wx.getStorageSync("userinfo")
    console.log(user)
    if (user.img == '') {
      that.setData({
        user_info: true
      })
    } else {
      that.setData({
        user_info: false,
        user: user
      })
    }
  },
  // 获取用户信息
  set_user: function (e) {
    console.log(e)
    var that = this
    var succ = e.detail.errMsg
    if (succ != 'getUserInfo:ok') {
      app.getUserInfo(function (userInfo) {
        that.users()
      })
    } else {
      app.getUserInfo(function (userInfo) {
        that.users()
      })
    }
  },
  job_w: function (e) {
    var that = this
    var user_id = wx.getStorageSync("userinfo").id
    app.util.request({
      url: 'entry/wxapp/SeeMember',
      data:{
        user_id:user_id
      },
      success: res => {
        console.log(res)
       if(res.data==false){
         wx.showModal({
           title: '',
           content: '您还没有认证,请先进行认证',
           success: res => {
             if (res.confirm) {
               wx.navigateTo({
                 url: '../r_z/index',
               })
             }
           }
         })
       }else{
         if (res.data.status == 1) {
           wx.showModal({
             title: '',
             content: '系统正在审核中，请稍后再试',
           })
         } else if (res.data.status == 2) {
           wx.navigateTo({
             url: '../r_z/log_index',
           })
         } else if (res.data.status == 3) {
           wx.showModal({
             title: '',
             content: '您的认证申请已经被拒绝,请重新认证',
             success: res => {
               if (res.confirm) {
                 wx.navigateTo({
                   url: '../r_z/index',
                 })
               }
             }
           })
         }
       }
        

      }
    })
  },
  coll: function (e) {
    wx.navigateTo({
      url: '../coll/index',
    })
  },
  user: function (e) {
    wx.navigateTo({
      url: '../user/index',
    })
  },
  resume: function (e) {
    wx.navigateTo({
      url: '../resume/index',
    })
  },
  interview: function (e) {
    wx.navigateTo({
      url: '../Interview/index',
    })
  },
  mine_iter: function (e) {
    wx.navigateTo({
      url: '../Interview/mine_inter',
    })
  },
  tabbar: function (e) {
    console.log(e)
    var that = this
    var url = e.currentTarget.dataset.url
    wx.redirectTo({
      url: url,
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
    that.users()
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
  onShareAppMessage: function () {

  }
})