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
      var job = wx.getStorageSync('job')
      that.setData({
        job: job[index],
        date: job[index].work_time1,
        date1: job[index].work_time2,
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
  cancel: function (e) {
    var that = this
    var job = wx.getStorageSync('job')
    var index = that.data.index
    job = job.splice(1, index)
    wx.showToast({
      title: '删除成功',
    })
    setTimeout(function(){
      var pages = getCurrentPages();
      var currPage = pages[pages.length - 1];   //当前页面
      var prevPage = pages[pages.length - 2];  //上一个页面
      prevPage.setData({
        job: job
      })
      wx.navigateBack({
        delta: 1
      })
    },1500)
  },
  formSubmit: function (e) {
    console.log(e)
    var that = this
    var name = e.detail.value.name
    var text = e.detail.value.text
    var job = e.detail.value.job
    var date = that.data.date
    var date1 = that.data.date1
    var modify = that.data.modify
    var job_c = {
      work_company: name,
      work_content: text,
      work_position: job,
      work_time1: date,
      work_time2: date1
    }
    var job = wx.getStorageSync('job')
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];  //上一个页面
    if (modify != true) {
      prevPage.setData({
        job: job.concat(job_c)
      })
      wx.navigateBack({
        delta: 1
      })
    } else {
      var index = that.data.index
      job[index] = job_c
      prevPage.setData({
        job: job
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