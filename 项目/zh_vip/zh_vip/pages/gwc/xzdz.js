var app = getApp();
Page({
  data: {
    address_list: null
  },
  onLoad: function (e) {
  },
  onReady: function () { },
  onShow: function () {
    wx.showNavigationBarLoading();
    var that = this;
    var xtxx = wx.getStorageSync('xtxx')
    var url = getApp().imgurl;
    console.log(xtxx)
    this.setData({
      xtxx: xtxx,
      url: url,
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: xtxx.link_color,
    })
    var user_id = wx.getStorageSync('UserData').id;
    app.util.request({
      'url': 'entry/wxapp/MyAddress',
      'cachetime': '0',
      data: { user_id: user_id },
      success: function (res) {
        console.log(res)
        for(let i=0;i<res.data.length;i++){
          res.data[i].address = res.data[i].area.join('') + res.data[i].address
        }
        console.log(res)
          that.setData({
            address_list:res.data,
          })
      }
    });  
  },
  form_save: function (e) {
    console.log(e)
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
  },
  bianji: function (e) {
    var bjid = e.currentTarget.dataset.bjid;
    console.log(bjid)
    wx.navigateTo({
      url: 'bjdz?bjid=' + bjid,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  shanchu: function (e) {
    console.log(e.currentTarget.dataset.scid)
    var scid = e.currentTarget.dataset.scid;
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定要删除该地址吗？',
      confirmText: "确定",
      cancelText: "取消",
      success: function (res) {
        console.log(res);
        if (res.confirm) {
          app.util.request({
            'url': 'entry/wxapp/DelAdd',
            'cachetime': '0',
            data: { id: scid },
            header: { 'content-type': 'application/json' },
            success: function (res) {
              console.log(res)
              if (res.data == '1') {
              that.onShow()
              wx.showToast({
                title: '删除成功',
                icon: 'success'
              })
              }
            }
          })
          console.log('用户点击确定')
        } else {
          console.log('用户点击取消')
        }
      }
    });
  },
  radioChange: function (e) {
    var uid = wx.getStorageSync('mydata').id,that = this;
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    var checkedradio = e.detail.value;
    app.util.request({
      'url': 'entry/wxapp/AddDefault',
      'cachetime': '0',
      data: { id: checkedradio},
      success: function (res) {
        console.log(res)
        if(res.data=='1'){
          that.onShow()
          wx.showToast({
            title: '修改成功',
            icon: 'success',
            duration: 1000
          })
          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
          }, 1000)
        }
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  // pickAddress: function (e) {
  //   var a = this,
  //     s = e.currentTarget.dataset.index,
  //     t = a.data.address_list[s];
  //   wx.setStorageSync("picker_address", t),
  //     wx.navigateBack()
  // },
  getWechatAddress: function (s) {
    var user_id = wx.getStorageSync('UserData').id, that = this;
    wx.chooseAddress({
      success: function (s) {
        console.log(s)
        "chooseAddress:ok" == s.errMsg && (wx.showLoading(),
         app.util.request({
          'url': 'entry/wxapp/AddAddress',
          'cachetime': '0',
          data: {
            address: s.detailInfo, area: s.provinceName + ',' + s.cityName + ','+ s.countyName, user_name: s.userName, user_id: user_id, tel: s.telNumber
          },
          success: function (res) {
            console.log(res.data)
            if (res.data == '1') {
              wx.showToast({
                title: '保存成功',
                duration: 1000
              })
              that.onShow()
            }
          }
        })
        )
      },
      fail: function () {
        wx.getSetting({
          success: (res) => {
            console.log(res)
            if (res.authSetting["scope.address"]) {////如果用户重新同意了授权登录
              console.log('取消')
            }
            else {
              wx.showModal({
                title: '提示',
                content: '您拒绝了获取收货地址授权，部分功能无法使用,点击确定重新获取授权。',
                showCancel: false,
                success: function (res) {
                  if (res.confirm) {
                    wx.openSetting({
                      success: (res) => {
                        if (res.authSetting["scope.address"]) {////如果用户重新同意了授权登录
                          that.getWechatAddress()
                        }
                      },
                      fail: function (res) {
                      }
                    })
                  }
                }
              })
            }
          }
        })
      }
    })
  }
});