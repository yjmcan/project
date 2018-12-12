// zh_jypx/pages/rank/recive_password.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    time: '获取验证码', //倒计时 
    currentTime: 60,
    disabled: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /*找回密码*/
  formSubmit:function(e){
    var that=this;
    //手机号
    var phone = e.detail.value.phone;
    //验证码
    var code = e.detail.value.code;
    //密码
    var password = e.detail.value.password
    var recive_code = that.data.recive_code;
    console.log(phone)
    console.log(code)
    console.log(password)

    var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
    var tip = ""
    if (!myreg.test(phone)) {
      tip = "您输入的手机格式有误!"
    } else if (code == "") {
      tip = "请输入验证码!"
    } else if (code = !recive_code){
      tip = "您输入的验证码不正确!"
    } else if (password == "") {
      tip = "请输入密码!"
    } 
    if (tip != "") {
      wx.showModal({
        title: '',
        content: tip
      })
    } else {
      // // 获取6位数的随机数
      var recive_code = "";
      for (var i = 0; i < 6; i++) {
        recive_code += Math.floor(Math.random() * 10);
      }
      console.log(recive_code)
      that.setData({
        disabled: true,
        recive_code: recive_code
      })
      app.util.request({
        "url": "entry/wxapp/ResetPassword",
        "cachetime": "0",
        data: {
          phone: phone,
          code: code,
          npass_word: password
        },
        success: function (res) {
          console.log("提交成功")      
          console.log(res)
          if(res.data.code==505){
            wx.showToast({
              title: '该手机号尚未注册，请先注册!',
              icon: "none",
              duration: 2000
            })
            setTimeout(function () {
              wx: wx.redirectTo({
                url: 'login',
              })
            },2000)
          }else{
            wx.showToast({
              title: '成功找回密码!',
              icon: "none",
              duration: 2000
            })
            setTimeout(function () {
              wx: wx.redirectTo({
                url: 'login_firset',
              })
            }, 2000)
          }
        }
      })
    }
  },

  //获取电话号码
  onChange:function(e){
    var num=e.detail.value;
    console.log(num)
    this.setData({
      num: num
    })
  },

  //获取验证码
  onCode:function(e){
    var that=this;
    // console.log(that)
    var currentNum = that.data.num;
    console.log(currentNum)
    var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;

    if (!myreg.test(currentNum)) {
      wx.showModal({
        title: '',
        content: "您输入的手机号有误!"
      })
    }else{
      that.getCode();
      that.setData({
        disabled: true
      })
      // // 获取6位数的随机数
      var recive_code = "";
      for (var i = 0; i < 6; i++) {
        recive_code += Math.floor(Math.random() * 10);
      }
      console.log(recive_code)
      that.setData({
        disabled: true,
        recive_code: recive_code
      })
      // 随机数传给后台
      app.util.request({
        'url': 'entry/wxapp/Code',
        'cachetime': '0',
        data: {
          code: recive_code,
          phone: currentNum
        },
        success: function (res) {
          console.log(res)
        }
      })
    }
  },

  //倒计时
  getCode:function(e){
    var that=this;
    console.log(that)
    //输入的手机号
    var currentNum = that.data.num;
    var currentTime = that.data.currentTime;
    var interval=setInterval(function(){
      currentTime--;
      that.setData({
        time: currentTime+'秒'
      })
      if (currentTime<=0){
        clearInterval(interval)
        that.setData({
          time:"重新获取",
          currentTime:60,
          disabled: false
        })
      }
    },1000)

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