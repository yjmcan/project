// zh_jypx/pages/rank/login_firset.js
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
  onLoad: function (options) {
  
  },

  /*登录 */
  formSubmit:function(e){
    //手机号
    var phone = e.detail.value.phone;
    //密码
    var code = e.detail.value.code;
    console.log(phone)
    console.log(code)

    var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
    var tip=""
    if (!myreg.test(phone)){
      tip="您输入的手机格式有误!"
    } else if (code==""){
      tip = "请输入密码!"
    }
    if(tip!=""){
      wx.showModal({
        title: '',
        content: tip
      })
    }else{
      app.util.request({
        "url":"entry/wxapp/login",
        "cachetime":"0",
        data:{
          phone: phone,
          pass_word: code
        },
        success:function(res){
          if (res.data.code==505){
            wx.showToast({
              title: '该手机号尚未注册，请先注册!',
              icon: "none",
              duration: 2000
            })
            // wx.showModal({
            //   title: "该手机号尚未注册，请先注册",
            //   content: tip
            // })
          } else if (res.data.code == 506){
            wx.showToast({
              title: '您的密码不正确!',
              icon: "none",
              duration: 2000
            })            
          }else{
            wx.showToast({
              title: '登录成功!',
              icon: "none",
              duration: 2000
            })
            setTimeout(function () {
              wx: wx.redirectTo({
                url: '../index/index',
              })
            }, 2000)
          }
          console.log("提交成功")
          console.log(res)
          //var user_msg = res.data.data
          wx.setStorageSync('user_msg', res.data.data)
          // var userid = wx.getStorageSync('user_msg')
          // console.log(userid)
        },
        fail:function(res){
          console.log("提交失败")
          console.log(res)
        }
      })
    }
  },

  /*跳转找回密码 */
  onFoget:function(e){
    wx:wx.navigateTo({
      url: 'recive_password',
    })
  },

  /*跳转注册 */
  onRegister: function (e) {
    wx: wx.navigateTo({
      url: 'login',
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
  
  }
})