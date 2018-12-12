// zh_vip/pages/my/wdck/gkzx.js
var app = getApp();
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
    var that = this;
    var xtxx = wx.getStorageSync('xtxx')
    console.log(xtxx)
    this.setData({
      xtxx: xtxx,
      url: getApp().imgurl
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: xtxx.link_color,
    })
  },
  reLoad:function(){
    var that = this, uid = wx.getStorageSync('UserData').id;
    console.log(uid)
    app.util.request({
      'url': 'entry/wxapp/NumCardList',
      'cachetime': '0',
      success: function (res) {
        console.log(res.data)
        var arr = res.data
        app.util.request({
          'url': 'entry/wxapp/MyCardList',
          'cachetime': '0',
          data: { user_id: uid,yxq:'未失效'},
          success: function (res) {
            console.log(res.data)
            var wsxarr = res.data
            for (let i = 0; i < wsxarr.length;i++){
              for (let j = 0; j < arr.length; j++){
                if (wsxarr[i].card_id==arr[j].id){
                    arr[j].isgm=true; 
                }
              }
            }
            console.log(arr)
            that.setData({
              list:arr
            })
          },
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
    this.reLoad();
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
})