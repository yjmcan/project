// pages/Invitation/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    color: "#459cf9",
    select_code: true
  },
  ljsq:function(){
    wx.navigateTo({
      url: 'jrhhr',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu({
      
    })
    app.setNavigationBarColor(this);
    var that = this,userinfo= wx.getStorageSync('users')
    console.log(userinfo)
    this.setData({
      userid:userinfo.id,
      username:userinfo.name,
      pt_name: getApp().xtxx.url_name,
    })
    app.util.request({
      'url': 'entry/wxapp/Url',
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        that.setData({
          url: res.data
        })
      },
    })
    app.util.request({
      'url': 'entry/wxapp/CheckRetail',
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        that.setData({
          fxset: res.data,
        })
      },
    })
    this.reLoad()
  },
  reLoad:function(){
    var that = this, user_id = wx.getStorageSync('users').id;
    console.log(user_id)
    //用户是否申请
    app.util.request({
      'url': 'entry/wxapp/MyDistribution',
      'cachetime': '0',
      data: { user_id: user_id },
      success: function (res) {
        console.log(res.data)
        if (res.data.state == '2') {
          console.log('是分销商')
          that.setData({
            isfxs: 2
          })
        }
        else if (res.data.state == '1') {
          console.log('待审核')
          that.setData({
            isfxs: 1
          })
        }
        else {
          console.log('未申请过')
          that.setData({
            isfxs: 3
          })
        }
      }
    });
  },
  se_code: function (e) {
    wx.navigateTo({
      url: 'core',
    })
    // if (this.data.select_code == true) {
    //   this.setData({
    //     select_code: false
    //   })
    // } else {
    //   this.setData({
    //     select_code: true
    //   })
    // }
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
    var that = this, user_id = wx.getStorageSync('users').id;
    console.log(user_id)
    //用户是否申请
    app.util.request({
      'url': 'entry/wxapp/GetFxData',
      'cachetime': '0',
      data: { user_id: user_id },
      success: function (res) {
        console.log(res.data)
        that.setData({
          fxdata:res.data,
        })
      }
    });
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
  onShareAppMessage: function (res) {
    console.log(this.data.pt_name, this.data.userid, this.data.username)
    console.log(res)
    if (res.from === 'menu') {
      //
      return false;
    }
    return {
      title: this.data.username + '邀请你来看看' + this.data.pt_name,
      path: "/zh_cjdianc/pages/Liar/loginindex?userid=" + this.data.userid,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})