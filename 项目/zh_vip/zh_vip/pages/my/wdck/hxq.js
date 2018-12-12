// zh_zbkq/pages/index/yhqdl.js
var app=getApp();
var dsq;
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var that=this, xtxx = wx.getStorageSync('xtxx')
    console.log(xtxx)
    this.setData({
      xtxx: xtxx,
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: xtxx.link_color,
    })
    var uid = wx.getStorageSync('UserData').id;
    console.log(uid)
    //取优惠券详情;
    app.util.request({
      'url': 'entry/wxapp/MyCardInfo',
      'cachetime': '0',
      data: { id: options.kid },
      success: function (res) {
        console.log(res.data)
        // if (res.data.name == '通用券') {
        //   res.data.cost = parseInt(res.data.cost)
        // }
        // wx.setNavigationBarTitle({
        //   title: res.data.md_name + res.data.name,
        // })
        that.setData({
          yhq: res.data,
        })
      }
    });
    // dsq=setInterval(function(){
    //   //;
    //   app.util.request({
    //     'url': 'entry/wxapp/UseCoupons',
    //     'cachetime': '0',
    //     data: { coupons_id: options.yhqid, user_id: uid, qid: options.qid},
    //     success: function (res) {
    //       console.log(res.data)
    //       if(res.data==2){
    //         wx.showToast({
    //           title: '核销成功',
    //           duration:1000,
    //         })
    //         setTimeout(function(){
    //           wx.reLaunch({
    //             url: '../../index/index',
    //           })
    //         },1000)
    //       }
    //     }
    //   });
    // },5000)
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
    clearInterval(dsq)
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
  // onShareAppMessage: function () {
  
  // }
})