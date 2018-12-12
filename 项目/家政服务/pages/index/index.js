//index.js
//获取应用实例
var app = getApp()

Page({
  data: {
    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    var that = this
    // var kk = {
    //   data:{
    //     '0 mallorder':[1,2,3],
    //   }
    // }
    // console.log(kk.data["0 mallorder"])
    app.getUserInfo(function (userInfo) {
      console.log(userInfo)
      that.setData({
        userInfo: userInfo,
      })
      var user_id = userInfo.data.userid
      that.setData({
        user_id: user_id
      })
    
      that.refresh()
    })
  },
 refresh:function(e){
    var that= this
    var user_id = that.data.user_id
    console.log(user_id)
    // 轮播图
    wx.request({
      
      url: 'https://sanye.nbxiong.com/jz/showCarousels.do',
      method: "POST",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data:{
        type:'服务商品'
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
    // 分类
    wx.request({

      url: 'https://sanye.nbxiong.com/jz/listServiceType.do',
      method: "POST",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: res => {
        console.log(res)
        that.setData({
          nav: res.data.servicetype
        })
        // 所有商品
        wx.request({

          url: 'https://sanye.nbxiong.com/jz/getServiceProductListByType.do',
          method: "POST",
          header: {
            "content-type": "application/x-www-form-urlencoded"
          },
          data: {
            type: res.data.servicetype[0].servicetypename
          },
          success: res => {
            console.log(res)
            that.setData({
              list: res.data.serviceproduct
            })
          },
          fail: res => {
            console.log(res)
          }
        })
      },
      fail: res => {
        console.log(res)
      }
    })
   
  },
  phone: function (e) {
    wx.makePhoneCall({
      phoneNumber: '18190107258'
    })
  },
  classfication:function(e){
    wx.navigateTo({
      url: 'classfication?name='+e.currentTarget.dataset.name,
    })
  },
  classfication_info:function(e){
    wx.navigateTo({
      url: 'service?id=' + e.currentTarget.dataset.id,
    })
  },
  onPullDownRefresh: function () {
    this.refresh()
    wx.stopPullDownRefresh()
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

})
