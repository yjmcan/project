// zh_wzp/pages/resume/add_job.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: '2016-09-01',
    date1: '至今'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var that = this
    if (options.type == 1) {
      var index = options.index
      var project = wx.getStorageSync('project')
      that.setData({
        project: project[index],
        date: project[index].project_time1,
        date1: project[index].project_time2,
        modify: true,
        index: index
      })
    }
    that.setData({
      color: wx.getStorageSync("color")
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: wx.getStorageSync("color"),
    })
  },
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  bindDateChange1: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date1: e.detail.value
    })
  },
  formSubmit: function (e) {
    console.log(e)
    var that = this
    var name = e.detail.value.name
    var text = e.detail.value.text
    var job = e.detail.value.job
    var date = that.data.date
    var date1 = that.data.date1
    var fruit = e.detail.value.fruit
    var job_c = {
      project_name: name,
      project_introducation: text,
      project_role: job,
      project_time1: date,
      project_time2: date1,
      project_url: fruit
    }
    var project = wx.getStorageSync('project')
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];  //上一个页面
    var modify = that.data.modify
    console.log(modify)
    if (modify != true) {
      prevPage.setData({
        project: project.concat(job_c)
      })
      wx.navigateBack({
        delta: 1
      })
    } else {
      var index = that.data.index
      project[index] = job_c
      prevPage.setData({
        project: project
      })
      wx.navigateBack({
        delta: 1
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