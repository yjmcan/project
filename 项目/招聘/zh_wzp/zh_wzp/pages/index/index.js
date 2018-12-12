// zh_wzp/pages/index/index.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    types_id: '',
    HomePosition: [],
    page: 1,
    whole: 'b_s',
    nav: [
      {
        name: '附近兼职',
        img: 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg'
      },
    ],
    height: 300,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.util.request({
      url: 'entry/wxapp/Bottom',
      success: res => {
        console.log(res)
        wx.setStorageSync('tabbar', res.data)
        app.route(this)
      }
    })
    var that = this
    wx.getSetting({
      success: (res) => {
        console.log(res)
        var auth = res.authSetting
        if (auth["scope.userInfo"] == true) {
          console.log('用户已经授权了')
          app.getUserInfo(function (userInfo) {
            console.log(userInfo)
            that.setData({
              user_info: userInfo
            })
          })
        } else {
          console.log('没有授权过')
          app.getuser_info(function (userInfo) {
            console.log(userInfo)
            that.setData({
              user_info: userInfo
            })
          })
        }
      }
    })
    app.util.request({
      url: 'entry/wxapp/Attachurl',
      success: res => {
        console.log(res)
        wx.setStorageSync('url', res.data)
        that.setData({
          url: res.data
        })
      }
    })
    that.ad()
    that.nav()
    that.job_want()
    that.HomePosition()
    that.AdPosition()
  },
  // 首页轮播图
  ad: function (e) {
    var that = this
    app.util.request({
      url: 'entry/wxapp/getAd',
      success: res => {
        console.log(res)
        that.setData({
          ad: res.data
        })
      }
    })
    // // 广告位
    // app.util.request({
    //   url: 'entry/wxapp/AdPosition',
    //   success: res => {
    //     console.log(res)
    //     that.setData({
    //       AdPosition: res.data
    //     })
    //   }
    // })
    // 基本设置
    app.util.request({
      url: 'entry/wxapp/system',
      success: res => {
        console.log(res)
        wx.setStorageSync("color", res.data.color)
        wx.setNavigationBarColor({
          frontColor: '#ffffff',
          backgroundColor: res.data.color,
        })
        wx.setNavigationBarTitle({
          title: res.data.pt_name,
        })
        that.setData({
          system: res.data,
          color:res.data.color
        })
      }
    })
  },
  // 首页广告位
  AdPosition: function (e) {
    var that = this
    app.util.request({
      url: 'entry/wxapp/AdPosition',
      success: res => {
        console.log(res)
        that.setData({
          AdPosition: res.data
        })
      }
    })
  },
  // 导航
  nav: function (e) {
    var that = this
    app.util.request({
      url: 'entry/wxapp/Nav',
      success: res => {
        console.log(res)
        var nav = res.data
        var navs = []
        for (var i = 0, len = nav.length; i < len; i += 8) {
          navs.push(nav.slice(i, i + 8))
        }
        that.setData({
          navs: navs
        })
      }
    })
  },
  // 招聘列表
  HomePosition: function (e) {
    var that = this
    var types_id = that.data.types_id
    console.log(types_id)
    var page = that.data.page
    var HomePosition = that.data.HomePosition
    app.util.request({
      url: 'entry/wxapp/HomePosition',
      data: {
        industry_id: types_id,
        page: page
      },
      success: res => {
        console.log(res)
        if (res.data.length > 0) {
          HomePosition = HomePosition.concat(res.data)
          for (let i in HomePosition){
            HomePosition[i].created_at = HomePosition[i].created_at.slice(5,11)
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
  // 导航跳转
  skip: function (e) {
    console.log(e)
    var that = this
    var src = e.currentTarget.dataset.src
    var appid = e.currentTarget.dataset.appid
    var wb_src = e.currentTarget.dataset.wb_src
    if (src != '') {
      var id = src.replace(/[^0-9]/ig, "");
      var src = src.replace(/(\d+|\s+)/g, "");
      console.log(src + id)
      console.log(id)
      wx.navigateTo({
        url: String(src) + String(id)
      })
    } else if (appid != '') {
      wx.navigateToMiniProgram({
        appId: appid,
        success(res) {
          // 打开成功\
          console.log(res)
        }
      })
    } else if (wb_src != '') {
      wx.navigateTo({
        url: 'link?link=' + wb_src
      })
    }
  },
  // 首页求职分类
  job_want: function (e) {
    var that = this
    app.util.request({
      url: 'entry/wxapp/Type',
      success: res => {
        console.log(res)
        var Types = res.data
        for (let i in Types) {
          Types[i].attribute = "b_n_s"
        }
        that.setData({
          Types: Types
        })
      }
    })
  },
  // 求职分类
  classification: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index
    var Types = that.data.Types
    for (let i in Types) {
      if (i == index) {
        Types[index].attribute = 'b_s'
      } else {
        Types[i].attribute = 'b_n_s'
      }
    }
    console.log(Types)
    that.setData({
      Types: Types,
      page: 1,
      whole: 'b_n_s',
      HomePosition: [],
      types_id: Types[index].id
    })
    that.HomePosition()
  },
  whole: function (e) {
    var that = this
    var Types = that.data.Types
    for (let i in Types) {
      Types[i].attribute = 'b_n_s'
    }
    that.setData({
      types_id: '',
      page: 1,
      Types: Types,
      HomePosition: [],
      whole: 'b_s',
    })
    that.HomePosition()
  },
  fabu: function (e) {
    wx.navigateTo({
      url: 'info?id='+e.currentTarget.dataset.id,
    })
  },
  Interview: function (e) {
    wx, wx.navigateTo({
      url: '../Interview/Interview',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
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
    that.setData({
      page:1,
      HomePosition:[]
    })
    that.ad()
    that.nav()
    that.job_want()
    that.HomePosition()
    that.AdPosition()
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