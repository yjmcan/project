// zh_gjhdbm/pages/index/city.js
const app = getApp()
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
    app.setNavigationBarColor(this);
    wx.hideShareMenu()
    // var url = 'https://hl.zhycms.com/app/index.php?i=59&t=0&v=1.0&from=wxapp&c=entry&a=wxapp&do=' + 'getcity' +'&&m=zh_gjhdbm&sign=86519d3f837d0445405a1fbca29ef8f4'
    // wx.request({
    //   url: 'https://hl.zhycms.com/app/index.php?i=59&t=0&v=1.0&from=wxapp&c=entry&a=wxapp&do=getcity&&m=zh_gjhdbm&sign=86519d3f837d0445405a1fbca29ef8f4',
    //   success:res=>{
    //     console.log(res)
    //   }
    // })
    // 获取城市列表
    app.util.request({
      'url': 'entry/wxapp/getcity',
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        that.setData({
          city:res.data
        })
      },
    })
  },
  city:function(e){
    console.log(e)
    var that = this
    var city = that.data.city
    var index = e.currentTarget.dataset.index
    wx.setStorageSync('city', city[index].cityname)
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];  //上一个页面
    prevPage.berak()
    prevPage.advert()
    app.globalData.sele_city = 0
    console.log('点击了')
    wx.navigateBack({
      delta:1
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
  // onShareAppMessage: function () {
  
  // }
})