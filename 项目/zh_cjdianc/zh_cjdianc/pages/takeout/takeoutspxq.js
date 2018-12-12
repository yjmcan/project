// zh_dianc/pages/takeout/takeoutspxq.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    store_id: '1',
    start_at: '88',
    share_modal_active: false,
    color: '#ff4544',
    spggtoggle: true,
    gg: [],
  },
  //tjdd
  subText() {
    console.log(this.data)
    var totalPrice = parseFloat(this.data.cart_list.money), start_at = parseFloat(this.data.start_at), subtext;
    console.log(totalPrice, start_at)
    if (totalPrice <= 0) {
      subtext = '￥' + this.data.start_at + '元起送';
    } else if (totalPrice < start_at) {
      let diff = start_at - totalPrice;
      console.log(diff)
      subtext = '还差' + diff.toFixed(2) + '元起送';
    } else {
      console.log(totalPrice)
      subtext = '去结算';
    }
    this.setData({
      subtext: subtext,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    app.getUserInfo(function (userinfo) {
      console.log(userinfo)
      var user_id = wx.getStorageSync('users').id, store_id = that.data.store_id;
      app.util.request({
        'url': 'entry/wxapp/MyCar',
        'cachetime': '0',
        data: {
          store_id: store_id, user_id: user_id
        },
        success: function (res) {
          console.log(res)
          var cart_list = res.data.res
          that.setData({
            cart_list: res.data,
          })
          that.subText()
        }
      })
    })
  },
  spggck: function () {
    this.setData({
      spggtoggle: false
    })
  },
  gbspgg: function () {
    this.setData({
      spggtoggle: true,
    })
  },
  showcart: function () {
    var that = this;
    this.setData({
      share_modal_active: !that.data.share_modal_active,
    })
  },
  closecart: function () {
    var page = this;
    page.setData({
      share_modal_active: false,
    });
  },
  clear: function () {
    var that = this, dishes = this.data.dishes, user_id = wx.getStorageSync('users').id, store_id = that.data.store_id;
    console.log(dishes, user_id, store_id)
    wx.showModal({
      title: '提示',
      content: '确定清空此商家的购物车吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.showLoading({
            title: "正在加载",
            mask: !0
          }),
            app.util.request({
              'url': 'entry/wxapp/DelCar',
              'cachetime': '0',
              data: {
                user_id: user_id, store_id: store_id
              },
              success: function (res) {
                console.log(res.data)
                if (res.data == '1') {
                  for (let i = 0; i < dishes.length; i++) {
                    for (let j = 0; j < dishes[i].good.length; j++) {
                      dishes[i].good[j].quantity = 0
                    }
                  }
                  that.setData({
                    dishes: dishes
                  })
                  that.gwcreload()
                }
              },
            })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
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