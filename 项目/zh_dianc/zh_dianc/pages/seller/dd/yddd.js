// zh_dianc/pages/seller/yydd.js
var app = getApp();
var dsq;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabbar: {},
    tabs: ['待确认', '已确认','已取消'],
    activeIndex: 0,
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
  tabClick: function (e) {
    this.setData({
      activeIndex: e.currentTarget.id
    });
  },
  tel: function (e) {
    console.log(e.currentTarget.dataset.tel)
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.tel,
    })
  },
  qrdd: function (e) {
    var that = this;
    var oid = e.currentTarget.dataset.oid;
    console.log(oid);
    wx.showModal({
      title: '提示',
      content: '确认订单吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          app.util.request({
            'url': 'entry/wxapp/OkYdOrder',
            'cachetime': '0',
            data: { order_id: e.currentTarget.dataset.oid },
            success: function (res) {
              console.log(res)
              if (res.data == 1) {
                wx.showToast({
                  title: '操作成功',
                  duration: 1000,
                })
                setTimeout(function () {
                  that.setData({
                    pagenum: 1,
                    ddlist: [],
                    mygd: false,
                    jzgd: true,
                    jzwb: false,
                  })
                  that.reLoad(that.data.date)
                }, 1000)
              }
            },
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  tgtk: function (e) {
    var that = this;
    console.log('通过退款' + e.currentTarget.dataset.oid)
    wx.showModal({
      title: '提示',
      content: '确定通过退款吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          app.util.request({
            'url': 'entry/wxapp/Ydtk',
            'cachetime': '0',
            data: { order_id: e.currentTarget.dataset.oid },
            success: function (res) {
              console.log(res.data)
              if (res.data == '1') {
                wx.showToast({
                  title: '操作成功',
                  icon: 'success',
                  duration: 1000,
                })
                setTimeout(function () {
                  that.setData({
                    pagenum: 1,
                    ddlist: [],
                    mygd: false,
                    jzgd: true,
                    jzwb: false,
                  })
                  that.reLoad(that.data.date)
                }, 1000)
              }
              else {
                wx.showToast({
                  title: '请重试',
                  icon: 'loading',
                  duration: 1000,
                })
              }
            },
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  jjtk: function (e) {
    var that = this;
    console.log('拒绝退款' + e.currentTarget.dataset.oid)
    wx.showModal({
      title: '提示',
      content: '确定拒绝退款吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          app.util.request({
            'url': 'entry/wxapp/Tkjj',
            'cachetime': '0',
            data: { order_id: e.currentTarget.dataset.oid },
            success: function (res) {
              console.log(res.data)
              if (res.data == '1') {
                wx.showToast({
                  title: '操作成功',
                  icon: 'success',
                  duration: 1000,
                })
                setTimeout(function () {
                  that.setData({
                    pagenum: 1,
                    ddlist: [],
                    mygd: false,
                    jzgd: true,
                    jzwb: false,
                  })
                  that.reLoad(that.data.date)
                }, 1000)
              }
              else {
                wx.showToast({
                  title: '请重试',
                  icon: 'loading',
                  duration: 1000,
                })
              }
            },
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  scdd: function (e) {
    var that = this;
    console.log('删除订单' + e.currentTarget.dataset.oid)
    wx.showModal({
      title: '提示',
      content: '确定删除吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          app.util.request({
            'url': 'entry/wxapp/Del',
            'cachetime': '0',
            data: { order_id: e.currentTarget.dataset.oid },
            success: function (res) {
              console.log(res.data)
              if (res.data == '1') {
                wx.showToast({
                  title: '提交成功',
                  icon: 'success',
                  duration: 1000,
                })
                setTimeout(function () {
                  that.setData({
                    pagenum: 1,
                    ddlist: [],
                    mygd: false,
                    jzgd: true,
                    jzwb: false,
                  })
                  that.reLoad(that.data.date)
                }, 1000)
              }
              else {
                wx.showToast({
                  title: '请重试',
                  icon: 'loading',
                  duration: 1000,
                })
              }
            },
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.editTabBar();
    var that = this;
    if (options.activeIndex) {
      this.setData({
        activeIndex: parseInt(options.activeIndex)
      })
    }
    var sjdsjid = wx.getStorageSync('sjdsjid')
    console.log(sjdsjid)
    //提醒
    // if (wx.getStorageSync('yybb')) {
    //   dsq = setInterval(function () {
    //     app.util.request({
    //       'url': 'entry/wxapp/NewOrder',
    //       'cachetime': '0',
    //       data: { store_id: sjdsjid },
    //       success: function (res) {
    //         console.log(res)
    //         if (res.data == 1) {
    //           wx.playBackgroundAudio({
    //             dataUrl: wx.getStorageSync('url2') + 'addons/zh_dianc/template/images/wm.wav',
    //           })
    //         }
    //       },
    //     })
    //   }, 10000)
    // }
    this.reLoad(this.data.date)
  },
  reLoad: function (date) {
    var sjdsjid = wx.getStorageSync('sjdsjid')
    console.log(sjdsjid)
    var that = this;
    //商家订单
    app.util.request({
      'url': 'entry/wxapp/AppYdOrder',
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
        var dqr = [], yqr = [], yqx = [];
        for (var i = 0; i < ddlist.length; i++) {
          if (ddlist[i].state == '1') {
            dqr.push(ddlist[i])
          }
          if (ddlist[i].state == '2') {
            yqr.push(ddlist[i])
          }
          if (ddlist[i].state == '4' || ddlist[i].state == '5' || ddlist[i].state == '6' || ddlist[i].state == '7') {
            yqx.push(ddlist[i])
          }
        }
        console.log(dqr, yqr, yqx)
        that.setData({
          dqr: dqr,
          yqr: yqr,
          yqx: yqx,
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
    clearInterval(dsq)
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