// pages/logs/capital.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:1,
    list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.hideShareMenu()
    //====================================获取系统设置=============================================//
    app.getSystem(function (getSystem) {
      console.log(getSystem)
      that.setData({
        getSystem: getSystem,
        color: getSystem.color
      })
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: getSystem.color,
      })
    })
    that.list()
  },
  list:function(e){
    var that = this
    app.util.request({
      url:'entry/wxapp/GetHelp',
      success:res=>{
        console.log(res)
       var help = res.data
       for(let i in help){
         help[i].class='none'
       }
       that.setData({
         help:help
       })
      }
    })
  },
  show:function(e){
      var that = this,a = that.data,help = a.help,index = e.currentTarget.dataset.index
      for(let i in help){
        if(i == index){
          help[index].class = 'show'
        }else{
          help[i].class = 'none'
        }
      }
      console.log(help)
      that.setData({
        help:help
      })
  },
  help_info:function(e){
      console.log(e)
      let info = e.currentTarget.dataset.info
      wx.setStorageSync('info', info)
      wx.navigateTo({
        url: 'help',
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
    this.list()
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {
  
  // }
})