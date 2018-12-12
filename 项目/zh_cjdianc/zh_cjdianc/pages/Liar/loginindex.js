// zh_cjdianc/pages/Liar/loginindex.js
var a = getApp();
var dsq, dsq1
Page({

  /**
   * 页面的初始数据
   */
  data: {
    second:3,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(options)
    var scene = decodeURIComponent(options.scene)
    console.log('scene', scene)
    if (scene != 'undefined') {
      var fxzuid = scene
    }
    if (options.userid != null) {
      console.log('转发获取到的userid:', options.userid)
      var fxzuid = options.userid
    }
    console.log('fxzuid', fxzuid)
    this.setData({
      fxzuid: fxzuid,
    })
    a.getUserInfo(function (userinfo) {
      console.log(userinfo)
      //Binding
      if (fxzuid != null) {
        a.util.request({
          'url': 'entry/wxapp/Binding',
          'cachetime': '0',
          data: { fx_user: userinfo.id, user_id: fxzuid },
          success: function (res) {
            console.log(res)
          },
        })
      }
      else {
        a.util.request({
          'url': 'entry/wxapp/Binding',
          'cachetime': '0',
          data: { fx_user: userinfo.id, user_id: 0 },
          success: function (res) {
            console.log(res)
          },
        })
      }
    })
    // dsq=setInterval(()=>{
    //   second--
    //   that.setData({
    //     second: second,
    //   }) 
    // },1000)
    // dsq1=setTimeout(() => {
    //   clearInterval(dsq)
    //   that.tggg()
    // }, 3000)
    a.setNavigationBarColor(this);
    // 系统设置
    a.util.request({
      'url': 'entry/wxapp/system',
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        // if (res.data.model == '3') {
        //   wx.reLaunch({
        //     url: '../Liar/Liar',
        //   })
        // }
        var second = Number(res.data.countdown);
        dsq = setInterval(() => {
          second--
          that.setData({
            second: second,
          })
        }, 1000)
        dsq1 = setTimeout(() => {
          clearInterval(dsq)
          that.tggg()
        }, second*1000)
        var xtxx=res.data;
        that.setData({
          xtxx:xtxx,
          second: res.data.countdown
        })
        getApp().xtxx1 = xtxx
        wx.setNavigationBarTitle({
          title: res.data.url_name,
        })
        //home轮播图和开屏公告
        a.util.request({
          'url': 'entry/wxapp/ad',
          'cachetime': '0',
          data: { type: '2' },
          success: function (res) {
            console.log(res)
            if (res.data.length == 0) {
              clearInterval(dsq)
              clearTimeout(dsq1)
              setTimeout(() => {
                if (xtxx.model == '1') {
                  wx.reLaunch({
                    url: '/zh_cjdianc/pages/index/index',
                  })
                }
                if (xtxx.model == '2') {
                  getApp().sjid = xtxx.default_store
                  wx.reLaunch({
                    url: '/zh_cjdianc/pages/seller/index',
                  })
                }
                if (xtxx.model == '3') {
                  wx.reLaunch({
                    url: '/zh_cjdianc/pages/Liar/Liar',
                  })
                }
                if (xtxx.model == '4') {
                  getApp().sjid = xtxx.default_store
                  wx.reLaunch({
                    url: '/zh_cjdianc/pages/seller/indextakeout',
                  })
                }
              }, 1000)
            }
            that.setData({
              kpggimg: res.data,
            })
          },
        })
      },
    })
  },
  tggg:function(){
    clearInterval(dsq)
    clearTimeout(dsq1)
     var xtxx=this.data.xtxx;
     console.log(xtxx);
     if (xtxx.model == '1'){
       wx.reLaunch({
         url: '/zh_cjdianc/pages/index/index',
       })
     }
     if (xtxx.model == '2') {
       getApp().sjid = xtxx.default_store
       wx.reLaunch({
         url: '/zh_cjdianc/pages/seller/index',
       })
     }
     if (xtxx.model == '3') {
       wx.reLaunch({
         url: '/zh_cjdianc/pages/Liar/Liar',
       })
     }
     if (xtxx.model == '4') {
       getApp().sjid = xtxx.default_store
       wx.reLaunch({
         url: '/zh_cjdianc/pages/seller/indextakeout',
       })
     }
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