// pages/integral_mall/integral_mall.js
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
    // var user_id = wx.getStorageSync('user_info').data.userid
    // // 用户信息
    // wx.request({
    //   url: 'https://sanye.nbxiong.com/jz/getUserInfo.do',
    //   method: "POST",
    //   header: {
    //     "content-type": "application/x-www-form-urlencoded"
    //   },
    //   data: { userid: user_id },
    //   success: res => {
    //     console.log(res)
    //     that.setData({
    //       user_info: res.data.user
    //     })
    //   },
    //   fail: res => {
    //     console.log(res)
    //   }
    // })
    that.refresh()
  },
  refresh:function(e){
    var that = this
    var user_id = wx.getStorageSync('user_info').data.userid
    // 用户信息
    wx.request({
      url: 'https://sanye.nbxiong.com/jz/getUserInfo.do',
      method: "POST",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: { userid:user_id},
      success: res => {
        console.log(res)
        that.setData({
          user_info: res.data.user
        })
      },
      fail: res => {
        console.log(res)
      }
    })
    // 积分商城
    wx.request({
      url: 'https://sanye.nbxiong.com/jz/listMallProduct.do',
      method: "POST",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: res => {
        console.log(res)
        that.setData({
          score_list: res.data.mallproduct
        })
      },
      fail: res => {
        console.log(res)
      }
    })
    // 轮播图
    wx.request({
      url: 'https://sanye.nbxiong.com/jz/showCarousels.do',
      method: "POST",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        type: '商城商品'
      },
      success: res => {
        console.log(res)
        for (let i in res.data) {
          console.log(res.data[i])
        }
        that.setData({
          imgs: res.data.carousel
        })
      },
      fail: res => {
        console.log(res)
      }
    })
  },
  service:function(e){
    wx.navigateTo({
      url: 'service?id='+e.currentTarget.dataset.id,
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