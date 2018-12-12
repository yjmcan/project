// zh_cjdianc/pages/smdc/drdc.js
var app = getApp()
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isloading: true,
  },
  qxpd: function () {
    var that = this, drid = this.data.drid, drorder = this.data.drlsit.drorder;
    console.log(drorder)
    wx.showModal({
      title: '提示',
      content: '是否关闭此拼单？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.showLoading({
            title: '加载中',
          })
          app.util.request({
            'url': 'entry/wxapp/SdDrShop',
            'cachetime': '0',
            data: {
              id: drid,
            },
            success: function (res) {
              console.log(res.data)
              if (res.data == '1') {
                wx.showToast({
                  title: '取消成功',
                })
                wx.navigateBack({

                })
                // wx.navigateTo({
                //   url: 'smdcform?storeid=' + that.data.storeid + '&tableid=' + that.data.tableid + '&isdr=1',
                // })
              }
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  tjddformSubmit: function () {
    var that = this, drid = this.data.drid, drorder = this.data.drlsit.drorder;
    console.log(drorder)
    if (this.data.drlsit.money <= 0) {
      wx.showModal({
        title: '提示',
        content: '金额过低无法提交订单',
      })
      return false
    }
    if (drorder.state == 2) {
      wx.navigateTo({
        url: 'smdcform?storeid=' + that.data.storeid + '&tableid=' + that.data.tableid + '&drid=' + drid,
      })
    }
    if (drorder.state == 1) {
      wx.showModal({
        title: '提示',
        content: '提交订单后将锁定订单',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            wx.showLoading({
              title: '加载中',
            })
            app.util.request({
              'url': 'entry/wxapp/SdDrShop',
              'cachetime': '0',
              data: {
                id: drid,
              },
              success: function (res) {
                console.log(res.data)
                if (res.data == '1') {
                  wx.showToast({
                    title: '锁定成功',
                  })
                  that.reLoad()
                  setTimeout(() => {
                    wx.navigateTo({
                      url: 'smdcform?storeid=' + that.data.storeid + '&tableid=' + that.data.tableid + '&drid=' + drid,
                    })
                  }, 1000)
                }
              }
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },
  jsdd: function () {
    var that = this, drid = this.data.drid, drorder = this.data.drlsit.drorder;
    wx.showLoading({
      title: '加载中',
    })
    app.util.request({
      'url': 'entry/wxapp/JsDrShop',
      'cachetime': '0',
      data: {
        id: drid,
      },
      success: function (res) {
        console.log(res.data)
        if (res.data == '1') {
          wx.showToast({
            title: '解锁成功',
          })
          that.reLoad()
        }
      }
    })
  },
  sc: function (e) {
    var that = this, storeid = this.data.storeid, sonid = e.currentTarget.dataset.sonid, zuid = this.data.zuid, drid = this.data.drid;
    console.log(storeid, zuid, sonid, drid)
    wx.showModal({
      title: '提示',
      content: '确定删除他的商品吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          app.util.request({
            'url': 'entry/wxapp/DelCar',
            'cachetime': '0',
            data: {
              store_id: storeid,
              user_id: zuid,
              son_id: sonid,
              dr_id: drid,
              type: 2
            },
            success: function (res) {
              console.log(res.data)
              if (res.data == '1') {
                wx.showToast({
                  title: '删除成功',
                })
                that.reLoad()
              }
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  sxsj: function () {
    this.reLoad()
  },
  reLoad: function () {
    var that = this, storeid = this.data.storeid, uid = this.data.zuid, drid = this.data.drid;
    console.log(storeid, uid, drid)
    app.util.request({
      'url': 'entry/wxapp/DrShopList',
      'cachetime': '0',
      data: { store_id: storeid, user_id: uid, dr_id: drid },
      success: function (res) {
        console.log(res.data)
        that.setData({
          drlsit: res.data,
        })
      },
    })
  },
  // cxxg:function(){
  //   wx.navigateBack({

  //   })
  //   // wx.setStorageSync('cxxg', '1')
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu({

    })
    var that = this, uid = wx.getStorageSync('users').id;
    console.log(uid, options)
    app.setNavigationBarColor(this);
    this.setData({
      storeid: options.storeid,
      tableid: options.tableid,
      zuid: uid,
    })
    app.util.request({
      'url': 'entry/wxapp/Zhuohao',
      'cachetime': '0',
      data: { id: options.tableid },
      success: function (res) {
        console.log(res)
        that.setData({
          type_name: res.data.type_name,
          table_name: res.data.table_name,
        })
      }
    })
    app.util.request({
      'url': 'entry/wxapp/IsDr',
      'cachetime': '0',
      data: { store_id: options.storeid, user_id: uid },
      success: function (res) {
        console.log(res.data)
        var dr_id = res.data;
        if (res.data != '请重新开启拼单') {
          that.setData({
            isloading: false
          })
          app.util.request({
            'url': 'entry/wxapp/DrShopList',
            'cachetime': '0',
            data: { store_id: options.storeid, user_id: uid, dr_id: dr_id },
            success: function (res) {
              console.log(res.data)
              that.setData({
                drlsit: res.data,
                drid: dr_id,
              })
            },
          })
        }
        else {
          app.util.request({
            'url': 'entry/wxapp/DrShop',
            'cachetime': '0',
            data: { store_id: options.storeid, user_id: uid },
            success: function (res) {
              console.log(res.data)
              var dr_id = res.data;
              if (res.data != '请稍后重试') {
                that.setData({
                  isloading: false
                })
                app.util.request({
                  'url': 'entry/wxapp/DrShopList',
                  'cachetime': '0',
                  data: { store_id: options.storeid, user_id: uid, dr_id: dr_id },
                  success: function (res) {
                    console.log(res.data)
                    that.setData({
                      drlsit: res.data,
                      drid: dr_id,
                    })
                  },
                })
              }
            },
          })
        }
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  onShareAppMessage: function (res) {
    var that = this, storeid = this.data.storeid, uid = wx.getStorageSync('users').id, tableid = that.data.tableid, drid = this.data.drid;
    console.log(storeid, uid, tableid, drid)
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: wx.getStorageSync('users').name + '邀请你来拼单',
      path: '/zh_cjdianc/pages/smdc/sharedrdc?storeid=' + storeid + '&tableid=' + tableid + '&uid=' + uid + '&drid=' + drid,
    }
  }
})