// pages/my/task.js
//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    task_title: [{ "id": "1", "con": "正在批改" }, { "id": "2", "con": "已经批改" }],
    activeIndex:0,
    hidden:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var task_id = options.userid;
    console.log(task_id)
    that.setData({
      task_id: task_id
    })

    console.log(that)
    var state = that.data.task_title[0].id
    app.util.request({
      'url': 'entry/wxapp/MyTask',
      'cachetime': '0',
      data: {
        userid: task_id,
        state: state
      },
      success: function (res) {
        console.log(res)
        if(res.data.code==200){
          that.setData({
            task:res.data.list,
            none:res.data,
            hidden: true
          })
        }else{
          that.setData({
            none: res.data
          })          
        }
      }
    })
  },

  /*点击课程选择 */
  onDetail: function (e) {
    var that = this;
    console.log(e)
    console.log(that.data)
    var detail_id = e.currentTarget.dataset.id
    var activeIndex = that.data.activeIndex;
    var index = e.currentTarget.dataset.index;
    var user_id = that.data.task_id
    console.log(activeIndex)
    console.log(index)
    app.util.request({
      'url': 'entry/wxapp/MyTask',
      'cachetime': '0',
      data: {
        state: detail_id,
        userid: user_id
      },
      success: function (res) {
        console.log("作业列表")
        console.log(res.data)
        if (res.data.code == 501) {
          that.setData({
            none: res.data
          })
        } else {
          that.setData({
            task: res.data.list,
            none: res.data
          })
        }
      },
    })
    that.setData({
      index: index,
      activeIndex: index
    })

  },

  /*跳转详情页 */
  onrevise:function(e){
    var that=this;
    var user_id = wx.getStorageSync('user_msg').id
    console.log(user_id)    
    var unit_id=e.currentTarget.dataset.index
    var status = e.currentTarget.dataset.status
    
    console.log(e)
    console.log(status)
    
    console.log(that)
    wx: wx.navigateTo({
      url: "../task/mytask_list?userid=" + user_id + "&unitid=" + unit_id + "&status=" + status
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