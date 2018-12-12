// zh_zbkq/pages/home/homeinfo.js
const app = getApp()
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
    var that=this;
    console.log(options.zxid)
    app.getUserInfo(function (userInfo) {
      //登录
      console.log(app.globalData)
      app.userlogin(function (userdata) {
        console.log(userdata)
        var uid = wx.getStorageSync('UserData').id;
        app.util.request({
          'url': 'entry/wxapp/GetUserInfo',
          'cachetime': '0',
          data: { user_id: uid },
          success: function (res) {
            console.log(res.data)
            that.setData({
              username: res.data.nickname,
            })
          }
        });
      })
    })
    //取imgurl;
    app.util.request({
      'url': 'entry/wxapp/Attachurl',
      'cachetime': '0',
      success: function (res1) {
        console.log(res1.data)
        that.setData({
          url: res1.data,
          zxid: options.zxid,
        })
        var time = util.getNowFormatDate();
        //取zxinfo;
        app.util.request({
          'url': 'entry/wxapp/ZxInfo',
          'cachetime': '0',
          data: { zx_id: options.zxid },
          success: function (res) {
            console.log(res.data)
            var zxinfo = res.data;
            console.log(util.xctsfm(res.data.time, time))
            zxinfo.xctime = util.xctsfm(res.data.time, time)
            var imgarr = res.data.imgs.split(',');
            for (var j = 0; j < imgarr.length; j++) {
              imgarr[j] = res1.data + imgarr[j]
            }
            zxinfo.imgarr = imgarr;
            console.log(zxinfo)
            that.setData({
              zxinfo: zxinfo,
            })
          }
        });
      }
    });
    //取平台信息
    app.util.request({
      'url': 'entry/wxapp/GetPlatform',
      'cachetime': '0',
      success: function (res) {
        console.log(res.data)
        that.setData({
          ptxx: res.data
        })
      }
    });
  },
  tel: function (e) {
    var that = this;
    console.log(e.currentTarget.dataset.tel)
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.tel,
    })
  },
  previewImage: function (e) {
    var that = this;
    console.log(e.currentTarget.dataset.imgarr, e.currentTarget.dataset.src)
    wx.previewImage({
      current: e.currentTarget.dataset.src,
      urls: e.currentTarget.dataset.imgarr
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  console.log(this.data.username,this.data.zxid)
  return {
    title: this.data.username + '邀请你来看看' + this.data.ptxx.name+'资讯',
    path: 'zh_zbkq/pages/home/homeinfo?zxid='+this.data.zxid,
    success: function (res) {
      // 转发成功
    },
    fail: function (res) {
      // 转发失败
    }
  }
  }
})