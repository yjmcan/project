// pages/logs/bill.js

const app =  getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    color: "#459cf9",
    page:1,
    nav:[],
    keywords:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.hideShareMenu()
    that.setData({
      money: options.money,
      count: options.count,
      days: options.days,
      options:options
    })
    if(options.type==0){
      that.order_info()
    }else if(options.type==1){
      that.setData({
        time:app.today_month()
      })
      that.order_list()
    }else{
      that.order_list()
    }
    //====================================获取系统设置=============================================//
    app.getSystem(function (getSystem) {
      console.log(getSystem)
      that.setData({
        getSystem: getSystem,
        color: getSystem.color
      })
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: getSystem.color,
      })
    })
  },
  input:function(e){
    let value = e.detail.value
    console.log(e)
    console.log(value)
    this.setData({
      keywords:value,
    })
  },
  search:function(e){
    this.setData({
      page: 1,
      nav: []
    })
    this.order_list()
  },
  // order_info: function (e) {
  //   var that = this
  //   var a = that.data
  //   var days = a.days
  //   var qs_id = wx.getStorageSync('qs').id
  //   app.util.request({
  //     url: 'entry/wxapp/TodayList',
  //     data: {
  //       qs_id: qs_id,
  //       days: days
  //     },
  //     success: res => {
  //       console.log(res)
  //       that.setData({
  //         nav: res.data
  //       })
  //     }
  //   })
  // },
  // day_order: function (e) {
  //   wx.navigateTo({
  //     url: 'order_info',
  //   })
  // },
  // 日账单
  order_info: function (e) {
    var that = this
    var a = that.data
    var days = a.days
    var qs_id = wx.getStorageSync('qs').id
    app.util.request({
      url: 'entry/wxapp/TodayList',
      data: {
        qs_id: qs_id,
        days: app.today_time()
      },
      success: res => {
        console.log(res)
        for(let i in res.data){
          res.data[i].ps_money = Number(res.data[i].ps_money).toFixed(1)
          res.data[i].jd_time = app.ormatDate(res.data[i].jd_time)
          if (res.data[i].state == 5) {
            res.data[i].color = '#fe5656'
          }
          if (res.data[i].state == 2) {
            res.data[i].color = '#ff9a49'
          }
          if (res.data[i].state == 3) {
            res.data[i].color = '#97d5ff'
          }
          if (res.data[i].state == 4) {
            res.data[i].color = '#dddddd'
          }
        }
        that.setData({
          nav: res.data
        })
      }
    })
  },
  // 月账单
  order_list: function (e) {
    var that = this
    var a = that.data
    var qs_id = wx.getStorageSync('qs').id, page = that.data.page, nav = that.data.nav, keywords = that.data.keywords
    app.util.request({
      url: 'entry/wxapp/SearchList',
      data: {
        qs_id: qs_id,
        start_time: that.data.time||'',
        end_time: that.data.time || '',
        page: page,
        pagesize: 10,
        keywords: keywords
      },
      success: res => {
        console.log(res)
        if (res.data.length > 0) {
          for (let i in res.data) {
            res.data[i].ps_money = Number(res.data[i].ps_money).toFixed(1)
            res.data[i].jd_time = app.ormatDate(res.data[i].jd_time)
            if(res.data[i].state==5){
              res.data[i].color = '#fe5656'
            }
            if(res.data[i].state==2){
              res.data[i].color = '#ff9a49'
            }
            if (res.data[i].state == 3) {
              res.data[i].color = '#97d5ff'
            }
            if (res.data[i].state == 4) {
              res.data[i].color = '#dddddd'
            }
          }
          nav = nav.concat(res.data)
          console.log(nav)
          that.setData({
            nav: nav.sort(function(a,b){
              return (b.time) - Number(a.time)
            }),
            page: page + 1
          })
        }
      }
    })
  },
  order_infos:function(e){
      wx.navigateTo({
        url: '../index/order_info?id='+e.currentTarget.dataset.id,
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
    this.order_list()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})