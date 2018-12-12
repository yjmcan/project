// zh_cjdianc/pages/sjzx/sjzx.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    yykgtext: '语音播报已关闭',
  },
  cartaddformSubmit: function (e) {
    console.log('formid', e.detail.formId)
    var that=this, user_id = this.data.storeinfo.store.admin_id;
    app.util.request({
      'url': 'entry/wxapp/AddFormId',
      'cachetime': '0',
      data: { user_id: user_id, form_id: e.detail.formId },
      success: function (res) {
        console.log(res.data)
        that.reLoad();
      },
    })
  },
  tcdl:function(){
    wx.removeStorageSync('sjdsjid')
    wx.reLaunch({
      url: '/zh_cjdianc/pages/my/index',
    })
  },
  jdswitchChange: function (e) {
    var that = this;
    var sjdsjid = wx.getStorageSync('sjdsjid')
    console.log(sjdsjid)
    console.log('jdswitchChange 发生 change 事件，携带值为', e.detail.value)
    if (e.detail.value){
      var is_jd=1
    }
    else{
      var is_jd = 2
    }
    console.log(is_jd)
    wx.showLoading({
      title: "提交中",
      mask: !0
    }), app.util.request({
      'url': 'entry/wxapp/UpStore',
      'cachetime': '0',
      data: { store_id: sjdsjid, is_jd:is_jd },
      success: function (res) {
        console.log(res.data)
        if (res.data == '1') {
          wx.showToast({
            title: '设置成功',
            icon: 'success',
            duration: 1000,
          })
          if (e.detail.value) {
            that.setData({
              jdkgtext: '自动接单已开启'
            })
          }
          else {
            that.setData({
              jdkgtext: '自动接单已关闭'
            })
          }
        }
        else if (res.data == '2') {
          wx.showToast({
            title: '请修改后提交',
            icon: 'loading',
            duration: 1000,
          })
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
  },
  yyswitchChange: function (e) {
    var that = this;
    console.log('switch2 发生 change 事件，携带值为', e.detail.value)
    if (e.detail.value) {
      wx.setStorageSync('yybb', true)
      that.setData({
        yykg: true,
        yykgtext: '语音播报已开启'
      })
    }
    else {
      wx.removeStorageSync('yybb')
      that.setData({
        yykg: false,
        yykgtext: '语音播报已关闭'
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this, sjdsjid = wx.getStorageSync('sjdsjid'), user_id = wx.getStorageSync('users').id;
    console.log(sjdsjid,user_id)
    app.setNavigationBarColor(this);
    app.sjdpageOnLoad(this);
    app.util.request({
      'url': 'entry/wxapp/StoreInfo',
      'cachetime': '0',
      data: {
        store_id: sjdsjid
      },
      success: (res) => {
        console.log('商家详情', res)
        that.setData({
          storeinfo: res.data,
          user_id: user_id
        })
        that.reLoad();
        if (res.data.storeset.is_jd == '1') {
          that.setData({
            jdkg: true,
            jdkgtext: '自动接单已开启'
          })
        }
        if (res.data.storeset.is_jd == '2') {
          that.setData({
            jdkg: false,
            jdkgtext: '自动接单已关闭'
          })
        }
      }
    })
    if (wx.getStorageSync('yybb')) {
      that.setData({
        yykg: true,
        yykgtext: '语音播报已开启'
      })
    }
  },
  reLoad: function () {
    var that = this, admin_id = this.data.storeinfo.store.admin_id;
    app.util.request({
      'url': 'entry/wxapp/MyFormId',
      'cachetime': '0',
      data: { admin_id: admin_id },
      success: function (res) {
        console.log(res.data)
        that.setData({
          sycs: res.data
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

  }
})