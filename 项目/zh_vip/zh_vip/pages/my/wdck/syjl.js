// zh_vip/pages/my/wdck/syjl.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    jzsj:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var that = this, xtxx = wx.getStorageSync('xtxx')
    console.log(xtxx)
    this.setData({
      xtxx: xtxx,
      url: getApp().imgurl
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: xtxx.link_color,
    })
    var user_id = wx.getStorageSync('UserData').id
    console.log(user_id)
    //取优惠券详情;
    app.util.request({
      'url': 'entry/wxapp/MyCardInfo',
      'cachetime': '0',
      data: { id: options.kid },
      success: function (res) {
        console.log(res.data)
        // if (res.data.name == '通用券') {
        //   res.data.cost = parseInt(res.data.cost)
        // }
        // wx.setNavigationBarTitle({
        //   title: res.data.md_name + res.data.name,
        // })
        that.setData({
          item: res.data,
          jzsj:false,
        })
      }
    });
    // 积分
    app.util.request({
      'url': 'entry/wxapp/Record',
      'cachetime': '0',
      data: { user_id: user_id, card_id: options.cid},
      success: function (res) {
        console.log(res)
        var score = res.data
        // var integral = 0
        // for (var i = 0; i < score.length; i++) {
        //   if (score[i].type == 1) {
        //     integral += Number(score[i].score)
        //   }
        //   if (score[i].type == 2){
        //     integral -= Number(score[i].score)
        //   }
        // }
        // console.log(integral)
        that.setData({
          score: score
        })
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