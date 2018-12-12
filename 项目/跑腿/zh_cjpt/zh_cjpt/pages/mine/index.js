const app = getApp()
const siteinfo = require('../../../siteinfo.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    getmsg: '获取验证码',
    color: "#459cf9",
    succ: false,
    close: false,
    codes: '',
    name: 0,
    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    wx.hideShareMenu()
    //====================================获取用户openid=============================================//
    app.getUserInfo(function(userInfo) {
      that.setData({
        userInfo: userInfo,
      })
    })
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
    app.util.request({
      url: 'entry/wxapp/Attachurl',
      success: res => {
        console.log(res)
        that.setData({
          url: res.data
        })
      }
    })
    app.util.request({
      url: 'entry/wxapp/ad',
      success: res => {
        console.log(res)
        that.setData({
          list: res.data
        })
      }
    })
  },
  // 跳转到入驻协议
  xieyi:function(e){
    wx.navigateTo({
      url: 'rz',
    })
  },
  // 上传图片
  choose: function(e) {
    var that = this
    // 获取上传图片所需要的url
    var url = siteinfo.siteroot
    // 获取小程序id
    var uniacid = siteinfo.uniacid
    // 判断用户点击的是哪一个上传图片
    var id = e.currentTarget.dataset.type
    console.log(id)
    // 第一个上传图片
    var upload_one = ''
    // 第二个上传图片
    var upload_two = ''
    // 第三个上传图片
    var upload_three = ''
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        console.log(res)
        var tempFilePaths = res.tempFilePaths[0]
        wx.uploadFile({
          url: url + '?i=' + uniacid + '&c=entry&a=wxapp&do=upload&m=zh_cjpt',
          filePath: tempFilePaths,
          name: 'upfile',
          formData: {},
          success: function(res) {
            console.log('这是上传成功')
            console.log(res)
            console.log(tempFilePaths)
            if (id == 1) {
              that.setData({
                upload_one: tempFilePaths,
                logo: res.data
              })
            } else if (id == 2) {
              that.setData({
                upload_two: tempFilePaths,
                img_0: res.data
              })
            } else if (id == 3) {
              that.setData({
                upload_three: tempFilePaths,
                img_1: res.data
              })
            }
          },
          fail: function(res) {
            console.log('这是上传失败')
            console.log(res)
          },
        })
      }
    })
  },
  // 获取用户输入的手机号
  user_tel: function(e) {
    var that = this
    if (e.detail.value.length == 11) {
      // 判断用户输入的手机号是否符合格式
      var judge = app.isTelCode(e.detail.value)
      if (judge == true) {
        that.setData({
          phone: e.detail.value
        })
      } else {
        that.setData({
          title: '请检查您输入的手机号是否有误',
          close: true
        })
        setTimeout(function() {
          that.setData({
            close: false
          })
        }, 3000)
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
          type: 1
        },
        success: function(res) {
          console.log(res)
        },
      })
      that.setData({
        codes: Num
      })
      var time = 59
      // 60秒倒计时
      var inter = setInterval(function() {
        that.setData({
          getmsg: time + "s后重新发送",
          send: true
        })
        time--
        if (time <= 0) {
          // 停止倒计时
          clearInterval(inter)
          that.setData({
            getmsg: "获取验证码",
            send: false,
            num: 0
          })
        }
      }, 1000)
    }

  },
  P_message: function(title) {
    var that = this
    that.setData({
      title: title,
      close: true
    })
    setTimeout(function() {
      that.setData({
        close: false
      })
    }, 3000)
  },
  // 选择协议
  selse_succ: function(e) {
    var that = this
    var succ = that.data.succ
    if (succ == false) {
      that.setData({
        succ: true
      })
    } else {
      that.setData({
        succ: false
      })
    }
  },
  // 微信绑定手机号验证
  getPhoneNumber: function(e) {
    var that = this
    var a = that.data
    console.log(app.getSK)
    console.log(e)
    app.util.request({
      'url': 'entry/wxapp/jiemi',
      'cachetime': '0',
      data: {
        sessionKey: a.userInfo.session_key,
        iv: e.detail.iv,
        data: e.detail.encryptedData
      },
      success: function(res) {
        console.log('这是解密手机号')
        console.log(res)
        that.setData({
          phone: res.data.phoneNumber
        })
      },
    })
  },
  // 提交注册
  formSubmit: function(e) {
    var that = this
    // 获取全部变量
    var a = that.data
    // 获取提交的数组
    var getSystem = a.getSystem
    var b = e.detail.value
    var name = b.name
    if (getSystem.is_dxyz == 1) {
      var tel = b.tel
    } else {
      var tel = a.phone
    }
    var email = b.email
    console.log(email)
    let re = /^\w+@[a-zA-Z0-9]{2,10}(?:\.[a-z]{2,4}){1,3}$/;
    var password = b.password
    var confin = b.confirm_pw
    var code = b.code
    var logo = a.logo
    var img_0 = a.img_0
    var img_1 = a.img_1
    var succ = a.succ
    var openid = a.userInfo.openid
    var codes = a.codes
    var title = ''
    if (name == '') {
      title = '请输入您的真实名字'
    } else if (tel == '' && getSystem.is_dxyz == 1) {
      title = '请输入您的真实手机号'
    } else if (tel == null && getSystem.is_dxyz == 2) {
      title = '请输入您的真实手机号'
    } else if (email=='') {
      title = '请输入您的邮箱账号'
    } else if (!re.test(email)){
      title = '请输入正确的邮箱'
    } else if (code == '' && getSystem.is_dxyz == 1) {
      title = '请输入验证码'
    } else if (password == '') {
      title = '请输入登录密码'
    } else if (confin == '') {
      title = '请再次输入登录密码'
    } else if (code != codes && getSystem.is_dxyz == 1) {
      title = '验证码输入错误'
    } else if (password != confin) {
      title = '登录密码输入不一致'
    } else if (succ == false) {
      title = '请阅读并同意入驻申请协议'
    }
    if (title != '') {
      that.P_message(title)
    } else {
      app.util.request({
        url: 'entry/wxapp/SaveRider',
        data: {
          openid: openid,
          name: name,
          tel: tel,
          logo: logo,
          pwd: password,
          zm_img: img_0,
          fm_img: img_1,
          email: email
        },
        success: res => {
          console.log(res)
          if (res.data == '') {
            app.succ_t('注册成功', false)
          } else {
            wx.showModal({
              title: '',
              content: res.data,
            })
          }
        },
        fail: res => {
          console.log(res)
        }
      })
    }
  },
  names: function(e) {
    var that = this
    setInterval(function() {
      var name = that.data.name
      that.setData({
        name: name + 1
      })
      that.one()
    })
  },
  // 申请假数据
  one: function(e) {
    var that = this
    var name = that.data.name
    console.log(name)
    app.util.request({
      url: 'entry/wxapp/SaveRider',
      data: {
        openid: '123',
        name: name,
        tel: name + '123',
        logo: '这是头像',
        pwd: '这是密码',
        zm_img: '这是身份证正面',
        fm_img: '这是身份证反面'
      },
      success: res => {
        console.log(res)
      },
      fail: res => {
        console.log(res)
      }
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
  // onShareAppMessage: function () {

  // }
})