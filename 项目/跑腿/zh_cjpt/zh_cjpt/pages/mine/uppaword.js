// zh_cjpt/pages/mine/uppaword.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    getmsg: '发送验证码',
    code: '215421521521',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    wx.hideShareMenu()
    //====================================获取系统设置=============================================//
    app.getSystem(function(getSystem) {
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
  },
  // 获取用户输入的手机号
  user_tel: function(e) {
    var that = this
    if (e.detail.value.length == 11) {
      // 判断用户输入的手机号是否符合格式
      var judge = app.isTelCode(e.detail.value)
      console.log(judge)
      if (judge == true) {
        that.setData({
          phone: e.detail.value
        })
      } else {
        that.setData({
          title: '请检查您输入的手机号是否有误',
        })
      }

    } else {
      that.setData({
        title: '请检查您输入的手机号是否有误',
        close: true
      })
    }

  },
  // 判断用户输入的验证码是否正确
  codes: function(e) {
    var that = this
    var a = that.data
    var code = a.code
    console.log(code)
    var value = e.detail.value
    console.log(value)
    if (value != '' && value.length == 6) {
      if (value == code) {
        console.log('验证码输入正确')
        that.setData({
          close: false
        })
      } else {
        console.log('验证码输入错误')
        wx.showModal({
          title: '',
          content: '验证码输入错误',
        })
        that.setData({
          close: true
        })
      }
    }
  },
  //====================================生成随机数组成验证码传给后台=============================================//
  sendmessg: function(e) {
    var that = this
    var phone = that.data.phone
    if (phone == '' || phone == null) {
      wx: wx.showToast({
        title: '请输入手机号',
        icon: '',
        image: '',
        duration: 2000,
        mask: true,
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    }
    else {
      // 获取6位数的随机数
      var Num = "";
      for (var i = 0; i < 6; i++) {
        Num += Math.floor(Math.random() * 10);
      }
      console.log(Num)
      // 随机数传给后台
      app.util.request({
        'url': 'entry/wxapp/Sms2',
        'cachetime': '0',
        data: {
          code: Num,
          tel: phone,
          type: 2
        },
        success: function(res) {
          console.log(res)
        },
      })
      that.setData({
        code: Num
      })
      var time = 59
      // 60秒倒计时
      var inter = setInterval(function() {
        that.setData({
          getmsg: "重新发送(" + time + 's)',
          send: true
        })
        time--
        if (time <= 0) {
          // 停止倒计时
          clearInterval(inter)
          that.setData({
            getmsg: "发送验证码",
            send: false,
            num: 0
          })
        }
      }, 1000)
    }
  },
  pwd: function(e) {
    if (e.detail.value != '') {
      if (e.detail.value.length <= 8) {
        this.setData({
          pwd: e.detail.value
        })
      } else {
        wx.showModal({
          title: '',
          content: '密码最多设置8位',
        })
      }
    }

  },
  formSubmit: function(e) {
    console.log(e)
    var that = this,a = that.data,b = e.detail.value,new_pwd = b.new_pwd,pwd = b.pwd,phone = b.phone,code = b.code
    that.setData({
      phone: phone
    })
    if(phone == ''){
      app.succ_m('请输入您的手机号')
    }else if(pwd==''){
      app.succ_m('请输入您的新密码')
    }else if(new_pwd==''){
      app.succ_m('请再次输入您的密码')
    }else if(pwd!=new_pwd){
      app.succ_m('两次密码输入不一致')
    } else if (code ==''){
      app.succ_m('请输入验证码')
    } else if (code != a.code) {
      app.succ_m('验证码错误')
    }else{
      app.util.request({
        'url': 'entry/wxapp/UpdPwd',
        'cachetime': '0',
        data: {
          tel: phone,
          pwd: pwd
        },
        success: function (res) {
          console.log(res)
          if (res.data == 1) {
            app.succ_t('修改成功', false)
          } else {
            app.succ_t('修改失败', true)
          }
        },
      })
    }
    
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