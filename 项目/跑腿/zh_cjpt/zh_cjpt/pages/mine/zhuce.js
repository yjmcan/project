// pages/mine/zhuce.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    app.getUrl(that)
    wx.hideShareMenu()
    //====================================获取系统设置=============================================//
    app.getSystem(function (getSystem) {
      console.log(getSystem)
      that.setData({
        getSystem: getSystem,
        color: getSystem.color
      })
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: getSystem.color,
      })
    })
    // wx.getSystemInfo({
    //   success:res=>
    //   {
    //     console.log(res)
    //     app.succ_m('您当前的手机型号为'+res.model)
    //   }
    // })
    // app.util.request({
    //   url: 'entry/wxapp/Attachurl',
    //   success: res => {
    //     console.log(res)
    //     that.setData({
    //       url:res.data
    //     })
    //   }
    // })
    app.getUserInfo(function(userInfo) {
      console.log(userInfo)
      that.setData({
        userInfo: userInfo,
      })
      console.log(wx.getStorageSync('user_info'))
      if (wx.getStorageSync('user_info') != '') {
        wx.showLoading({
          title: '正在检测登录状态',
        })
        // 说明用户之前登录过
        app.util.request({
          'url': 'entry/wxapp/login',
          'cachetime': '0',
          data: {
            tel: wx.getStorageSync('user_info').name,
            pwd: wx.getStorageSync('user_info').pwd,
            openid: userInfo.openid
          },
          success: function (res) {
            console.log(res)
            if (res.data == false) {
              wx.showModal({
                title: '',
                content: '该账号密码已修改，请重新登录',
              })
              that.setData({
                sign: false
              })
            } else if (res.data == "该账号不存在") {

              that.setData({
                sign: false
              })
            } else if (res.data == "账号异常,请联系管理员") {
              wx.showModal({
                title: '',
                content: '系统正在审核中，请稍后再试',
              })
              that.setData({
                sign: false
              })
            } else if (res.data.name != '') {
              console.log('可以进行正常登录')
              wx.hideLoading()
              wx.setStorageSync('qs', res.data)
              wx.reLaunch({
                url: '../index/index',
              })
            }
          },
        })
      } else {
        console.log('还没进行过登录')
        that.setData({
          sign: false
        })
      }
    })
   
  },
  zhuce: function(e) {
    wx.navigateTo({
      url: 'index',
    })
  },
  formSubmit: function(e) {
    var that = this
    console.log(e)
    var form_id = e.detail.formId
    var a = e.detail.value
    var name = a.name
    var tel = a.tel
    if (name == '') {
      app.succ_t('账号不能为空', true)
    } else if (tel == '') {
      app.succ_t('密码不能为空', true)
    } else {
      app.util.request({
        'url': 'entry/wxapp/login',
        'cachetime': '0',
        data: {
          tel: name,
          pwd: tel,
          openid: that.data.userInfo.openid
        },
        success: function(res) {
          console.log(res)
          if (res.data == false) {
            app.succ_m('账号或者密码错误')
          } else if (res.data == "该账号不存在") {
            wx.showModal({
              title: '',
              content: '请先注册账号',
            })
          } else if (res.data == "账号异常,请联系管理员") {
            wx.showModal({
              title: '',
              content: '系统正在审核中，请稍后再试',
            })
            that.setData({
              sign: false
            })
          } else if (res.data.name != '') {
            console.log('可以进行正常登录')
            let user_info = {
              name: name,
              pwd: tel
            }
            wx.setStorageSync('user_info', user_info)
            wx.setStorageSync('qs', res.data)
            wx.reLaunch({
              url: '../index/index',
            })
          }
        },
      })
    }

  },
  wx_login:function(e){
    var that = this
    app.util.request({
      'url': 'entry/wxapp/WxLogin',
      'cachetime': '0',
      data: {
        openid: that.data.userInfo.openid
      },
      success: function (res) {
        console.log(res)
        if (res.data == false) {
          app.succ_m('暂无绑定微信账号')
        } else{
          if(res.data.state==1){
            app.succ_m('当前账号正在审核中')
          } else if (res.data.state == 2){
            wx.setStorageSync('qs', res.data)
            wx.reLaunch({
              url: '../index/index',
            })
          }else{
            app.succ_m('您的入驻申请已被拒绝')
          }
        }
      },
    })
  },
  uppaword:function(e){
    wx.navigateTo({
      url: 'uppaword',
    })
  },  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})