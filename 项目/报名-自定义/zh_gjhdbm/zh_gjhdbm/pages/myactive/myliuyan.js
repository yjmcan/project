// pages/myactive/myliuyan.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    swiperCurrent: 0,
    indicatorDots: false,
    luntext: ['最新', '未回复'],
    activeIndex: 0,
    assess: [],
    page: 1,
    hide: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()
    app.setNavigationBarColor(this);
    var that = this
    that.refresh()
  },
  refresh: function (e) {
    var that = this
    var page = that.data.page
    var assess = that.data.assess
    var user_id = wx.getStorageSync('userInfo').id
    // 获取分类
    app.util.request({
      'url': 'entry/wxapp/MyAssess',
      'cachetime': '0',
      data: {
        user_id: user_id,
        page: page
      },
      success: function (res) {
        console.log('这是所有留言')
        console.log(res)
        if (res.data.length > 0) {
          assess = assess.concat(res.data)
          that.setData({
            assess: assess,
            page: page + 1
          })
        }
      },
    })
  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },

  // ———————————点击删除留言———————————
  lyshanchu: function () {
    wx.showModal({
      title: '提示',
      content: '确定要删除？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  // 控制回复显示与隐藏
  hide: function (e) {
    var that = this
    var assess_id = e.currentTarget.dataset.id
    console.log(assess_id)
    that.setData({
      assess_id: assess_id
    })
    var hide = that.data.hide
    if (hide === false) {
      that.setData({
        hide: true
      })
    } else {
      that.setData({
        hide: false
      })
    }
  },
  // textarea
  textarea: function (e) {
    console.log(e)
    this.setData({
      textarea: e.detail.value
    })
  },
  // 保存回复
  saves: function (e) {
    var that = this
    console.log(that.data)
    var textarea = that.data.textarea
    var assess_id = that.data.assess_id
    if (textarea == '' || textarea == null) {
      wx.showModal({
        title: '',
        content: '请输入留言',
      })
    } else {
      app.util.request({
        url: 'entry/wxapp/SaveReply',
        data: {
          reply: textarea,
          assess_id: assess_id
        },
        success: res => {
          console.log(res)
          wx.showToast({
            title: '提交成功',
          })
          setTimeout(function () {
            that.setData({
              hide: false
            })
          }, 1500)
          that.setData({
            page:1,
            assess:[]
          })
          that.refresh()
        }
      })
    }
  },
  // ———————————点击删除回复———————————
  sfshanchu: function (e) {
    var that  =this
    var assess_id = e.currentTarget.dataset.id
    wx.showModal({
      title: '提示',
      content: '确定要删除？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          app.util.request({
            url: 'entry/wxapp/DelAssess',
            data: {
              assess_id: assess_id
            },
            success: res => {
              console.log(res)
              wx.showToast({
                title: '提交成功',
              })
              that.setData({
                page: 1,
                assess: []
              })
              that.refresh()
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
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
    this.refresh()
  },

  /**
   * 用户点击右上角分享
  //  */
  // onShareAppMessage: function () {

  // }
})