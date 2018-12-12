// pages/index/info.js
const app = getApp()
var siteinfo = require('../../../siteinfo.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    index: 0,
    getmsg: "获取验证码",
    ac_index: 0,
    succ: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.setNavigationBarColor(this);
    var that = this
    var user_id = wx.getStorageSync('users').id
    that.setData({
      state: options.state
    })
    console.log(options)
    
    // if (options.state != 3) {
      app.util.request({
        'url': 'entry/wxapp/CheckRz',
        'cachetime': '0',
        data: { user_id: user_id },
        success: function (res) {
          console.log(res.data)
          if (res.data == false) {
            var url = wx.getStorageSync('imglink')
            that.setData({
              id: '',
              url: url,
            })
            that.rz_time()
          } else {
            that.setData({
              name: res.data.name,
              details: app.convertHtmlToText(res.data.details),
              link_name: res.data.link_name,
              link_tel: res.data.link_tel,
              address: res.data.address,
              latitude: res.data.coordinates,
              phone: res.data.link_tel,
              upload_one: res.data.logo,
              upload_two: res.data.zm_img,
              upload_three: res.data.fm_img,
              upload_four: res.data.yyzz,
              bdupload_one: res.data.logo,
              bdupload_two: res.data.zm_img,
              bdupload_three: res.data.fm_img,
              bdupload_four: res.data.yyzz,
              id: res.data.id,
              day: res.data.rz_time,
              url: '',
            })
            that.rz_time()
          }
        },
      })
    // }else{
    //   that.setData({
    //     id:'',
    //     url: '',
    //   })
    //   that.rz_time()
    // }
    that.setData({
      form_id: options.form_id
    })
    app.util.request({
      'url': 'entry/wxapp/system',
      'cachetime': '0',
      success: function (res) {
        that.setData({
          system: res.data
        })
      },
    })
    
    app.util.request({
      'url': 'entry/wxapp/CheckSms',
      'cachetime': '0',
      success: function (res) {
        that.setData({
          CheckSms: res.data
        })
      },
    })
    app.util.request({
      'url': 'entry/wxapp/ad',
      'cachetime': '0',
      // data:{type:5},
      success: function (res) {
        console.log(res)
        var arr = res.data
        var array = []
        for (let i in arr) {
          if (arr[i].type == '5') {
            array.push(arr[i])
          }
        }
        that.setData({
          ad: array,
        })
      },
    })
  },
  rz_time:function(e){
    var a = this.data
    var that = this
    app.util.request({
      'url': 'entry/wxapp/GetRzqx',
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        var arr = res.data
        if (arr.length > 0) {
          that.setData({
            array: true,
            arr: arr
          })
          if (a.day != null) {
            for(let i in arr){
              if (arr[i].days==a.day){
                that.setData({
                  ac_index:i
                })
              }
            }
          } else {

          }
        } else {
          that.setData({
            array: false,
          })
        }
      },
    })
  },
  selse_succ: function (e) {
    var succ = this.data.succ
    if (succ == true) {
      this.setData({
        succ: false
      })
    } else {
      this.setData({
        succ: true
      })
    }
  },
  code: function (e) {
    console.log(e)
    this.setData({
      phone: e.detail.value
    })
  },
  // 验证码
  sendmessg: function (e) {
    var that = this
    console.log(that.data)
    var phone = that.data.phone
    if (phone == '' || phone == null) {
      wx.showModal({
        title: '',
        content: '请输入手机号',
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
        'url': 'entry/wxapp/sms2',
        'cachetime': '0',
        data: { code: Num, tel: phone },
        success: function (res) {
          console.log(res)
        },
      })
      that.setData({
        num: Num
      })
      var time = 59
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
          })
        }
      }, 1000)
    }

  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  // 上传图片
  choose: function (e) {
    var that = this
    // 判断用户点击的是哪一个上传图片
    var type = e.currentTarget.dataset.type
    var url = wx.getStorageSync('imglink')
    // 第一个上传图片
    var upload_one = ''
    // 第二个上传图片
    var upload_two = ''
    // 第三个上传图片
    var upload_three = ''
    // 第四个上传图片
    var upload_four = ''
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        console.log(res)
        var tempFilePaths = res.tempFilePaths[0]
        wx.uploadFile({
          url: siteinfo.siteroot + '?i=' + siteinfo.uniacid + '&c=entry&a=wxapp&do=upload&m=zh_cjdianc',
          filePath: tempFilePaths,
          name: 'upfile',
          formData: {},
          success: function (res) {
            console.log('这是上传成功')
            console.log(res)
            if (type == 1) {
              that.setData({
                bdupload_one: tempFilePaths,
                upload_one: res.data
              })
            } else if (type == 2) {
              that.setData({
                bdupload_two: tempFilePaths,
                upload_two: res.data
              })
            } else if (type == 3) {
              that.setData({
                bdupload_three: tempFilePaths,
                upload_three: res.data
              })
            } else if (type == 4) {
              that.setData({
                bdupload_four: tempFilePaths,
                upload_four: res.data
              })
            }
          },
          fail: function (res) {
            console.log('这是上传失败')
            console.log(res)
          },
        })
      }
    })
  },
  // 选择入驻期限
  sele_arr: function (e) {
    var that = this
    var arr = that.data.arr
    var index = e.currentTarget.dataset.index
    if (that.data.state == 3 || that.data.state == 4) {
      wx.showModal({
        title: '',
        content: '入驻期限不可以修改',
      })
    } else {
      that.setData({
        ac_index: index
      })
    }
  },
  // 选择商户地址
  choose_address: function (e) {
    var that = this
    wx.chooseLocation({
      success: res => {
        console.log(res)
        var latitude = res.latitude + ',' + res.longitude
        console.log(latitude)
        that.setData({
          address: res.address,
          latitude: latitude
        })
      }
    })
  },
  xieyi: function (e) {
    wx.navigateTo({
      url: 'xieyi',
    })
  },
  formSubmit: function (e) {
    var a = this.data
    var b = e.detail.value
    // 商户名字
    var name = b.name_title
    // 商户简介
    var name_prompt = b.name_prompt
    // 商户联系人姓名
    var name_wor = b.name_wor
    // 商户联系人电话
    var name_tel = b.name_tel
    var code = b.code
    var num = a.num
    // 入驻期限
    var arr = a.arr
    var succ = a.succ
    var ac_index = a.ac_index
    var array = a.array
    var system = a.system
    var id = a.id
    if (id == '') {
      console.log('这是新建')
      if (array == true) {
        var day = arr[ac_index].days
        var money = arr[ac_index].money
      }
      // if (system.md_sf == 1) {
      //   if (array == true) {
      //     var day = arr[ac_index].days
      //     var money = arr[ac_index].money
      //   }
      // } else {
      //   var money = 0
      //   var day = 365
      // }
    } else {
      console.log('这是修改')
      var day = a.day
    }
    // 商户地址
    var address = a.address
    var upload_one = a.upload_one
    var upload_two = a.upload_two
    var upload_three = a.upload_three
    var upload_four = a.upload_four
    var latitude = a.latitude
    var form_id = a.form_id
    var CheckSms = a.CheckSms
    var form_id_1 = e.detail.formId
    console.log(form_id)
    console.log(form_id_1)
    var user_id = wx.getStorageSync('users').id
    app.util.request({
      'url': 'entry/wxapp/AddFormId',
      'cachetime': '0',
      data: { user_id: user_id, form_id: e.detail.formId },
      success: function (res) {
        console.log(res.data)
      },
    })
    var openid = wx.getStorageSync('users').openid
    var title = ''
    if (name == '') {
      title = "请输入商户名称"
    } else if (address == null) {
      title = '请选择商户地址'
    } else if (name_prompt == '') {
      title = '请输入商户简介'
    } else if (name_wor == '') {
      title = '请输入联系人姓名'
    } else if (name_tel == '') {
      title = '请输入联系人电话'
    } else if (upload_one == null) {
      title = '请上传商户logo'
    } else if (upload_two == null) {
      title = '请上传身份证正面照片'
    } else if (upload_three == null) {
      title = '请上传身份证反面照片'
    } else if (upload_four == null) {
      title = '请上传营业执照'
    } else if (num != code && CheckSms==1 ) {
      title = '验证码输入错误'
    } else if (succ == false) {
      title = "请先阅读并同意入驻申请协议"
    } else if (array == false) {
      title = "请选择入驻期限"
    }
    if (app.title(title) == true) {
      app.util.request({
        'url': 'entry/wxapp/SaveRzsq',
        'cachetime': '0',
        data: {
          id: id,
          name: name,
          user_id: user_id,
          address: address,
          details: name_prompt,
          rz_time: day,
          yyzz: upload_four,
          fm_img: upload_three,
          zm_img: upload_two,
          logo: upload_one,
          link_name: name_wor,
          link_tel: name_tel,
          coordinates: latitude,
          money: money,
        },
        success: function (res) {
          console.log(res)
          var rz_id = res.data
          if (id == '') {
            if (Number(money) > 0) {
              app.util.request({
                'url': 'entry/wxapp/RzPay',
                'cachetime': '0',
                data: { openid: openid, money: money, rz_id: rz_id },
                success: function (res) {
                  wx.requestPayment({
                    'timeStamp': res.data.timeStamp,
                    'nonceStr': res.data.nonceStr,
                    'package': res.data.package,
                    'signType': res.data.signType,
                    'paySign': res.data.paySign,
                    'success': function (res) {
                      console.log('支付成功')
                      console.log(res)
                      wx.showToast({
                        title: '申请已提交',
                      })
                      app.util.request({
                        'url': 'entry/wxapp/RzMessage',
                        'cachetime': '0',
                        data: {
                          form_id: form_id,
                          openid: openid,
                          sh_id: rz_id,
                        },
                        success: function (res) {
                          console.log('发送模板消息')
                          console.log(res)
                        },
                      })
                      setTimeout(function () {
                        wx.navigateBack({
                          delta: 2
                        })
                      }, 1500)
                    },

                    'fail': function (res) {
                      console.log('支付失败')
                      wx.showToast({
                        title: '支付失败',
                      })
                      setTimeout(function () {
                        wx.navigateBack({
                          delta: 2
                        })
                      }, 1500)
                    },
                  })
                },
              })
            } else {
              app.util.request({
                'url': 'entry/wxapp/RzMessage',
                'cachetime': '0',
                data: {
                  form_id: form_id,
                  openid: openid,
                  sh_id: rz_id,
                },
                success: function (res) {
                  console.log('发送模板消息')
                  console.log(res)
                },
              })
              wx.showToast({
                title: '申请已提交',
              })
              setTimeout(function () {
                wx.navigateBack({
                  delta: 2
                })
              }, 1500)
            }
          } else {
            wx.showToast({
              title: '申请已提交',
            })
            setTimeout(function () {
              wx.navigateBack({
                delta: 2
              })
            }, 1500)
            app.util.request({
              'url': 'entry/wxapp/RzMessage',
              'cachetime': '0',
              data: {
                form_id: form_id,
                openid: openid,
                sh_id: a.id,
              },
              success: function (res) {
                console.log('发送模板消息')
                console.log(res)
              },
            })
          }
        },
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