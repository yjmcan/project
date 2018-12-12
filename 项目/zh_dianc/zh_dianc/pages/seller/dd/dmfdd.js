// zh_dianc/pages/seller/dd/dmfdd.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: '',
    pagenum: 1,
    ddlist: [],
    mygd: false,
    jzgd: true,
    jzwb: false,
  },
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  sousuo: function () {
    this.setData({
      pagenum: 1,
      ddlist: [],
      mygd: false,
      jzgd: true,
      jzwb: false,
    })
    this.reLoad(this.data.date)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.reLoad(this.data.date)
  },
  reLoad: function (date) {
    var sjdsjid = wx.getStorageSync('sjdsjid')
    console.log(sjdsjid)
    var that = this;
    //商家订单
    app.util.request({
      'url': 'entry/wxapp/AppDmOrder',
      'cachetime': '0',
      data: { store_id: sjdsjid, page: that.data.pagenum, time: date },
      success: function (res) {
        console.log('分页返回的数据', res.data)
        if (res.data.length == 0) {
          that.setData({
            mygd: true,
            jzgd: true,
            jzwb: true,
          })
        }
        else {
          that.setData({
            jzgd: true,
            pagenum: that.data.pagenum + 1,
          })
        }
        var ddlist = that.data.ddlist;
        ddlist = ddlist.concat(res.data);
        that.setData({
          dmfdd: ddlist,
          ddlist: ddlist,
        })
      },
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
      date: '',
      pagenum: 1,
      ddlist: [],
      mygd: false,
      jzgd: true,
      jzwb: false,
    })
    this.reLoad(this.data.date);
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
      this.reLoad(this.data.date);
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