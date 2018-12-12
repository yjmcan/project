// zh_cjdianc/pages/sjzx/dpgl.js
var app = getApp();
var siteinfo = require('../../../../siteinfo.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    jrdd:'0',
    jrcj:'0'
  },
  formSubmit: function (e) {
    var that = this, uid = wx.getStorageSync('users').id;
    console.log(uid)
    wx.showLoading({
      title: '跳转中',
    })
    app.util.request({
      'url': 'entry/wxapp/AddFormId',
      'cachetime': '0',
      data: { user_id: uid, form_id: e.detail.formId },
      success: function (res) {
        console.log(res.data, uid)
        wx.navigateTo({
          url: 'pdfl',
        })
      },
    })
    // setTimeout(()=>{
    //   wx.navigateTo({
    //     url: 'pdfl',
    //   })
    // },1000)
  },
  reLoad: function () {
    var that = this
    app.util.request({
      'url': 'entry/wxapp/NumberList',
      'cachetime': '0',
      data: {
        store_id: wx.getStorageSync('sjdsjid')
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          NumberList: res.data
        })
      },
    })
  },
  refresh: function () {
    wx.showToast({
      title: '刷新数据',
      icon: 'loading'
    })
    this.reLoad()
  },
  ckyl:function(e){
    var that = this;
    var id = e.currentTarget.dataset.id;
    console.log(id);
    wx.navigateTo({
      url: 'pdxq?typename=' + e.currentTarget.dataset.id,
    })
  },
  call: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id, root = siteinfo.siteroot.replace("app/index.php", "");
    console.log(id, root);
    wx.showModal({
      title: '提示',
      content: '确认叫号吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          app.util.request({
            'url': 'entry/wxapp/QueryNumber',
            'cachetime': '0',
            data: { id: id },
            success: function (res) {
              console.log(res)
              wx.playBackgroundAudio({
                dataUrl: root + res.data,
                title: '语音播报',
              })
              wx.showToast({
                title: '叫号成功',
                duration: 1000,
              })
              // if (res.data == 1) {
              //   wx.showToast({
              //     title: '操作成功',
              //     duration: 1000,
              //   })
              //   setTimeout(function () {
              //     that.reLoad()
              //   }, 1000)
              // }
            },
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  sitdown: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    console.log(id);
    wx.showModal({
      title: '提示',
      content: '确认入座此号吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          app.util.request({
            'url': 'entry/wxapp/Pdrz',
            'cachetime': '0',
            data: { id: id },
            success: function (res) {
              console.log(res)
              if (res.data == 1) {
                wx.showToast({
                  title: '操作成功',
                  duration: 1000,
                })
                setTimeout(function () {
                  that.reLoad()
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
  pass: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    console.log(id);
    wx.showModal({
      title: '提示',
      content: '确认跳过此号吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          app.util.request({
            'url': 'entry/wxapp/Pdth',
            'cachetime': '0',
            data: { id: id },
            success: function (res) {
              console.log(res)
              if (res.data == 1) {
                wx.showToast({
                  title: '操作成功',
                  duration: 1000,
                })
                setTimeout(function () {
                  that.reLoad()
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '排队取号',
    })
    this.reLoad()
    var that = this, sjdsjid = wx.getStorageSync('sjdsjid');
    console.log(sjdsjid, wx.getStorageSync('system'))
    app.setNavigationBarColor(this);
    app.sjdpageOnLoad(this);
    // app.util.request({
    //   'url': 'entry/wxapp/StoreStatistics',
    //   'cachetime': '0',
    //   data: { store_id:sjdsjid},
    //   success: function (res) {
    //     console.log(res.data)
    //     that.setData({
    //       wmdd: res.data
    //     })
    //   },
    // })
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
  
  }
})