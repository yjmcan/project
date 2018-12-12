// pages/rank/rank.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    var user_id = options.user_id
    console.log(user_id)
    app.util.request({
      "url": "entry/wxapp/Ranking",
      "cachetime": "0",
      data: {
        user_id: user_id
      },
      success:function(res){
        console.log(res)
        if(res.data.code==200){
          var cate_name = res.data.list[0].cate_name
          var course_name = res.data.list[0].course_name
          var name = res.data.list[0].name
          var class_name = res.data.list[0].class_name
          that.setData({
            list: res.data.list,
            course_name: course_name,
            cate_name: cate_name,
            name: name,
            class_name: class_name,
            none:res.data,
          })
        }else{
          that.setData({
            none: res.data,
          })
        }

      }
    })
  },

  /*进入首页 */
  onIndex: function (e) {
    wx: wx.redirectTo({
      url: '../index/index',
    })
  },

  /*进入我的 */
  onMy: function (e) {
    var return_con = wx.getStorageSync('user_msg')
    console.log(return_con)
    if (return_con == "") {
      wx.showToast({
        title: '您还没有登录,请先登录!',
        icon: "none",
        duration: 2000
      })
      setTimeout(function () {
        wx: wx.redirectTo({
          url: '../rank/login_firset',
        })
      }, 2000)
    } else {
      wx: wx.redirectTo({
        url: '../my/my',
      })
    }
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