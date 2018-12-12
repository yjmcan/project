// pages/index/index.js
var a = getApp();
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
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].sales == '0.0') {
            res.data[i].sales = '5.0'
          }
          // var sjjwd = (res.data[i].coordinates).split(',')
          // console.log(sjjwd, start)
          // var distance = (util.getDistance(start.lat, start.lng, sjjwd[0], sjjwd[1])).toFixed(1)
          // console.log(distance)
          var distance = parseFloat(res.data[i].juli)
          console.log(distance)
          console.log()
          if (distance < 1000) {
            res.data[i].aa = distance + 'm'
            res.data[i].aa1 = distance
          }
          else {
            res.data[i].aa = (distance / 1000).toFixed(2) + 'km'
            res.data[i].aa1 = distance
          }
          that.setData({
            storelist: storelist,
            bfstorelist: storelist,
          })
        }
        console.log(storelist)
      },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    a.setNavigationBarColor(this);
    // a.pageOnLoad(this);
    // a.getUserInfo(function (userinfo) {
    //   console.log(userinfo)
    // })
    console.log(options)
    wx.setNavigationBarTitle({
      title: options.typename,
    })
    var that = this, params = this.data.params;
    params.type_id = options.type_id;
    that.setData({
      params: params,
    })
    // 系统设置
    a.util.request({
      'url': 'entry/wxapp/system',
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        // 实例化API核心类
        qqmapsdk = new QQMapWX({
          key: res.data.map_key
        });
        that.setData({
          mdxx: res.data
        })
        that.dwreLoad()
        wx.setStorageSync('bqxx', res.data)
      },
    })
    // // 网址信息
    // a.util.request({
    //   'url': 'entry/wxapp/Url2',
    //   'cachetime': '0',
    //   success: function (res) {
    //     console.log(res.data)
    //     that.setData({
    //       url2: res.data
    //     })
    //   },
    // })
    //home分类
    // a.util.request({
    //   'url': 'entry/wxapp/TypeAd',
    //   'cachetime': '0',
    //   success: function (res) {
    //     console.log(res.data)
    //     var navs = [];
    //     for (var i = 0, len = res.data.length; i < len; i += 8) {
    //       navs.push(res.data.slice(i, i + 8));
    //     }
    //     console.log(navs)
    //     that.setData({
    //       navs: navs,
    //     })
    //   },
    // })
  },
  tzsjxq: function (e) {
    console.log(e.currentTarget.dataset.sjid, this.data.mdxx)
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
  },
  onPageScroll: function (e) {
    // console.log(e)
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
    console.log('下拉刷新', this.data.pagenum)
    if (this.data.jzgd) {
      this.setData({
        jzgd: false
      })
      this.dwreLoad();
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
  }
})