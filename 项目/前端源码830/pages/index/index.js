const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    color: 'rgb(56, 132, 254)', //56 132 253
    color1: 'rgb(56, 132, 253)',
    // region: ['广东省', '广州市', '海珠区'],
    region: [],
    region1: [],
    route_0: '',
    route_1: '',
    route: false,
    i: 0,
    j: 0,
    n: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    that.province()
    console.log(app.siteinfo.url)
    app.getUserInfo(function(userInfo) {
      console.log(userInfo)
    })
    that.refresh()
  },
  refresh: function(e) {
    var that = this
    wx.request({
      url: getApp().siteinfo.url +'/hyb/index/index',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      success: res => {
        console.log(res)
        that.setData({
          banenrlist: res.data.data.banenrlist,
          goodsStationlist: res.data.data.goodsStationlist,
        })
      }
    })
  },
  // 获取省
  province: function(e) {
    var that = this
    wx.request({
      // url: url +'/hyb/login/thirdLogin',
      url: getApp().siteinfo.url +'/hyb/city/selectPro',
      success: res => {
        that.setData({
          province: res.data.data,
        })
        that.city()
      }
    })
  },
  // 获取市
  city: function(e) {
    var that = this
    var province = that.data.province
    var i = that.data.i || 0

    wx.request({
      url: getApp().siteinfo.url +'/hyb/city/selectCity',
      data: {
        cityCode: province[i].adCode
      },
      success: res => {
        var city = [],
          county_0 = {
            cityDesc: '全部'
          }
        city = res.data.data
        city.unshift(county_0)
        console.log(city)
        that.setData({
          city: city
        })
        that.county()
        // var city = res.data.data
        // console.log(city)
        // if (city.length > 0) {
        //   that.setData({
        //     city: city
        //   })
        //   that.county()
        // } else {
        //   that.setData({
        //     city: [],
        //     county: []
        //   })
        // }
      }
    })
  },
  county: function(e) {
    var that = this
    var city = that.data.city
    var j = that.data.j || 0
    if (city[j].cityDesc == null) {
      var cityCode = that.data.province[that.data.i].adCode
    } else {
      var cityCode = city[j].adCode
    }
    wx.request({
      url: getApp().siteinfo.url +'/hyb/city/selectCity',
      data: {
        cityCode: cityCode
      },
      success: res => {
        var county = [],
          county_0 = {
            cityDesc: '全部'
          }
        county = res.data.data
        county.unshift(county_0)
        console.log(county)
        that.setData({
          county: county
        })
      }
    })
  },
  // change事件
  bindChange: function(e) {
    console.log(e)
    var that = this
    var value = e.detail.value
    var i = value[0]
    var j = value[1]
    var n = value[2]
    that.setData({
      i: i,
      j: j,
      n: n
    })
    that.city()
  },
  // 触发选择城市
  route_0: function(e) {
    var that = this
    console.log('触发选择', e)
    that.setData({
      route: true,
      type: e.currentTarget.dataset.type
    })
  },
  // 确认选择
  confirm: function(e) {
    var that = this
    var a = that.data
    var province = a.province,
      city = a.city,
      county = a.county,
      i = a.i,
      j = a.j,
      n = a.n,
      type = a.type
    console.log(type)
    console.log(province[i].cityDesc)
    console.log(city[j].cityDesc)
    console.log(county[n].cityDesc)
    if (city[j].cityDesc == '全部') {
      var route = province[i].cityDesc + '全部'
      var code = province[i].adCode
    } else if (city[j].cityDesc != '全部') {
      var route = city[j].cityDesc + '全部'
      var code = city[j].adCode
    } else if (county[n].cityDesc == '全部') {
      var route = city[j].cityDesc + '全部'
      var code = city[j].adCode
    } else if (county[n].cityDesc != '全部') {
      var route = city[j].cityDesc + county[n].cityDesc
      var code = county[n].adCode
    } else {
      var route = city[j].cityDesc + county[n].cityDesc
      var code = county[n].adCode
    }
    console.log(code)
    // if (city.length == 0) {
    //   var route = province[i].cityDesc + '全部'
    //   var code = province[i].adCode
    // } else if (county.length == 0) {
    //   var route = city[j].cityDesc + '全部'
    //   var code = province[i].adCode
    // } else if (county[n].cityDesc == '全部') {
    //   var route = city[j].cityDesc + county[n].cityDesc
    //   var code = city[j].adCode
    // } else if (county[n].cityDesc != '全部') {
    //   var route = city[j].cityDesc + county[n].cityDesc
    //   var code = county[n].adCode
    // }
    console.log(code)
    if (type == 0) {
      that.setData({
        route_0: route,
        start_code: code
      })
    } else {
      that.setData({
        route_1: route,
        end_code: code
      })
    }
    that.setData({
      route: false,
      i: 0,
      j: 0,
      n: 0,
      city: [],
      county: []
    })
    that.city()
  },
  // 取消选择
  cancel: function(e) {
    var that = this
    that.setData({
      route: false,
      value: [
        0, 0, 0
      ]
    })
  },
  bindRegionChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var region = e.detail.value
    if (region[1] == '全部') {
      var route_0 = region[0] + '/全部'
    } else if (region[2] == '全部') {
      var route_0 = region[1] + '/全部'
    } else {
      var route_0 = region[0] + region[1] + region[2]
    }
    this.setData({
      region: e.detail.value,
      route_0: route_0
    })
  },
  bindRegionChange1: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var region = e.detail.value
    if (region[1] == '全部') {
      var route_1 = region[0] + '/全部'
    } else if (region[2] == '全部') {
      var route_1 = region[1] + '/全部'
    } else {
      var route_1 = region[0] + region[1] + region[2]
    }
    this.setData({
      region1: e.detail.value,
      route_1: route_1
    })
  },
  index: function(e) {
    wx.reLaunch({
      url: 'index',
    })
  },
  logs: function(e) {
    wx.reLaunch({
      url: '../logs/index',
    })
  },
  info: function(e) {
    var index = e.currentTarget.dataset.index
    wx.navigateTo({
      url: 'info?id=' + index,
    })
  },
  search_route: function(e) {
    var that = this
    var a = that.data
    console.log(a)
    if (a.route_0 == '' || a.route_1 == '') {
      wx.showModal({
        title: '温馨提示',
        content: '请选择合理的出发地和目的地',
      })
    } else {
      wx.navigateTo({
        url: 'search?startPlace=' + a.start_code + '&endPlace=' + a.end_code,
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
return {
      title: '全国货运专线查询平台',
      path: '/pages/index/index'
    }
  }
})