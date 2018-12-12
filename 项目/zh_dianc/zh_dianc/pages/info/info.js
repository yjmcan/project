// pages/info/info.js
var app = getApp()
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    swiperCurrent: 0,
    huise: false,
    huangse: true,
    hdnum: 0,
    kpgg: true,
    bjyylb:'laba',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var scene = decodeURIComponent(options.scene)
    console.log('scene', scene)
    if (scene != 'undefined') {
      getApp().sjid = scene
    }
    if (options.id != null) {
      console.log('转发获取到的sjid:', options.id)
      getApp().sjid = options.id
    }
    var that = this
    var bqxx = wx.getStorageSync('bqxx')
    console.log(bqxx)
    this.setData({
      bqxx: bqxx
    })
    // app.util.request({
    //   'url': 'entry/wxapp/ad2',
    //   'cachetime': '0',
    //   success: function (res) {
    //     console.log(res)
    //     if (res.data.length != 0) {
    //       that.setData({
    //         kpgg: false,
    //         kpggimg: res.data
    //       })
    //     }
    //   },
    // })
    var time = util.formatTime(new Date());
    var current_time = time.slice(11, 16)
    console.log(current_time)
    that.setData({
      current_time: current_time
    })
    this.reLoad();
  },
  reLoad: function () {
    this.setData({
      hdnum: 0,
    })
    var that = this
    var time = util.formatTime(new Date());
    // 再通过setData更改Page()里面的data，动态更新页面的数据  
    var settime = time.slice(11, 16)
    console.log(settime)
    // var scene = decodeURIComponent(options.scene)
    // console.log(scene)
    // //
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
    // 获取用户登录信息
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
                    data: { user_id: res.data.id, store_id: getApp().sjid },
                    success: function (res) {
                      console.log(res)
                      wx.setStorageSync('new_user', res.data)
                    },
                  })
                },
              })
            }

          },
        })
      }
    })
    // 商家信息
    console.log(that.data)
    var current_time = that.data.current_time
    app.util.request({
      'url': 'entry/wxapp/Store',
      'cachetime': '0',
      data: { id: getApp().sjid, user_id: wx.getStorageSync('users').id },
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
          if (close_time1 > shop_time)
          {
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
        that.setData({
          sjdzlat: Number(res.data.coordinates.split(',')[0]),
          sjdzlng: Number(res.data.coordinates.split(',')[1])
        })
        // app.util.request({
        //   'url': 'entry/wxapp/zhuanh',
        //   'cachetime': '0',
        //   data: { op: res.data.coordinates },
        //   success: function (res) {
        //     console.log(res)
        //     console.log(res.data.locations[0].lat + ',' + res.data.locations[0].lng)
        //     that.setData({
        //       sjdzlat: res.data.locations[0].lat,
        //       sjdzlng: res.data.locations[0].lng
        //     })
        //   }
        // })
      },
    })
    // 网址信息
    app.util.request({
      'url': 'entry/wxapp/Url',
      'cachetime': '0',
      success: function (res) {
        console.log(res.data)
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
      url: 'sjhj',
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
      data: {store_id:getApp().sjid},
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
    console.log(page.data.goods_qrcode)
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
    // var that = this;
    // var context = wx.createCanvasContext('firstCanvas')
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
    // this.setData({
    //   kpgg: true
    // })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  gbbjyy: function () {
    var bjyylb = this.data.bjyylb;
    var that=this;
    if(bjyylb=='laba'){
      wx.stopBackgroundAudio()
      this.setData({
        bjyylb:'laba1'
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
  onUnload: function () {
    wx.stopBackgroundAudio()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that = this
    // pageNum = 1;
    that.reLoad()
    wx.stopPullDownRefresh();
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
    var that = this;
    that.setData({
      share_modal_active: "",
      no_scroll: false,
    });
    return {
      title: that.data.store.name,
      path: '/zh_dianc/pages/info/info?id=' + getApp().sjid,
      success: function (res) {
        // 转发成功
        that.setData({
          share_modal_active: "",
        });
        wx.showToast({
          title: '转发成功',
        })
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
  ,
  //
  closekpgg: function () {
    this.setData({
      kpgg: true
    })
  },
})