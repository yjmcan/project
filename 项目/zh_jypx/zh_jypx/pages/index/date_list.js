// pages/index/date_list.js
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {},

  /*点击进入作业列表 */
  task_list:function(e){
    console.log(e)
    var index = e.currentTarget.dataset.index;
    var unit_id = e.currentTarget.dataset.id;
    console.log(unit_id)
    
    if (index===0){
      wx: wx.navigateTo({
        url: 'task_list?unit_id=' + unit_id,
      })
    }else{
      wx.showToast({
        title: '当前作业做完才能进入后面的作业',
        icon: 'none',
        duration: 1000
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var cour_id = options.cour_id
    console.log(options)
    var that=this;
    app.util.request({
      "url": "entry/wxapp/Unit",
      'cachetime': '0',
      data:{
        cour_id: cour_id
      },
      success: function (res) {
        console.log(res)
        if(res.data.code==200){
          var course_name = res.data.list[0].course_name
          var name = res.data.list[0].name
          var title = course_name + name
          that.setData({
            date: res.data.list,
            title: title,
            none: res.data
          })
        }else{
          that.setData({
            // date: res.data.list,
            none: res.data
          })
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