// pages/admission/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    color: 'rgb(56, 132, 254)', //56 132 253
    img1: [],
    img2: [],
    imgArray1: [],
    imgArray2: [],
    route: false,
    i: 0,
    j: 0,
    n: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    var source = [{
      name: 'place1',
      termini: 'termini1'
    }]
    var station = wx.getStorageSync('users')
    console.log(station)
    that.setData({
      name: station.name,
      phone: station.phone,
      area_one: station.nowSource,
      area_two: station.stationDetails,
    })
    if (station.inStorePhoto != null) {
      station.inStorePhoto = station.inStorePhoto.split(",") || []
      var source = station.sourceRouteArray
      var line = []
      source.map(function(item) {
        var obj = {}
        obj.start = item.startAllName
        obj.end = item.endAllName
        line.push(obj)
      }) 
      var routes = []
      source.map(function (item) {
        var obj = {}
        obj.startPlace = item.startPlace
        obj.endPlace = item.endPlace
        routes.push(obj)
      })
      // var line = new Array(source.length)
      // for (let i in source) {
      //   line[i].start = source[i].startAllName
      //   line[i].end = source[i].endAllName
      // }
      console.log(line)
      that.setData({
        source: source,
        station: station,
        line: line,
        routes: routes,
        area_one: station.nowSource,
        area_two: station.stationDetails,
        imgArray2: station.inStorePhoto,
        imgArray1: [
          station.stationMainImg
        ],
        address: station.cityAddress,
        latitude: station.latitude,
        longitude: station.longitude,
      })
    } else {
      var line = [{
        end: '',
        start: '',
      }]
      var routes = [{
        endPlace: '',
        startPlace: '',
      }]
      that.setData({
        line: line,
        routes: routes
      })
    }

    that.province()
  },
  area1:function(e){
    area_one:e.detail.value
  },
  area2: function (e) {
    area_two: e.detail.value
  },
  // 获取省
  province: function(e) {
    var that = this
    wx.request({
      // url: url +'/hyb/login/thirdLogin',
      url: getApp().siteinfo.url +'/hyb/city/selectPro',
      success: res => {
        that.setData({
          province: res.data.data,
        })
        that.city()
      }
    })
  },
  // 获取市
  city: function(e) {
    var that = this
    var province = that.data.province
    var i = that.data.i || 0

    wx.request({
      url: getApp().siteinfo.url +'/hyb/city/selectCity',
      data: {
        cityCode: province[i].adCode
      },
      success: res => {
        var city = res.data.data
        console.log(city)
        if (city.length > 0) {
          that.setData({
            city: city
          })
          that.county()
        } else {
          that.setData({
            city: [],
            county: []
          })
        }
      }
    })
  },
  county: function(e) {
    var that = this
    var city = that.data.city
    var j = that.data.j || 0
    if (city[j].cityDesc == null) {
      var cityCode = that.data.province[that.data.i].adCode
    } else {
      var cityCode = city[j].adCode
    }
    wx.request({
      url: getApp().siteinfo.url +'/hyb/city/selectCity',
      data: {
        cityCode: cityCode
      },
      success: res => {
        var county = [],
          county_0 = {
            cityDesc: '全部'
          }
        county = res.data.data
        county.unshift(county_0)
        console.log(county)
        that.setData({
          county: county
        })
      }
    })
  },
  // change事件
  sele_city: function(e) {
    console.log(e)
    var that = this
    var value = e.detail.value
    var i = value[0]
    var j = value[1]
    var n = value[2]
    that.setData({
      i: i,
      j: j,
      n: n
    })
    that.city()
  },
  // 触发选择城市
  route_0: function(e) {
    var that = this
    console.log('触发选择', e)
    that.setData({
      route: true,
      type: e.currentTarget.dataset.type,
      index: e.currentTarget.dataset.index
    })
  },
  // 确认选择
  confirm: function(e) {
    var that = this
    var a = that.data
    var province = a.province,
      city = a.city,
      county = a.county,
      i = a.i,
      j = a.j,
      n = a.n,
      type = a.type,
      index = a.index,
      line = a.line,
      routes = a.routes
    console.log(type)
    if (city.length == 0) {
      var route = province[i].cityDesc + '全部'
      var code = province[i].adCode
    } else if (county.length == 0) {
      var route = city[j].cityDesc + '全部'
      var code = province[i].adCode
    } else if (county[n].cityDesc == '全部') {
      var route = city[j].cityDesc + county[n].cityDesc
      var code = city[j].adCode
    } else if (county[n].cityDesc != '全部') {
      var route = city[j].cityDesc + county[n].cityDesc
      var code = county[n].adCode
    }
    if (type == 0) {
      line[index].start = route
      routes[index].startPlace = code
      console.log(line)
      that.setData({
        line: line,
        routes: routes,
      })
    } else {
      line[index].end = route
      routes[index].endPlace = code
      that.setData({
        line: line,
        routes: routes,
      })
    }
    that.setData({
      route: false,
      i: 0,
      j: 0,
      n: 0,
      county: [],
      city: []
    })
    that.province()
  },
  // 取消选择
  cancel: function(e) {
    var that = this
    that.setData({
      route: false,
      value: [
        0, 0, 0
      ],
      county: [],
      city: []
    })
  },
  choose_img_0: function(e) {
    var that = this
    var imgArray1 = that.data.imgArray1
    console.log(imgArray1.length)
    wx.chooseImage({
      count: 1 - imgArray1.length, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        imgArray1 = imgArray1.concat(tempFilePaths)
        // that.setData({
        //   imgArray1: imgArray1
        // })
        console.log(imgArray1)
        // 上传营业执照
        that.uploadimg({
          url: getApp().siteinfo.url +'/hyb/upload/uploadSave',
          path: imgArray1
        });
      }
    })
  },
  choose_img_1: function(e) {
    var that = this
    var imgArray2 = that.data.imgArray2
    wx.chooseImage({
      count: 5 - imgArray2.length, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        imgArray2 = imgArray2.concat(tempFilePaths)
        // that.setData({
        //   imgArray2: imgArray2
        // })
        console.log(imgArray2)
        // 上传营业执照
        that.uploadimg1({
          url: getApp().siteinfo.url +'/hyb/upload/uploadSave',
          path: imgArray2
        });
      }
    })
  },
  // 添加线路
  add_line: function(e) {
    var that = this
    var a = that.data
    var line = a.line
    var routes = a.routes
    // var arr = [];
    // for (var i = 0; i < line.length + 1; i++) {
    //   var obj = {};
    //   obj.start = [];
    //   obj.end =[];
    //   arr.push(obj);
    // }
    var obj = {};
    obj.start = '';
    obj.end = '';
    line.push(obj)
    var obj1 = {};
    obj1.startPlace = '';
    obj1.endPlace = '';
    routes.push(obj1)
    that.setData({
      line: line,
      routes: routes
    })
  },
  // 添加货源
  add_source: function(e) {
    var that = this
    var a = that.data
    var source = a.source
    console.log(source)
    var arr = [];
    for (var i = 0; i < source.length + 1; i++) {
      var obj = {};
      obj.name = 'place' + i;
      obj.termini = 'termini' + i;
      arr.push(obj);
    }
    console.log(arr)
    that.setData({
      source: arr
    })
  },
  // 删除线路
  deletes: function(e) {
    var that = this
    var a = that.data
    var index = e.currentTarget.dataset.index
    if (index > 0) {
      var line = a.line
      var routes = a.routes
      line.splice(index, 1)
      routes.splice(index, 1)
      that.setData({
        line: line,
        routes: routes
      })
    }
  },

  delete_img1: function(e) {
    var that = this
    var imgArray1 = that.data.imgArray1
    var index = e.currentTarget.dataset.index
    imgArray1.splice(index, 1)
    that.setData({
      imgArray1: imgArray1
    })
  },
  delete_img2: function(e) {
    var that = this
    var imgArray2 = that.data.imgArray2
    var index = e.currentTarget.dataset.index
    imgArray2.splice(index, 1)
    that.setData({
      imgArray2: imgArray2
    })
  },
  // 选择地址
  choose_address: function(e) {
    var that = this
    wx.chooseLocation({
      success: function(res) {
        console.log(res)
        that.setData({
          address: res.address,
          latitude: res.latitude,
          longitude: res.longitude
        })
      }
    })
  },
  // 选择线路起点
  bindRegionChange: function(e) {
    console.log(e)
    var that = this
    var line = that.data.line
    var index = e.currentTarget.dataset.type
    var value = e.detail.value
    line[index].start = value
    that.setData({
      line: line
    })
  },
  // 选择线路终点
  bindRegionChange1: function(e) {
    console.log(e)
    var that = this
    var line = that.data.line
    var index = e.currentTarget.dataset.type
    var value = e.detail.value
    line[index].end = value
    that.setData({
      line: line
    })
  },
  // 提交表单
  formSubmit: function(e) {
    console.log(e)
    console.log(this.data)
    var that = this
    var a = that.data
    var b = e.detail.value
    var name = b.name
    var tel = b.tel
    var address = b.address
    var cityAddress =a.address
    var route_info = b.route
    var text = b.texts
    var num = b.num
    var latitude = a.latitude
    var longitude = a.longitude
    // var route_info = route_info.replace("\n", "↵")
    console.log(route_info)
    var title = ''
    if (name == '') {
      title = '请输入货站名称'
    } else if (tel == '') {
      title = '请输入货站电话'
    } else if (route_info == '') {
      title = '请输入货源信息'
    } else if (text == '') {
      title = '请输入货站详情信息'
    } else if (num == '') {
      title = '请输入支付宝账号'
    } else if (cityAddress == '') {
      title = '请选择货站地址'
    } else if (address == '') {
      title = '请输入货站详细地址'
    }
    if (title != '') {
      wx.showModal({
        title: '温馨提示',
        content: title,
      })
    } else {
      console.log('可以入住了')
      that.setData({
        address: address,
        route_info: route_info,
        num: num,
        text: text,
        name: name,
        tel: tel,
        cityAddress: cityAddress
      })
      that.place_info()
    }
  },

  place_info: function(e) {
    var that = this,
      a = that.data,
      imgArray1 = a.imgArray1,
      imgArray2 = a.imgArray2.join(","),
      routes = a.routes,
      route_info = a.route_info,
      num = a.num,
      text = a.text
    // JSON.stringify(routes)
    wx.request({
      // url: url +'/hyb/login/thirdLogin',
      url: getApp().siteinfo.url +'/hyb/goodsStationApi/imgproveInformation',
      data: {
        goodsStationId: wx.getStorageSync('users').id,
        name: a.name,
        phone: a.tel,
        nowSource: route_info,
        stationMainImg: imgArray1[0],
        inStorePhoto: imgArray2, //店内照片
        alipay: num,
        stationDetails: text,
        longitude: a.longitude,
        latitude: a.latitude,
        address: a.address,
        cityAddress: a.cityAddress,
        route: JSON.stringify(routes)
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      success: res => {
        console.log(res)
        wx.hideLoading()
        wx.navigateBack({
          delta: 1
        })
      },
      complete: res => {
        console.log('执行操作')

      }
    })
  },
  uploadimg: function(data) {
    var that = this,
      i = data.i ? data.i : 0,
      success = data.success ? data.success : 0,
      fail = data.fail ? data.fail : 0;
    wx.uploadFile({
      url: data.url,
      filePath: data.path[i],
      name: 'file',
      formData: null,
      success: (resp) => {
        if (resp.data != '') {
          success++;
          data.path[i] = resp.data
          // imgArray1.push(resp.data)
          that.setData({
            imgArray1: data.path,
          })
          console.log('上传图片时候提交的图片数组', data.path)
        } else {
          wx.showToast({
            icon: "loading",
            title: "请重试"
          })
        }
      },
      fail: (res) => {
        fail++;
      },
      complete: () => {
        i++;
        if (i == data.path.length) {
          console.log(i)
          console.log(data.path.length)
          that.setData({
            images: data.path
          });
        } else {
          data.i = i;
          data.success = success;
          data.fail = fail;
          that.uploadimg(data);
        }

      }
    });
  },
  uploadimg1: function(data) {
    var that = this,
      i = data.i ? data.i : 0,
      success = data.success ? data.success : 0,
      fail = data.fail ? data.fail : 0;
    wx.uploadFile({
      url: data.url,
      filePath: data.path[i],
      name: 'file',
      formData: null,
      success: (resp) => {
        if (resp.data != '') {
          //console.log(resp)
          success++;
          data.path[i] = resp.data
          // imgArray1.push(resp.data)
          that.setData({
            imgArray2: data.path,
          })

          console.log('上传图片时候提交的图片数组', data.path)
        } else {
          wx.showToast({
            icon: "loading",
            title: "请重试"
          })
        }
      },
      fail: (res) => {
        fail++;
      },
      complete: () => {
        i++;
        if (i == data.path.length) {
          that.setData({
            images: data.path
          });
          //console.log('执行完毕');
          // console.log('成功：' + success + " 失败：" + fail);
        } else {
          //console.log(i);
          data.i = i;
          data.success = success;
          data.fail = fail;
          that.uploadimg1(data);
        }

      }
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})