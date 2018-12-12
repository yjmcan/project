// zh_wzp/pages/coll/index.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nav: [],
    page: 1,
    navv:[],
    navv: [],
    ac_index: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.route(this)
    var that = this
    var user = wx.getStorageSync("userinfo")
    var user_id = user.id
    console.log(user_id)
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
    // —————————————— 获取上传网址——————————
    app.util.request({
      "url": "entry/wxapp/Attachurl",
      'cachetime': '0',
      success: function (res) {
        that.setData({
          url: res.data
        })
      }
    })
    that.jobs()
    that.wor()
  },
  jobs: function (e) {
    console.log('职位')
    var that = this
    var user_id = wx.getStorageSync("userinfo").id
    var nav = that.data.nav
    var page = that.data.page
    //职位接口
    app.util.request({
      'url': 'entry/wxapp/MyCollections',
      'cachetime': '0',
      data: {
        user_id: user_id,
        page: page
      },
      success: function (res) {
        console.log(res)
        if (res.data.length > 0) {
          nav = nav.concat(res.data)
          for(let i in res.data){
            res.data[i].created_at = res.data[i].created_at.slice(5,11)
            if (res.data[i].tag.length >= 3) {
              res.data[i].tag = res.data[i].tag.slice(0, 3)
            }
          }
          that.setData({
            nav: nav,
            page: page + 1
          })
        }
      }
    });
  },
  wor: function (e) {
    console.log('人才')
    var that = this
    var user_id = wx.getStorageSync("userinfo").id
    var navv = that.data.navv
    var page = that.data.page
    //人才接口
    app.util.request({
      'url': 'entry/wxapp/MyCollection',
      'cachetime': '0',
      data: {
        user_id: user_id,
        page:page
      },
      success: function (res) {
        console.log(res)
        if (res.data.length > 0) {
          navv = navv.concat(res.data)
          console.log(navv)
          for (let i in res.data) {
            res.data[i].created_at = res.data[i].created_at.slice(5, 11)
            res.data[i].area = res.data[i].area.split(",")
            res.data[i].skill = res.data[i].skill.split(",")
          }
          that.setData({
            navv: navv,
            page: page + 1
          })
        }
      }
    });
  },
  // 取消收藏职位
  collections: function (e) {
    var that = this
    var user_id = wx.getStorageSync("userinfo").id
    var id = e.currentTarget.dataset.id
    app.util.request({
      url: 'entry/wxapp/CollectionJob',
      data: {
        user_id: user_id,
        position_id: id
      },
      success: res => {
        console.log(res)
        wx.showToast({
          title: '取消成功',
        })
        setTimeout(function () {
          that.setData({
            ac_index: 1,
            page: 1,
            nav: [],
            navv: []
          })
          that.jobs()
        }, 1500)
      }
    })
  },
  // 点击取消收藏简历
  collection: function (e) {
    var that = this
    var user_id = wx.getStorageSync("userinfo").id
    var id = e.currentTarget.dataset.id
    app.util.request({
      url: 'entry/wxapp/CollectionResume',
      data: {
        user_id: user_id,
        resume_id: id
      },
      success: res => {
        console.log(res)
        wx.showToast({
          title: '取消成功',
        })
        setTimeout(function(){
          that.setData({
            ac_index: 2,
            page: 1,
            nav: [],
            navv: []
          })
          that.wor()
        },1500)
      }
    })
  },
  job: function (e) {
    this.setData({
      ac_index: 1,
      page:1,
      navv: [],
      nav: [],
    })
    this.jobs()
  },
  personnel: function (e) {
    this.setData({
      ac_index: 2,
      page: 1,
      nav: [],
      navv:[]
    })
    this.wor()
  },
  info: function (e) {
    wx.navigateTo({
      url: '../look_wor/info?id=' + e.currentTarget.dataset.id,
    })
  },
  fabu: function (e) {
    wx.navigateTo({
      url: '../index/info?id=' + e.currentTarget.dataset.id,
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
    this.jobs()
    this.wor()
    this.setData({
      nav:[],
      page:1,
      navv:[],
      ac_index:1
    })
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this
    if(that.data.ac_index==1){
      that.jobs()
    } else {
      that.wor()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})