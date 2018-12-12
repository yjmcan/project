// pages/kaci/kaci.js
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
    var user_id = wx.getStorageSync('user_info').data.userid
    // 卡次
    wx.request({
      url: 'https://sanye.nbxiong.com/jz/showAllCards.do',
      method: "POST",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        userid: user_id
      },
      success: res => {
        console.log(res)
        if (res.data.info == '该用户暂没有卡' || res.data == '') {
          that.setData({
            card_number: res.data,
            length: 0
          })
        } else {
          var card = res.data.card
          for (let i in card) {
            // 商品详情
            wx.request({
              url: 'https://sanye.nbxiong.com/jz/showServiceProduct.do',
              method: "POST",
              header: {
                "content-type": "application/x-www-form-urlencoded"
              },
              data: { productid:card[i].productid },
              success: res => {
                console.log(res)
                card[i].img = res.data.serviceproduct.imgurl
                card[i].name = res.data.serviceproduct.productname
                card[i].cost = res.data.serviceproduct.price
                that.setData({
                  card:card
                })
              },
              fail: res => {
                console.log(res)
              }
            })
          }

        }

      },
      fail: res => {
        console.log(res)
      }
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