// zh_wxc/pages/fabu/checkdetail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    refuse_reason:true,
    note:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    var task_id = options.task_id
    console.log(task_id)

    // —————————————— 获取网址——————————
    app.util.request({
      url: 'entry/wxapp/Attachurl',
      'cachetime': '0',
      success: function (res) {
        // —————————— 异步保存网址前缀————————
        wx.setStorageSync('url', res.data)
        that.setData({
          url: res.data
        })
      },
    });

    app.util.request({
      url: 'entry/wxapp/SeeFeedbackDetails',
      'cachetime': '0',
      data: {
        task_id: task_id
      },
      success: function (res) {
        var con = res.data[0]
        console.log(res.data)
        console.log(res.data[0].pic)
        var listimgs = con.pic
        /*将用户发表的图片转化成数组 */
        if (listimgs != '') {
          var listimg = listimgs.split(',')
        } else {
          var listimg = []
        }
        that.setData({
          con: con,
          listimg: listimg
        })
      },
    })

  },

  /*点击通过 */
  onpass:function(e){
    var that=this
    var passnum = e.currentTarget.dataset.passnum;
  console.log(that.data.con.id)
  var task_id = that.data.con.id
    console.log(e)
    app.util.request({
      url: 'entry/wxapp/Examine',
      'cachetime': '0',
      data: {
        status: passnum,
        task_id: task_id
      },
      success: function (res) {
        console.log(res)
        wx.navigateBack({
          delta: 1
        })
        wx.showToast({
          title: '成功',
          icon: 'success',
          duration: 2000
        })
      }
    })
  },
  reason:function(e){
    this.setData({
      note:e.detail.value
    })
  },
  cancel:function(e){
    this.setData({
      refuse_reason: true
    })
  },
  /*点击拒绝 */
  onrefuese: function (e) {
    var that=this;
    var refusenum = e.currentTarget.dataset.refusenum;
    var task_id = that.data.con.id

    console.log(e)
    var refuse_reason = that.data.refuse_reason
    var note = that.data.note
    if (refuse_reason==true){
      that.setData({
        refuse_reason:false
      })
    }else if(note==''){
      wx.showModal({
        title:'温馨提示',
        content:'请输入拒绝的理由'
      })
    } else {
      app.util.request({
        url: 'entry/wxapp/Examine',
        'cachetime': '0',
        data: {
          status: 2,
          task_id: task_id,
          note:note
        },
        success: function (res) {
          console.log(res)
          wx.navigateBack({
            delta: 1
          })
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 2000
          })
        }
      })
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