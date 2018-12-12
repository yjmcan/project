const app = getApp()
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var util = require('../../utils/util.js');
var qqmapsdk;
Page({
  data: {
    listarr: ['距您最近', '推荐排序', '人气优先'],
    weizhi: '定位中...',
    kpgg: true,
    activeIndex: 0,
    mdlist: [],
    qqsj: false,
    pagenum: 1,
    flpagenum: 1,
    storelist: [],
    flstorelist: [],
    mygd: false,
    jzgd: true,
    djfl: false,
    typetext: '推荐',
    type: 2,
    djjz: false,
  },
  closekpgg: function () {
    this.setData({
      kpgg: true,
    })
  },
  //点击切换排序
  tabClick: function (e) {
    var that = this;
    var index = e.currentTarget.id
    console.log(index)
    this.setData({
      activeIndex: e.currentTarget.id,
      qqsj: false,
      pagenum: 1,
      flpagenum: 1,
      storelist: [],
      flstorelist: [],
      mygd: false,
      jzgd: true,
      djjz: true,
    });
    if (index == '0') {
      this.setData({
        type: 2,
      })
      if (this.data.djfl) {
        console.log(this.data.djfl)
        this.flreLoad();
      }
      else {
        this.reLoad();
      }
    }
    if (index == '1') {
      this.setData({
        type: 1,
      })
      if (this.data.djfl) {
        console.log(this.data.djfl)
        this.flreLoad();
      }
      else {
        this.reLoad();
      }
    }
    if (index == '2') {
      this.setData({
        type: 3,
      })
      if (this.data.djfl) {
        console.log(this.data.djfl)
        this.flreLoad();
      }
      else {
        this.reLoad();
      }
    }
  },
  xzwz: function () {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        console.log(res)
        that.setData({
          weizhi: res.name,
        })
        that.hqalllb(res.latitude, res.longitude, 1)
      },
    })
  },
  sssj: function () {
    wx.navigateTo({
      url: 'sssj',
    })
  },
  cxfl: function (e) {
    var that = this;
    that.setData({
      activeIndex: 0,
      qqsj: false,
      djfl: true,
      mygd: false,
      jzgd: true,
      flpagenum: 1,
      flstorelist: [],
      djjz: true,
    })
    console.log(e.currentTarget.dataset.flid, e.currentTarget.dataset.flname)
    that.setData({
      flid: e.currentTarget.dataset.flid,
      typetext: e.currentTarget.dataset.flname,
      flname: e.currentTarget.dataset.flname,
    })
    this.flreLoad();
  },
  flreLoad: function () {
    console.log('flreLoad')
    var that = this;
    var flid = this.data.flid, sjtype = this.data.type;
    console.log(sjtype)
    //定位用户地址
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        console.log(res)
        let latitude = res.latitude
        let longitude = res.longitude
        let op = latitude + ',' + longitude;
        console.log(op)
        that.hqfllb(latitude, longitude, flid, sjtype)
      },
      fail: function () {
        wx.showModal({
          title: '警告',
          content: '您点击了拒绝地理位置授权,无法正常使用功能，点击确定重新获取授权。',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              wx.openSetting({
                success: (res) => {
                  if (res.authSetting["scope.userLocation"]) {////如果用户重新同意了授权登录
                    wx.getLocation({
                      type: 'wgs84',
                      success: function (res) {
                        let latitude = res.latitude
                        let longitude = res.longitude
                        let op = latitude + ',' + longitude;
                        console.log(op)
                        that.hqfllb(latitude, longitude, flid, sjtype)
                      },
                    })
                  } else {
                    that.reLoad();
                  }
                },
                fail: function (res) {
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
  onLoad: function (options) {
    var that = this;
    console.log(this);
    console.log(options)
    var scene = decodeURIComponent(options.scene)
    console.log('scene', scene)
    if (scene != 'undefined') {
      var fxzuid = scene
    }
    if (options.userid != null) {
      console.log('转发获取到的userid:', options.userid)
      var fxzuid = options.userid
    }
    console.log('fxzuid', fxzuid)
    //取key
    app.util.request({
      'url': 'entry/wxapp/GetMapKey',
      'cachetime': '0',
      success: function (res) {
        console.log(res.data)
        // 实例化API核心类
        qqmapsdk = new QQMapWX({
          key: res.data.map_key
        });
        that.reLoad();
      }
    });
    //获取设备高度
    wx.getSystemInfo({
      success(res) {
        that.setData({
          scrollHeight: res.windowHeight
        })
      }
    });
    //取平台信息
    app.util.request({
      'url': 'entry/wxapp/GetPlatform',
      'cachetime': '0',
      success: function (res) {
        console.log(res.data)
        var xtxx=res.data;
        //取行业列表;
        app.util.request({
          'url': 'entry/wxapp/type',
          'cachetime': '0',
          success: function (res) {
            console.log(res.data)
            var navs = [];
            if (xtxx.fl_more == '1') {
              for (var i = 0, len = res.data.length; i < len; i += 8) {
                navs.push(res.data.slice(i, i + 8));
              }
              console.log(navs)
              that.setData({
                navs: navs,
              })
            }
            else {
              for (var i = 0, len = res.data.length; i < len; i += 10) {
                navs.push(res.data.slice(i, i + 10));
              }
              console.log(navs)
              that.setData({
                navs: navs,
              })
            }
          }
        });
        //GetSlide;
        app.util.request({
          'url': 'entry/wxapp/GetSlide',
          'cachetime': '0',
          success: function (res1) {
            if (res.data.is_ad == '1' && res1.data.length != 0) {
              that.setData({
                kpgg: false,
              })
              console.log(res1.data)
              that.setData({
                kpggimg: res1.data
              })
            }
          }
        });
        that.setData({
          bqxx: xtxx
        })
        wx.setNavigationBarTitle({
          title: xtxx.xcx_name,
        })
      }
    });
    //获取用户头像等信息
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //登录
      console.log(app.globalData)
      app.userlogin(function (userdata) {
        console.log(userdata)
        console.log('用户id', userdata.id)
        //Binding
        if (fxzuid != null) {
          app.util.request({
            'url': 'entry/wxapp/Binding',
            'cachetime': '0',
            data: { fx_user: userdata.id, user_id: fxzuid },
            success: function (res) {
              console.log(res)
            },
          })
        }
        app.util.request({
          'url': 'entry/wxapp/FxSet',
          'cachetime': '0',
          success: function (res) {
            console.log(res.data)
            that.setData({
              img: res.data.img,
              url: getApp().imgurl,
              fxset: res.data,
            })
            if (res.data.is_fx == '1') {
              console.log('开启分销审核')
            }
            if (res.data.is_fx == '2') {
              console.log('未开启审核')
              app.util.request({
                'url': 'entry/wxapp/Binding',
                'cachetime': '0',
                data: { fx_user: userdata.id, user_id: 0 },
                success: function (res) {
                  console.log(res)
                },
              })
            }
          }
        });
      })
    })
    //取imglink
    app.util.request({
      'url': 'entry/wxapp/url',
      'cachetime': '0',
      success: function (res) {
        console.log(res.data)
        getApp().imglink = res.data
      }
    });
    //取imgurl;
    app.util.request({
      'url': 'entry/wxapp/Attachurl',
      'cachetime': '0',
      success: function (res) {
        console.log(res.data)
        that.setData({
          url: res.data
        })
        getApp().imgurl = res.data
      }
    });
    //delgq;
    // app.util.request({
    //   'url': 'entry/wxapp/DelAllCoupons',
    //   'cachetime': '0',
    //   success: function (res) {
    //     console.log(res)
    //   }
    // });
    //取轮播;
    app.util.request({
      'url': 'entry/wxapp/ad',
      'cachetime': '0',
      success: function (res) {
        console.log(res.data)
        that.setData({
          lb: res.data
        })
      }
    });
    // this.reLoad(); 
  },
  reLoad: function () {
    console.log('reLoad')
    var that = this, sjtype = this.data.type;
    console.log(sjtype)
    //定位用户地址
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        console.log(res)
        let latitude = res.latitude
        let longitude = res.longitude
        let op = latitude + ',' + longitude;
        console.log(op)
        that.hqalllb(latitude, longitude, sjtype)
      },
      fail: function () {
        wx.showModal({
          title: '警告',
          content: '您点击了拒绝地理位置授权,无法正常使用功能，点击确定重新获取授权。',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              wx.openSetting({
                success: (res) => {
                  if (res.authSetting["scope.userLocation"]) {////如果用户重新同意了授权登录
                    wx.getLocation({
                      type: 'wgs84',
                      success: function (res) {
                        let latitude = res.latitude
                        let longitude = res.longitude
                        let op = latitude + ',' + longitude;
                        console.log(op)
                        // that.setData({
                        //   lat:latitude,
                        //   lng:longitude,
                        // })
                        that.hqalllb(latitude, longitude, sjtype)
                      },
                    })
                  } else {
                    that.reLoad();
                  }
                },
                fail: function (res) {
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
  hqalllb: function (latitude, longitude, sjtype) {
    var that = this;
    console.log('hqalllb', this.data.pagenum, this.data.flpagenum)
    // 调用接口
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: latitude,
        longitude: longitude
      },
      coord_type: 1,
      success: function (res) {
        var start = res.result.ad_info.location
        console.log(res);
        console.log(res.result.formatted_addresses.recommend);
        console.log('坐标转地址后的经纬度：', res.result.ad_info.location)
        that.setData({
          weizhi: res.result.formatted_addresses.recommend,
        })
        //取门店;
        app.util.request({
          'url': 'entry/wxapp/MdList',
          'cachetime': '0',
          data: { lat: start.lat, lng: start.lng, page: that.data.pagenum, pagesize: 10, type: sjtype },
          success: function (res) {
            console.log('分页返回的门店列表数据', res.data)
            if (res.data.length < 10) {
              that.setData({
                mygd: true,
                jzgd: true,
              })
            }
            else {
              that.setData({
                jzgd: true,
                pagenum: that.data.pagenum + 1,
              })
            }
            that.setData({
              djjz: false,
            })
            var mdlist = that.data.storelist;
            mdlist = mdlist.concat(res.data)
            for (let i = 0; i < mdlist.length; i++) {
              var distance = (util.getDistance(start.lat, start.lng, mdlist[i].lat, mdlist[i].lng)).toFixed(2)
              if (distance < 1000) {
                mdlist[i].distance = distance + 'm'
              }
              else {
                mdlist[i].distance = (distance / 1000).toFixed(2) + 'km'
              }
            }
            that.setData({
              mdlist: mdlist,
              allstore: mdlist,
              storelist: mdlist,
              qqsj: true,
            })
            console.log('处理后的数据', mdlist)
          }
        });
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        console.log(res);
      }
    });
  },
  hqfllb: function (latitude, longitude, flid, sjtype) {
    var that = this;
    console.log('hqfllb', this.data.pagenum, this.data.flpagenum)
    // 调用接口
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: latitude,
        longitude: longitude
      },
      coord_type: 1,
      success: function (res) {
        var start = res.result.ad_info.location
        console.log(res);
        console.log(res.result.formatted_addresses.recommend);
        console.log('坐标转地址后的经纬度：', res.result.ad_info.location)
        that.setData({
          weizhi: res.result.formatted_addresses.recommend,
        })
        //取门店;
        app.util.request({
          'url': 'entry/wxapp/MdList',
          'cachetime': '0',
          data: { lat: start.lat, lng: start.lng, type_id: flid, page: that.data.flpagenum, pagesize: 10, type: sjtype },
          success: function (res) {
            console.log('分页返回的分类门店列表数据', res.data)
            if (res.data.length < 10) {
              that.setData({
                mygd: true,
                jzgd: true,
              })
            }
            else {
              that.setData({
                jzgd: true,
                flpagenum: that.data.flpagenum + 1,
              })
            }
            that.setData({
              djjz: false,
            })
            var mdlist = that.data.flstorelist;
            mdlist = mdlist.concat(res.data)
            for (let i = 0; i < mdlist.length; i++) {
              var distance = (util.getDistance(start.lat, start.lng, mdlist[i].lat, mdlist[i].lng)).toFixed(2)
              if (distance < 1000) {
                mdlist[i].distance = distance + 'm'
              }
              else {
                mdlist[i].distance = (distance / 1000).toFixed(2) + 'km'
              }
            }
            that.setData({
              mdlist: mdlist,
              qqsj: true,
              flstorelist: mdlist,
              typetext: that.data.flname,
            })
            console.log('处理后的数据', mdlist)
          }
        });
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        console.log(res);
      }
    });
  },
  // 跳转小程序
  tzxcx: function (e) {
    console.log(e.currentTarget.dataset.appid)
    wx.navigateToMiniProgram({
      appId: e.currentTarget.dataset.appid,
      success(res) {
        // 打开成功
        console.log(res)
      }
    })
  },
  tzsj: function (e) {
    console.log(e.currentTarget.dataset.index, this.data.lb)
    var item = this.data.lb[e.currentTarget.dataset.index]
    console.log(item)
    if (item.item == '1') {
      wx.navigateTo({
        url: item.src,
      })
    }
    if (item.item == '2') {
      wx.navigateTo({
        url: 'webhtml?weburl=' + item.id,
      })
    }
    if (item.item == '3') {
      wx.navigateToMiniProgram({
        appId: item.tz_appid,
        success(res) {
          // 打开成功
          console.log(res)
        }
      })
    }
  },
  wyrz: function () {
    wx.navigateTo({
      url: '../my/wyrz'
    })
  },
  tzwy: function (e) {
    console.log(e.currentTarget.dataset.index, this.data.kpggimg)
    var item = this.data.kpggimg[e.currentTarget.dataset.index]
    console.log(item)
    if (item.item == '1') {
      wx.navigateTo({
        url: item.src,
      })
    }
    if (item.item == '2') {
      wx.navigateTo({
        url: 'webhtml?weburl=' + item.id,
      })
    }
    if (item.item == '3') {
      wx.navigateToMiniProgram({
        appId: item.tz_appid,
        success(res) {
          // 打开成功
          console.log(res)
        }
      })
    }
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    console.log(app.globalData)
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  onReachBottom: function () {
    console.log('上拉加载', this.data.pagenum, this.data.flpagenum)
    var that = this;
    if (!this.data.mygd && this.data.jzgd && !this.data.djjz) {
      this.setData({
        jzgd: false
      })
      if (this.data.djfl) {
        console.log(this.data.djfl)
        this.flreLoad();
      }
      else {
        this.reLoad();
      }
    }
    else {
      // wx.showToast({
      //   title: '没有更多了',
      //   icon: 'loading',
      //   duration: 1000,
      // })
    }
  },
  onPullDownRefresh: function () {
    this.setData({
      weizhi: '定位中...',
      activeIndex: 0,
      mdlist: [],
      qqsj: false,
      pagenum: 1,
      flpagenum: 1,
      storelist: [],
      flstorelist: [],
      mygd: false,
      jzgd: true,
      djfl: false,
      typetext: '推荐',
      type: 2,
      djjz: false,
    })
    console.log('下拉刷新', this.data.pagenum, this.data.flpagenum)
    var that = this;
    if (this.data.jzgd) {
      this.setData({
        jzgd: false
      })
      this.reLoad();
    }
    wx.stopPullDownRefresh();
  },
  /**
  * 用户点击右上角分享
  */
  onShareAppMessage: function () {

  }
})