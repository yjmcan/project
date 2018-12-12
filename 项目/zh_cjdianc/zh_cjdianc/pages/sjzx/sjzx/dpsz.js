// zh_cjdianc/pages/sjzx/dpgl.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },
  bindTimeChange: function (e) {
    this.setData({
      time: e.detail.value
    })
  },
  bindTimeChange1: function (e) {
    this.setData({
      time1: e.detail.value
    })
  },
  bindTimeChange2: function (e) {
    this.setData({
      time2: e.detail.value
    })
  },
  bindTimeChange3: function (e) {
    this.setData({
      time3: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this, sjdsjid = wx.getStorageSync('sjdsjid');
    console.log(options, sjdsjid)
    this.setData({
      szname: options.szname,
    })
    app.setNavigationBarColor(this);
    app.util.request({
      'url': 'entry/wxapp/StoreInfo',
      'cachetime': '0',
      data: {
        store_id: sjdsjid
      },
      success: (res) => {
        console.log('商家详情', res)
        that.setData({
          storeinfo: res.data,
          time:res.data.store.time,
          time1: res.data.store.time2,
          time2: res.data.store.time3,
          time3: res.data.store.time4,
        })
        if (res.data.storeset.print_type == '1') {
          that.setData({
            dyfs: true,
          })
        }
        if (res.data.storeset.print_type == '2') {
          that.setData({
            dyfs: false,
          })
        }
        if (res.data.storeset.print_mode == '1') {
          that.setData({
            dysj: true,
          })
        }
        if (res.data.storeset.print_mode == '2') {
          that.setData({
            dysj: false,
          })
        }
        if (res.data.store.is_rest == '2') {
          that.setData({
            sfyy: true,
          })
        }
        if (res.data.store.is_rest == '1') {
          that.setData({
            sfyy: false,
          })
        }
      }
    })
  },
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    var that = this, szname = this.data.szname, sjdsjid = wx.getStorageSync('sjdsjid');
    console.log(szname, sjdsjid)
    if(szname==1){
      var print_type = e.detail.value.radiodyfs, print_mode = e.detail.value.radiodysj;
      console.log(print_type,print_mode)
      wx.showLoading({
        title: "提交中",
        mask: !0
      }), app.util.request({
        'url': 'entry/wxapp/UpStore',
        'cachetime': '0',
        data: { store_id:sjdsjid, print_type: print_type, print_mode: print_mode,},
        success: function (res) {
          console.log(res.data)
          if (res.data == '1') {
            wx.showToast({
              title: '设置成功',
              icon: 'success',
              duration: 1000,
            })
            setTimeout(function () {
              wx.navigateBack({

              })
            }, 1000)
          }
          else if (res.data == '2') {
            wx.showToast({
              title: '请修改后提交',
              icon: 'loading',
              duration: 1000,
            })
          }
          else {
            wx.showToast({
              title: '请重试',
              icon: 'loading',
              duration: 1000,
            })
          }
        },
      })
    }
    if (szname == 2) {
      var is_rest = e.detail.value.radiosfyy, time = e.detail.value.time, time1 = e.detail.value.time1, time2 = e.detail.value.time2, time3 = e.detail.value.time3;
      console.log(is_rest,time,time1,time2,time3)
      if (time == '' || time1 == '' || time2 == '' || time3 == ''){
        wx.showModal({
          title: '提示',
          content: '时间不能为空',
        })
        return
      }
      if (time >= time1 || time1 >= time2){
         wx.showModal({
           title: '提示',
           content: '请设置正确合理的时间',
         })
         return
      }
      wx.showLoading({
        title: "提交中",
        mask: !0
      }), app.util.request({
        'url': 'entry/wxapp/UpStore',
        'cachetime': '0',
        data: { store_id: sjdsjid, is_rest: is_rest, time: time, time2: time1, time3: time2, time4: time3 },
        success: function (res) {
          console.log(res.data)
          if (res.data == '1') {
            wx.showToast({
              title: '设置成功',
              icon: 'success',
              duration: 1000,
            })
            setTimeout(function () {
              wx.navigateBack({

              })
            }, 1000)
          }
          else if (res.data == '2') {
            wx.showToast({
              title: '请修改后提交',
              icon: 'loading',
              duration: 1000,
            })
          }
          else {
            wx.showToast({
              title: '请重试',
              icon: 'loading',
              duration: 1000,
            })
          }
        },
      })
    }
    //var warn = "";
    //var flag = true;
    // if (mdlogo == "") {
    //   warn = "请上传商家Logo！";
    // } else {
    //   flag = false;
    // }
    // if (flag == true) {
    //   wx.showModal({
    //     title: '提示',
    //     content: warn
    //   })
    // }
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