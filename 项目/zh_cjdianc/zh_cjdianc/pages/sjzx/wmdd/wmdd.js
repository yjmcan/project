// zh_cjdianc/pages/sjzx/wmdd.js
var app = getApp();
var dsq;
var siteinfo = require('../../../../siteinfo.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectedindex: 0,
    topnav: [{ img: '../../../img/icon/djd.png', img1: '../../../img/icon/wdjd.png', name: '待接单' }, { img: '../../../img/icon/dps.png', img1: '../../../img/icon/wdps.png', name: '待送达' }, { img: '../../../img/icon/dzt.png', img1: '../../../img/icon/wdzt.png', name: '待自提' }, { img: '../../../img/icon/ywc.png', img1: '../../../img/icon/wywc.png', name: '已完成' }, { img: '../../../img/icon/sh.png', img1: '../../../img/icon/wsh.png', name: '售后/退款' },],
    open:false,
    pagenum: 1,
    order_list: [],
    storelist: [],
    mygd: false,
    jzgd: true,
    hide: 1
  },
  hide: function (t) { this.setData({ hide: 1 }) },
  psxq: function (e) {
    var a = this, oid = e.currentTarget.dataset.id, sjid = e.currentTarget.dataset.sjid, psmode = e.currentTarget.dataset.psmode;
    console.log(oid, sjid, psmode)
    wx.showLoading({
      title: "加载中",
      mask: !0
    }), app.util.request({
      'url': 'entry/wxapp/GetStorePsInfo',
      'cachetime': '0',
      data: { store_id: sjid, order_id: oid },
      success: function (res) {
        console.log(res.data)
        if (psmode == '达达配送' && res.data.result == null) {
          wx.showModal({
            title: '提示',
            content: '配送信息异常' + res.data,
          })
          return
        }
        a.setData({
          psxx: res.data,
          psmode: psmode,
          hide: 2
        })
      },
    })
  },
  maketel: function (t) {
    var a = t.currentTarget.dataset.tel;
    wx.makePhoneCall({
      phoneNumber: a,
    })
  },
  location: function (t) {
    var lat = t.currentTarget.dataset.lat, lng = t.currentTarget.dataset.lng, address = t.currentTarget.dataset.address;
    console.log(lat, lng)
    wx.openLocation({
      latitude: parseFloat(lat),
      longitude: parseFloat(lng),
      address: address,
      name: '位置'
    })
  },
  selectednavbar: function (e) {
    console.log(e)
    this.setData({
      pagenum: 1,
      order_list: [],
      storelist: [],
      mygd: false,
      jzgd: true,
      selectedindex: e.currentTarget.dataset.index,
      status: Number(e.currentTarget.dataset.index)+1
    })
    this.reLoad();
  },
  doreload: function (status) {
    console.log(status)
    this.setData({
      pagenum: 1,
      order_list: [],
      storelist: [],
      mygd: false,
      jzgd: true,
      selectedindex: status-1,
      status: status
    })
    this.reLoad();
  },
  kindToggle: function (e) {
    var that=this;
    var index = e.currentTarget.id, list = this.data.order_list;
    console.log(index)
    for (var i = 0, len = list.length; i < len; ++i) {
      if (i == index) {
        list[i].open = !list[i].open
      } else {
        list[i].open = false
      }
    }
    this.setData({
      order_list: list
    });
  },
  reLoad: function () {
    var that = this, status = this.data.status || 1, store_id = wx.getStorageSync('sjdsjid'), page = this.data.pagenum;
    var wmstatus,zt=''
    if (status == 1) {
      wmstatus = '2'
    }
    if (status == 2) {
      wmstatus = '3'
      zt = '2'
    }
    if (status == 3) {
      wmstatus = '3'
      zt = '1'
    }
    if (status == 4) {
      wmstatus = '4,5';
    }
    if (status == 5) {
      wmstatus = '6,7,8,9,10';
    }
    console.log(status, wmstatus,zt, store_id, page)
    app.util.request({
      'url': 'entry/wxapp/StoreWmOrder',
      'cachetime': '0',
      data: { state: wmstatus, zt:zt, store_id: store_id, page: page, pagesize: 10 },
      success: function (res) {
        console.log('分页返回的列表数据', res.data)
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
        that.setData({
          order_list: storelist,
          storelist: storelist
        })
        console.log(storelist)
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this, sjdsjid = wx.getStorageSync('sjdsjid'), root = siteinfo.siteroot.replace("app/index.php", "");
    console.log(sjdsjid, root)
    this.reLoad();
    app.setNavigationBarColor(this);
    app.sjdpageOnLoad(this);
    app.util.request({
      'url': 'entry/wxapp/system',
      'cachetime': '0',
      success: function (res) {
        console.log(res.data)
        wx.setStorageSync('system', res.data)
        wx.setNavigationBarTitle({
          title: res.data.wm_name || '外卖',
        })
        that.setData({
          xtxx: res.data
        })
      }
    });
    dsq = setInterval(function () {
      if (wx.getStorageSync('yybb')) {
        app.util.request({
          'url': 'entry/wxapp/NewOrder',
          'cachetime': '0',
          data: {
            store_id: sjdsjid
          },
          success: function (res) {
            console.log(res)
            if (res.data == 1) {
              wx.playBackgroundAudio({
                dataUrl: root + 'addons/zh_cjdianc/template/images/wm.wav',
                title: '语音播报',
              })
            }
            if (res.data == 2) {
              wx.playBackgroundAudio({
                dataUrl: root + 'addons/zh_cjdianc/template/images/dn.wav',
                title: '语音播报',
              })
            }
            // if (res.data == 3) {
            //   wx.playBackgroundAudio({
            //     dataUrl: root + 'addons/zh_cjdianc/template/images/yy.wav',
            //     title: '语音播报',
            //   })
            // }
          },
        })
      }
      else {
        clearInterval(dsq)
      }
    }, 10000)
  },
  smhx: function (e) {
    var storeid = wx.getStorageSync('sjdsjid');
    // var path = "zh_vip/pages/my/wdck/hx?scene=2"
    // var tnurl = '/' + path
    // wx.navigateTo({
    //   url: tnurl + '&storeid=' + storeid,
    // })
    wx.scanCode({
      success: (res) => {
        console.log(res)
        var path = res.path
        var tnurl = '/' + path
        wx.navigateTo({
          url: tnurl + '&storeid=' + storeid,
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
  dyxp: function (e) {
    var a = this, oid = e.currentTarget.dataset.id;
    console.log(oid)
    wx.showModal({
      title: "提示",
      content: "是否确认打印此订单小票？",
      cancelText: "否",
      confirmText: "是",
      success: function (s) {
        if (s.cancel) return !0;
        s.confirm && (wx.showLoading({
          title: "操作中",
          mask: !0
        }), app.util.request({
          'url': 'entry/wxapp/QtPrint',
          'cachetime': '0',
          data: { order_id: oid, type:1 },
          success: function (res) {
            console.log(res.data)
            wx.showToast({
              title: '操作成功',
              icon: 'success',
              duration: 1000,
            })
          },
        }))
      }
    })
  },
  djjd: function (e) {
    var a = this, oid = e.currentTarget.dataset.id;
    console.log(oid)
    wx.showModal({
      title: "提示",
      content: "是否确认接单？",
      cancelText: "否",
      confirmText: "是",
      success: function (s) {
        if (s.cancel) return !0;
        s.confirm && (wx.showLoading({
          title: "操作中",
          mask:!0
        }), app.util.request({
          'url': 'entry/wxapp/JdOrder',
          'cachetime': '0',
          data: { order_id: oid },
          success: function (res) {
            console.log(res.data)
            if (res.data == '1') {
              wx.showToast({
                title: '接单成功',
                icon: 'success',
                duration: 1000,
              })
              setTimeout(function () {
                a.doreload(2)
              }, 1000)
            }
            else {
              wx.showToast({
                title: '请重试',
                icon: 'loading',
                duration: 1000,
              })
            }
          },
        }))
      }
    })
  },
  jjjd: function (e) {
    var a = this, oid = e.currentTarget.dataset.id;
    console.log(oid)
    wx.showModal({
      title: "提示",
      content: "是否拒绝接单？",
      cancelText: "否",
      confirmText: "是",
      success: function (s) {
        if (s.cancel) return !0;
        s.confirm && (wx.showLoading({
          title: "操作中",
          mask: !0
        }), app.util.request({
          'url': 'entry/wxapp/JjOrder',
          'cachetime': '0',
          data: { order_id: oid },
          success: function (res) {
            console.log(res.data)
            if (res.data == '1') {
              wx.showToast({
                title: '操作成功',
                icon: 'success',
                duration: 1000,
              })
              setTimeout(function () {
                a.doreload(5)
              }, 1000)
            }
            else {
              wx.showToast({
                title: '请重试',
                icon: 'loading',
                duration: 1000,
              })
            }
          },
        }))
      }
    })
  },
  wcps: function (e) {
    var a = this, oid = e.currentTarget.dataset.id;
    console.log(oid)
    wx.showModal({
      title: "提示",
      content: "确认完成此订单？",
      cancelText: "否",
      confirmText: "是",
      success: function (s) {
        if (s.cancel) return !0;
        s.confirm && (wx.showLoading({
          title: "操作中",
          mask: !0
        }), app.util.request({
          'url': 'entry/wxapp/OkOrder',
          'cachetime': '0',
          data: { order_id: oid },
          success: function (res) {
            console.log(res.data)
            if (res.data == '1') {
              wx.showToast({
                title: '操作成功',
                icon: 'success',
                duration: 1000,
              })
              setTimeout(function () {
                a.doreload(4)
              }, 1000)
            }
            else {
              wx.showToast({
                title: '请重试',
                icon: 'loading',
                duration: 1000,
              })
            }
          },
        }))
      }
    })
  },
  jjtk: function (e) {
    var a = this, oid = e.currentTarget.dataset.id;
    console.log(oid)
    wx.showModal({
      title: "提示",
      content: "是否拒绝退款？",
      cancelText: "否",
      confirmText: "是",
      success: function (s) {
        if (s.cancel) return !0;
        s.confirm && (wx.showLoading({
          title: "操作中",
          mask: !0
        }), app.util.request({
          'url': 'entry/wxapp/JjTk',
          'cachetime': '0',
          data: { order_id: oid },
          success: function (res) {
            console.log(res.data)
            if (res.data == '1') {
              wx.showToast({
                title: '操作成功',
                icon: 'success',
                duration: 1000,
              })
              setTimeout(function () {
                a.doreload(5)
              }, 1000)
            }
            else {
              wx.showToast({
                title: '请重试',
                icon: 'loading',
                duration: 1000,
              })
            }
          },
        }))
      }
    })
  },
  tgtk: function (e) {
    var a = this, oid = e.currentTarget.dataset.id;
    console.log(oid)
    wx.showModal({
      title: "提示",
      content: "是否通过退款？",
      cancelText: "否",
      confirmText: "是",
      success: function (s) {
        if (s.cancel) return !0;
        s.confirm && (wx.showLoading({
          title: "操作中",
          mask: !0
        }), app.util.request({
          'url': 'entry/wxapp/TkTg',
          'cachetime': '0',
          data: { order_id: oid },
          success: function (res) {
            console.log(res.data)
            if (res.data == '1') {
              wx.showLoading({
                title: "操作中",
                mask: !0
              })
              setTimeout(function () {
                a.doreload(5)
              }, 1000)
            }
            else {
              wx.showToast({
                title: '请重试',
                icon: 'loading',
                duration: 1000,
              })
            }
          },
        }))
      }
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
    clearInterval(dsq)
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
    console.log('上拉加载', this.data.pagenum)
    var that = this;
    if (!this.data.mygd && this.data.jzgd) {
      this.setData({
        jzgd: false
      })
      this.reLoad();
    }
    else {
    }
  }
})