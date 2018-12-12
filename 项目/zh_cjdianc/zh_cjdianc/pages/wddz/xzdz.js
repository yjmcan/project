var app = getApp();
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var qqmapsdk;
Page({
  data: {
    address_list: null
  },
  onLoad: function (e) {
    app.setNavigationBarColor(this);
    var that = this;
    app.util.request({
      'url': 'entry/wxapp/System',
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        that.setData({
          System: res.data,
        })
        // 实例化API核心类
        qqmapsdk = new QQMapWX({
          key: res.data.map_key
        });
      }
    })
  },
  onReady: function () { },
  onShow: function () {
    wx.showNavigationBarLoading();
    var that=this, user_id = wx.getStorageSync('users').id;
    app.util.request({
      'url': 'entry/wxapp/MyAddress',
      'cachetime': '0',
      data: { user_id: user_id },
      success: function (res) {
        console.log(res)
        for (let i = 0; i < res.data.length; i++) {
          res.data[i].address = res.data[i].area.join('') + res.data[i].address
        }
        that.setData({
          address_list: res.data,
        })
        // if (res.data.length == 1 && res.data[0].is_default == '1') {
        //   var pages = getCurrentPages();
        //   console.log(pages)
        //   if (pages.length > 1 && pages[pages.length - 2].route == 'zh_cjdianc/pages/takeout/takeoutform') {

        //     var prePage = pages[pages.length - 2];

        //     prePage.countpsf()
        //   }
        //   setTimeout(function () {
        //     wx.navigateBack({
        //       delta: 1
        //     })
        //   }, 1000)
        // }
      }
    });
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
    var uid = wx.getStorageSync('mydata').id, that = this;
    console.log('radio发生change事件，携带value值为：', e.currentTarget.dataset.id)
    var checkedradio = e.currentTarget.dataset.id;
    app.util.request({
      'url': 'entry/wxapp/AddDefault',
      'cachetime': '0',
      data: { id: checkedradio },
      success: function (res) {
        console.log(res)
        if (res.data == '1') {
          that.onShow()
          wx.showToast({
            title: '修改成功',
            icon: 'success',
            duration: 1000
          })
          var pages = getCurrentPages();
          console.log(pages)
          if (pages.length > 1 && pages[pages.length - 2].route =='zh_cjdianc/pages/takeout/takeoutform') {

            var prePage = pages[pages.length - 2];

            prePage.countpsf()
          }
          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
          }, 1000)
        }
        if (res.data == '2') {
          var pages = getCurrentPages();
          console.log(pages)
          if (pages.length > 1 && pages[pages.length - 2].route == 'zh_cjdianc/pages/takeout/takeoutform') {

            var prePage = pages[pages.length - 2];

            prePage.countpsf()
          }
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
    var user_id = wx.getStorageSync('users').id, that = this;
    wx.chooseAddress({
      success: function (s) {
        console.log(s)
        // var shdz = s.provinceName + s.cityName + s.countyName + s.detailInfo;
        // console.log(shdz)
        "chooseAddress:ok" == s.errMsg && (wx.showLoading(),
          qqmapsdk.geocoder({
          address: s.provinceName + s.cityName + s.countyName + s.detailInfo,
            success: function (res) {
              console.log(res);
              if (res.status == '0') {
                var lat = res.result.location.lat, lng = res.result.location.lng;
                app.util.request({
                  'url': 'entry/wxapp/AddAddress',
                  'cachetime': '0',
                  data: {
                    address: s.detailInfo, area: s.provinceName + ',' + s.cityName + ',' + s.countyName, user_name: s.userName, user_id: user_id, tel: s.telNumber,lat:lat,lng:lng,
                  },
                  success: function (res) {
                    console.log(res.data)
                    if (res.data == '1') {
                      wx.showToast({
                        title: '保存成功',
                        duration: 1000
                      })
                      var pages = getCurrentPages();
                      console.log(pages)
                      if (pages.length > 1 && pages[pages.length - 2].route == 'zh_cjdianc/pages/takeout/takeoutform') {

                        var prePage = pages[pages.length - 2];

                        prePage.countpsf()
                      }
                      setTimeout(function () {
                        wx.navigateBack({
                          delta: 1
                        })
                      }, 1000)
                      that.onShow()
                    }
                  }
                })
              }
            },
            fail: function (res) {
              console.log(res);
            },
            complete: function (res) {
              console.log(res);
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