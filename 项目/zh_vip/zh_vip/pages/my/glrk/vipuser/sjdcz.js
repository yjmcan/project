// zh_vip/pages/vipseller/recharge.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    countries: ["现金收款", "微信收款", "支付宝收款", "刷卡收款"],
    countryIndex: 0,
    disabled: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var that = this;
    var sjdsjid = wx.getStorageSync('sjdsjid')
    console.log(sjdsjid)
    // app.util.request({
    //   'url': 'entry/wxapp/system',
    //   'cachetime': '0',
    //   success: function (res) {
    //     console.log(res)
    //     that.setData({
    //       xtxx: res.data,
    //       url: url,
    //     })
    //     wx.setNavigationBarColor({
    //       frontColor: '#ffffff',
    //       backgroundColor: res.data.link_color,
    //     })
    //     wx.setNavigationBarTitle({
    //       title: res.data.link_name,
    //     })
    //     if (res.data.is_yue == '1') {
    //       that.setData({
    //         kqyue: true
    //       })
    //     }
    //     else {
    //       that.setData({
    //         kqyue: false
    //       })
    //     }
    //   },
    // })
    //UserInfo
    app.util.request({
      'url': 'entry/wxapp/UserInfo',
      'cachetime': '0',
      data: { user_id: options.uid },
      success: function (res) {
        console.log('用户信息', res.data)
        that.setData({
          userInfo: res.data,
          discount: res.data.discount,
        })
      }
    });
    //Store 
    app.util.request({
      'url': 'entry/wxapp/StoreInfo',
      'cachetime': '0',
      data: { id: sjdsjid },
      success: function (res) {
        console.log('门店信息', res.data)
        that.setData({
          mdinfo: res.data,
        })
        wx.setNavigationBarTitle({
          title:  res.data.name+'充值',
        })
      }
    });
    // czhd
    app.util.request({
      'url': 'entry/wxapp/Czhd',
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        that.setData({
          czhd: res.data
        })
      }
    })
  },
  jsmj: function (num, arr) {
    var index;
    for (let i = 0; i < arr.length; i++) {
      if (Number(num) >= Number(arr[i].full)) {
        index = i;
        break;
      }
    }
    return index
  },
  bindInput: function (e) {
    console.log(e.detail.value)
    this.setData({
      czje: e.detail.value
    })
    if (e.detail.value != '') {
      this.setData({
        disabled: false,
      })
    }
    else {
      this.setData({
        disabled: true,
      })
    }
  },
  bindCountryChange: function (e) {
    console.log('picker country 发生选择改变，携带值为', e.detail.value);

    this.setData({
      countryIndex: e.detail.value
    })
  },
  formSubmit: function (e) {
    var that=this;
    console.log('form发生了submit事件，携带数据为：', e.detail, e.detail.formId)
    var sjdzh = wx.getStorageSync('sjdzh'), money = e.detail.value.czje, fkfs = this.data.countries[e.detail.value.fkfs], beizhu = e.detail.value.beizhu;
    var uid = this.data.userInfo.id;
    var sjid = this.data.mdinfo.id;
    console.log(sjdzh,money,uid,sjid,fkfs,beizhu)
    that.setData({
      disabled:true,
    })
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
    // if (czhd.length == 0) {
    //   var zsmoney = 0
    // }
    // else if (Number(money) >= Number(this.data.czhd[czhd.length - 1].full)) {
    //   var czhdindex = this.jsmj(money, czhd)
    //   console.log(czhdindex)
    //   var zsmoney = Number(czhd[czhdindex].reduction)
    // }
    // else {
    //   var zsmoney = 0
    // }
    // StoreRecharge
    app.util.request({
      'url': 'entry/wxapp/StoreRecharge',
      'cachetime': '0',
      data: { user_id: uid, money: money, store_id: sjid, account_id: sjdzh.id, type: fkfs,note:beizhu},
      success: function (res) {
        console.log(res)
        var order_id = res.data;
        if (res.data != '下单失败！') {
          wx.showToast({
            title: '充值成功',
            duration: 1000
          })
          setTimeout(function () {
            wx.navigateBack({

            })
          }, 1000)
          app.util.request({
            'url': 'entry/wxapp/czPrint2',
            'cachetime': '0',
            data: { order_id: order_id },
            success: function (res) {
              console.log(res)
            },
          })
        }
        else{
          wx.showToast({
            title: '请重试！',
          })
          that.setData({
            disabled: false,
          })
        }
      }
    })
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
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  }
})