// zh_wzp/pages/user/index.js
var app = getApp()
var siteinfo = require('../../../siteinfo.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: '2016-09-01',
    year: "1994-12",
    seles: true,
    sele_b: 'sele_b',
    sele: "sele",
    none_sele_b: 'none_sele_b',
    none_sele: 'none_sele'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.route(this)
    var that = this
    that.setData({
      color: wx.getStorageSync("color")
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: wx.getStorageSync("color"),
    })
    app.util.request({
      url: 'entry/wxapp/Attachurl',
      success: res => {
        console.log(res)
        that.setData({
          url: res.data
        })
      }
    })
    var user= wx.getStorageSync("userinfo")
    that.setData({
      user:user
    })
    app.util.request({
      url: 'entry/wxapp/GetCenter',
      data:{
        user_id: user.id
      },
      success: res => {
        console.log(res)
        var userInfo = res.data
        if (userInfo.code != '500') {
          console.log(userInfo)
          console.log('有用户信息')
          that.setData({
            tel: userInfo.contact,
            name: userInfo.username,
            life: userInfo.work_life,
            logo: userInfo.header,
            date: userInfo.work_part,
            year: userInfo.birthday,
            degree: userInfo.degree,
            graduation_school: userInfo.graduation_school,
            experience_id: userInfo.experience_id
          })
          if (userInfo.sex == 1) {
            that.setData({
              sele: false,
              sele_b: 'sele_b',
              sele: "sele",
              none_sele_b: 'none_sele_b',
              none_sele: 'none_sele'
            })
          } else {
            that.setData({
              sele: true,
              sele_b: 'sele_nv_b',
              sele: "sele_nv",
              none_sele_b: 'sele_b',
              none_sele: 'sele'
            })
          }
          that.degree(userInfo.degree)
        } else {
          console.log('没有用户信息')
          that.degree(0)
        }
      }
    })

    app.util.request({
      url: 'entry/wxapp/system',
      success: res => {
        console.log(res)
      }
    })
    app.util.request({
      url: 'entry/wxapp/Attachurl',
      success: res => {
        console.log(res)
        that.setData({
          url: res.data
        })
      }
    })
    that.setData({
      user: user
    })
  },
  degree: function (degrees) {
    var that = this
    console.log(degrees)
    app.util.request({
      url: 'entry/wxapp/Degree',
      success: res => {
        var degree = res.data
        var nav = []
        for (let i in degree) {
          nav.push(degree[i].name)
        }
        if (degrees == 0) {
          that.setData({
            index: 0,
            degree: degree[0].id
          })
        } else {
          for (let i in degree) {
            if (degree[i].id == degrees) {
              console.log(degree[i].id)
              that.setData({
                index: i,
                degree: degree[i].id
              })
            }
          }
        }
        that.setData({
          nav: nav,
          degrees: degree
        })
      }
    })
  },
  bindinput:function(e){
    var that = this
    var value = e.detail.value
    app.util.request({
      url: 'entry/wxapp/experience',
      success: res => {
        var years = res.data
        for(let i in years){
          years[i].zd_year = Number(years[i].zd_year)
          years[i].zg_year = Number(years[i].zg_year)
          if (value > years[i].zd_year && value <= years[i].zg_year){
            console.log(years[i])
            that.setData({
              experience_id: years[i].id
            })
          }
        }
      }
    })
  },
  // 上传图片
  choose: function (e) {
    var that = this
    // 获取上传图片所需要的url
    var url = siteinfo.siteroot
    // 获取小程序id
    var uniacid = siteinfo.uniacid
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        console.log(res)
        var tempFilePaths = res.tempFilePaths[0]
        wx.uploadFile({
          url: url + '?i=' + uniacid + '&c=entry&a=wxapp&do=upload&m=zh_wzp',
          filePath: tempFilePaths,
          name: 'upfile',
          formData: {},
          success: function (res) {
            console.log('这是上传成功')
            console.log(res)
            that.setData({
              logo: res.data
            })
          },
          fail: function (res) {
            console.log('这是上传失败')
            console.log(res)
          },
        })
      }
    })
  },
  none_sele: function (e) {
    var that = this
    that.setData({
      seles: true,
      sele_b: 'sele_b',
      sele: "sele",
      none_sele_b: 'none_sele_b',
      none_sele: 'none_sele'
    })
  },
  sele: function (e) {
    var that = this
    that.setData({
      seles: false,
      sele_b: 'sele_nv_b',
      sele: "sele_nv",
      none_sele_b: 'sele_b',
      none_sele: 'sele'
    })
  },
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  bindDateChange1: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      year: e.detail.value
    })
  },
  bindPickerChange2: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var that = this
    var index = e.detail.value
    var degrees = that.data.degrees
    for (let i in degrees) {
      if (i == index) {
        that.setData({
          index: index,
          degree: degrees[i].id
        })
      }
    }
  },
  formSubmit: function (e) {
    var user_id = wx.getStorageSync('userinfo').id
    var that = this
    var name = e.detail.value.username
    var tel = e.detail.value.tel
    var life = e.detail.value.life
    var school = e.detail.value.school
    var seles = that.data.seles
    var date = that.data.date
    var year = that.data.year
    var logo = that.data.logo
    var degree = that.data.degree
    var experience_id = that.data.experience_id
    console.log(experience_id)
    if (seles == true) {
      console.log('男')
      var sex = 1
    } else {
      console.log('女')
      var sex = 2
    }
    console.log(user_id)
    console.log(name)
    console.log(tel)
    console.log(life)
    var title = ''
    if (logo == null) {
      title = "请上传照片"
    } else if (name == '') {
      title = '请输入您的姓名'
    } else if (tel == '') {
      title = '请输入您的联系方式'
    } else if (life == '') {
      title = '请输入工作年限'
    }
    if (app.title(title) == true) {
      app.util.request({
        url: 'entry/wxapp/Center',
        data: {
          user_id: user_id,
          header: logo,
          username: name,
          sex: sex,
          work_life: life,
          contact: tel,
          work_part: date,
          birthday: year,
          degree: degree,
          experience_id: experience_id,
          graduation_school: school
        },
        success: res => {
          console.log(res)
          if (res.data.code == 200) {
            wx.showToast({
              title: '保存成功',
            })
            setTimeout(function () {
              wx.navigateBack({
                delta: 1
              })
            }, 1500)
          }
        }
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