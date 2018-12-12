// zh_jd/pages/wode/room.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var url = wx.getStorageSync("url")
    var hotel_id = options.hotel_id
    var id = options.id
    var myDate = new Date().toLocaleDateString().replace(/\//g, "-");
    app.util.request({
      'url': 'entry/wxapp/getroom',
      'cachetime': '0',
      data: { seller_id: hotel_id },
      success: function (res) {
        console.log('这是房型列表')
        console.log(res)
        var newarr = res.data
        for (let i = 0; i < newarr.length; i++) {
          if (id == newarr[i].id) {
            var room = newarr[i]
            room.img = room.img.split(",")
            // 获取今日房间价格
            app.util.request({
              'url': 'entry/wxapp/todaycost',
              'cachetime': '0',
              data: { room_id: room.id, day: myDate },
              success: function (res) {
                var today_cost = res.data
                if (today_cost.name == null) {
                  room.online_price = today_cost
                }
                that.setData({
                  room: room,
                  url: url
                })
              },
            })
          }


        }

      },
    })
    app.util.request({
      'url': 'entry/wxapp/gethotel',
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        for (var i = 0; i < res.data.length; i++) {
          if (hotel_id == res.data[i].id) {
            console.log(res.data[i])
            // res.data[i].coordinates = res.data[i].coordinates.split(",")
            that.setData({
              seller:res.data[i]
            })
          }
        }
      },
    })
  },

  phone: function (e) {
    wx.makePhoneCall({
      phoneNumber: this.data.seller.link_tel
    })
  },
  dizhi: function (e) {
    var that = this
    var lat2 = Number(that.data.seller.coordinates.split(",")[0])
    var lng2 = Number(that.data.seller.coordinates.split(",")[1])
    wx.openLocation({
      latitude: lat2,
      longitude: lng2,
      name: that.data.seller.name,
      address: that.data.seller.address
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})