var app = getApp();
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var qqmapsdk;
Page({
  data: {
    name: "",
    mobile: "",
    detail: "",
    region: [],
    items: [{ name: '先生', value: 1, checked: true }, { name: '女士', value: 2}]
  },
  onLoad: function (p) {
    app.setNavigationBarColor(this);
    console.log(p.bjid)
    var that = this;
    app.util.request({
      'url': 'entry/wxapp/System',
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        that.setData({
          System: res.data,
          bjid: p.bjid,
        })
        // 实例化API核心类
        qqmapsdk = new QQMapWX({
          key: res.data.map_key
        });
        if (p.bjid) {
          //取帮助信息
          app.util.request({
            'url': 'entry/wxapp/MyAddressInfo',
            'cachetime': '0',
            data: { id: p.bjid },
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
        else {
          wx.getLocation({
            type: 'wgs84',
            success: function (res) {
              console.log(res)
              // 调用接口
              qqmapsdk.reverseGeocoder({
                coord_type: 1,
                location: {
                  latitude: res.latitude,
                  longitude: res.longitude
                },
                success: function (res) {
                  console.log(res);
                  that.setData({
                    detail: res.result.formatted_addresses.recommend,
                    region: [res.result.address_component.province, res.result.address_component.city, res.result.address_component.district]
                  })
                },
                fail: function (res) {
                  console.log(res);
                },
                complete: function (res) {
                  console.log(res);
                }
              });
            },
          })
        }
      }
    });
  },
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },
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
          }
        })
      }
    })
  },
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value);
    var user_id = wx.getStorageSync('users').id, dm = e.detail.value.name, sex = e.detail.value.radiogroup, sjh = e.detail.value.mobile, area = this.data.region.toString(), xxdz = e.detail.value.detail, bjid = this.data.bjid;
    var shdz = this.data.region.join('')+xxdz;
    console.log(user_id,dm,sjh,area,xxdz,bjid,shdz);
    var warn = "";
    var flag = true;
    if (dm == "") {
      warn = "请填写收货人！";
    } else if (sjh == "") {
      warn = "请填写手机号！";
    } else if (sjh.length < 7) {
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
      qqmapsdk.geocoder({
        address: shdz,
        success: function (res) {
          console.log(res);
          if (res.status=='0'){
            var lat = res.result.location.lat, lng = res.result.location.lng;
            if (bjid == null) {
              app.util.request({
                'url': 'entry/wxapp/AddAddress',
                'cachetime': '0',
                data: {
                  address: xxdz, area: area, user_name: dm, user_id: user_id, tel: sjh, sex: sex,lat:lat,lng:lng
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
                    if (pages.length > 1 && pages[pages.length - 3].route == 'zh_cjdianc/pages/takeout/takeoutform') {

                      var prePage = pages[pages.length - 3];

                      prePage.countpsf()
                    }
                    setTimeout(function () {
                      wx.navigateBack({
                        delta: 1
                      })
                    }, 1000)
                  }
                }
              })
            }
            else {
              app.util.request({
                'url': 'entry/wxapp/UpdAddress',
                'cachetime': '0',
                data: {
                  address: xxdz, area: area, user_name: dm, id: bjid, tel: sjh, sex: sex, lat: lat, lng: lng
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
          else{
            wx.showModal({
              title: '提示',
              content: '网络错误！',
            })
          }
        },
        fail: function (res) {
          console.log(res);
        },
        complete: function (res) {
          console.log(res);
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
  onReady: function () { },
  onShow: function () { }
});