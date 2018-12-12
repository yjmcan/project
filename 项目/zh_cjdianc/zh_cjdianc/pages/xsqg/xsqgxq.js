// zh_tcwq/pages/store/timeLi.js
var app=getApp();
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },
  opennav: function () {
    this.setData({
      opendh: !this.data.opendh
    })
  },
  bought: function () {
    wx.navigateTo({
      url: 'yqgyh?goodid=' + this.data.QgGoodInfo.id,
    })
  },
  tzsj: function () {
    wx.redirectTo({
      url: '../seller/index?sjid=' + this.data.StoreInfo.store.id,
    })
  },
  order: function () {
    wx.navigateTo({
      url: 'order',
    })
  },
  addformSubmit: function (e) {
    console.log('formid', e.detail.formId)
    var user_id = wx.getStorageSync('users').id;
    app.util.request({
      'url': 'entry/wxapp/AddFormId',
      'cachetime': '0',
      data: { user_id: user_id, form_id: e.detail.formId },
      success: function (res) {
        console.log(res.data)
      },
    })
  },
  ljqg: function () {
    var that = this, userinfo = this.data.userinfo, store_id = this.data.QgGoodInfo.store_id, goodid = this.data.QgGoodInfo.id;
    console.log(userinfo)
    if (userinfo.img == '' || userinfo.name == '') {
      wx.navigateTo({
        url: '../smdc/getdl',
      })
    }
    else {
      if (this.data.QgGoodInfo.type == '1') {
        wx.redirectTo({
          url: 'qgform?storeid=' + store_id + '&goodid=' + goodid,
        })
      }
      if (this.data.QgGoodInfo.type == '2') {
        wx.showLoading({
          title: "正在加载",
          mask: !0
        }),app.util.request({
          'url': 'entry/wxapp/DelCar',
          'cachetime': '0',
          data: {
            user_id: userinfo.id, store_id: store_id,
          },
          success: function (res) {
            console.log(res.data)
            var QgGoodInfo = that.data.QgGoodInfo
            console.log(QgGoodInfo)
            wx.showLoading({
              title: "正在加载",
              mask: !0
            }), app.util.request({
              'url': 'entry/wxapp/QgAddCar',
              'cachetime': '0',
              data: {
                money: QgGoodInfo.money, good_id: goodid, store_id: store_id, user_id: userinfo.id, num: 1, spec: '', combination_id: '', box_money: 0, is_qg: 1, qg_name: QgGoodInfo.name, qg_logo: QgGoodInfo.logo,
              },
              success: function (res) {
                console.log(res)
                if (res.data == '1') {
                  wx.redirectTo({
                    url: '/zh_cjdianc/pages/takeout/takeoutindex?storeid=' + store_id + '&qgjl=1',
                  })
                }
                else if (res.data == '超出库存!') {
                  wx.showModal({
                    title: '提示',
                    content: '库存不足',
                  })
                }
                else if (res.data == '超出购买限制!') {
                  wx.showModal({
                    title: '提示',
                    content: '超出购买限制!',
                  })
                }
              }
            })
          },
        })
      }
    }
  },
  maketel: function (t) {
    var a = this.data.StoreInfo.store.tel;
    wx.makePhoneCall({
      phoneNumber: a,
    })
  },
  location: function () {
    var jwd = this.data.StoreInfo.store.coordinates.split(','), t = this.data.StoreInfo.store;
    console.log(jwd)
    wx.openLocation({
      latitude: parseFloat(jwd[0]),
      longitude: parseFloat(jwd[1]),
      address: t.address,
      name: t.name
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.setNavigationBarColor(this);
    var that = this
    app.getUserInfo(function (userinfo) {
      console.log(userinfo)
      that.setData({
        userinfo: userinfo,
      })
      app.util.request({
        'url': 'entry/wxapp/IsPay',
        'cachetime': '0',
        data: { user_id: userinfo.id, good_id: options.id },
        success: function (res) {
          console.log(res)
          that.setData({
            IsPay: res.data,
          })
        },
      })
    })
    app.util.request({
      'url': 'entry/wxapp/Url',
      'cachetime': '0',
      success: function (res) {
        console.log(res.data)
        that.setData({
          url: res.data,
          xtxx: getApp().xtxx
        })
      },
    })
    app.util.request({
      'url': 'entry/wxapp/QgPeople',
      'cachetime': '0',
      data: { good_id: options.id },
      success: function (res) {
        console.log(res.data)
        that.setData({
          QgPeople: res.data
        })
      },
    })
    app.util.request({
      'url': 'entry/wxapp/QgGoodInfo',
      'cachetime': '0',
      data:{id:options.id},
      success: function (res) {
        console.log(res)
        wx.setNavigationBarTitle({
          title: res.data.money+'元抢购'+res.data.name,
        })
        res.data.yqnum = (((Number(res.data.number) - Number(res.data.surplus)) / Number(res.data.number) * 100)).toFixed(1)
        res.data.img = res.data.img.split(",");
        var time1 = new Date(res.data.end_time).getTime();
        countdown(res.data.end_time)
        res.data.start_time = util.ormatDate(res.data.start_time)
        res.data.end_time = util.ormatDate(res.data.end_time)
        that.setData({
          QgGoodInfo: res.data,
        })
        app.util.request({
          'url': 'entry/wxapp/StoreInfo',
          'cachetime': '0',
          data: {
            store_id: res.data.store_id
          },
          success: (res) => {
            console.log('商家详情',res)
            that.setData({
              StoreInfo: res.data,
            })
          },
        })
      },
    })
    function countdown(time) {
      var EndTime = time || [];
      var NowTime = Math.round(new Date().getTime() / 1000);
      var total_micro_second = EndTime - NowTime || [];
      that.setData({
        clock: dateformat(total_micro_second)
      });
      if (total_micro_second <= 0) {
        that.setData({
          clock: false
        });
      } else if (total_micro_second > 0) {
        setTimeout(function () {
          total_micro_second -= 1000;
          countdown(time);
        }, 1000)
      }

    }

    // 时间格式化输出，如11:03 25:19 每1s都会调用一次
    function dateformat(micro_second) {
      // 总秒数
      var second = Math.floor(micro_second);
      // 天数
      var day = Math.floor(second / 3600 / 24);
      // 小时
      var hr = Math.floor(second / 3600 % 24);
      // 分钟
      var min = Math.floor(second / 60 % 60);
      // 秒
      var sec = Math.floor(second % 60);
      if (day < 10) {
        day = '0' + day
      }
      if (hr < 10) {
        hr = '0' + hr
      }
      if (sec < 10) {
        sec = '0' + sec
      }
      if (min < 10) {
        min = '0' + min
      }
      var time = {
        day: day,
        hr: hr,
        min: min,
        sec: sec
      }
      return time
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
    var that = this, userinfo = this.data.userinfo, QgGoodInfo = this.data.QgGoodInfo, fx_title = userinfo.name + '邀请你' + QgGoodInfo.money + '元抢购' + QgGoodInfo.name;
    console.log(userinfo)
    return {
      title: fx_title,
      path: '/zh_cjdianc/pages/xsqg/xsqgxq?id=' + QgGoodInfo.id,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})