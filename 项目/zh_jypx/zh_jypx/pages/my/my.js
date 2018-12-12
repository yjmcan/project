// pages/my/my.js
//获取应用实例
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
  onLoad: function (options) {
    var that=this;
    var user_msg = wx.getStorageSync('user_msg')
    that.setData({
      img: user_msg.img,
      really_name: user_msg.students_name,
      school: user_msg.cate_name,
      grade: user_msg.course_name,
      classes: user_msg.class_name,
      score: user_msg.score
    })  
  },

  //地图
  onAddress:function(e){
    // wx.chooseLocation({
    //   success:function(res){
    //   console.log(res)
    //   }
    // })
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function (res) {
        console.log(res)
        var latitude = res.latitude
        var longitude = res.longitude
        wx.openLocation({
          latitude: latitude,
          longitude: longitude,
          scale: 28
        })
      }
    })
  },
  /*跳转积分 */
  integral:function(e){
    var integral_id = wx.getStorageSync('user_msg').id
    wx: wx.navigateTo({
      url: "integral?userid=" + integral_id
    })
  },

  /*进入教师登录 */
  onTeacher: function (e) {
    var return_con = wx.getStorageSync('teacher_msg')
    console.log(return_con)
    if (return_con == "") {
      wx.showToast({
        title: '您还没有登录,请先登录!',
        icon: "none",
        duration: 2000
      })
      setTimeout(function () {
        wx: wx.redirectTo({
          url: '../teacher/t_login',
        })
      }, 2000)
    } else {
      wx: wx.navigateTo({
        url: '../teacher/t_list',
      })
    }
  },

  /*跳转积分兑换 */
  integral_change: function (e) {
    wx: wx.navigateTo({
      url: "integral_change"
    })
  },

  /*跳转班级排名 */
  // onRank:function(e){
  //   wx: wx.navigateTo({
  //     url: "../rank/rank"
  //   })
  // },

  /*跳转我的资料 */
  datas: function (e) {
    var data_id = wx.getStorageSync('user_msg').id
    console.log(data_id)
    wx: wx.navigateTo({
      url: "data?user_id=" + data_id
    })
  },

  /*跳转我的作业 */
  task: function (e) {
    var task_id = wx.getStorageSync('user_msg').id
    console.log(task_id)    
    wx: wx.navigateTo({
      url: "task?userid=" + task_id
    })
  },

  /*跳转历史文章 */
  article: function (e) {
    wx: wx.navigateTo({
      url: "article"
    })
  },

  /*进入排名 */
  onRank: function (e) {
    var rank_id = wx.getStorageSync('user_msg').id
    wx: wx.navigateTo({
      url: '../rank/rank?user_id=' + rank_id,
    })
  },

  /*进入首页 */
  onIndex: function (e) {
    wx: wx.redirectTo({
      url: '../index/index',
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
  onShareAppMessage: function () {
  
  }
})