// zh_wzp/pages/Interview/info.js
var app = getApp()
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
    console.log(options)
    app.route(this)
    var that = this
    that.setData({
      color: wx.getStorageSync("color")
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: wx.getStorageSync("color"),
    })
    app.util.request({
      url: 'entry/wxapp/Attachurl',
      success: res => {
        console.log(res)
        that.setData({
          url: res.data
        })
      }
    })
    app.util.request({
      url: 'entry/wxapp/MeetDetails',
      data: { id: options.id },
      success: res => {
        console.log(res)
        that.setData({
          detail: res.data
        })
      }
    })
    that.setData({
      type: options.type,
      id: options.id,
      state1:options.state
    })
  },
  operation: function (e) {
    var that = this
    console.log(e)
    var state = e.currentTarget.dataset.status
    var position_id = that.data.id
    var title = ''
    if (state == 1) {
      wx.showModal({
        title: '',
        content: '是否拒绝此面试邀请',
        success: res => {
          if (res.confirm) {
            app.util.request({
              url: 'entry/wxapp/Operation',
              data: {
                position_id: position_id,
                state: 1,
              },
              success: res => {
                console.log(res)
                if (res.data == 1) {
                  wx.showToast({
                    title: '已拒绝',
                  })
                  setTimeout(function () {
                    wx.navigateBack({
                      delta: 1
                    })
                  }, 1500)
                } else {
                  wx.showToast({
                    title: '操作失败',
                  })
                  setTimeout(function () {
                    wx.navigateBack({
                      delta: 1
                    })
                  }, 1500)
                }
              }
            })
          }
        }
      })
    } else {
      wx.showModal({
        title: '',
        content: '是否同意此面试邀请',
        success: res => {
          if (res.confirm) {
            app.util.request({
              url: 'entry/wxapp/Operation',
              data: {
                position_id: position_id,
                state: 2,
              },
              success: res => {
                console.log(res)
                if (res.data == 1) {
                  wx.showToast({
                    title: '已同意',
                  })
                  setTimeout(function () {
                    wx.navigateBack({
                      delta: 1
                    })
                  }, 1500)
                } else {
                  wx.showToast({
                    title: '操作失败',
                  })
                  setTimeout(function () {
                    wx.navigateBack({
                      delta: 1
                    })
                  }, 1500)
                }
              }
            })
          }
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