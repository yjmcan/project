// zh_wzp/pages/Interview/index.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nav: [
      {
        name: '全部',
        sele: "rgb(73, 156, 244)",
        sele_b: "rgb(73, 156, 244)"
      },
      {
        name: '邀面试',
        sele: "",
        sele_b: "#fff"
      },
      {
        name: '已拒绝',
        sele: "",
        sele_b: "#fff"
      },
    ],
    index: 0,
    jianli:[],
    page:1,
    status:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.route(this)
    var that = this
    that.setData({
      color: wx.getStorageSync("color")
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: wx.getStorageSync("color"),
    })
    app.util.request({
      url: 'entry/wxapp/Attachurl',
      success: res => {
        console.log(res)
        that.setData({
          url: res.data
        })
      }
    })
    that.jianli()
  },
  jianli:function(e){
    var that = this
    var jianli = that.data.jianli
    var page= that.data.page
    var user_id =wx.getStorageSync("userinfo").id
    var status = that.data.status
    app.util.request({
      url: 'entry/wxapp/Partake',
      data:{
        user_id:user_id,
        page:page,
        status:status
      },
      success: res => {
        console.log(res)
        if (res.data.length > 0) {
          jianli = jianli.concat(res.data)
          for (let i in res.data) {
            res.data[i].created_at = res.data[i].created_at.slice(5, 11)
          }
          that.setData({
            jianli: jianli,
            page:page+1
          })
        }else{

        }
      }
    })
  },
  nav: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index
    console.log(index)
    var nav = that.data.nav
    for (let i in nav) {
      if (i == index) {
        nav[i].sele = "rgb(73, 156, 244)"
        nav[i].sele_b = "rgb(73, 156, 244)"
      } else {
        nav[i].sele = ''
        nav[i].sele_b = "#fff"
      }
    }
    if(index==0){
      that.setData({
        status: '',
        page: 1,
        jianli: []
      })
      that.jianli()
    }else if(index==1){
      that.setData({
        status: 2,
        page:1,
        jianli:[]
      })
      that.jianli()
    } else if (index == 2) {
      that.setData({
        status: 3,
        page: 1,
        jianli: []
      })
      that.jianli()
    }
    that.setData({
      nav: nav,
    })
  },
  info:function(e){
    wx.navigateTo({
      url: 'info?id='+e.currentTarget.dataset.id,
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
    this.setData({
      page:1,
      jianli:[]
    })
    this.jianli()
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

    this.jianli()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})