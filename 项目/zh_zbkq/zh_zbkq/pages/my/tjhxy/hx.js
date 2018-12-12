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
    var scene = decodeURIComponent(options.scene).split(',')
    console.log(scene)
    var yhqid = scene[0]
    var yhquid = scene[1]
    this.setData({
      yhqid: yhqid,
      yhquid: yhquid
    })
    app.getUserInfo(function (userInfo) {
      //登录
      console.log(app.globalData)
      app.userlogin(function (userdata) {
        console.log(userdata)
      })
    })
  },
  hx:function(){
    var that = this;
    var uid = wx.getStorageSync('UserData').id;
    var yhqid = that.data.yhqid
    var yhquid = that.data.yhquid
    //
    console.log('扫码人的id', uid, '优惠券id', yhqid, '优惠券所有者id', yhquid)
    app.util.request({
      'url': 'entry/wxapp/IsHx',
      'cachetime': '0',
      data: { user_id: uid, coupons_id:yhqid },
      success: function (res) {
        console.log(res)
        if(res.data==1){
          wx.showModal({
            title: '提示',
            content: '确定核销此券吗？',
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
                app.util.request({
                  'url': 'entry/wxapp/hxCoupons',
                  'cachetime': '0',
                  data: { coupons_id: yhqid,user_id:yhquid},
                  success: function (res) {
                    console.log(res)
                    if (res.data == 1) {
                      wx.showToast({
                        title: '核销成功',
                        icon: 'success',
                        duration: 1000
                      })
                      setTimeout(function () {
                        wx.switchTab({
                          url: '../../index/index',
                        })
                      }, 1000)
                    }
                    else{
                      wx.showToast({
                        title: '请重试',
                        icon: 'loading',
                        duration: 1000
                      })
                    }
                  }
                });
              } else if (res.cancel) {
                console.log('用户点击取消')
                wx.switchTab({
                  url: '../../index/index',
                })
              }
            }
          })
        }
        else{
          wx.showModal({
            title: '提示',
            content: '您没有核销权限哦',
          })
          setTimeout(function () {
            wx.switchTab({
              url: '../../index/index',
            })
          }, 2000)
        }
      }
    });
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