// zh_wzp/pages/release/info.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: [
      "不限",
      "3000以下",
      "3000-5000",
      "5000-10000",
      "10000-20000",
      "20000-50000",
      "50000以上",
    ],
    job: [
      "全职",
      "兼职"
    ],
    index: 0,
    index1: 0,
    index2: 0,
    index3: 0,
    ac_index: 0,
    text_index: 0,
    n_index_0: 0,
    n_index_1: 0,
    sele_t: []
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
    var type = options.type
    var type_id = options.type_id
    console.log(options)
    app.util.request({
      url: 'entry/wxapp/tag',
      success: res => {
        console.log(res)
        for (let i in res.data) {
          res.data[i].class = 'no_select'
        }
        that.setData({
          tag: res.data
        })
      }
    })
    that.setData({
      type: options.type,
      type_id: options.type_id,
      type2_name: options.type2_name
    })
    // 学历
    app.util.request({
      url: 'entry/wxapp/Degree',
      success: res => {
        var degree = res.data
        var Education = []
        for (let i in degree) {
          Education.push(degree[i].name)
        }
        that.setData({
          Education: Education,
          ed: res.data,
          degree_require: degree[0].id
        })
      }
    })
    // 薪资范围
    app.util.request({
      url: 'entry/wxapp/Salary',
      success: res => {
        var degree = res.data
        var array = []
        for (let i in degree) {
          array.push(degree[i].name)
        }
        that.setData({
          array: array,
          xz: res.data,
          salary: degree[0].id
        })
      }
    })
    // 工作性质
    app.util.request({
      url: 'entry/wxapp/Jobtype',
      success: res => {
        var degree = res.data
        var job = []
        for (let i in degree) {
          job.push(degree[i].name)
        }
        that.setData({
          job: job,
          job_t: res.data,
          nature: degree[0].id
        })
      }
    })
    // 工作经验
    app.util.request({
      url: 'entry/wxapp/experience',
      success: res => {
        var degree = res.data
        var num_years = []
        for (let i in degree) {
          num_years.push(degree[i].name)
        }
        that.setData({
          num_years: num_years,
          ex: res.data,
          experience_require: degree[0].id
        })
      }
    })
    that.nav(0)
  },
  nav: function (index) {
    var that = this
    app.util.request({
      url: 'entry/wxapp/type',
      success: res => {
        console.log(res)
        var nav = res.data
        var navs = []
        var nav_c = []
        for (let i in nav) {
          navs.push(nav[i].name)
          if (nav[i].id == that.data.type) {
            that.setData({
              type_name: nav[i].name
            })
          }
        }
        console.log()
        for (let i in nav[index].children) {
          nav_c.push(nav[index].children[i].name)
        }
        that.setData({
          nav: res.data,
          navs: navs,
          nav_c: nav_c
        })
      }
    })
  },
  // 福利待遇选中状态
  select: function (e) {
    var that = this
    var tag = that.data.tag
    var index = e.currentTarget.dataset.index
    if (tag[index].class == "no_select") {
      tag[index].class = "select"
    } else {
      tag[index].class = "no_select"
    }
    var sele_t = []
    for (let i in tag) {
      if (tag[i].class == "select") {
        sele_t.push(tag[i].id)
      }
    }
    that.setData({
      tag: tag,
      sele_t: sele_t
    })
  },
  // 选择位置
  address: function (e) {
    var that = this
    wx.chooseLocation({
      success: function (res) {
        console.log(res)
        var latitude = res.latitude + ',' + res.longitude
        console.log(latitude)
        that.setData({
          address: res.address,
          latitude: latitude
        })
      }
    })
  },
  // 、选择薪资范围
  bindPickerChange: function (e) {
    var that = this
    var xz = that.data.xz
    var index = e.detail.value
    for (let i in xz) {
      if (i == index) {
        that.setData({
          index: index,
          salary: xz[i].id
        })
      }
    }
  },
  // 一级分类
  navs_1: function (e) {
    var that = this
    var nav = that.data.nav
    var index = e.detail.value
    for (let i in nav) {
      if (i == index) {
        that.setData({
          type: nav[i].id
        })
      }
    }
    that.setData({
      n_index_0: e.detail.value,
      nav_s: true,
      n_index_1: 0
    })
    that.nav(e.detail.value)
  },
  // 二级分类
  navs_2: function (e) {
    var that = this
    var nav = that.data.nav
    var n_index_0 = that.data.n_index_0
    var index = e.detail.value
    for (let i in nav[n_index_0].children) {
      if (i == index) {
        that.setData({
          type_id: nav[n_index_0].children[i].id
        })
      }
    }
    that.setData({
      n_index_1: e.detail.value,
      nav_s: true
    })
  },
  // 、选择职位限制
  bindPickerChange1: function (e) {
    var that = this
    var job_t = that.data.job_t
    var index1 = e.detail.value
    for (let i in job_t) {
      if (i == index1) {
        that.setData({
          index1: index1,
          nature: job_t[i].id
        })
      }
    }
  },
  // 、选择学历
  bindPickerChange2: function (e) {
    var that = this
    var ex = that.data.ex
    var index2 = e.detail.value
    for (let i in ex) {
      if (i == index2) {
        that.setData({
          index2: index2,
          degree_require: ex[i].id
        })
      }
    }
  },
  // 、选择工作经验
  bindPickerChange3: function (e) {
    var that = this
    var ex = that.data.ex
    var index3 = e.detail.value
    for (let i in ex) {
      if (i == index3) {
        that.setData({
          index3: index3,
          experience_require: ex[i].id
        })
      }
    }
  },
  formSubmit: function (e) {
    var that = this
    // 职位描述
    var description = e.detail.value.text
    // 招聘人数
    var number = e.detail.value.num
    // 公司邮箱
    var email = e.detail.value.email
    // 用户id
    var user_id = wx.getStorageSync("userinfo").id
    // 一级分类
    var industry_id = that.data.type
    // 二级分类
    var type_id = that.data.type_id
    // 公司经纬度
    var coordinates = that.data.latitude
    // 工作经验
    var experience_require = that.data.experience_require
    // 薪资待遇
    var salary = that.data.salary
    // 学历要求
    var degree_require = that.data.degree_require
    // 选中的福利待遇
    var sele_t = that.data.sele_t.join(",")
    // 工作性质
    var nature = that.data.nature
    // 公司地址
    var area = that.data.address
    var title = ''
    if (that.data.address == null) {
      title = '请选择公司地址'
    }else if (number == '') {
      title = '请输入招聘人数'
    } else if (email == '') {
      title = '请输入公司邮箱'
    } else if (description == '') {
      title = '请输入职位介绍'
    }
    if (app.title(title) == true) {
      app.util.request({
        url: 'entry/wxapp/PublishPosition',
        data: {
          description: description,
          number: number,
          email: email,
          user_id: user_id,
          industry_id: industry_id,
          type_id: type_id,
          coordinates: coordinates,
          experience_require: experience_require,
          salary: salary,
          degree_require: degree_require,
          welfare_id: sele_t,
          nature: nature,
          area: area
        },
        success: res => {
          console.log(res)
          if (res.data == "200") {
            wx.showToast({
              title: '发布成功',
            })
            setTimeout(function () {
              wx.navigateBack({
                delta: 1
              })
            }, 1500)
          } else {
            wx.showToast({
              title: '发布成功',
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