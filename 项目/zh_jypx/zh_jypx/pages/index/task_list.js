// pages/index/task_list.js
//获取应用实例
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
    var unit_id = options.unit_id
    var that = this;
    console.log(that)
    console.log(unit_id)
    that.setData({
      unit_id: unit_id
    })

    // —————————————— 获取网址——————————
    app.util.request({
      "url": "entry/wxapp/Attachurl",
      'cachetime': '0',
      success: function (res) {
        that.setData({
          url: res.data
        })
      }
    })

    //获取课程列表
    app.util.request({
      "url": "entry/wxapp/Task",
      'cachetime': '0',
      data: {
        unit_id: unit_id
      },
      success: function (res) {
        console.log(res)
        if (res.data.code==200){
          var course_name = res.data.list[0].course_name
          var name = res.data.list[0].name
          var nav_title = res.data.list[0].unit_name
          var title = course_name + name
          var first_id = res.data.list[0].id
          that.setData({
            task_con: res.data.list,
            title: title,
            nav_title: nav_title,
            first_id: first_id,
            none: res.data
          })
        }else{
          that.setData({
            // task_con: res.data.list,
            none:res.data
          })
        }
      }
    })
  },

  /*点击进入详情页 */
  task_detail: function (e) {
    var return_con = wx.getStorageSync('user_msg')
    console.log(return_con)
    if (return_con==""){
      wx.showModal({
        title: '',
        content: "您还没有登录,请先登录!"
      })
      setTimeout(function () {
        wx: wx.redirectTo({
          url: '../rank/login_firset',
        })
      }, 2000)
    }else{
      console.log(e)
      var that = this;
      var task_id = that.data.first_id
      console.log(that)
      console.log(task_id)
      var unit_id = that.data.unit_id
      var index = e.currentTarget.dataset.index
      wx: wx.navigateTo({
        url: 'task_detail?task_id=' + task_id + "&unit_id=" + unit_id + "&index=" + index,
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