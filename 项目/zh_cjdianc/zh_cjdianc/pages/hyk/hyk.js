// zh_cjdianc/pages/hyk/hyk.js
var app = getApp();
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Coupons: [{ reduce: '5', state: '1' }, { reduce: '8.8', state: '2' }, { reduce: '5', state: '1' }, { reduce: '8.8', state: '2' }, { reduce: '5', state: '1' }],
  fwxy: true,
  xymc: '会员特权说明',
  xynr: '',
},
  lookck: function () {
    wx.navigateTo({
      url: '../car/xydtl?title=' +'会员特权说明',
    })
  },
  // queren: function () {
  //   this.setData({
  //     fwxy: true
  //   })
  // },
  jumps: function (e) {
    var that = this
    var id = e.currentTarget.dataset.id, name = e.currentTarget.dataset.name;
    var appid = e.currentTarget.dataset.appid
    var src = e.currentTarget.dataset.src, src2 = e.currentTarget.dataset.wb_src
    var type = e.currentTarget.dataset.type
    console.log(id, name, appid, src, src2, type)
    if (type == 1) {
      console.log(src)
      wx: wx.navigateTo({
        url: src,
      })
    } else if (type == 2) {
      wx.setStorageSync('vr', src2)
      wx: wx.navigateTo({
        url: '../car/car',
      })
    } else if (type == 3) {
      wx.navigateToMiniProgram({
        appId: appid,
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.setNavigationBarColor(this);
    app.pageOnLoad(this);
    var that = this;
    //home轮播图和开屏公告
    app.util.request({
      'url': 'entry/wxapp/ad',
      'cachetime': '30',
      success: function (res) {
        console.log(res)
        var toplb = [];
        for (var i = 0; i < res.data.length; i++) {
          if (res.data[i].type == '8') {
            toplb.push(res.data[i])
          }
        }
        console.log(toplb)
        that.setData({
          lblist: toplb,
          xtxx:getApp().xtxx,
          xynr: getApp().xtxx.hy_details.replace(/\<img/gi, '<img style="width:100%;height:auto" ')
        })
      },
    })
    app.util.request({
      'url': 'entry/wxapp/system',
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        that.setData({
          system: res.data
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
    var that = this, user_id = wx.getStorageSync('users').id;
    var date = util.formatTime(new Date).substring(0, 10).replace(/\//g, "-");
    console.log(date.toString())
    // UserInfo
    app.util.request({
      'url': 'entry/wxapp/UserInfo',
      'cachetime': '0',
      data: { user_id: user_id },
      success: function (res) {
        console.log(res)
        if (res.data.dq_time == '' || res.data.dq_time < date.toString()) {
          res.data.ishy = 2
        }
        that.setData({
          userInfo: res.data,
          lxr: res.data.user_name,
          tel: res.data.user_tel
        })
      }
    })
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