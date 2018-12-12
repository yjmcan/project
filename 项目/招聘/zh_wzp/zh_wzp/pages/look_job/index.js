// zh_wzp/pages/look_wor/index.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    HomePosition: [],
    page: 1,
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
        name: '薪资',
        img: '../img/xia.png',
        children: [
          { name: '全职', },
          { name: '兼职', },
        ]
      },
    ],
    nav_statu: false,
    degree_require: '',
    experience_require: '',
    industry_id: '',
    salary: '',
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
    that.HomePosition()
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
      url: 'entry/wxapp/Salary',
      success: res => {
        var degree = res.data
        nav[3].children = degree
        that.setData({
          nav: nav
        })
        console.log(res)
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
  },
  tabbar: function (e) {
    console.log(e)
    var that = this
    var url = e.currentTarget.dataset.url
    wx.redirectTo({
      url: url,
    })
  },
  // 招聘列表
  HomePosition: function (e) {
    var that = this
    var page = that.data.page
    var HomePosition = that.data.HomePosition
    var degree_require = that.data.degree_require
    var experience_require = that.data.experience_require
    var industry_id = that.data.industry_id
    var salary = that.data.salary
    app.util.request({
      url: 'entry/wxapp/Position',
      data: {
        page: page,
        degree_require: degree_require,
        experience_require: experience_require,
        industry_id: industry_id,
        salary: salary,
      },
      success: res => {
        console.log(res)
        if (res.data.length > 0) {
          HomePosition = HomePosition.concat(res.data)
          for (let i in HomePosition) {
            if (HomePosition[i].tag.length >= 3) {
              HomePosition[i].tag = HomePosition[i].tag.slice(0, 3)
            }
          }
          that.setData({
            page: page + 1,
            HomePosition: HomePosition
          })
        } else {

        }

      }
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
          degree_require: e.currentTarget.dataset.id,
          page: 1,
          HomePosition: []
        })
        that.HomePosition()
      } else if (nav_index == 1) {
        that.setData({
          experience_require: e.currentTarget.dataset.id,
          page: 1,
          HomePosition: []
        })
        that.HomePosition()
      } else if (nav_index == 2) {
        that.setData({
          industry_id: e.currentTarget.dataset.id,
          page: 1,
          HomePosition: []
        })
        that.HomePosition()
      } else if (nav_index == 3) {
        that.setData({
          page: 1,
          salary: e.currentTarget.dataset.id,
          HomePosition: []
        })
        that.HomePosition()
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
    var that = this
    var nav = that.data.nav
    for (let i in nav) {
      nav[i].img = '../img/xia.png'
    }
    nav[0].name = '学历'
    nav[1].name = '工作经验'
    nav[2].name = '行业'
    nav[3].name = '工作性质'
    that.setData({
      page: 1,
      HomePosition: [],
      degree_require: '',
      experience_require: '',
      industry_id: '',
      salary: '',
      children: [],
      nav: nav
    })
    that.HomePosition()
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this
    that.HomePosition()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})