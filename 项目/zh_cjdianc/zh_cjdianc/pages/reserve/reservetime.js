// zh_cjdianc/pages/reserve/reservetime.js
var app = getApp();
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navbar: [],
    selectedindex: 0,
  },
  selectednavbar: function (e) {
    console.log(e)
    this.setData({
      selectedindex: e.currentTarget.dataset.index,
      yxtime: this.data.navbar[e.currentTarget.dataset.index].time
    })
  },
  selectedTime: function (e) {
    console.log(e)
    this.setData({
      selectedtime: e.currentTarget.dataset.index
    })
  },
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      yxtime: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    function GetDateStr(AddDayCount) {
      var dd = new Date();
      dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期 
      var y = dd.getFullYear();//获取当前年份的日期 
      var m = dd.getMonth() + 1;//获取当前月份的日期
      if(m<10){
        m='0'+m
      } 
      var d = dd.getDate();//获取当前天数的日期
      if (d < 10) {
        d = '0' + d
      }
      var h = dd.getHours(); //获取当前小时数
      var mm = dd.getMinutes(); //获取当前分钟数
      var s = dd.getSeconds(); //获取当前描述
      //return y + "-" + m + "-" + d + " " + h + ":" + mm + ":" + s;
      return y + "-" + m + "-" + d;
    }
    wx.setNavigationBarTitle({
      title: '选择时间',
    })
    app.setNavigationBarColor(this);
    var that = this,today = util.formatTime(new Date).substring(0, 10).replace(/\//g, "-");
    console.log(options, GetDateStr(0), GetDateStr(1), GetDateStr(2))
    app.util.request({
      'url': 'entry/wxapp/GetStoreTime',
      'cachetime': '0',
      data: { store_id: options.storeid },
      success: function (res) {
        console.log(res)
        that.setData({
          tiemarr: res.data,
          yxtime:GetDateStr(0),
          startdate:today,
        })
      }
    });
    app.util.request({
      'url': 'entry/wxapp/GetYdSet',
      'cachetime': '0',
      data: { store_id: options.storeid },
      success: function (res) {
        console.log(res)
        if (res.data.is_ydtime == '1') {
          that.setData({
            navbar: [{ name: '今天', time: GetDateStr(0) }],
          })
        }
        else{
          that.setData({
            navbar: [{ name: '今天', time: GetDateStr(0) }, { name: '明天', time: GetDateStr(1) }, { name: '后天', time: GetDateStr(2) }, { name: '其他时间' },],
          })
        }
        // that.setData({
        //   System: res.data,
        // })
      }
    });
  },
  formSubmit: function (e) {
    var pages = getCurrentPages(), that = this, uid = wx.getStorageSync('users').id;
    app.util.request({
      'url': 'entry/wxapp/AddFormId',
      'cachetime': '0',
      data: { user_id: uid, form_id: e.detail.formId },
      success: function (res) {
        console.log(res.data)
      },
    })
    if (this.data.selectedtime!=null){
      if (pages.length > 1) {

        var prePage = pages[pages.length - 2];

        prePage.setData({
          date: that.data.yxtime,
          time: that.data.tiemarr[that.data.selectedtime].time
        })
      }
      setTimeout(function () {
        wx.navigateBack({
        })
      }, 500)
    }
    else{
      wx.showModal({
        title: '提示',
        content: '请选择时间',
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