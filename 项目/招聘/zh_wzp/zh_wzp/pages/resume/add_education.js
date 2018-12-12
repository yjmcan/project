// zh_wzp/pages/resume/add_job.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    multiIndex: [0, 0],
    date: "2016",
    date1: "2018",
    index1:3,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var that = this
    if (options.type == 1) {
      var index = options.index
      var education = wx.getStorageSync('education')
      var date = education[index].education_time1
      var date1 = education[index].education_time2
      that.setData({
        education: education[index],
        date: education[index].education_time1,
        date1: education[index].education_time2,
        modify: true,
        index: index
      })
      that.date()
    }else{
      var date = that.data.date
      var date1 = that.data.date1
      that.date()
    }
    that.setData({
      color: wx.getStorageSync("color")
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: wx.getStorageSync("color"),
    })
  },
  date:function(e){
    var that =this
    var modify = that.data.modify
    app.util.request({
      url: 'entry/wxapp/Degree',
      success: res => {
        var degree = res.data
        var price = []
        var education = that.data.education
        for (let i in degree) {
          price.push(degree[i].name)
          if(modify==true){
            if (education.education_qualification == degree[i].name) {
              that.setData({
                index1: i
              })
            }
          }
        }
        that.setData({
          price: price
        })
      }
    })
    var date = that.data.date
    var date1 = that.data.date1
    var myDate = new Date();
    // 开始年份
    var startYear = myDate.getFullYear() - 50;//起始年份 
    startYear = Number(startYear)
    var year = myDate.getFullYear()
    year = Number(year)
    var endYear = myDate.getFullYear() + 20;//结束年份 
    endYear = Number(endYear)
    // 结束年份
    var obj = []
    console.log(myDate)
    console.log(startYear)
    console.log(year)
    console.log(endYear)
    var job_w = [
      [],
      []
    ]
    console.log(date)
    console.log(date1)
    var multiIndex = that.data.multiIndex
    for (var i = year; i <= year && i >= startYear; i--) {
      job_w[0].push(i)
    }
    for (var i = year; i >= year && i <= endYear; i++) {
      job_w[1].push(i)
     
    }
    for(let i in job_w[0]){
      if(date==job_w[0][i]){
        console.log(i)
        multiIndex[0] = i
      }
    } for (let i in job_w[1]) {
      if (date1 == job_w[1][i]) {
        console.log(i)
        multiIndex[1] = i 
      }
    }
    that.setData({
      job_w: job_w,
      multiIndex: multiIndex
    })
  },

  bindMultiPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      multiIndex: e.detail.value
    })
  },
  bindMultiPickerColumnChange: function (e) {
    console.log(e)
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);

  },
  bindPickerChange2: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index1: e.detail.value
    })
  },
  formSubmit: function (e) {
    console.log(e)
    var that = this
    var name = e.detail.value.name
    var text = e.detail.value.text
    var job = e.detail.value.job
    var job_w = that.data.job_w
    var multiIndex = that.data.multiIndex
    var time = job_w[0][multiIndex[0]] + '-' + job_w[1][multiIndex[1]]
    var price = that.data.price
    var index1 = that.data.index1
    var educa = price[index1]
    var job_c = {
      education_school: name,
      education_experience: text,
      education_major: job,
      education_time1: job_w[0][multiIndex[0]],
      education_time2: job_w[1][multiIndex[1]],
      education_qualification: educa
    }
    var education = wx.getStorageSync('education')
    console.log(education)
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];  //上一个页面
    var modify = that.data.modify
    console.log(modify)
    if (modify != true) {
      prevPage.setData({
        education: education.concat(job_c)
      })
      wx.navigateBack({
        delta: 1
      })
    } else {
      var index = that.data.index
      education[index] = job_c
      prevPage.setData({
        education: education
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