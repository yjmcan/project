//logs.js
const app = getApp()
var fabu = require("../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: ['线上活动', '线下活动'],
    index_class: 0,
    index: 0,
    city_index:0,
    fabufoot: true,
    tempFilePaths: '',
    icon: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this

    app.getUserInfo(function (userInfo) {
      console.log(userInfo)
      that.setData({
        userInfo: userInfo
      })
    })
    app.setNavigationBarColor(this);
    var db_tab = wx.getStorageSync('db_tab')
    var yes = app.contains(db_tab, '../logs/logs')
    console.log(yes)
    that.setData({
      db_tab: db_tab
    })
    try {
      wx.removeStorageSync('bminfo')
      wx.removeStorageSync('mode')
    } catch (e) {
      // Do something when catch error
    }
    wx.hideShareMenu()
    that.setData({
      today: app.util.time()
    })
    //编辑活动
    if (options.id == null) {
      that.setData({
        edit: false
      })
      that.refresh()
    } else {
      app.util.request({
        url: 'entry/wxapp/ActivityDetails',
        data: { activity_id: options.id },
        success: res => {
          console.log(res)
          if (res.data.activity_type == 1) {
            res.data.activity_type = '线上活动'
          } else {
            res.data.activity_type = '线下活动'
          }
          that.setData({
            address: res.data.address,
            link_tel: res.data.link_tel,
            datastart: app.ormatDate(res.data.start_time).slice(0, 10),
            time1: app.ormatDate(res.data.start_time).slice(10, 16),
            dataend: app.ormatDate(res.data.end_time).slice(0, 10),
            time2: app.ormatDate(res.data.end_time).slice(10, 16),
            uplogo: res.data.logo,
            title: res.data.title,
            activity_type: res.data.activity_type,
            type_id: res.data.type_id,
            cityname: res.data.cityname,
            hx_code: res.data.hx_code,
            edit: true,
            content: res.data.content,
            imgs: res.data.hd_imgs,
            bm_info: res.data.bm_info,
            coordinates: res.data.coordinates,
            zd_money:res.data.zd_money
          })
        }
      })
      that.setData({
        activity_id:options.id
      })
      that.refresh()
    }
  },
  user_info: function (e) {
    var that = this
    var userInfo = wx.getStorageSync('userInfo')
    var user_id = wx.getStorageSync('userInfo').id
    that.setData({
      user_id: user_id
    })
    app.util.request({
      'url': 'entry/wxapp/GetSponsor',
      'cachetime': '0',
      data: { user_id: user_id },
      success: function (res) {
        console.log('这是获取主办方资料')
        console.log(res)
        if (res.data == false) {
          // 没有认证
          wx.showModal({
            title: '创建主办方',
            content: '您还没有进行填写主办方信息',
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
                wx.navigateTo({
                  url: '../mycenter/edit?status=' + 1,
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
                wx.redirectTo({
                  url: '../index/index',
                })
              }
            }
          })
        } else {
          // 获取系统设置
          app.util.request({
            'url': 'entry/wxapp/getSystem',
            'cachetime': '0',
            success: function (res) {
              console.log('这是系统设置')
              console.log(res)
              if (res.data.is_sfrz == 1) {
                if (userInfo.rz_type == 0) {
                  wx.showModal({
                    title: '身份认证提示',
                    content: '您还没有进行身份认证',
                    success: res => {
                      if (res.confirm) {
                        console.log('用户点击确定')
                        wx.navigateTo({
                          url: '../authentication/authentication',
                        })
                      } else{
                        console.log('用户点击取消')
                        wx.reLaunch({
                            url: '/zh_gjhdbm/pages/index/index',
                        })
                      }
                    }
                  })
                }
              }
            },
          })
          that.setData({
            sponsor: res.data.name
          })
        }
      },
    })

  },
  refresh: function (e) {
    var that = this
    // 获取网址
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
    // 获取分类
    app.util.request({
      'url': 'entry/wxapp/typeList',
      'cachetime': '0',
      success: function (res) {
        console.log('这是分类')
        console.log(res)
        if (that.data.type_id != null) {
          for (let i in res.data) {
            if (that.data.type_id == res.data[i].id) {
              that.setData({
                type_name: res.data[i].type_name
              })
            }
          }
        }
        var classification = []
        res.data.map(function (item) {
          var obj = {};
          obj = item.type_name,
            classification.push(obj);
        })
        that.setData({
          typeList: res.data,
          classification: classification
        })
      },
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
  // —————————上传图片部分—————————
  fabuimg: function (e) {
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
              uplogo: res.data
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
  selehuodong: function (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  // 选择城市
  city: function (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      city_index: e.detail.value
    })
  },
  classification: function (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index_class: e.detail.value
    })
  },
  // 活动开始日期
  datastart: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      datastart: e.detail.value
    })
  },
  // 活动结束日期
  dataend: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      dataend: e.detail.value
    })

  },
  // 活动开始时间
  bindTimeChange1: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      time1: e.detail.value
    })
  },
  // 活动结束时间
  bindTimeChange2: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      time2: e.detail.value
    })
  },
  baomingset: function () {
    wx.navigateTo({
      url: 'enrollset',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  fabuinfo: function () {
    console.log(111)
    wx.navigateTo({
      url: 'fabuinfo',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  addimg: function () {
    this.setData({
      fabufoot: false
    })
  },
  // 选择活动地址
  address: function (e) {
    var that = this
    wx.chooseLocation({
      success: function (res) {
        console.log(res)
        var coordinates = res.latitude + ',' + res.longitude
        console.log(coordinates)
        that.setData({
          address: res.address,
          coordinates: coordinates
        })
      }
    })
  },
  // 联系电话
  link_tel: function (e) {
    console.log(e)
    this.setData({
      link_tel: e.detail.value
    })
  },
  // 认证须知
  identity: function (e) {
    wx.navigateTo({
      url: '../mycenter/inform?status=' + 4,
    })
  },
  formSubmit: function (e) {
    console.log(e)
    var that = this
    console.log(that.data.edit)
    if (that.data.edit == true) {
      var content = that.data.content
      var imgs = that.data.imgs
    }
    // 总分类
    var typeList = that.data.typeList
    // 获取活动海报
    var uplogo = that.data.uplogo
    // 活动标题
    var title = e.detail.value.title
    // 活动方式

    if (that.data.activity_type == null) {
      var array = that.data.array[that.data.index]
    } else {
      var array = that.data.activity_type
    }
    // 活动分类
    if (that.data.type_id == null) {
      var classification = that.data.classification[that.data.index_class]
      for (let i in typeList) {
        if (typeList[i].type_name == classification) {
          classification = typeList[i].id
        }
      }
    } else {
      var classification = that.data.type_id
    }
    // 活动城市
    var city = wx.getStorageSync('city')
    console.log(city)
    // 活动开始日期
    var datastart = that.data.datastart
    // 活动结束日期
    var dataend = that.data.dataend
    // 活动开始时间
    var time1 = that.data.time1
    // 活动结束时间
    var time2 = that.data.time2
    var start_time = datastart + ' ' + time1
    var end_time = dataend + ' ' + time2
    // 获取主办方name
    var sponsor = that.data.sponsor
    // 获取活动地点
    var address = that.data.address
    var coordinates = that.data.coordinates
    // 获取活动联系方式
    var link_tel = that.data.link_tel
    // 发布须知
    var icon = that.data.icon
    // 活动核销码
    var hx_code = e.detail.value.hx_code
    var Prompt = ''
    if (uplogo == '' || uplogo == null) {
      Prompt = '请上传活动海报'
    } else if (title == '') {
      Prompt = '请输入活动标题'
    } else if (array == null) {
      Prompt = '请选择活动方式'
    } else if (classification == null) {
      Prompt = '请选择活动分类'
    } else if (datastart == null) {
      Prompt = '请输入活动开始日期'
    } else if (dataend == null) {
      Prompt = '请输入活动结束日期'
    } else if (datastart > dataend) {
      Prompt = '活动开始日期不能大于活动结束日期'
    } else if (time1 == null) {
      Prompt = '请输入活动开始时间'
    } else if (time2 == null) {
      Prompt = '请输入活动结束时间'
    } else if (start_time == end_time) {
      Prompt = '活动开始时间不能和结束时间一致'
    } else if (address == null) {
      Prompt = '请选择活动地点'
    } else if (link_tel == null || link_tel == '') {
      Prompt = '请输入联系电话'
    } else if (hx_code == null || hx_code == '') {
      Prompt = '请输入活动核销码'
    } else if (icon == false) {
      Prompt = '请阅读并同意发布须知'
    }
    if (Prompt != '') {
      wx: wx.showModal({
        title: '温馨提示',
        content: Prompt,
        showCancel: true,
        cancelText: '取消',
        cancelColor: '#333',
        confirmText: '确定',
        confirmColor: '#333',
      })
    } else {
      if (that.data.edit == false) {
        wx.navigateTo({
          url: 'enrollset?uplogo=' + uplogo + '&title=' + title + '&array=' + array + '&classification=' + classification + '&start_time=' + start_time + '&end_time=' + end_time + '&address=' + address + '&link_tel=' + link_tel + '&coordinates=' + coordinates + '&link_tel=' + link_tel + '&sponsor=' + sponsor + '&city=' + city + '&hx_code=' + hx_code,
        })
      } else {
        wx.navigateTo({
          url: 'fabuinfo?uplogo=' + uplogo + '&title=' + title + '&array=' + array + '&classification=' + that.data.type_id + '&start_time=' + start_time + '&end_time=' + end_time + '&address=' + address + '&link_tel=' + link_tel + '&coordinates=' + coordinates + '&link_tel=' + link_tel + '&sponsor=' + sponsor + '&city=' + city + '&hx_code=' + hx_code + '&imgs=' + imgs + '&content=' + content + '&activity_id=' + that.data.activity_id + '&bminfo=' + that.data.bm_info + '&zd_money=' + that.data.zd_money,
        })
      }


    }

  },
  // ————————第四个跳转——————————
  wode: function () {
    var that = this
    var db_tab = that.data.db_tab
    wx: wx.reLaunch({
      url: db_tab[3].src,
    })
  },

  // ————————跳转到发布活动——————————
  fabu: function () {
    wx: wx.reLaunch({
      url: '../fabu/fabu',
    })
  },
  // ————————跳转到首页——————————
  index: function () {
    var that = this
    var db_tab = that.data.db_tab
    wx: wx.reLaunch({
      url: db_tab[0].src,
    })
  },
  // ————————第二个跳转——————————
  classifination: function (e) {
    var that = this
    var db_tab = that.data.db_tab
    wx: wx.reLaunch({
      url: db_tab[1].src,
    })
  },
  // ————————第三个跳转——————————
  mine_activity: function (e) {
    var that = this
    var db_tab = that.data.db_tab
    wx: wx.reLaunch({
      url: db_tab[2].src,
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
    this.user_info()
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
