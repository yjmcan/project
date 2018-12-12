// zh_zbkq/pages/my/my.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    issq:false,
    showModal: false,
    kgvip: false,
    isvip:false
  },
  xszz: function () {
    this.setData({
      showModal: true,
    })
  },
  yczz: function () {
    this.setData({
      showModal: false,
    })
  },
  glkq:function(){
    wx.showModal({
      title: '提示',
      content: '此功能正在开发中，敬请期待',
    })
  },
  sjvip:function(){
    wx.navigateTo({
      url: 'sjvip',
    })
    // if (this.data.issq) {
    //   wx.navigateTo({
    //     url: 'sjvip',
    //   })
    // }
    // else {
    //   wx.showModal({
    //     title: '温馨提示',
    //     content: '成功开通门店后方能升级VIP',
    //   })
    // }
  },
  tjhxy:function(){
    if(this.data.issq){
      wx.navigateTo({
        url: 'tjhxy/tjhxy',
      })
    }
    else{
      wx.showModal({
        title: '温馨提示',
        content: '成功开通门店并且发布券后方能添加核销员',
      })
    }
  },
  login: function () {
    wx: wx.navigateTo({
      url: 'sjzx/bbaa',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
    // var store_info = wx.getStorageSync('store_id')
    // console.log(store_info)
    // if (store_info == null || store_info == '') {
    //   wx: wx.navigateTo({
    //     url: 'sjzx/bbaa',
    //     success: function (res) { },
    //     fail: function (res) { },
    //     complete: function (res) { },
    //   })
    // } else {
    //   wx: wx.navigateTo({
    //     url: 'sjzx/merchant',
    //     success: function (res) { },
    //     fail: function (res) { },
    //     complete: function (res) { },
    //   })
    // }
  },
  // 跳转小程序
  tzxcx: function (e) {
    console.log(e.currentTarget.dataset.appid)
    wx.navigateToMiniProgram({
      appId: e.currentTarget.dataset.appid,
      success(res) {
        // 打开成功
        console.log(res)
      }
    })
  },
  previewImage: function (e) {
    console.log(e.currentTarget.dataset.img)
    wx.previewImage({
      current: e.currentTarget.dataset.img, // 当前显示图片的http链接
      urls: [e.currentTarget.dataset.img] // 需要预览的图片http链接列表
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.reLoad();
  },
  reLoad:function(){
    var that = this
    var uid = wx.getStorageSync('UserData').id;
    console.log(uid)
    //取用户信息
    app.util.request({
      'url': 'entry/wxapp/GetUserInfo',
      'cachetime': '0',
      data: { user_id: uid },
      success: function (res) {
        console.log(res.data)
        that.setData({
          userinfo: res.data,
        })
        if (res.data.is_vip == '1') {
          that.setData({
            isvip: true
          })
        }
        else{
          that.setData({
            isvip: false
          })
        }
      }
    });
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })
    var url = getApp().imgurl;
    //取平台信息
    app.util.request({
      'url': 'entry/wxapp/GetPlatform',
      'cachetime': '0',
      success: function (res) {
        console.log(res.data)
        that.setData({
          bqxx: res.data,
          url: url
        })
      }
    });
    console.log(that.data)
    app.util.request({
      'url': 'entry/wxapp/GetMdid',
      'cachetime': '0',
      data: { user_id: uid },
      success: function (res) {
        console.log(res)
        if (res.data != '') {
          that.setData({
            mdid: res.data.id,
          })
          if (res.data.is_check == '2') {
            that.setData({
              issq: true,
            })
          }
        }
      }
    });
    //取平台是否开启vip
    app.util.request({
      'url': 'entry/wxapp/GetVip',
      'cachetime': '0',
      success: function (res) {
        console.log(res.data)
        if(res.data.status=='1'){
          console.log('关闭了vip')
          that.setData({
           kgvip:false,
          })
        }
        else{
          console.log('开启了vip')
          that.setData({
            kgvip: true,
          })
        }
      }
    });
    app.util.request({
      'url': 'entry/wxapp/FxSet',
      'cachetime': '0',
      success: function (res) {
        console.log(res.data)
        that.setData({
          is_fx: res.data.is_open
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
    var that = this
    //jjsqzcdy
    wx.getSetting({
      success: (res) => {
        console.log(res)
        if (!res.authSetting["scope.userInfo"]){
            that.reLoad()
        }
      }
    })
    var uid = wx.getStorageSync('UserData').id;
    console.log(uid)
    //取用户信息
    app.util.request({
      'url': 'entry/wxapp/GetUserInfo',
      'cachetime': '0',
      data: { user_id: uid },
      success: function (res) {
        console.log(res.data)
        that.setData({
          userinfo: res.data,
        })
        if (res.data.is_vip == '1') {
          that.setData({
            isvip: true
          })
        }
        else {
          that.setData({
            isvip: false
          })
        }
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