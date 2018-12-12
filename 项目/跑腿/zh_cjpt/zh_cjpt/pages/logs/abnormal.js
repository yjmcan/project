// zh_cjpt/pages/logs/abnormal.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:1,
    list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    app.getSystem(function (getSystem) {
      console.log(getSystem)
      that.setData({
        getSystem: getSystem,
        distaceShop: Number(getSystem.distance),
        color: getSystem.color
      })
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: getSystem.color,
      })
      app.g_t(function (location) {
        console.log(location)
        that.setData({
          location: location,
          lat: location.split(",")[0],
          lng: location.split(",")[1],
        })
        that.refresh()
      })
    })
  },
  refresh:function(e){
    let list = this.data.list,location = this.data.location
    app.util.request({
      url:'entry/wxapp/Myabnormal',
      data:{
        qs_id: wx.getStorageSync('qs').id,
        page:this.data.page
      },
      success:res=>{
        console.log(res)
        if (res.data.length > 0) {
          for (let i in res.data) {
            res.data[i].distance = app.location(Number(location[0]), Number(res.data[i].sender_lat), Number(location[1]), Number(res.data[i].sender_lng), )
            res.data[i].distance1 = app.location(Number(res.data[i].sender_lat), Number(res.data[i].receiver_lat), Number(res.data[i].sender_lng), Number(res.data[i].receiver_lng), )
            res.data[i].wc_time = app.ormatDate(res.data[i].wc_time)
            res.data[i].goods_info = res.data[i].goods_info.split(",")
            res.data[i].time = app.ormatDate(res.data[i].time)
          }
          list = list.concat(res.data)
          this.setData({
            list: list,
            page:this.data.page+1
          })
        }
      }
    })
  },

  // 跳转订单详情
  order_info: function (e) {
    wx.navigateTo({
      url: '../index/order_info?id=' + e.currentTarget.dataset.id + '&index=' + e.currentTarget.dataset.index,
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
    this.refresh()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})