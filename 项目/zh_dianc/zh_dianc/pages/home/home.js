// pages/home/home.js
const app = getApp()
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var amapFile = require('../../utils/amap-wx.js');
var util = require('../../utils/util.js');
var qqmapsdk;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    huise: false,
    huangse: true,
    hdnum: 0,
    kpgg: true,
    slider: [],
    currentTab: 0,
    swiperCurrent: 0,
    listarr: ['距离', '推荐', '销量', '评分'],
    activeIndex: 0,
    qqsj: false,
    scrollHeight: 0,
    pagenum:1,
    storelist:[],
    mygd:false,
    jzgd:true,
    jzwb:false,
    bjyylb: 'laba',
  },
  /**
 * 生命周期函数--监听页面加载
 */
  onLoad: function (options) {
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
    console.log('fxzuid',fxzuid)
    //当前时间
    var time = util.formatTime(new Date());
    var current_time = time.slice(11, 16)
    console.log(current_time)
    this.setData({
      current_time: current_time
    })
    //
    var that = this;
    //tq
    var myAmapFun = new amapFile.AMapWX({ key: 'd03d1ecd781de95397abc7c9f60273e2' });
    myAmapFun.getWeather({
      success: function (data) {
        //成功回调
        console.log(data)
        that.setData({
          tianqi: data
        })
      },
      fail: function (info) {
        //失败回调
        console.log(info)
      }
    })
    //获取设备高度
    wx.getSystemInfo({
      success(res) {
        that.setData({
          scrollHeight: res.windowHeight
        })
      }
    });
    // 系统设置
    app.util.request({
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
        if (res.data.more == '1') {
          //定位用户地址
          that.dwreLoad();
          wx.setNavigationBarTitle({
            title: res.data.pt_name
          })
        }
        if (res.data.more == '2') {
          that.danreLoad();
        }
        wx.setStorageSync('bqxx', res.data)
      },
    })
    // 网址信息
    app.util.request({
      'url': 'entry/wxapp/Url',
      'cachetime': '0',
      success: function (res) {
        // console.log(res.data)
        wx.setStorageSync('imglink', res.data)
        that.setData({
          url: res.data
        })
      },
    })
    // 网址信息
    app.util.request({
      'url': 'entry/wxapp/Url2',
      'cachetime': '0',
      success: function (res) {
        console.log(res.data)
        that.setData({
          url2: res.data
        })
      },
    })
    //home轮播图和开屏公告
    app.util.request({
      'url': 'entry/wxapp/ad2',
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        var lb = [], kpggimg = [];
        for (var i = 0; i < res.data.length; i++) {
          if (res.data[i].type == '1') {
            lb.push(res.data[i])
          }
          if (res.data[i].type == '2') {
            kpggimg.push(res.data[i])
          }
        }
        console.log(lb, kpggimg)
        that.setData({
          slider: lb,
        })
        if (kpggimg.length != 0) {
          that.setData({
            kpgg: false,
            kpggimg: kpggimg
          })
        }
      },
    })
    //home分类
    app.util.request({
      'url': 'entry/wxapp/storetype',
      'cachetime': '0',
      success: function (res) {
        console.log(res.data)
        var navs = [];
        for (var i = 0, len = res.data.length; i < len; i += 8) {
          navs.push(res.data.slice(i, i + 8));
        }
        console.log(navs)
        that.setData({
          navs: navs,
        })
      },
    })
    //获取头像
    wx.getUserInfo({
      success: function (res) {
        console.log(res.userInfo)
        var userInfo = res.userInfo;
        that.setData({
          nickName: userInfo.nickName,
          avatarUrl: userInfo.avatarUrl,
        })
      }, fail: function () {
        wx.showModal({
          title: '警告',
          content: '您点击了拒绝授权,无法正常显示个人信息,点击确定重新获取授权。',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              wx.openSetting({
                success: (res) => {
                  if (res.authSetting["scope.userInfo"]) {////如果用户重新同意了授权登录
                    wx.getUserInfo({
                      success: function (res) {
                        console.log(res.userInfo)
                        var userInfo = res.userInfo;
                        that.setData({
                          nickName: userInfo.nickName,
                          avatarUrl: userInfo.avatarUrl,
                        })
                      }
                    })
                  } else {
                    that.setData({
                      nickName: '',
                      avatarUrl: '',
                    })
                  }
                },
                fail: function (res) {
                }
              })
            }
          }
        })
      }, complete: function (res) {
      }
    })
    //登录
    wx.login({
      success: function (res) {
        var code = res.code
        wx.setStorageSync("code", res.code)
        app.util.request({
          'url': 'entry/wxapp/openid',
          'cachetime': '0',
          data: { code: code },
          success: function (res) {
            console.log(res)
            wx.setStorageSync("key", res.data.session_key)
            // var img = that.data.userInfo.avatarUrl
            // var name = that.data.userInfo.nickName
            // 异步保存用户openid
            wx.setStorageSync("openid", res.data.openid)
            var openid = res.data.openid
            console.log(openid)
            // 获取用户登录信息
            if (openid == '') {
              wx: wx.showToast({
                title: '没有获取到openid',
                icon: '',
                image: '',
                duration: 1000,
                mask: true,
                success: function (res) { },
                fail: function (res) { },
                complete: function (res) { },
              })
            } else {
              app.util.request({
                'url': 'entry/wxapp/Login',
                'cachetime': '0',
                data: { openid: openid, img: that.data.avatarUrl, name: that.data.nickName },
                success: function (res) {
                  console.log(res)
                  // 异步保存用户登录信息
                  wx.setStorageSync('users', res.data)
                  // 获取用户状态
                  app.util.request({
                    'url': 'entry/wxapp/New',
                    'cachetime': '0',
                    data: { user_id: res.data.id, store_id: that.data.mdxx.default_store },
                    success: function (res) {
                      console.log(res)
                      wx.setStorageSync('new_user', res.data)
                    },
                  })
                  //Binding
                  if(fxzuid!=null){
                    app.util.request({
                      'url': 'entry/wxapp/Binding',
                      'cachetime': '0',
                      data: { fx_user: res.data.id, user_id: fxzuid },
                      success: function (res) {
                        console.log(res)
                      },
                    })
                  }
                },
              })
            }

          },
        })
      }
    })
  },
  dwreLoad:function(){
    var that=this;
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
            console.log(res);
            console.log(res.result.formatted_addresses.recommend);
            console.log('坐标转地址后的经纬度：', res.result.ad_info.location)
            that.setData({
              weizhi: res.result.formatted_addresses.recommend,
              startjwd: start,
            })
            that.duoreLoad(start);
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
        wx.showModal({
          title: '警告',
          content: '您点击了拒绝授权,无法正常使用功能，点击确定重新获取授权。',
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
                              startjwd: start,
                            })
                            that.duoreLoad(start);
                          },
                          fail: function (res) {
                            console.log(res);
                          },
                          complete: function (res) {
                            console.log(res);
                          }
                        });
                      },
                    })
                  } else {
                    that.dwreLoad();
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
  //关闭开屏公告
  closekpgg: function () {
    this.setData({
      kpgg: true
    })
  },
  //多店的自定义方法
  duoreLoad: function (start) {
    console.log(start)
    var that = this;
    //推荐商家列表
    app.util.request({
      'url': 'entry/wxapp/StoreList',
      'cachetime': '0',
      data: { lat: start.lat, lng: start.lng,page: that.data.pagenum, pagesize: 10 },
      success: function (res) {
        console.log('分页返回的商家列表数据', res.data)
        if (res.data.length < 10) {
          that.setData({
            mygd: true,
            jzgd: true,
            jzwb: true,
          })
        }
        else {
          that.setData({
            jzgd: true,
            pagenum: that.data.pagenum + 1,
          })
        }
        var storelist = that.data.storelist;
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
          if (res.data[i].score == '0.0') {
            res.data[i].score = '5.0'
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
            jlstorelist: storelist,
            tjpx: storelist,
            xlpx: storelist,
            pfpx: storelist,
            storelist: storelist,
            qqsj: true,
          })
          that.setData({
            tjstorelist: that.data.tjpx.sort(that.comparesx("number")),
            xlstorelist: that.data.xlpx.sort(that.comparejx("sales")),
            pfstorelist: that.data.pfpx.sort(that.comparejx("score")),
          })
        }
        console.log(storelist)
      },
    })
  },
  //点击切换排序
  tabClick: function (e) {
    var that = this;
    var index = e.currentTarget.id
    console.log(index)
    this.setData({
      activeIndex: e.currentTarget.id,
    });
    if (index == '1') {
      that.setData({
        tjstorelist: that.data.tjpx.sort(that.comparesx("number")),
        qqsj: true
      })
    }
    if (index == '2') {
      console.log(that.data.xlpx)
      that.setData({
        xlstorelist: that.data.xlpx.sort(that.comparejx("sales")),
        qqsj: true
      })
    }
    if (index == '3') {
      console.log(that.data.pfpx)
      that.setData({
        pfstorelist: that.data.pfpx.sort(that.comparejx("score")),
        qqsj: true
      })
    }
    if (index == '0') {
      that.setData({
        qqsj: true
      })
    }
  },
  // 滑动切换
  bindChange: function (e) {

    var that = this;
    that.setData({ currentTab: e.detail.current });

  },
  comparesx: function (prop) {
    return function (obj1, obj2) {
      var val1 = obj1[prop];
      var val2 = obj2[prop];
      if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
        val1 = Number(val1);
        val2 = Number(val2);
      }
      if (val1 < val2) {
        return -1;
      } else if (val1 > val2) {
        return 1;
      } else {
        return 0;
      }
    }
  },
  comparejx: function (prop) {
    return function (obj1, obj2) {
      var val1 = obj1[prop];
      var val2 = obj2[prop];
      if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
        val1 = Number(val1);
        val2 = Number(val2);
      }
      if (val1 < val2) {
        return 1;
      } else if (val1 > val2) {
        return -1;
      } else {
        return 0;
      }
    }
  },
  //自定义算距离方法
  distance: function (f, t, cbk) {
    // 调用距离接口
    var distance;
    qqmapsdk.calculateDistance({
      mode: 'driving',
      from: {
        latitude: f.lat,
        longitude: f.lng
      },
      to: [{
        latitude: t.lat,
        longitude: t.lng
      }],
      success: function (res) {
        console.log(res);
        if (res.status == 0) {
          distance = Math.round(res.result.elements[0].distance)
          cbk(distance)
        }
      },
      fail: function (res) {
        console.log(res);
        if (res.status == 373) {
          distance = 15000;
          cbk(distance)
        }
      },
      complete: function (res) {
        console.log(res);
      }
    });
  },
  //自定义转换方法
  changejwd: function (lat, lng, cbk) {
    //坐标转地址
    var jwd;
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: lat,
        longitude: lng
      },
      coord_type: 3,
      success: function (res) {
        console.log(res);
        console.log('坐标转地址后的经纬度：', res.result.ad_info.location)
        jwd = res.result.ad_info.location
        cbk(jwd)
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        console.log(res);
      }
    });
  },
  tzsj: function (e) {
    console.log(e.currentTarget.dataset.sjid)
    var sjinfo = e.currentTarget.dataset.sjid
    getApp().sjid = e.currentTarget.dataset.sjid.id
    if (sjinfo.is_dn == '0' && sjinfo.is_pd == '0' && sjinfo.is_yy == '0' && sjinfo.is_wm == '1' && sjinfo.is_sy == '0') {
      wx.navigateTo({
        url: '../index/index?type=2'
      })
    }
    else {
      wx.navigateTo({
        url: '../info/info'
      })
    }
  },
  tzfl: function (e) {
    console.log(e.currentTarget.dataset.flinfo)
    wx.navigateTo({
      url: 'sjfl?flid=' + e.currentTarget.dataset.flinfo.id + '&flname=' + e.currentTarget.dataset.flinfo.type_name
    })
  },

  //单店的自定义方法
  danreLoad: function () {
    this.setData({
      hdnum: 0,
    })
    var that = this
    var time = util.formatTime(new Date());
    // 再通过setData更改Page()里面的data，动态更新页面的数据  
    var settime = time.slice(11, 16)
    console.log(settime)
    // 商家信息
    console.log(that.data)
    var current_time = that.data.current_time
    app.util.request({
      'url': 'entry/wxapp/Store',
      'cachetime': '0',
      data: { id: that.data.mdxx.default_store, user_id: wx.getStorageSync('users').id },
      success: function (res) {
        console.log(res)
        //背景音乐
        if (res.data.store_mp3 != '' && res.data.is_mp3 == '1') {
          wx.playBackgroundAudio({
            dataUrl: res.data.store_mp3,
          })
          wx.getBackgroundAudioPlayerState({
            success: function (res) {
              console.log(res)
              var status = res.status
              var dataUrl = res.dataUrl
              var currentPosition = res.currentPosition
              var duration = res.duration
              var downloadPercent = res.downloadPercent
            },
            fail: function (res) {
              console.log(res)
            },
            complete: function (res) {
              console.log(res)
            }
          })
        }
        //背景色
        wx.setStorageSync('nbcolor', res.data.color)
        getApp().sjid = res.data.id
        wx.setNavigationBarTitle({
          title: res.data.name
        })
        wx.setNavigationBarColor({
          frontColor: '#ffffff',
          backgroundColor: res.data.color,
        })
        that.setData({
          color: res.data.color
        })
        //满减
        app.util.request({
          'url': 'entry/wxapp/Reduction',
          'cachetime': '0',
          data: { id: getApp().sjid },
          success: function (res1) {
            console.log(res1)
            that.setData({
              mj: res1.data
            })
            if (res1.data.length != 0 && res.data.xyh_open == '1') {
              that.setData({
                hdnum: 2
              })
            }
            else if ((res1.data.length != 0 && res.data.xyh_open != '1') || (res1.data.length == 0 && res.data.xyh_open == '1')) {
              that.setData({
                hdnum: 1
              })
            }
            else {
              that.setData({
                hdnum: 0
              })
            }
          }
        })
        var shop_time = res.data.time
        var close_time = res.data.time2
        var shop_time1 = res.data.time3
        var close_time1 = res.data.time4
        var rest = res.data.is_rest
        console.log('当前的系统时间为' + current_time)
        console.log('商家的营业时间从' + shop_time + '至' + close_time, shop_time1 + '至' + close_time1)
        that.setData({
          rest: res.data.is_rest
        })
        if (rest == 1) {
          console.log('商家正在休息')

        } else {
          console.log('商家没有休息')
          if (close_time1 > shop_time) {
            if (current_time > shop_time && current_time < close_time || current_time > shop_time1 && current_time < close_time1) {
              console.log('商家正常营业')
              that.setData({
                time: 1
              })
            }
            else if (current_time < shop_time || current_time > close_time && current_time < shop_time1) {
              console.log('商家还没开店呐，稍等一会儿可以吗？')
              that.setData({
                time: 2
              })
            }
            else if (current_time > close_time1) {
              console.log('商家以及关店啦，明天再来吧')
              that.setData({
                time: 3
              })
            }
          }
          else if (close_time1 < shop_time) {
            if (current_time > shop_time && current_time < close_time || current_time > shop_time1 && current_time > close_time1 || current_time < shop_time1 && current_time < close_time1) {
              console.log('商家正常营业')
              that.setData({
                time: 1
              })
            }
            else if (current_time < shop_time || current_time > close_time && current_time < shop_time1) {
              console.log('商家还没开店呐，稍等一会儿可以吗？')
              that.setData({
                time: 2
              })
            }
            else if (current_time > close_time1) {
              console.log('商家以及关店啦，明天再来吧')
              that.setData({
                time: 3
              })
            }
          }
        }

        var distance = Number(res.data.distance)
        that.setData({
          store: res.data,
          distance: distance
        })
        app.util.request({
          'url': 'entry/wxapp/zhuanh',
          'cachetime': '0',
          data: { op: res.data.coordinates },
          success: function (res) {
            console.log(res)
            console.log(res.data.locations[0].lat + ',' + res.data.locations[0].lng)
            that.setData({
              sjdzlat: res.data.locations[0].lat,
              sjdzlng: res.data.locations[0].lng
            })
          }
        })
      },
    })
  },
  facing: function (e) {
    wx.navigateTo({
      url: '../fukuan/fukuan'
    })
  },
  breakout: function (e) {
    // var path = "zh_dianc/pages/index/index?scene=5"
    // console.log(path.substring(15))
    // var tnurl = '../' + path.substring(15)
    // console.log(tnurl)
    // wx.navigateTo({
    //   url: tnurl
    // })
    wx.scanCode({
      success: (res) => {
        console.log(res)
        var path = res.path
        var tnurl = '../' + path.substring(15)
        wx.navigateTo({
          url: tnurl,
        })
      },
      fail: (res) => {
        console.log('扫码fail')
        // wx.showToast({
        //   title: '二维码错误',
        //   image:'../images/x.png'
        // })
      }
    })
  },
  takeOut: function (e) {
    wx.navigateTo({
      url: '../index/index?type=' + 2
    })
  },

  // 点击拨打电话
  call_phone: function () {
    var that = this
    wx.makePhoneCall({
      phoneNumber: that.data.store.tel
    })
  },
  // ——————————————点击跳转地图页面——————————
  tomap: function (e) {
    var that = this
    wx.openLocation({
      latitude: that.data.sjdzlat,
      longitude: that.data.sjdzlng,
      name: that.data.store.name,
      address: that.data.store.address
    })
  },
  tzsjhj: function (e) {
    console.log(e.currentTarget.dataset.sjid)
    wx.navigateTo({
      url: '../info/sjhj',
    })
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
  tzweb:function(e){
    console.log(e.currentTarget.dataset.index, this.data.slider)
    var item = this.data.slider[e.currentTarget.dataset.index]
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
  ggtzweb: function (e) {
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
  showShareModal: function () {
    var page = this;
    page.setData({
      share_modal_active: "active",
      no_scroll: true,
    });
  },

  shareModalClose: function () {
    var page = this;
    page.setData({
      share_modal_active: "",
      no_scroll: false,
    });
  },

  getGoodsQrcode: function () {
    var page = this;
    page.setData({
      goods_qrcode_active: "active",
      share_modal_active: "",
    });
    // 网址信息
    app.util.request({
      'url': 'entry/wxapp/StoreCode',
      'cachetime': '0',
      data: { store_id: getApp().sjid },
      success: function (res) {
        page.setData({
          goods_qrcode: page.data.url2 + res.data,
        });
      },
    })
  },

  goodsQrcodeClose: function () {
    var page = this;
    page.setData({
      goods_qrcode_active: "",
      no_scroll: false,
    });
  },
  goodsQrcodeClick: function (e) {
    var src = e.currentTarget.dataset.src;
    wx.previewImage({
      urls: [src],
    });
  },
  saveGoodsQrcode: function () {
    var page = this;
    if (!wx.saveImageToPhotosAlbum) {
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。',
        showCancel: false,
      });
      return;
    }

    wx.showLoading({
      title: "正在保存图片",
      mask: false,
    });
    console.log( page.data.goods_qrcode)
    wx.downloadFile({
      url: page.data.goods_qrcode,
      success: function (urlres) {
        console.log(urlres)
        wx.showLoading({
          title: "正在保存图片",
          mask: false,
        });
        wx.saveImageToPhotosAlbum({
          filePath: urlres.tempFilePath,
          success: function () {
            page.goodsQrcodeClose()
            wx.showModal({
              title: '提示',
              content: '商家海报保存成功',
              showCancel: false,
            });
          },
          fail: function (e) {
            wx.showModal({
              title: '警告',
              content: '您点击了拒绝授权,无法正常保存图片,点击确定重新获取授权。',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  wx.openSetting({
                    success: (res) => {
                      if (res.authSetting["scope.writePhotosAlbum"]) {////如果用户重新同意了授权登录
                        page.saveGoodsQrcode()
                      }
                    },
                    fail: function (res) {
                    }
                  })
                }
                else {
                  wx.showModal({
                    title: '图片保存失败',
                    content: e.errMsg,
                    showCancel: false,
                  });
                }
              }
            })
          },
          complete: function (e) {
            console.log(e);
            wx.hideLoading();
          }
        });
      },
      fail: function (e) {
        wx.showModal({
          title: '图片下载失败',
          content: e.errMsg + ";" + page.data.goods_qrcode,
          showCancel: false,
        });
      },
      complete: function (e) {
        console.log(e);
        wx.hideLoading();
      }
    });

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
    var ptxx = wx.getStorageSync('bqxx')
    if (ptxx.more == '1') {
      var nbcolor = wx.getStorageSync('bqxx').color
    }
    if (ptxx.more == '2') {
      var nbcolor = wx.getStorageSync('nbcolor')
    }
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: nbcolor,
    })
    this.setData({
      color: nbcolor
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      kpgg: true
    })
    wx.stopBackgroundAudio()
  },
  gbbjyy: function () {
    var bjyylb = this.data.bjyylb;
    var that = this;
    if (bjyylb == 'laba') {
      wx.stopBackgroundAudio()
      this.setData({
        bjyylb: 'laba1'
      })
      wx.showToast({
        title: '音乐已关闭',
      })
    }
    if (bjyylb == 'laba1') {
      wx.playBackgroundAudio({
        dataUrl: that.data.store.store_mp3,
      })
      this.setData({
        bjyylb: 'laba'
      })
      wx.showToast({
        title: '音乐已开启',
      })
    }
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
    if (that.data.mdxx.more == '1') {
      this.setData({
        activeIndex: 0,
        pagenum: 1,
        storelist: [],
        qqsj:false,
        jzgd:true,
        jzwb:false,
        mygd:false,
      })
      console.log('下拉刷新', this.data.pagenum)
      if (this.data.jzgd) {
        this.setData({
          jzgd: false
        })
        this.dwreLoad();
      }
    }
    if (that.data.mdxx.more == '2') {
      that.danreLoad();
    }
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('上拉加载', this.data.pagenum)
    var that = this;
    if (!this.data.mygd && this.data.jzgd) {
      this.setData({
        jzgd: false
      })
      this.duoreLoad(this.data.startjwd);
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

  },
})