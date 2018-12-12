// pages/logs/mymoney.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hidden:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.money()

  },
     //—————————————————————————————— 产品分类 ——————————————————————————————
    money:function(e){
      var that=this;
      var userid = wx.getStorageSync('users').id
      app.util.request({
        url: 'entry/wxapp/Wallet',
        'cachetime': '0',
        data: {
          user_id: userid
        },
        success: function (res) {
          console.log("钱")
          console.log(res.data)
          that.setData({
            money: res.data
          })
          if(res.data.code==500){
            console.log("暂无数据")
          }else{
            that.setData({
              hidden:true
            })
          }
          wx.setStorageSync('money', res.data)
        },
      });
    },

  // ——————————跳转到零钱收入详情——————————
  shouruinfo:function(e) {
    var xiangid = wx.getStorageSync("users").id;

    wx: wx.navigateTo({
      url: '../logs/shouruinfo?txlist=' + xiangid,
    })
  },

  // ——————————跳转到提现——————————
  ti_xian:function(e){
    var moneyid = wx.getStorageSync("users").id;
    console.log(moneyid)
    wx: wx.navigateTo({
      url: 'ti_xian?user_id=' + moneyid,
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
    var that = this;
    that.money()
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