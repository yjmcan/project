// zh_wzp/pages/look_wor/index.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nav: [
      {
        name: '学历',
        img: '../img/xia.png',
        children: [
          { name: '不限', },
          { name: '初中', },
          { name: '高中', },
          { name: '大专', },
          { name: '本科', },
          { name: '硕士', },
          { name: '博士', },
        ]
      },
      {
        name: '工作经验',
        img: '../img/xia.png',
        children: [
          { name: '不限', },
          { name: '1年以内', },
          { name: '1-3年', },
          { name: '3-5年', },
          { name: '5-8年', },
          { name: '8-10年', },
          { name: '10年以上', },
        ]
      },
      {
        name: '行业',
        img: '../img/xia.png',
        children: [
          { name: '1', },
          { name: '2', },
          { name: '3', },
          { name: '4', },
          { name: '5', },
          { name: '6', },
          { name: '7', },
        ]
      },
      {
        name: '工作性质',
        img: '../img/xia.png',
        children: [
          { name: '全职', },
          { name: '兼职', },
        ]
      },
    ],
    experience_id: "",
    degree: "",
    industry_id: "",
    nav_statu: false,
    page: 1,
    list: []
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
    var nav = that.data.nav
    app.util.request({
      url: 'entry/wxapp/Degree',
      success: res => {
        var degree = res.data
        nav[0].children = degree
        that.setData({
          nav: nav
        })
        console.log(res)
      }
    })

    app.util.request({
      url: "entry/wxapp/type",
      success: res => {
        console.log(res)
        var multiArray = res.data
        nav[2].children = multiArray
        that.setData({
          nav: nav
        })
      }
    })
    app.util.request({
      url: 'entry/wxapp/experience',
      success: res => {
        var degree = res.data
        nav[1].children = degree
        that.setData({
          nav: nav
        })
        console.log(res)
      }
    })
    app.util.request({
      url: 'entry/wxapp/Jobtype',
      success: res => {
        var degree = res.data
        nav[3].children = degree
        that.setData({
          nav: nav
        })
        console.log(res)
      }
    })
    that.list()
  },
  list: function (e) {
    var that = this
    console.log(that.data)
    var experience_id = that.data.experience_id
    var degree = that.data.degree
    var industry_id = that.data.industry_id
    var list = that.data.list
    var page = that.data.page
    app.util.request({
      url: 'entry/wxapp/ResumeList',
      data: {
        page: page,
        experience_id: experience_id,
        degree: degree,
        industry_id: industry_id
      },
      success: res => {
        console.log(res)
        if (res.data.length > 0) {
          list = list.concat(res.data)
          for (let i in res.data) {
            res.data[i].area = res.data[i].area.split(",")
            res.data[i].skill = res.data[i].skill.split(",")
          }
          that.setData({
            list: list,
            page: page + 1
          })
        }
      }
    })
  },
  tabbar: function (e) {
    console.log(e)
    var that = this
    var url = e.currentTarget.dataset.url
    wx.redirectTo({
      url: url,
    })
  },
  // 顶部导航栏点击效果
  nav: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index
    console.log(index)
    var nav = that.data.nav
    var nav_statu = that.data.nav_statu
    var nav_index = that.data.nav_index
    if (index == nav_index) {
      if (nav_statu == false) {
        for (let i in nav) {
          if (i == index) {
            nav[i].img = '../img/shang.png'
          } else {
            nav[i].img = '../img/xia.png'
          }
        }
        console.log(nav[index].children)
        that.setData({
          nav: nav,
          nav_statu: true,
          nav_index: index,
          children: nav[index].children
        })
      } else {
        nav[index].img = '../img/xia.png'
        that.setData({
          nav: nav,
          nav_statu: false,
          nav_index: index,
          children: []
        })
      }
    } else {
      for (let i in nav) {
        if (i == index) {
          nav[i].img = '../img/shang.png'
        } else {
          nav[i].img = '../img/xia.png'
        }
      }
      console.log(nav[index].children)
      that.setData({
        nav: nav,
        nav_statu: true,
        nav_index: index,
        children: nav[index].children
      })
    }


  },
  nav_c: function (e) {
    var that = this
    var nav_statu = that.data.nav_statu
    var index = e.currentTarget.dataset.index
    var children = that.data.children
    var nav = that.data.nav
    var nav_index = that.data.nav_index
    nav[nav_index].name = children[index].name
    if (nav_statu == true) {
      if (nav_index == 0) {
        that.setData({
          degree: e.currentTarget.dataset.id,
          page: 1,
          list: []
        })
        that.list()
      } else if (nav_index == 1) {
        that.setData({
          experience_id: e.currentTarget.dataset.id,
          page: 1,
          list: []
        })
        that.list()
      } else if (nav_index == 2) {
        that.setData({
          industry_id: e.currentTarget.dataset.id,
          page: 1,
          list: []
        })
        that.list()
      } else if (nav_index == 3) {
        that.setData({
          page: 1,
          list: []
        })
        that.list()
      }
      nav[nav_index].img = "../img/xia.png"
      that.setData({
        nav: nav,
        nav_statu: false,
        children: [],
      })
    } else {

    }
  },
  info: function (e) {
    wx.navigateTo({
      url: 'info?id=' + e.currentTarget.dataset.id,
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
    var that = this
    var nav = that.data.nav
    for(let i in nav){
      nav[i].img='../img/xia.png'
    }
    nav[0].name = '学历'
    nav[1].name = '工作经验'
    nav[2].name = '行业'
    nav[3].name = '工作性质'
    this.setData({
      page: 1,
      list: [],
      experience_id: "",
      degree: "",
      industry_id: "",
      children:[],
      nav: nav
    })
    this.list()
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.list()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})