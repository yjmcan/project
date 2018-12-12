// zh_cjdianc/pages/seller/getnum.js
var app = getApp()
var util = require('../../utils/util.js');
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
    this.setData({
      store_id: options.storeid
    })
    wx.setNavigationBarTitle({
      title: '排队取号',
    })
    var that = this
    app.setNavigationBarColor(this);
    app.getimgUrl(this)
    app.getUserInfo(function (userinfo) {
      console.log(userinfo)
      app.util.request({
        'url': 'entry/wxapp/IsReceive',
        'cachetime': '0',
        data: {
          store_id: options.storeid, user_id: userinfo.id,
        },
        success: function (res) {
          console.log(res.data)
          if (res.data && res.data.state=='1'){
            wx.redirectTo({
              url: 'getnumdl?storeid=' + that.data.store_id + '&id=' + res.data.id,
            })
          }
        },
      })
    })
    app.util.request({
      'url': 'entry/wxapp/StoreInfo',
      'cachetime': '0',
      data: {
        store_id: options.storeid
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          storeinfo:res.data.store
        })
      },
    })
    app.util.request({
      'url': 'entry/wxapp/GetTable',
      'cachetime': '0',
      data: {
        store_id: options.storeid
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          tableinfo: res.data
        })
      },
    })
  },
  select:function(e){
    var that=this;
    this.setData({
      activeIndex: e.currentTarget.dataset.index,
    })
  },
  formSubmit: function (e) {
    var that = this, store_id = this.data.store_id, uid = wx.getStorageSync('users').id;
    app.util.request({
      'url': 'entry/wxapp/AddFormId',
      'cachetime': '0',
      data: { user_id: uid, form_id: e.detail.formId },
      success: function (res) {
        console.log(res.data, uid, store_id)
      },
    })
    if (this.data.activeIndex==null){
      wx.showModal({
        title: '提示',
        content: '请选择桌位类型',
      })
    }
    else{
      wx.showModal({
        title: '提示',
        content: '您选择的是' + that.data.tableinfo[that.data.activeIndex].typename,
        success: function (s) {
          if (s.cancel) return !0;
          s.confirm && (wx.showLoading({
            title: "操作中"
          }), app.util.request({
            'url': 'entry/wxapp/SaveNumber',
            'cachetime': '0',
            data: { store_id: store_id, typename: that.data.tableinfo[that.data.activeIndex].typename,user_id:uid },
            success: function (res) {
              console.log(res.data)
              if (res.data) {
                wx.showToast({
                  title: '取号成功',
                  icon: 'success',
                  mask:true,
                  duration: 1000,
                })
                setTimeout(function () {
                  wx.redirectTo({
                    url: 'getnumdl?storeid=' + that.data.storeinfo.id + '&id=' + res.data,
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
            },
          }))
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