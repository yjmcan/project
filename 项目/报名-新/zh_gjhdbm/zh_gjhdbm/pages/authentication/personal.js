// zh_gjhdbm/pages/authentication/enterprise.js
var app = getApp()
var siteinfo = require('../../../siteinfo.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    icon: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    app.setNavigationBarColor(this);
    that.setData({
      id: options.id
    })
    wx.hideShareMenu()
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
    app.getUserInfo(function (userInfo) {
      that.setData({
        userInfo: userInfo,
      })
    })
  },
  // 选择正面照片
  choose1: function (e) {
    var that = this;
    var url = siteinfo.siteroot
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // console.log(res)
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths[0]
        wx.uploadFile({
          url: url + '?i=' + that.data.userInfo.uniacid + '&c=entry&a=wxapp&do=upload&m=zh_gjhdbm',
          filePath: tempFilePaths,
          name: 'upfile',
          formData: {},
          success: function (res) {
            console.log(res)
            that.setData({
              zm_img: res.data
            })
          },
          fail: function (res) {
            // console.log(res)
          },
        })
        that.setData({
          logo: tempFilePaths
        })
      }
    })
  },
  // 选择反面照片
  choose2: function (e) {
    var that = this;
    var url = wx.getStorageSync('siteroot')
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // console.log(res)
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths[0]
        wx.uploadFile({
          url: url + '?i=' + that.data.userInfo.uniacid + '&c=entry&a=wxapp&do=upload&m=zh_gjhdbm',
          filePath: tempFilePaths,
          name: 'upfile',
          formData: {},
          success: function (res) {
            console.log(res)
            that.setData({
              fm_img: res.data
            })
          },
          fail: function (res) {
            // console.log(res)
          },
        })
        that.setData({
          logo: tempFilePaths
        })
      }
    })
  },
  formSubmit: function (e) {
    var that = this
    console.log(e)
    var formId = e.detail.formId
    var name = e.detail.value.name
    var code = e.detail.value.code
    var representative = e.detail.value.representative
    var zm_img = that.data.zm_img
    var fm_img = that.data.fm_img
    var icon = that.data.icon
    var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    var id = that.data.id
    var title = ''
    if (name == '') {
      title = '请输入您的真实姓名'
    } else if (code == '') {
      title = '请输入您的身份证证件号码'
    } else if (reg.test(code) === false) {
      title = '身份证输入不合法'
    } else if (zm_img == null) {
      title = '请上传正面照片以便核实'
    } else if (fm_img == null) {
      title = '请上传反面照片以便核实'
    } else if (icon == false) {
      title = '请阅读并同意认证须知'
    }
    if (title != '') {
      wx.showModal({
        title: '温馨提示',
        content: title,
      })
    } else {
      if (id == 0) {
        // 保存认证
        app.util.request({
          'url': 'entry/wxapp/saveattestation',
          'cachetime': '0',
          data: {
            user_id: that.data.userInfo.id,
            name: name,
            zj_name: '身份证',
            code: code,
            zm_img: zm_img,
            bm_img: fm_img,
            type: 1
          },
          success: function (res) {
            console.log(res)
            if (res.data != 'error') {
              wx.showToast({
                title: '提交成功',
              })
              setTimeout(function () {
                wx.navigateBack({
                  delta: 2
                })
              }, 1500)
              var openid = wx.getStorageSync('userInfo').openid
              app.util.request({
                'url': 'entry/wxapp/Message3',
                'cachetime': '0',
                data: {
                  form_id: formId,
                  openid: openid,
                  rz_id: res.data,
                },
                success: function (res) {
                  console.log('发送模板消息')
                  console.log(res)
                },
              })
            } else {
              wx.showModal({
                title: '',
                content: '系统出差了，待会儿再试吧！',
              })
            }
          },
        })
      } else {
        // 保存认证
        app.util.request({
          'url': 'entry/wxapp/saveattestation',
          'cachetime': '0',
          data: {
            user_id: that.data.userInfo.id,
            name: name,
            zj_name: '身份证',
            code: code,
            zm_img: zm_img,
            bm_img: fm_img,
            type: 1,
            id: id
          },
          success: function (res) {
            console.log(res)
            if (res.data != 'error') {
              wx.showToast({
                title: '提交成功',
              })
              setTimeout(function () {
                wx.navigateBack({
                  delta: 2
                })
              }, 1500)
              var openid = wx.getStorageSync('userInfo').openid
              app.util.request({
                'url': 'entry/wxapp/Message2',
                'cachetime': '0',
                data: {
                  form_id: formId,
                  openid: openid,
                  rz_id: res.data
                },
                success: function (res) {
                  console.log('发送模板消息')
                  console.log(res)
                },
              })
            } else {
              wx.showModal({
                title: '',
                content: '系统出差了，待会儿再试吧！',
              })
            }
          },
        })
      }
    }

  },
  // 认证须知
  identity: function (e) {
    wx.navigateTo({
      url: '../mycenter/inform?status=' + 3,
    })
  },
  // 选择认证须知
  icon: function (e) {
    var that = this
    var icon = that.data.icon
    if (icon == true) {
      that.setData({
        icon: false
      })
    } else {
      that.setData({
        icon: true
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
  // onShareAppMessage: function () {

  // }
})