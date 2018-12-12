// zh_tcwq/pages/integral/integral.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    slide:[
      { logo:'http://opocfatra.bkt.clouddn.com/images/0/2017/10/tdJ70qw1fEfjfVJfFDD09570eqF28d.jpg'},
      { logo: 'http://opocfatra.bkt.clouddn.com/images/0/2017/10/k5JQwpBfpb0u8sNNy5l5bhlnrhl33W.jpg' },
      { logo: 'http://opocfatra.bkt.clouddn.com/images/0/2017/10/zUeEednDedmUkIUumN9XI6IXU91eko.jpg' }
    ],
    fenlei:[],
    commodity:[]
  },
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
    wx.hideShareMenu({
      
    })
    var that = this
    this.reLoad()
    //home轮播图和开屏公告
    app.util.request({
      'url': 'entry/wxapp/ad',
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        var toplb = [];
        for (var i = 0; i < res.data.length; i++) {
          if (res.data[i].type == '6') {
            toplb.push(res.data[i])
          }
        }
        console.log(toplb)
        that.setData({
          lblist: toplb,
        })
      },
    })
    //type
    app.util.request({
      'url': 'entry/wxapp/Jftype',
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        that.setData({
          fenlei: res.data
        })
      }
    })
    //商品列表
    app.util.request({
      'url': 'entry/wxapp/JfGoods',
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        that.setData({
          commodity: res.data
        })
      }
    })
  },
  reLoad(){
    var that = this
    var user_id = wx.getStorageSync('users').id
    // 积分
    app.util.request({
      'url': 'entry/wxapp/UserInfo',
      'cachetime': '0',
      data: { user_id: user_id },
      success: function (res) {
        console.log(res)
        that.setData({
          integral: res.data.total_score
        })
      }
    })
  },
  // —————————————点击跳转到兑换记录—————————————————
  record: function (e) {
    wx:wx.navigateTo({
      url: 'record/record',
    })
  },
  interinfo: function (e) {
    console.log(e.currentTarget.id)
    wx: wx.navigateTo({
      url: 'integralinfo/integralinfo?id=' + e.currentTarget.id,
    })
  },
  cxfl:function(e){
    console.log(e.currentTarget.id)
    var that=this;
    app.util.request({
      'url': 'entry/wxapp/JftypeGoods',
      'cachetime': '0',
      data: { type_id: e.currentTarget.id},
      success: function (res) {
        console.log(res)
        that.setData({
          commodity: res.data
        })
      }
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
    this.reLoad();
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
    this.onLoad();
    wx.stopPullDownRefresh()
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