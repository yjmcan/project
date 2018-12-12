// zh_zbkq/pages/my/glyhq/glyhqdl.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
  chakan:function(){
    var that=this
    wx.navigateTo({
      url: '../../index/sjdl?sjid='+that.data.sjid,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
   console.log(options)
   this.setData({
     sjid:options.sjid
   })
   //取优惠券详情;
   app.util.request({
     'url': 'entry/wxapp/CouponsInfo',
     'cachetime': '0',
     data: { coupons_id: options.yhqid },
     success: function (res) {
       console.log(res.data)
       wx.setNavigationBarTitle({
         title: '管理'+res.data.md_name + res.data.name,
       })
       that.setData({
         yhq: res.data,
         sysl: Number(res.data.number) - Number(res.data.lq_num)
       })
     }
   });
   //取优惠券详情;
   app.util.request({
     'url': 'entry/wxapp/HxUserList',
     'cachetime': '0',
     data: { coupons_id: options.yhqid },
     success: function (res) {
       console.log(res.data)
       that.setData({
          hxlist:res.data
       })
     }
   });
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