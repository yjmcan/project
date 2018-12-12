// zh_jypx/pages/teacher/t_list.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeIndex: 0,
    hidden: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    var teacher_msg = wx.getStorageSync('teacher_msg')
    var teacher_id = teacher_msg[0].id
    console.log(teacher_id)
    console.log("老师id"+teacher_id)

    // ——————————————课程级别 ——————————
    app.util.request({
      'url': 'entry/wxapp/CateList',
      'cachetime': '0',
      data:{
        teacher_id: teacher_id
      },
      success: function (res) {
        console.log("级别")
        console.log(res.data)
        if(res.data.code==200){
          that.setData({
            level: res.data.list,
            hidden: true
          })
          that.order()
        }
      },
    })

  },
  order: function (e) {
    var that = this;
    console.log(that)
    var first_id = that.data.level[0].cate_id
    var activeIndex = that.data.activeIndex
    var teacher_msgs = wx.getStorageSync('teacher_msg')
    var teachers_id = teacher_msgs[0].id
    console.log(first_id)
    //——————————————课程 ——————————
    app.util.request({
      'url': 'entry/wxapp/CourseList',
      'cachetime': '0',
      data: {
        course_id: first_id,
        teacher_id: teachers_id
      },
      success: function (res) {
        console.log("级别详情")
        console.log(res.data)
        if(res.data.code==200){
          that.setData({
            con: res.data.list,
            none: res.data
          })
        }else{
          that.setData({
            con: res.data.list,
            none:res.data
          })          
        }

      },
    })
  },

  /*点击课程选择 */
  onDetail: function (e) {
    var that = this;
    console.log(e)
    console.log(that.data)
    var detail_id = e.currentTarget.dataset.cate_id
    var activeIndex = that.data.activeIndex;
    var index = e.currentTarget.dataset.index;
    var teacher_msgs = wx.getStorageSync('teacher_msg')
    var teachers_id = teacher_msgs[0].id
    console.log(activeIndex)
    console.log(index)
    app.util.request({
      'url': 'entry/wxapp/CourseList',
      'cachetime': '0',
      data: {
        course_id: first_id,
        teacher_id: teachers_id
      },
      success: function (res) {
        console.log("级别详情")
        console.log(res.data)
        that.setData({
          con: res.data,
        })
      },
    })
    that.setData({
      index: index,
      activeIndex: index
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