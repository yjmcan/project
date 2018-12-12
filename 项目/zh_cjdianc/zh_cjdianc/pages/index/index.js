// pages/index/index.js
var a = getApp();
var util = require('../../utils/util.js');
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var qqmapsdk;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    characteristicList: [{
      text: "0配送费"
    }, {
      text: "0元起送"
    }],
    sortList: [{
      sort: "综合排序",
      image: "",
    }, {
      sort: "销量最高",
      image: "",
    }, {
      sort: "起送价最低",
      image: "",
    }, {
      sort: "配送费最低",
      image: "",
    }],
    // discountList: [{
    //   icon: "减",
    //   iconColor: "#FF635B",
    //   text: "满减优惠"
    // }, {
    //   icon: "领",
    //   iconColor: "#FF7298",
    //   text: "进店领券"
    // }, {
    //   icon: "返",
    //   iconColor: "#FB4343",
    //   text: "满返代金券"
    // }, {
    //   icon: "折",
    //   iconColor: "#C183E2",
    //   text: "折扣商品"
    // }, {
    //   icon: "订",
    //   iconColor: "#6FDF64",
    //   text: "提前下单优惠"
    // }, {
    //   icon: "赠",
    //   iconColor: "#FDC41E",
    //   text: "满赠活动"
    // }, {
    //   icon: "免",
    //   iconColor: "#43B697",
    //   text: "满免配送"
    // }],
    discountList: [{
      icon: "减",
      iconColor: "#FF635B",
      text: "满减优惠",
      zdname: ' and d.money is not null'
    }, {
      icon: "新",
      iconColor: "#34aaff",
      text: "新用户立减",
      zdname: ' and c.xyh_open=1'
    }, {
      icon: "提",
      iconColor: "#6FDF64",
      text: "到店自提",
      zdname: ' and c.is_zt=1'
    }],
    categoryList: {
      pageone: [{
        name: "美食",
        src: "/pages/images/1.png"
      }, {
        name: "甜点饮品",
        src: "/pages/images/2.png"
      }, {
        name: "美团超市",
        src: "/pages/images/3.png"
      }, {
        name: "正餐精选",
        src: "/pages/images/4.png"
      }, {
        name: "生鲜果蔬",
        src: "/pages/images/5.png"
      }, {
        name: "全部商家",
        src: "/pages/images/6.png"
      }, {
        name: "免配送费",
        src: "/pages/images/7.png"
      }, {
        name: "新商家",
        src: "/pages/images/8.png"
      }],
      pagetwo: [{
        name: "美食",
        src: "/pages/images/1.png"
      }, {
        name: "甜点饮品",
        src: "/pages/images/2.png"
      }, {
        name: "美团超市",
        src: "/pages/images/3.png"
      }, {
        name: "正餐精选",
        src: "/pages/images/4.png"
      }, {
        name: "生鲜果蔬",
        src: "/pages/images/5.png"
      }, {
        name: "全部商家",
        src: "/pages/images/6.png"
      }, {
        name: "免配送费",
        src: "/pages/images/7.png"
      }, {
        name: "新商家",
        src: "/pages/images/8.png"
      }]
    },
    params: { nopsf: 2, nostart: 2, yhhd: '' },
    issx: false,
    selected: 0,
    mask1Hidden: true,
    mask2Hidden: true,
    animationData: "",
    location: "",
    characteristicSelected: [false, false],
    discountSelected: null,
    selectedNumb: 0,
    sortSelected: "综合排序",
    pagenum: 1,
    storelist: [],
    bfstorelist: [],
    mygd: false,
    jzgd: true,
    isjzz: true,
  },
  //tjhb
  refresh: function () {
    var that = this
    // 红包1
    var animationData_4 = wx.createAnimation({
      duration: 3000,
      timingFunction: 'linear',
    })
    animationData_4.opacity(0.2).step({ duration: 200 })
      .opacity(0.3).scale(1.1, 1.1).translate3d(0, 10, 0).step({ duration: 200 })
      .opacity(0.4).scale(1.2, 1.2).translate3d(0, 30, 0).step({ duration: 200 })
      .opacity(0.5).scale(1.3, 1.3).translate3d(0, 50, 0).step({ duration: 200 })
      .opacity(0.6).scale(1.4, 1.4).translate3d(0, 70, 0).step({ duration: 200 })
      .opacity(0.7).translate3d(0, 90, 0).step({ duration: 200 })
      .opacity(0.8).translate3d(0, 110, 0).step({ duration: 200 })
      .opacity(0.9).translate3d(0, 130, 0).step({ duration: 200 })
      .opacity(1).translate3d(0, 140, 0).step({ duration: 200 })
    that.setData({
      animationData_4: animationData_4.export()
    })

    // 红包2
    var animationData_5 = wx.createAnimation({
      duration: 3000,
      timingFunction: 'linear',
    })
    animationData_5.opacity(0.2).step({ duration: 200 })
      .opacity(0.3).scale(1.1, 1.1).translate3d(-10, 10, 0).step({ duration: 200 })
      .opacity(0.4).scale(1.2, 1.2).translate3d(-15, 30, 0).step({ duration: 200 })
      .opacity(0.5).scale(1.3, 1.3).translate3d(-20, 50, 0).step({ duration: 200 })
      .opacity(0.6).scale(1.4, 1.4).translate3d(-25, 70, 0).step({ duration: 200 })
      .opacity(0.7).translate3d(-30, 90, 0).step({ duration: 200 })
      .opacity(0.8).translate3d(-35, 110, 0).step({ duration: 200 })
      .opacity(0.9).translate3d(-40, 130, 0).step({ duration: 200 })
      .opacity(1).translate3d(-30, 150, 0).step({ duration: 200 })
    that.setData({
      animationData_5: animationData_5.export()
    })
    // 天降红包字样
    var animation = wx.createAnimation({
      duration: 3000,
      timingFunction: 'linear',
    })
    animation.translate3d(0, 0, 0).scale(0, 0).translate3d(0, 0, 0).step({ duration: 200 })
      .scale(0.2, 0.2).translate3d(0, 20, 0).step({ duration: 200 })
      .scale(0.4, 0.4).translate3d(0, 40, 0).step({ duration: 200 })
      .scale(0.6, 0.6).translate3d(0, 60, 0).step({ duration: 200 })
      .scale(0.8, 0.8).translate3d(0, 80, 0).step({ duration: 200 })
      .scale(1, 1).translate3d(0, 90, 0).step({ duration: 200 })
    that.setData({
      animationData: animation.export()
    })
    // 主体背景
    var animationData_1 = wx.createAnimation({
      duration: 3000,
      timingFunction: 'linear',
    })
    animationData_1.scale(0, 0).step({ duration: 100 })
      .scale(0.2, 0.2).step({ duration: 100 })
      .scale(0.4, 0.4).step({ duration: 100 })
      .scale(0.6, 0.6).step({ duration: 200 })
      .scale(0.8, 0.8).step({ duration: 200 })
      .scale(1, 1).step({ duration: 200 })
    that.setData({
      animationData_1: animationData_1.export()
    })
    // 第一个金币
    setTimeout(function () {
      console.log('开始执行')
      var animationData_2 = wx.createAnimation({
        duration: 3000,
        timingFunction: 'linear',
      })
      animationData_2.opacity(0.1).step({ duration: 100 })
        .opacity(0.3).scale(1.1, 1.1).translate3d(10, 10, 0).step({ duration: 100 })
        .opacity(0.4).scale(1.2, 1.2).translate3d(11, 15, 0).step({ duration: 100 })
        .opacity(0.5).scale(1.3, 1.3).translate3d(12, 20, 0).step({ duration: 100 })
        .opacity(0.6).scale(1.4, 1.4).translate3d(13, 25, 0).step({ duration: 100 })
        .opacity(0.7).translate3d(14, 30, 0).step({ duration: 100 })
        .opacity(0.8).translate3d(15, 35, 0).step({ duration: 100 })
        .opacity(0.9).translate3d(16, 40, 0).step({ duration: 100 })
        .opacity(1).translate3d(17, 45, 0).step({ duration: 100 })
      that.setData({
        animationData_2: animationData_2.export()
      })
    }, 700)
    // 第三个金币
    setTimeout(function () {
      var animationData_6 = wx.createAnimation({
        duration: 3000,
        timingFunction: 'linear',
      })
      animationData_6.opacity(0.1).step({ duration: 100 })
        .opacity(0.3).scale(1.1, 1.1).translate3d(-100, 10, 0).step({ duration: 70 })
        .opacity(0.4).scale(1.2, 1.2).translate3d(-110, 15, 0).step({ duration: 70 })
        .opacity(0.5).scale(1.3, 1.3).translate3d(-120, 20, 0).step({ duration: 70 })
        .opacity(0.6).scale(1.4, 1.4).translate3d(-130, 25, 0).step({ duration: 100 })
        .opacity(0.7).translate3d(-120, 30, 0).step({ duration: 130 })
        .opacity(0.8).translate3d(-110, 35, 0).step({ duration: 130 })
        .opacity(0.9).translate3d(-100, 40, 0).step({ duration: 130 })
        .opacity(1).translate3d(-90, 45, 0).step({ duration: 130 })
      that.setData({
        animationData_6: animationData_6.export()
      })
    }, 700)
    // 第四个金币
    setTimeout(function () {
      var animationData_7 = wx.createAnimation({
        duration: 3000,
        timingFunction: 'linear',
      })
      animationData_7.opacity(0.1).translate3d(0, 0, 0).step({ duration: 100 })
        .opacity(0.3).scale(1.1, 1.1).translate3d(10, 10, 0).step({ duration: 70 })
        .opacity(0.4).scale(1.2, 1.2).translate3d(20, 15, 0).step({ duration: 70 })
        .opacity(0.5).scale(1.3, 1.3).translate3d(30, 20, 0).step({ duration: 70 })
        .opacity(0.6).scale(1.4, 1.4).translate3d(40, 25, 0).step({ duration: 100 })
        .opacity(0.7).translate3d(50, 30, 0).step({ duration: 200 })
        .opacity(0.8).translate3d(60, 35, 0).step({ duration: 200 })
        .opacity(0.9).translate3d(70, 40, 0).step({ duration: 200 })
        .opacity(1).translate3d(80, 45, 0).step({ duration: 300 })
      that.setData({
        animationData_7: animationData_7.export()
      })
    }, 700)
    // 树叶
    setTimeout(function () {
      var animationData_8 = wx.createAnimation({
        duration: 3000,
        timingFunction: 'ease-in-out',
      })
      animationData_8.opacity(0.1).translate3d(20, -50, 0).step({ duration: 300 })
        .opacity(1).translate3d(40, 240, 200).step({ duration: 3000 })
      that.setData({
        animationData_8: animationData_8.export()
      })
    }, 300)
    // 去下单
    setTimeout(function () {
      setInterval(function () {
        var animationData_9 = wx.createAnimation({
          duration: 3000,
          timingFunction: 'linear',
        })
        animationData_9.scale(1.0, 1.0).step({ duration: 300 })
          .scale(1.1, 1.1).step({ duration: 300 })
        that.setData({
          animationData_9: animationData_9.export()
        })
      }, 600)
    }, 1200)
  },
  //
  onTapTag: function (e) {
    var params = this.data.params, that = this;
    if (e.currentTarget.dataset.index == '1') {
      params.by = 'juli asc'
    }
    if (e.currentTarget.dataset.index == '2') {
      params.by = 'sales desc'
    }
    console.log(params, e.currentTarget.dataset.index)
    this.setData({
      sortSelected: that.data.sortList[0].sort,
      selected: e.currentTarget.dataset.index,
      params: params,
      pagenum: 1,
      storelist: [],
      bfstorelist: [],
      mygd: false,
      jzgd: true,
    });
    that.getstorelist();
  },
  sortSelected: function (e) {
    var params = this.data.params, that = this;
    if (e.currentTarget.dataset.sortindex == '0') {
      params.by = 'number asc'
    }
    if (e.currentTarget.dataset.sortindex == '1') {
      params.by = 'score desc'
    }
    if (e.currentTarget.dataset.sortindex == '2') {
      params.by = 'start_at asc'
    }
    if (e.currentTarget.dataset.sortindex == '3') {
      params.by = 'ps_money asc'
    }
    console.log(params, e.currentTarget.dataset.index, e.currentTarget.dataset.sortindex + 1)
    this.setData({
      selected: e.currentTarget.dataset.index,
      sortSelected: that.data.sortList[e.currentTarget.dataset.sortindex].sort,
      params: params,
      pagenum: 1,
      storelist: [],
      bfstorelist: [],
      mygd: false,
      jzgd: true,
    });
    that.getstorelist();
  },
  finish: function () {
    var params = this.data.params, that = this, info = this.data.characteristicSelected, characteristicList = this.data.characteristicList, discountSelected = this.data.discountSelected;
    this.setData({
      issx: true,
    })
    for (let i = 0; i < info.length; i++) {
      if (info[i]) {
        if (characteristicList[i].text == '0配送费') {
          params.nopsf = 1
        }
        if (characteristicList[i].text == '0元起送') {
          params.nostart = 1
        }
      }
    }
    if (discountSelected != null) {
      params.yhhd = this.data.discountList[discountSelected].zdname
    }
    else {
      params.yhhd = ''
    }
    that.setData({
      params: params,
      pagenum: 1,
      storelist: [],
      bfstorelist: [],
      mygd: false,
      jzgd: true,
    })
    that.getstorelist();
    console.log(params, this.data.issx, info, characteristicList, discountSelected)
  },
  clearSelectedNumb: function () {
    var params = this.data.params;
    params.nopsf = 2, params.nostart = 2, params.yhhd = ''
    this.setData({
      characteristicSelected: [false],
      discountSelected: null,
      selectedNumb: 0,
      issx: false,
      params: params,
      pagenum: 1,
      storelist: [],
      bfstorelist: [],
      mygd: false,
      jzgd: true,
    })
    this.getstorelist();
  },
  characteristicSelected: function (e) {
    var info = this.data.characteristicSelected;
    info[e.currentTarget.dataset.index] = !info[e.currentTarget.dataset.index];
    this.setData({
      characteristicSelected: info,
      selectedNumb: this.data.selectedNumb + (info[e.currentTarget.dataset.index] ? 1 : -1)
    })
    console.log(info, e.currentTarget.dataset.index, e.currentTarget.dataset.name);
  },
  discountSelected: function (e) {
    if (this.data.discountSelected != e.currentTarget.dataset.index) {
      this.setData({
        discountSelected: e.currentTarget.dataset.index,
        selectedNumb: this.data.selectedNumb + (this.data.discountSelected == null ? 1 : 0)
      })
    } else {
      this.setData({
        discountSelected: null,
        selectedNumb: this.data.selectedNumb - 1
      })
    }
  },
  mask1Cancel: function () {
    this.setData({
      mask1Hidden: true
    })
  },
  mask2Cancel: function () {
    this.setData({
      mask2Hidden: true
    })
  },
  onOverallTag: function (e) {
    console.log(e)
    this.setData({
      mask1Hidden: false
    })
  },
  onFilter: function () {
    this.setData({
      mask2Hidden: false
    })
  },
  hddb: function () {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 1000
    })
  },
  dwreLoad: function () {
    var that = this, params = this.data.params;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        let latitude = res.latitude
        let longitude = res.longitude
        let op = latitude + ',' + longitude;
        console.log(op)
        // 调用接口
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: latitude,
            longitude: longitude
          },
          coord_type: 1,
          success: function (res) {
            var start = res.result.ad_info.location
            params.lat = start.lat, params.lng = start.lng;
            console.log(res);
            console.log(res.result.formatted_addresses.recommend);
            console.log('坐标转地址后的经纬度：', res.result.ad_info.location)
            that.setData({
              weizhi: res.result.formatted_addresses.recommend,
              startjwd: start,
              params: params,
            })
            that.getstorelist();
            // Brand
            a.util.request({
              'url': 'entry/wxapp/Brand',
              'cachetime': '0',
              data: { lat: start.lat, lng: start.lng },
              success: function (res) {
                console.log(res.data)
                that.setData({
                  Brand: res.data
                })
              },
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
      fail: function () {
        wx.getSetting({
          success: (res) => {
            console.log(res)
            var authSetting = res.authSetting
            if (authSetting['scope.userLocation'] == false) {
              wx.showModal({
                title: '提示',
                content: '您点击了拒绝授权,无法正常使用功能，点击确定重新获取授权。',
                showCancel: false,
                success: function (res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                    wx.openSetting({
                      success: function success(res2) {
                        if (res2.authSetting["scope.userLocation"]) {
                          that.dwreLoad()
                        }
                        else {
                          that.dwreLoad()
                        }
                      }
                    });
                  }
                }
              })
            }
          }
        })
      },
      complete: function (res) {
      }
    })
  },
  getstorelist: function () {
    var that = this, page = that.data.pagenum; that.data.params.page = page, that.data.params.pagesize = 10;
    console.log(page, that.data.params);
    that.setData({
      isjzz: true
    })
    //推荐商家列表
    a.util.request({
      'url': 'entry/wxapp/StoreList',
      'cachetime': '0',
      data: that.data.params,
      success: function (res) {
        console.log('分页返回的商家列表数据', res.data)
        if (res.data.length < 10) {
          that.setData({
            mygd: true,
            jzgd: true,
            isjzz: false
          })
        }
        else {
          that.setData({
            jzgd: true,
            pagenum: page + 1,
            isjzz: false
          })
        }
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].sales == '0.0') {
            res.data[i].sales = '5.0'
          }
          var distance = parseFloat(res.data[i].juli)
          console.log(distance)
          if (distance < 1000) {
            res.data[i].aa = distance + 'm'
            res.data[i].aa1 = distance
          }
          else {
            res.data[i].aa = (distance / 1000).toFixed(2) + 'km'
            res.data[i].aa1 = distance
          }
        }
        var storelist = that.data.bfstorelist;
        storelist = storelist.concat(res.data);
        function unrepeat(arr) {
          var newarr = [];
          for (var i = 0; i < arr.length; i++) {
            if (newarr.indexOf(arr[i]) == -1) {
              newarr.push(arr[i]);
            }
          }
          return newarr;
        }
        storelist = unrepeat(storelist)
        that.setData({
          isxlsxz: false,
          storelist: storelist,
          bfstorelist: storelist,
        })
        console.log(storelist)
      },
    })
  },
  jumps: function (e) {
    var that = this
    var id = e.currentTarget.dataset.id, name = e.currentTarget.dataset.name;
    var appid = e.currentTarget.dataset.appid
    var src = e.currentTarget.dataset.src, src2 = e.currentTarget.dataset.wb_src
    var type = e.currentTarget.dataset.type
    console.log(id, name, appid, src, src2, type)
    if (type == 1) {
      console.log(src)
      wx: wx.navigateTo({
        url: src,
      })
    } else if (type == 2) {
      wx.setStorageSync('vr', src2)
      wx: wx.navigateTo({
        url: '../car/car',
      })
    } else if (type == 3) {
      wx.navigateToMiniProgram({
        appId: appid,
      })
    }
  },
  tzsjxq: function (e) {
    console.log(e.currentTarget.dataset, this.data.mdxx)
    if (e.currentTarget.dataset.type == 1) {
      getApp().sjid = e.currentTarget.dataset.sjid
      wx.navigateTo({
        url: '/zh_cjdianc/pages/seller/index',
      })
    }
    else{
      if (this.data.mdxx.is_tzms == '1') {
        getApp().sjid = e.currentTarget.dataset.sjid
        wx.navigateTo({
          url: '/zh_cjdianc/pages/seller/index',
        })
      }
      else {
        wx.navigateTo({
          url: '/zh_cjdianc/pages/takeout/takeoutindex?storeid=' + e.currentTarget.dataset.sjid,
        })
      }
    }
  },
  qxd: function () {
    this.setData({
      istjhb: false,
    })
  },
  sssj: function () {
    wx.navigateTo({
      url: 'sssj',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      isxlsxz: true
    })
    a.setNavigationBarColor(this);
    a.pageOnLoad(this);
    a.getUserInfo(function (userinfo) {
      console.log(userinfo)
      a.util.request({
        'url': 'entry/wxapp/CouponSet',
        'cachetime': '0',
        success: function (res) {
          that.setData({
            CouponSet: res.data,
          })
          var current_time = util.formatTime(new Date()).slice(11, 16)
          console.log(res.data, current_time)
          if (current_time >= res.data.time && current_time < res.data.time2) {
            console.log('hbtime')
            if (res.data.is_tjhb == '1') {
              a.util.request({
                'url': 'entry/wxapp/TjCoupons',
                'cachetime': '0',
                data: { user_id: userinfo.id },
                success: function (res) {
                  console.log(res.data, typeof (res.data))
                  if (res.data == '暂无红包') {

                  }
                  if (res.data == '今日已领') {

                  }
                  if (typeof (res.data) == "object") {
                    console.log(typeof (res.data))
                    that.setData({
                      istjhb: true,
                      tjhbarr: res.data,
                    })
                    that.refresh()
                  }
                },
              })
            }
          }
          else {
            console.log('nothbtime')
          }
        },
      })
    })
    // 系统设置
    a.util.request({
      'url': 'entry/wxapp/system',
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        var xtxx = res.data;
        // 实例化API核心类
        qqmapsdk = new QQMapWX({
          key: res.data.map_key
        });
        wx.setNavigationBarTitle({
          title: res.data.url_name,
        })
        that.setData({
          mdxx: res.data
        })
        //home分类
        a.util.request({
          'url': 'entry/wxapp/TypeAd',
          'cachetime': '0',
          success: function (res) {
            console.log(res.data)
            var navs = [];
            if (xtxx.fl_more == '1') {
              for (var i = 0, len = res.data.length; i < len; i += 8) {
                navs.push(res.data.slice(i, i + 8));
              }
            }
            if (xtxx.fl_more == '2') {
              for (var i = 0, len = res.data.length; i < len; i += 10) {
                navs.push(res.data.slice(i, i + 10));
              }
            }
            console.log(navs)
            that.setData({
              navs: navs,
            })
          },
        })
        that.dwreLoad()
        wx.setStorageSync('bqxx', res.data)
      },
    })
    //llz
    a.util.request({
      'url': 'entry/wxapp/Llz',
      'cachetime': '0',
      data: { type: '1,2' },
      success: function (res) {
        console.log(res)
        var dbllz = [], zbllz = [];
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].type == 1) {
            dbllz.push(res.data[i])
          }
          if (res.data[i].type == 2) {
            zbllz.push(res.data[i])
          }
        }
        that.setData({
          dbllz: dbllz,
          zbllz: zbllz
        })
      },
    })
    // ZbOrder
    a.util.request({
      'url': 'entry/wxapp/ZbOrder',
      'cachetime': '0',
      success: function (res) {
        console.log(res.data)
        that.setData({
          ZbOrder: res.data
        })
      },
    })
    a.util.request({
      'url': 'entry/wxapp/QgGoods',
      'cachetime': '0',
      data: { type_id: '', store_id: '', page: 1, pagesize: 10, type: 1 },
      success: function (res) {
        console.log('分页返回的列表数据', res.data)
        for (let i = 0; i < res.data.length; i++) {
          res.data[i].discount = (Number(res.data[i].money) / Number(res.data[i].price) * 10).toFixed(1)
          res.data[i].yqnum = (((Number(res.data[i].number) - Number(res.data[i].surplus)) / Number(res.data[i].number) * 100)).toFixed(1)
        }
        that.setData({
          qglist: res.data,
        })
      }
    });
    //home轮播图和开屏公告
    a.util.request({
      'url': 'entry/wxapp/ad',
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        var toplb = [], zblb = [], dblb = [];
        for (var i = 0; i < res.data.length; i++) {
          if (res.data[i].type == '1') {
            toplb.push(res.data[i])
          }
          if (res.data[i].type == '3') {
            zblb.push(res.data[i])
          }
          if (res.data[i].type == '4') {
            dblb.push(res.data[i])
          }
        }
        console.log(toplb, zblb, dblb)
        that.setData({
          toplb: toplb,
          zblb: zblb,
          dblb: dblb
        })
      },
    })
  },
  onPageScroll: function (e) {
    // console.log(e)
    if (e.scrollTop > 0) {
      this.setData({
        topmove: true
      })
    }
    else {
      this.setData({
        topmove: false
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
    // var that = this;
    // wx.request({
    //   url: "https://www.easy-mock.com/mock/596257bc9adc231f357c4664/restaurant/info",
    //   method: "GET",
    //   success: function (res) {
    //     console.log(res)
    //     that.setData({
    //       restaurant: res.data.data.restaurant,
    //       location: wx.getStorageSync('location')
    //     })
    //   }
    // });
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
    var that = this
    this.setData({
      issx: false,
      selected: 0,
      mask1Hidden: true,
      mask2Hidden: true,
      animationData: "",
      location: "",
      characteristicSelected: [false, false],
      discountSelected: null,
      selectedNumb: 0,
      sortSelected: "综合排序",
      params: { nopsf: 2, nostart: 2, yhhd: '' },
      pagenum: 1,
      storelist: [],
      bfstorelist: [],
      mygd: false,
      jzgd: true,
    })
    console.log('下拉刷新', this.data.pagenum, this.data.isxlsxz)
    if (!this.data.isxlsxz) {
      this.setData({
        jzgd: false
      })
      this.onLoad();
    }
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('上拉加载', this.data.pagenum)
    var that = this;
    if (!this.data.mygd && this.data.jzgd && !this.data.isjzz) {
      this.setData({
        jzgd: false
      })
      this.getstorelist();
    }
    else {
      // wx.showToast({
      //   title: '没有更多了',
      //   icon: 'loading',
      //   duration: 1000,
      // })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this, fx_title = (that.data.mdxx.fx_title == '' ? that.data.mdxx.url_name : that.data.mdxx.fx_title);
    return {
      title: fx_title,
      path: '/zh_cjdianc/pages/Liar/loginindex',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})