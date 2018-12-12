// pages/mycenter/edit.js
const app = getApp()
var siteinfo = require('../../../siteinfo.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    getmsg: "发送验证码",
    num: 0,
    frequency: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    app.setNavigationBarColor(this);
    console.log(app)
    wx.hideShareMenu()
    var status = options.status
    that.setData({
      status: status
    })
    // 获取系统设置
    app.util.request({
      'url': 'entry/wxapp/getSystem',
      'cachetime': '0',
      success: function (res) {
        console.log('这是系统设置')
        console.log(res)
        that.setData({
          system: res.data
        })
      },
    })
    app.getUserInfo(function (userInfo) {
      console.log(userInfo)
      that.setData({
        userInfo: userInfo,
        user_id: userInfo.id
      })
      that.refresh()
    })
  },
  refresh: function (e) {
    var that = this
    app.util.request({
      'url': 'entry/wxapp/GetSponsor',
      'cachetime': '0',
      data: { user_id: that.data.userInfo.id },
      success: function (res) {
        console.log('这是获取主办方资料')
        console.log(res)
        if (res.data == false) {
          that.setData({
            name: '',
            phone: '',
            logo: '',
            info: '',
            sponsor: 2
          })
        } else {
          that.setData({
            name: res.data.name,
            phone: res.data.tel,
            logo: res.data.logo,
            info: res.data.details.replace("↵", "\n"),
            sponsor: 1,
            sponsor_id: res.data.id
          })
        }
      },
    })
    // 获取七牛云网址
    app.util.request({
      'url': 'entry/wxapp/url',
      'cachetime': '0',
      success: function (res) {
        console.log('这是网址')
        console.log(res)
        that.setData({
          url: res.data
        })
      },
    })
  },
  // 上传图片
  img_array: function (e) {
    var that = this
    that.setData({
      addmuban: true
    })
    var url = siteinfo.siteroot
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        wx.showToast({
          icon: "loading",
          title: "正在上传"
        })
        var imgsrc = res.tempFilePaths[0];
        url = url + '?i=' + that.data.userInfo.uniacid + '&c=entry&a=wxapp&do=Upload&m=zh_gjhdbm',
          wx.uploadFile({
            url: url,
            filePath: imgsrc,
            name: 'upfile',
            formData: null,
            success: (res) => {
              console.log(res)
              that.setData({
                logo: res.data
              })
            },
          });
      }
    })
  },
  code: function (e) {
    var that = this
    var code = e.detail.value
    that.setData({
      code: code
    })
  },
  formSubmit: function (e) {
    var that = this
    console.log(e)
    var user_id = that.data.user_id
    var name = e.detail.value.name
    var phone = e.detail.value.phone
    var info = e.detail.value.info
    var num = that.data.num
    var code = that.data.code
    var system = that.data.system
    info = info.replace("\n", "↵");
    var logo = that.data.logo
    console.log(user_id)
    console.log(name)
    console.log(phone)
    console.log(info)
    console.log(logo)
    var title = ''
    if (name == '') {
      title = '请输入名字'
    } else if (logo == '') {
      title = '请上传logo'
    } else if (phone == '') {
      title = '请输入手机号'
    } else if (info == '') {
      title = '请输入主办方简介'
    } else if (system.is_dxyz == 1) {
      if (num == 0) {
        title = '请进行短信验证'
      } else if (num != 0) {
        if (code != num) {
          title = '短信验证码错误'
        }
      }
    }
    if (title != '') {
      wx.showModal({
        title: '温馨提示',
        content: title,
      })
    } else {
      var sponsor = that.data.sponsor
      console.log(sponsor)
      var frequency = that.data.frequency
      if (frequency == 0) {

        that.setData({
          frequency: frequency + 1
        })
        if (sponsor == 2) {
          // 上传主办方资料
          app.util.request({
            'url': 'entry/wxapp/savesponsor',
            'cachetime': '0',
            data: {
              user_id: user_id,
              name: name,
              logo: logo,
              tel: phone,
              details: info
            },
            success: function (res) {
              console.log('这是上传主办方资料')
              console.log(res)
              if (that.data.status == 1) {
                wx.showToast({
                  title: '上传成功',
                  icon: 'success',
                  duration: 2000
                })
                setTimeout(function () {
                  wx.redirectTo({
                    url: '../fabu/fabu'
                  })
                }, 2000)
              } else {
                wx.showToast({
                  title: '上传成功',
                  icon: 'success',
                  duration: 2000
                })
                setTimeout(function () {
                  wx.navigateBack({
                    delta: 1
                  })
                }, 2000)
              }
            },
          })
        } else {
          // 上传主办方资料
          app.util.request({
            'url': 'entry/wxapp/savesponsor',
            'cachetime': '0',
            data: {
              id: that.data.sponsor_id,
              user_id: user_id,
              name: name,
              logo: logo,
              tel: phone,
              details: info
            },
            success: function (res) {
              console.log('这是修改主办方资料')
              console.log(res)
              if (res.data == 1) {

                wx.showToast({
                  title: '修改成功',
                  icon: 'success',
                  duration: 2000
                })
                setTimeout(function () {
                  wx.navigateBack({
                    delta: 1
                  })
                }, 2000)
              }
            },
          })
        }
      } else {
        setTimeout(function () {
          wx.navigateBack({
            delta: 1
          })
        }, 2000)
      }

    }
  },
  phone: function (e) {
    var that = this
    var phone = e.detail.value
    that.setData({
      phone: phone
    })
  },
  // 获取微信绑定的手机号
  getPhoneNumber: function (e) {
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
    var that = this
    console.log(app.session_key)
    app.util.request({
      'url': 'entry/wxapp/jiemi',
      'cachetime': '0',
      data: { sessionKey: app.session_key, iv: e.detail.iv, data: e.detail.encryptedData },
      success: function (res) {
        console.log('这是解密手机号')
        console.log(res)
        that.setData({
          phone: res.data.phoneNumber
        })
      },
    })
  },
  // 获取验证码
  sendmessg: function (e) {
    var that = this
    console.log(that.data)
    var phone = that.data.phone
    if (phone == '' || phone == null) {
      wx: wx.showToast({
        title: '请输入手机号',
        icon: '',
        image: '',
        duration: 2000,
        mask: true,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    } else {
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
        data: { code: Num, tel: phone },
        success: function (res) {
          console.log(res)
        },
      })
      that.setData({
        num: Num
      })
      var time = 60
      // 60秒倒计时
      var inter = setInterval(function () {
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
  // onShareAppMessage: function () {

  // }
})