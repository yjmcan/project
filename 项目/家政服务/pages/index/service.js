// pages/index/service.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    console.log(options)
    var id = options.id
    that.setData({
      id: id
    })
    that.refresh()
  },
  refresh: function (e) {
    var that = this
    var id = that.data.id
    console.log(id)
    console.log(typeof (id))

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
        if (res.data.info == '该用户暂没有卡'||res.data=='') {
          that.setData({
            card_number: res.data,
            length: 0
          })
        } else {
          for (let i in res.data.card) {
            if (id == res.data.card[i].productid) {
              that.setData({
                length: res.data.card[i].count
              })
            } else {
              that.setData({
                length: 0
              })
            }
          }

        }

      },
      fail: res => {
        console.log(res)
      }
    })
    // 查看商品所属卡次
    wx.request({
      url: 'https://sanye.nbxiong.com/jz/showDiscount.do',
      method: "POST",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: { productid: id },
      success: res => {
        console.log(res)
        that.setData({
          card: res.data.discout
        })

        var card_list = []
        res.data.discout.map(function (item) {
          var obj = {}
          obj = item.buytimes + '次'
          card_list.push(obj)
        })
        console.log(card_list)
        that.setData({
          card_list: card_list
        })
      },
      fail: res => {
        console.log(res)
      }
    })
    // 商品详情
    wx.request({
      url: 'https://sanye.nbxiong.com/jz/showServiceProduct.do',
      method: "POST",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: { productid: id },
      success: res => {
        console.log(res)
        that.setData({
          card_info: res.data.serviceproduct,
          imgs: res.data.detailimgs,
        })
      },
      fail: res => {
        console.log(res)
      }
    })
  },
  // 预约
  service: function (e) {
    var that = this
    var card = that.data.card
    // 直接去支付
    wx.navigateTo({
      url: 'service_info?id=' + that.data.id + '&type=' + 2 + '&buytimes=' + 1 + '&discount=' +1,
    })
  },
  // 卡次
  kaci: function (e) {
    var that = this
    var length = that.data.length
    var card = that.data.card
    var card_list = that.data.card_list
    console.log(card_list)
    var card_info = that.data.card_info
    console.log(card_info)
    var productname = card_info.productname
    if (card_info.supportcard == 0 || card_info.supportcard == null) {
      wx.showModal({
        title: '',
        content: '此产品不允许购买卡次',
      })
    } else {
      // 没有卡次  直接去购买
      if (length == 0) {
        wx.showActionSheet({
          itemList: card_list,
          success: function (res) {
            console.log(res.tapIndex)
            wx.navigateTo({
              url: 'service_info?id=' + that.data.id + '&type=' + 3 + '&buytimes=' + card[res.tapIndex].buytimes + '&discount=' + card[res.tapIndex].discount + '&productname=' + productname,
            })
          },
          fail: function (res) {
            console.log(res.errMsg)
          }
        })
       
      } else {
        wx.navigateTo({
          url: 'service_info?id=' + that.data.id + '&type=' + 1 + '&buytimes=' + 1 + '&discount=' +1,
        })
      }
    
    
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