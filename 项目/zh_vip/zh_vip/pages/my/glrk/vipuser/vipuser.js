// zh_vip/pages/vipseller/vipuser.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputValue:'',
    qqsj: false,
    pagenum: 1,
    hyarr: [],
    mygd: false,
    jzgd: true, 
  },
  bindinput: function (e) {
    console.log(e.detail.value)
    this.setData({
      inputValue: e.detail.value
    })
  },
  jqqd: function (e) {
    wx.showModal({
      title: '提示',
      content: '程序员回家过年了，敬请期待',
    })
  },
  confirm: function (e) {
    var that = this;
    var inputValue = this.data.inputValue
    console.log(inputValue)
    if (inputValue == '') {
      wx.showToast({
        title: '请输入内容',
        icon: 'loading',
        duration: 1000,
      })
    }
    else {
      that.setData({
        hyarr: [],
        qqsj: false,
        pagenum: 1,
        mygd: false,
        jzgd: true, 
      })
      that.reLoad(inputValue)
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   this.reLoad('')
  },
  reLoad: function (inputValue){
    console.log(inputValue)
    var that = this;
    //StoreUser
    app.util.request({
      'url': 'entry/wxapp/StoreUser',
      'cachetime': '0',
      data: { keywords: inputValue, page: that.data.pagenum },
      success: function (res) {
        console.log('分页返回的数据', res.data)
        if (res.data.length == 0) {
          that.setData({
            mygd: true,
            jzgd: true,
            qqsj: true,
          })
          // wx.showToast({
          //   title: '没有更多了',
          //   icon: 'loading',
          //   duration: 1000,
          // })
        }
        else {
          that.setData({
            jzgd: true,
            pagenum: that.data.pagenum + 1,
          })
        }
        var hyarr = that.data.hyarr;
        hyarr = hyarr.concat(res.data);
        that.setData({
          hyarr: hyarr,
          qqsj: true,
        })
      },
    })
  },
  vipuserinfo: function (e) {
    console.log(e.currentTarget.dataset.id)
    wx: wx.navigateTo({
      url: 'vipuserinfo?uid=' + e.currentTarget.dataset.id,
    })
  },

  // —————————跳转到商户中心页面———————————
  vipseller: function (e) {
    wx: wx.redirectTo({
      url: '../index',
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
    this.setData({
      inputValue: '',
      hyarr: [],
      qqsj: false,
      pagenum: 1,
      mygd: false,
      jzgd: true,
    })
    this.reLoad('')
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('上拉加载', this.data.pagenum)
    var that = this;
    if (!this.data.mygd && this.data.jzgd) {
      this.setData({
        jzgd: false
      })
      this.reLoad(that.data.inputValue);
    }
    else {
      // wx.showToast({
      //   title: '没有更多了',
      //   icon: 'loading',
      //   duration: 1000,
      // })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})