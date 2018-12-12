// zh_cjdianc/pages/index/xsqg.js
var app = getApp();
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var qqmapsdk;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navbar: [{ name: '全部', id: '' }],
    selectedindex: 0,
    params: { nopsf: 2, nostart: 2, yhhd: '' },
    status: 1,
    pagenum: 1,
    order_list: [],
    storelist: [],
    mygd: false,
    jzgd: true,
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
              params: params,
            })
            that.reLoad();
          },
          fail: function (res) {
            console.log(res);
          },
          complete: function (res) {
            console.log(res);
          }
        });
      }
    })
  },
  onOverallTag: function (e) {
    console.log(e)
    this.setData({
      mask1Hidden: false
    })
  },
  mask1Cancel: function () {
    this.setData({
      mask1Hidden: true
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
      toView: 'a' + (e.currentTarget.dataset.index - 1),
      status: Number(e.currentTarget.dataset.index) + 1
    })
    this.reLoad();
  },
  reLoad: function () {
    var that = this, status = this.data.status || 1, store_id = this.data.store_id || '', type = this.data.store_id == null ? 1 : ''; that.data.params.page = that.data.pagenum, that.data.params.pagesize = 5;
    var type_id;
    if (status == 1) {
      type_id = ''
    }
    else {
      type_id = that.data.navbar[status - 1].id
    }
    console.log(status, type_id, store_id, that.data.params)
    app.util.request({
      'url': 'entry/wxapp/SelectStoreList',
      'cachetime': '0',
      data: that.data.params,
      success: function (res) {
        console.log('分页返回的列表数据', res.data)
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].sales == '0.0') {
            res.data[i].sales = '5.0'
          }
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
        }
        if (res.data.length < 5) {
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
  tzsjxq: function (e) {
    console.log(e.currentTarget.dataset, getApp().xtxx)
    if (e.currentTarget.dataset.type == 1) {
      getApp().sjid = e.currentTarget.dataset.sjid
      wx.navigateTo({
        url: '/zh_cjdianc/pages/seller/index',
      })
    }
    else {
      if (getApp().xtxx.is_tzms == '1') {
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.setNavigationBarColor(this);
    app.pageOnLoad(this);
    var that = this, storeid = options.storeid;
    console.log(options, storeid, typeof (undefined), getApp().xtxx)
    wx.setNavigationBarTitle({
      title: options.title || '精选好店',
    })
    that.setData({
      store_id: storeid,
    })
    qqmapsdk = new QQMapWX({
      key: getApp().xtxx.map_key
    });
    that.dwreLoad()
    // app.util.request({
    //   'url': 'entry/wxapp/QgType',
    //   'cachetime': '0',
    //   success: function (res) {
    //     var navbar = that.data.navbar.concat(res.data)
    //     console.log(res, navbar)
    //     that.setData({
    //       navbar: navbar,
    //     })
    //   },
    // })
    //home轮播图和开屏公告
    app.util.request({
      'url': 'entry/wxapp/ad',
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        var toplb = [], zblb = [], dblb = [];
        for (var i = 0; i < res.data.length; i++) {
          if (res.data[i].type == '10') {
            toplb.push(res.data[i])
          }
        }
        console.log(toplb, zblb, dblb)
        that.setData({
          toplb: toplb,
        })
      },
    })
    // app.util.request({
    //   'url': 'entry/wxapp/QgGoods',
    //   'cachetime': '0',
    //   data: { type_id: '', store_id: '', page: 1, pagesize: 10, type: 1 },
    //   success: function (res) {
    //     console.log('分页返回的列表数据', res.data)
    //     for (let i = 0; i < res.data.length; i++) {
    //       res.data[i].discount = (Number(res.data[i].money) / Number(res.data[i].price) * 10).toFixed(1)
    //       res.data[i].yqnum = (((Number(res.data[i].number) - Number(res.data[i].surplus)) / Number(res.data[i].number) * 100)).toFixed(1)
    //     }
    //     that.setData({
    //       qglist: res.data,
    //     })
    //   }
    // });
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
  },
  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {
  
  // }
})