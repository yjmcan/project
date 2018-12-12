// zh_wxc/pages/fabu/check.js
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
    var that=this;
    var id = options.id;
    console.log(id)
    that.setData({
      id:id
    })
  },
  refresh:function(e){
    var that = this
    var id = that.data.id
    app.util.request({
      'url': 'entry/wxapp/SeeFeedback',
      'cachetime': '0',
      data: {
        order_id: id
      },
      success: function (res) {
        var con = res.data
        console.log(res.data)
        that.setData({
          con: con
        })
      },
    })
  },
  ondetail:function(e){
    var that=this;
    console.log(e)
    var index = e.currentTarget.dataset.id
    console.log(that.data)
    console.log(index)
    var prolistid = that.data.con;
    console.log(prolistid)
    for (var i = 0; i < prolistid.length; i++) {
      if (prolistid[i].id == prolistid[index].id) {
        console.log(prolistid[i].id)
        wx: wx.navigateTo({
          url: 'checkdetail?task_id=' + prolistid[i].id,
        })
      }
    }
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
    this.refresh()
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