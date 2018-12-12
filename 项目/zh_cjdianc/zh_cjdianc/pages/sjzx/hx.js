// zh_zbkq/pages/my/tjhxy/hx.js
var app = getApp();
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
    app.setNavigationBarColor(this);
    var that = this;
    console.log(options)
    var scene = decodeURIComponent(options.scene)
    console.log(scene, scene.split(','))
    var moid = scene.split(',')[1], msjid = scene.split(',')[0], storeid = options.storeid
    this.setData({
      moid: moid,
      msjid: msjid,
      storeid: storeid,
    })
    wx.showLoading({
      title: '加载中',
    })
    app.getUserInfo(function (userinfo) {
      console.log(userinfo)
      that.setData({
        smuid: userinfo.id
      })
    })
    app.util.request({
      'url': 'entry/wxapp/StoreInfo',
      'cachetime': '0',
      data: {
        store_id: msjid
      },
      success: (res) => {
        console.log('商家详情', res)
        that.setData({
          admin_id: res.data.store.admin_id
        })
      }
    })
  },
  hx: function () {
    var that = this;
    var storeid = this.data.storeid, admin_id = this.data.admin_id, smuid = this.data.smuid;
    var moid = that.data.moid, msjid = this.data.msjid;
    //
    console.log('扫码人的storeid', storeid, 'smuid', smuid, 'admin_id', admin_id, '订单id', moid, 'msjid', msjid)
    if(storeid==msjid||admin_id==smuid){
      app.util.request({
        'url': 'entry/wxapp/OkOrder',
        'cachetime': '0',
        data: { order_id: moid },
        success: function (res) {
          console.log(res)
          if (res.data == '1') {
            wx.showToast({
              title: '核销成功',
              icon: 'success',
              duration: 1000,
            })
            setTimeout(function () {
              wx.navigateBack({
                
              })
            }, 1000)
          }
          else {
            wx.showToast({
              title: '请重试',
              icon: 'loading',
              duration: 1000,
            })
          }
        }
      });
    }
    else{
      wx.showModal({
        title: '提示',
        content: '您暂无核销权限',
      })
      setTimeout(function () {
        wx.navigateBack({

        })
      }, 1000)
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