// zh_gjhdbm/pages/city/city.js
// var QQMapWX = require('../../../qqmap-wx-jssdk.min.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hot_city: [
      '北京市', '上海市', '深圳市', '广州市', '重庆市', '天津市', '长沙市', '成都市', '杭州市', '昆明市', '南京市', '武汉市', '厦门市', '西安市', '郑州市',
    ],
    picker_city: false,
    city_search: false,

    // customItem: '全部'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    app.setNavigationBarColor(this);
    console.log(wx.getStorageSync('location_city'))
    that.setData({
      location_city: wx.getStorageSync('location_city')[1],
      region: wx.getStorageSync('location_city')
    })
  },
  refresh: function (e) {
    var that = this
    if (wx.getStorageSync('citys') == '') {
      console.log('没有城市的缓存')
      var demo = new QQMapWX({
        key: 'FQIBZ-FOE3Q-CY354-GLNJF-3NUHZ-SBBO6' // 必填
      });
      // 调用接口
      demo.getCityList({
        success: function (res) {
          wx.setStorageSync('citys', res)
          console.log(res)
          // 获取直辖市和省
          var citys = res.result[0]
          // 获取第一个直辖市
          var city = citys[0]
          // 判断是否是直辖市
          var result = city.fullname.charAt(city.fullname.length - 1, 1)
          if (result == '市') {
            var province = []
            province[0] = city
          } else {
            var province = res.result[1].slice(city.cidx[0], city.cidx[1])
          }
          that.setData({
            citys: citys.slice(),
            more_city: res.result[0],
            province: province,
            all_city: res.result
          })
        },
        fail: function (res) {
          console.log(res);
        },
        complete: function (res) {
          console.log(res);
        }
      });
    } else {
      console.log('有城市的缓存')
      var city_mask = wx.getStorageSync('citys')
      console.log(city_mask)
      // 获取直辖市和省
      var citys = city_mask.result[0]
      // 获取第一个直辖市
      var city = citys[0]
      // 判断是否是直辖市
      var result = city.fullname.charAt(city.fullname.length - 1, 1)
      if (result == '市') {
        var province = []
        province[0] = city
      } else {
        var province = city_mask[1].slice(city.cidx[0], city.cidx[1])
      }
      that.setData({
        citys: citys.slice,
        more_city: city_mask.result[0],
        province: province,
        all_city: city_mask.result
      })
    }
  },
  // 决定piek-view是否显示与隐藏
  more_city: function (e) {
    var that = this
    var picker_city = that.data.picker_city
    if (picker_city == false) {
      that.setData({
        picker_city: true
      })
    } else {
      that.setData({
        picker_city: false
      })
    }


  },
  // pick-view中城市的切换
  bindChange: function (e) {
    const val = e.detail.value
    console.log(e)
    var that = this
    var all_city = that.data.all_city
    var citys_index = val[0]
    var city = all_city[0][citys_index]
    var result = city.fullname.charAt(city.fullname.length - 1, 1)
    if (result == '市') {
      var province = []
      province[0] = city
    } else {
      var province = []
      console.log(all_city[1])
      province = all_city[1].slice(city.cidx[0], city.cidx[1])
    }
    that.setData({
      province: province,
      citys: all_city[0],
    })
  },
  // 搜索框搜索城市
  search: function (e) {
    var that = this
    function isContain(str, substr) {
      return new RegExp(substr).test(str);
    }
    var all_city = that.data.all_city
    var value = e.detail.value
    if (value != '') {
      var city_result = []
      for (let i in all_city[1]) {
        if (all_city[1][i].pinyin[0].indexOf(value) != -1 || all_city[1][i].pinyin[1].indexOf(value) != -1 || all_city[1][i].fullname.indexOf(value) != -1) {
          if (all_city[1][i].fullname.charAt(all_city[1][i].fullname.length - 1, 1) != '区' && all_city[1][i].fullname.charAt(all_city[1][i].fullname.length - 1, 1) != '县') {
            city_result.push(all_city[1][i])
            // console.log(all_city[1][i])
            // console.log('找到了')
          }
        }
      }
      that.setData({
        city_result: city_result,
        city_search: true
      })
    } else {
      that.setData({
        city_search: false,
        city_result: []
      })
    }
  },
  select: function (e) {
    var city = e.currentTarget.dataset.city
    wx.setStorageSync('city', city)
    // wx.navigateBack({
    //   delta: 1
    // })
    app.globalData.sele_city = 0
    wx.redirectTo({
      url: '../index/index',
    })
    // 保存城市
    app.util.request({
      'url': 'entry/wxapp/SaveCity',
      'cachetime': '0',
      data: { cityname: city },
      success: function (res) {
        console.log('这是保存城市')

      },
    })
    // var pages = getCurrentPages();
    // var currPage = pages[pages.length - 1];   //当前页面
    // var prevPage = pages[pages.length - 2];  //上一个页面
    // prevPage.citys()
    // prevPage.berak()
    // prevPage.advert()
    // prevPage.setData({
    //   city: city
    // })
  },
  bindRegionChange: function (e) {
    var that = this
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var city = e.detail.value[1]
    if (city.indexOf('市') != -1) {
      console.log('有市')
      that.setData({
        select_city: city
      })
    } else {
      wx.showModal({
        title: '温馨提示',
        content: '当前城市选择仅支持市',
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
    // var that = this
    // that.refresh()
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
  // onShareAppMessage: function () {

  // }
})