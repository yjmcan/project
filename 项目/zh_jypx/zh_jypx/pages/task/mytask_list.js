// zh_jypx/pages/task/mytask_list.js
const app=getApp()
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

    // —————————————— 获取网址——————————
    app.util.request({
      "url": "entry/wxapp/Attachurl",
      'cachetime': '0',
      success: function (res) {
        that.setData({
          url: res.data
        })
      }
    })

    console.log(options)
    var userid = options.userid
    var unitid = options.unitid
    var status = options.status
    var that = this;
    that.setData({
      unitid: unitid,
      userid: userid
    })
    app.util.request({
      'url': 'entry/wxapp/MyTaskList',
      'cachetime': '0',
      data: {
        userid: userid,
        unitid: unitid,
        status: status
      },
      success: function (res) {
        console.log("我的作业")
        console.log(res.data)
        if(res.data.code==200){
          var course_name = res.data.list[0].course_name
          var name = res.data.list[0].name
          var unit_name = res.data.list[0].unit_name

          that.setData({
            task_list: res.data.list,
            course_name: course_name,
            name: name,
            unit_name: unit_name,
            none:res.data
          })          
        }else{
          that.setData({
            none: res.data
          }) 
        }

      },
    })
  },

  /*点击进入我的作业详情 */
  mytask_detail: function (e) {
    console.log(e)
    var that = this;
    // var task_id = that.data.first_id
    console.log(that)
    // console.log(task_id)
    // var unit_id = that.data.unit_id
    // var task_id = e.currentTarget.dataset.taskid
    var task_id = that.data.task_list[0].task_id
    var status = e.currentTarget.dataset.status
    var unitid = that.data.unitid
    var userid = that.data.userid
    wx: wx.navigateTo({
      url: 'mytask_detail?taskid=' + task_id + "&status=" + status + "&unitid=" + unitid + "&userid=" + userid,
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