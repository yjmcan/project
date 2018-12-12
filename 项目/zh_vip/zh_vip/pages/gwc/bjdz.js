var app = getApp();
Page({
  data: {
    name: "",
    mobile: "",
    detail: "",
    region: [],
  },
  onLoad: function (p) {
    console.log(p.bjid)
    if(p.bjid){
      //取帮助信息
      app.util.request({
        'url': 'entry/wxapp/MyAddressInfo',
        'cachetime': '0',
        data:{id:p.bjid},
        success: function (res) {
          console.log(res.data)
          that.setData({
            name: res.data.user_name,
            mobile: res.data.tel,
            detail: res.data.address,
            region: res.data.area,
          })
        }
      });
    }
    var that = this;
    var xtxx = wx.getStorageSync('xtxx')
    console.log(xtxx)
    this.setData({
      xtxx: xtxx,
      bjid:p.bjid,
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: xtxx.link_color,
    })
  },
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },
  // form_save: function (e) {
  //   console.log(e)
  //   var form_id = e.detail.formId
  //   app.util.request({
  //     'url': 'entry/wxapp/AddFormId',
  //     data: {
  //       user_id: wx.getStorageSync('UserData').id,
  //       form_id: form_id
  //     },
  //     success: res => {
  //       console.log(res)
  //     }
  //   })
  // },
  //获取经纬度
  dingwei: function (e) {
    console.log(e)
    var that = this
    wx.chooseLocation({
      success: function (res) {
        console.log(res);
        var index = res.address.indexOf('区')
        console.log(res.address.substring(index + 1)+res.name)
        that.setData({
          detail: res.address.substring(index + 1) + res.name
        })
      },
      fail: function () {
        wx.showModal({
          title: '提示',
          content: '您点击了拒绝位置授权，部分功能无法使用,点击确定重新获取授权。',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              wx.openSetting({
                success: (res) => {
                  if (res.authSetting["scope.userLocation"]) {////如果用户重新同意了授权登录
                    that.dingwei()
                  }
                },
                fail: function (res) {
                }
              })
            }
          }
        })
      }
    })
  },
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value);
    var user_id = wx.getStorageSync('UserData').id, dm = e.detail.value.name, sjh = e.detail.value.mobile, area = e.detail.value.picker.toString(), xxdz = e.detail.value.detail, bjid = this.data.bjid;
    console.log(user_id,dm,sjh,area,xxdz,bjid);
    var form_id = e.detail.formId
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
    var warn = "";
    var flag = true;
    if (dm == "") {
      warn = "请填写收货人！";
    } else if (sjh == "") {
      warn = "请填写手机号！";
    } else if (!(/^0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$/.test(sjh)) || sjh.length != 11) {
      warn = "手机号错误！";
    } else if (area == "") {
      warn = "请选择所在地区！";
    } else if (xxdz=='') {
      warn = "请填写详细地址！";
    } else {
      flag = false;
      wx.showLoading({
        title: '保存中...',
        mask: true
      })
      if(bjid==null){
        app.util.request({
          'url': 'entry/wxapp/AddAddress',
          'cachetime': '0',
          data: {
            address: xxdz, area: area, user_name: dm, user_id: user_id, tel: sjh
          },
          success: function (res) {
            console.log(res.data)
            if (res.data == '1') {
              wx.showToast({
                title: '保存成功',
                duration: 1000
              })
              setTimeout(function () {
                wx.navigateBack({
                  delta: 1
                })
              }, 1000)
            }
          }
        })
      }
      else{
        app.util.request({
          'url': 'entry/wxapp/UpdAddress',
          'cachetime': '0',
          data: {
            address: xxdz, area: area, user_name: dm, id: bjid, tel: sjh
          },
          success: function (res) {
            console.log(res.data)
            if (res.data == '1') {
              wx.showToast({
                title: '保存成功',
                duration: 1000
              })
              setTimeout(function () {
                wx.navigateBack({
                  delta: 1
                })
              }, 1000)
            }
          }
        })
      }
    }
    if (flag == true) {
      wx.showModal({
        title: '提示',
        content: warn
      })
    }
  },
  onReady: function () { },
  onShow: function () { }
});