// pages/question/question.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  kindToggle: function (e) {
    console.log(e)
    var index = e.currentTarget.id, list = this.data.list;
    // list[index].open=true
    console.log(index)
    for(let i in list){
      if (list[i].id==index){
        list[i].open =true
      }else{
        list[i].open = false
      }
    }
    console.log(list)
    this.setData({
      list:list
    })
  },

  // ————————————跳转到联系客服——————————————
  kefu:function(e){
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    app.util.request({
      url: 'entry/wxapp/help',
      'cachetime': '0',
      success: function (res) {
        console.log("常见问题")
        console.log(res.data)
        /*在获取的数据里面添加一个open */
        for(let i in res.data){
          res.data[i].open=false
        }
        that.setData({
          list: res.data
        })
      },
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