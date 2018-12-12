// zh_hyk/pages/my/myinfo.js
var app = getApp();
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: "2016-09-01",
  },
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  dw: function () {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        console.log(res)
        that.setData({
          weizhi: res.address,
          jwd: res.latitude + ',' + res.longitude
        })
      },
      fail: function () {
        wx.showModal({
          title: '警告',
          content: '您点击了拒绝地理位置授权,无法正常使用功能，点击确定重新获取授权。',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              wx.openSetting({
                success: (res) => {
                  if (res.authSetting["scope.userLocation"]) {////如果用户重新同意了授权登录
                    that.dw();
                  } else {
                    that.dw();
                  }
                },
                fail: function (res) {
                }
              })
            }
          }
        })
      },
    })
  },
  formSubmit: function (e) {
    var that = this;
    var uid = wx.getStorageSync('UserData').id;
    console.log(uid)
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    // var yzm = this.data.yzm;
    // console.log('随机生成的验证码', yzm)
    var xm = e.detail.value.xm, sjh = e.detail.value.sjh, sr = e.detail.value.sr, yx = e.detail.value.yx, xl= e.detail.value.xl, hy= e.detail.value.hy, ah= e.detail.value.ah, xxdz = e.detail.value.xxdz;
    console.log(xm, sjh, sr, yx, xl, hy, ah, xxdz)
    var form_id = e.detail.formId
    console.log(wx.getStorageSync('UserData').id)
    app.util.request({
      'url': 'entry/wxapp/AddFormId',
      data: {
        user_id: wx.getStorageSync('UserData').id,
        form_id: form_id
      },
      success: res => {
        console.log(res)
      }
    })
    var warn = "";//弹框时提示的内容
    var flag = true;//判断信息输入是否完整
    if (xm == "") {
      warn = "请填写姓名！";
      }
    // } else if (sjh == "") {
    //   warn = "请填写手机号！";
    // } else if (!(/^0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$/.test(sjh)) || sjh.length != 11) {
    //   warn = "手机号错误！";
    // } else if (yanzm == "" && that.data.isdx) {
    //   warn = "请填写您收到的验证码！";
    // } else if (yanzm != yzm && that.data.isdx) {
    //   warn = "验证码不正确！";
    // }
      else if (yx=='') {
       warn = "请填写邮箱";
    } else if (xl == '') {
      warn = "请填写学历";
    } else if (hy == '') {
      warn = "请填写行业";
    } else if (ah == '') {
      warn = "请填写爱好";
    } else if (xxdz == '') {
      warn = "请填写详细地址";
    } else {
      flag = false;
      var that = this;
      //zc
      var pages = getCurrentPages();
      console.log(pages)
      app.util.request({
        'url': 'entry/wxapp/UpdUser',
        'cachetime': '0',
        data: { user_id: uid, name: xm, tel: sjh, birthday: sr, address: xxdz, email: yx, education: xl, industry: hy, hobby:ah },
        success: function (res) {
          console.log(res.data)
          if (res.data == 1) {
            wx.showToast({
              title: '保存成功',
            })
            setTimeout(function () {
              wx.navigateBack({
              })
            }, 1000)
          }
          else if (res.data == 2) {
            wx.showToast({
              title: '没有任何修改',
              icon: 'loading',
              duration: 1000
            })
          }
          else{
            wx.showToast({
              title: '网络出问题了',
              icon: 'loading',
              duration: 1000
            })
          }
        }
      });
    }
    if (flag == true) {
      wx.showModal({
        title: '提示',
        content: warn
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var start = util.formatTime(new Date).substring(0, 10).replace(/\//g, "-");
    console.log(start.toString())
    this.setData({
      start: start,
    });
    var uid = wx.getStorageSync('UserData').id
    console.log(uid)
    var that = this;
    //UserInfo
    app.util.request({
      'url': 'entry/wxapp/UserInfo',
      'cachetime': '0',
      data: { user_id: uid },
      success: function (res) {
        console.log('用户信息', res.data)
        that.setData({
          userInfo: res.data,
          date: res.data.birthday,
          weizhi: res.data.address,
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
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  }
})