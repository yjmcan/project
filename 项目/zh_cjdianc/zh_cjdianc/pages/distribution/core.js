// pages/distribution/distribution.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    color: "#459cf9",
    fwxy: true,
  },
  previewimg: function () {
    wx.previewImage({
      urls: [this.data.code],
    })
  },
  mdmfx: function () {
    var page = this;
    page.setData({
      fwxy: false,
    });
  },
  yczz: function () {
    this.setData({
      fwxy: true,
    })
  },
  bctp: function () {
    console.log(this.data.code)
    var page = this;
    wx.downloadFile({
      url: page.data.code,
      success: function (urlres) {
        console.log(urlres)
        wx.showLoading({
          title: "正在保存图片",
          mask: true,
        });
        wx.saveImageToPhotosAlbum({
          filePath: urlres.tempFilePath,
          success: function () {
            page.setData({
              fwxy: true,
            })
            wx.showModal({
              title: '提示',
              content: '商家海报保存成功',
              showCancel: false,
            });
          },
        });
      },
      complete: function (e) {
        console.log(e);
        wx.hideLoading();
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.setNavigationBarColor(this);
    var that = this, user_id = wx.getStorageSync('users').id;
    this.setData({
      userinfo: wx.getStorageSync('users')
    })
    //邀请人
    app.util.request({
      'url': 'entry/wxapp/MySx',
      'cachetime': '0',
      data: { user_id: user_id },
      success: function (res) {
        console.log(res.data)
        if (!res.data) {
          that.setData({
            yqr: '总店',
            sxdata:res.data
          })
        }
        else {
          that.setData({
            yqr: res.data.name,
            sxdata: res.data
          })
        }
      }
    });
    //MyCode
    app.util.request({
      'url': 'entry/wxapp/MyCode',
      'cachetime': '0',
      data: { user_id: user_id },
      success: function (res) {
        console.log(res.data)
        that.setData({
          code: res.data,
        })
      }
    });
  },
  distribution:function(e){
    wx.navigateTo({
      url: 'distribution',
    })
  },
  downline:function(e){
    wx.navigateTo({
      url: 'downline',
    })
  },
  ranking:function(e){
    wx.navigateTo({
      url: 'ranking',
    })
  },
  invation: function (e) {
    wx.navigateTo({
      url: 'index',
    })
  },
  tixian:function(e){
    wx.navigateTo({
      url: 'tixian',
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
    var that = this, user_id = wx.getStorageSync('users').id;
    //MyCommission
    app.util.request({
      'url': 'entry/wxapp/MyCommission',
      'cachetime': '0',
      data: { user_id: user_id },
      success: function (res) {
        console.log(res.data)
        that.setData({
          yjdata: res.data
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
  onShareAppMessage: function () {

  }
})