// zh_cjdianc/pages/my/myyhq.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ['平台红包', '商家红包'],
    activeIndex: 0,
  },
  tabClick: function (e) {
    this.setData({
      activeIndex: e.currentTarget.id
    });
  },
  qsy:function(e){
    console.log(e.currentTarget.dataset.sjid)
    getApp().sjid = e.currentTarget.dataset.sjid
    wx.redirectTo({
      url: '/zh_cjdianc/pages/seller/index',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.setNavigationBarColor(this);
    console.log(this);
    var that = this, user_id = wx.getStorageSync('users').id;
    app.util.request({
      'url': 'entry/wxapp/MyCoupons',
      'cachetime': '0',
      data: {user_id: user_id },
      success: function (res) {
        console.log(res.data)
        var ptarr = [],sjarr=[];
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].type == '2') {
            ptarr.push(res.data[i])
          }
          if (res.data[i].type == '1') {
            sjarr.push(res.data[i])
          }
        }
        console.log(ptarr,sjarr)
        that.setData({
          ptarr: ptarr,
          sjarr: sjarr,
        })
      },
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
})