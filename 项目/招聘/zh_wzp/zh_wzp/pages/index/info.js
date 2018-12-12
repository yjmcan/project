// zh_wzp/pages/look_wor/info.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nav: [
      {

      },
      {

      }
    ]
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
    that.setData({
      id: options.id
    })
    that.info()
    that.coll()
  },
  info: function (e) {
    var that = this
    var id = that.data.id
    app.util.request({
      url: 'entry/wxapp/SeePosition',
      data: { id: id },
      success: res => {
        console.log(res)
        that.setData({
          info: res.data
        })
      }
    })
  },
  // 点击收藏简历
  collection: function (e) {
    var that = this
  },
  // 查看是否收藏简历
  coll: function (e) {
    var that = this
    var id = that.data.id
    var user_id = wx.getStorageSync("userinfo").id
    app.util.request({
      url: 'entry/wxapp/IsJob',
      data: { position_id: id, user_id: user_id },
      success: res => {
        console.log(res)
        if (res.data == 1) {
          that.setData({
            coll: false
          })
        } else {
          that.setData({
            coll: true
          })
        }
      }
    })
  },
  address: function (e) {
    var that = this
    var info = that.data.info
    var area = info.area
    var coordinates = info.coordinates.split(",")
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function (res) {
        var latitude = Number(coordinates[0])
        var longitude = Number(coordinates[1])
        wx.openLocation({
          latitude: latitude,
          longitude: longitude,
          name: info.company_name,
          address: area
        })
      }
    })
  },
  collections: function (e) {
    var that = this
    var coll = that.data.coll
    var user_id = wx.getStorageSync("userinfo").id
    var id = that.data.id
    app.util.request({
      url: 'entry/wxapp/CollectionJob',
      data: {
        user_id: user_id,
        position_id: id
      },
      success: res => {
        console.log(res)
        if (res.data.code == '200') {
          wx.showToast({
            title: '收藏成功',
          })
          that.setData({
            coll: false
          })
        } else {
          wx.showToast({
            title: '取消收藏',
          })
          that.setData({
            coll: true
          })
        }
      }
    })
  },
  // 查看是否设置默认简历
  defalut: function (e) {
    var that = this
    var id = that.data.id
    var user_id = wx.getStorageSync("userinfo").id
    app.util.request({
      url: 'entry/wxapp/IsDefault',
      data: {
        user_id: user_id
      },
      success: res => {
        console.log(res)
        if (res.data == 1) {
          that.setData({
            IsDefault: true
          })
        } else {
          that.setData({
            IsDefault: false
          })
        }
      }
    })
    app.util.request({
      url: 'entry/wxapp/IsPosition',
      data: {
        position_id: id,
        user_id: user_id
      },
      success: res => {
        console.log(res)
        if (res.data == 1) {
          that.setData({
            IsPosition: true
          })
        } else {
          that.setData({
            IsPosition: false
          })
        }
      }
    })
  },
  submit: function (e) {
    var that = this
    var IsDefault = that.data.IsDefault
    var user_id = wx.getStorageSync("userinfo").id
    var id = that.data.id
    var title = ''
    if (IsDefault == false) {
      title = "您还没有设置默认简历"
    }
    if (app.title(title) == true) {
      console.log('可以去投递')
      app.util.request({
        url: 'entry/wxapp/Job',
        data: {
          position_id: id,
          user_id: user_id
        },
        success: res => {
          console.log(res)
          if (res.data.code == "200") {
            wx.showToast({
              title: '投递成功',
            })
            setTimeout(function () {
              wx.redirectTo({
                url: '../Interview/mine_inter',
              })
            }, 1500)
          } else {
            wx.showToast({
              title: '投递失败',
            })
            setTimeout(function () {
              wx.navigateBack({
                delta: 1
              })
            }, 1500)
          }
        }
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
    this.defalut()
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