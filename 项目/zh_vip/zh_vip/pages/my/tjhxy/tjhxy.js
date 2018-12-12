// zh_zbkq/pages/my/tjhxy/tjhxy.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  sc:function(e){
    var that=this;
    console.log(e.currentTarget.dataset.uid)
    wx.showModal({
      title: '提示',
      content: '确定删除此核销员吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          //删除
          app.util.request({
            'url': 'entry/wxapp/DelVerification',
            'cachetime': '0',
            data: { id: e.currentTarget.dataset.uid },
            success: function (res) {
              console.log(res)
              if (res.data == 1) {
                wx.showToast({
                  title: '删除成功',
                  icon: 'success',
                  duration: 1000
                })
                setTimeout(function () {
                  that.reLoad();
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
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // if (getApp().getOpenId != null) {
    //   console.log('已经登录过')
    // }
    // else {
    //   console.log('没有登录过')
    //   //调用应用实例的方法获取全局数据
    //   app.getUserInfo(function (userInfo) {
    //     //登录
    //     console.log(app.globalData)
    //     app.userlogin()
    //   })
    // }
    var that = this;
    var uid = wx.getStorageSync('UserData').id;
    //取核销码
    console.log(uid)
    app.util.request({
      'url': 'entry/wxapp/HxCode',
      'cachetime': '0',
      data: { user_id: uid },
      success: function (res) {
        console.log(res)
        that.setData({
          hxm: res.data
        })
      }
    });
    this.reLoad();
  },
  reLoad:function(){
    var that = this;
    var uid = wx.getStorageSync('UserData').id;
    //取核销员列表
    app.util.request({
      'url': 'entry/wxapp/HxList',
      'cachetime': '0',
      data: { user_id: uid },
      success: function (res) {
        console.log(res)
        that.setData({
          hxylist: res.data
        })
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
   this.reLoad()
   setTimeout(function(){
     wx.stopPullDownRefresh()
   },1000)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
})