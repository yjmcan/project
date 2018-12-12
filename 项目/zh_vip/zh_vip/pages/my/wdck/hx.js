// zh_zbkq/pages/my/tjhxy/hx.js
var app=getApp();
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
    var that = this;
    console.log(options)
    var scene = decodeURIComponent(options.scene)
    console.log(scene)
    var kid = scene, storeid = options.storeid, acountid = options.acountid
    this.setData({
      kid: kid,
      storeid: storeid,
      acountid: acountid,
    })
    app.getUserInfo(function (userInfo) {
      //登录
    })
  },
  form_save: function (e) {
    console.log(e)
    var form_id = e.detail.formId
    app.util.request({
      'url': 'entry/wxapp/AddFormId',
      data: {
        user_id: wx.getStorageSync('UserData').id,
        form_id: form_id
      },
      success: res => {
        console.log(res)
      }
    })
  },
  hx:function(){
    var that = this;
    var storeid = this.data.storeid;
    var kid = that.data.kid, acountid =this.data.acountid;
    //
      console.log('扫码人的storeid', storeid, '卡的id', kid, 'acountid', acountid)
    if (storeid == null || acountid == null) {
      wx.showModal({
        title: '',
        content: '请登录商家后台核销',
      })
    } else {
      app.util.request({
        'url': 'entry/wxapp/HxCard',
        'cachetime': '0',
        data: { store_id: storeid, id: kid, hx_id: acountid },
        success: function (res) {
          console.log(res)
          wx.showModal({
            title: '提示',
            content: res.data,
          })
          setTimeout(function () {
            wx.navigateBack({

            })
          }, 1000)
        }
      });
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