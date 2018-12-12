// pages/index/info.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nav: [{
        name: '新任务'
      },
      {
        name: '待取送'
      },
      {
        name: '配送中'
      },
      {
        name: '配送完成'
      }
    ],
    ac_index: 0,
    page: 1,
    list: [],
    state: 1,
    inter: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    wx.hideShareMenu()
    var num = [
      1596 + 943 + 3270, 1197 + 722 + 2279, 901 + 630 + 751, 901 + 630 + 304, 901 + 125 + 180, 862.92 + 125 + 125, 626 + 99 + 90, 590 + 99 + 90, 590 + 90, 590 + 90, 373 + 90, 334 + 90, 91,0,0,0,0
    ]
    let nums = 0
    for(let i in num){
      num[i] =6000-num[i]
      nums+=num[i]
    }
    console.log(num)
    function binary_search(arr, key) {
      var low = 0,
        high = arr.length - 1;
      while (low <= high) {
        var mid = parseInt((high + low) / 2);
        if (key == arr[mid]) {
          return mid;
        } else if (key > arr[mid]) {
          low = mid + 1;
        } else if (key < arr[mid]) {
          high = mid - 1;
        } else {
          return -1;
        }
      }
    };
    var arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 23, 44, 86];
    var result = binary_search(arr, 10);
    console.log(result); // 9 返回目标元素的索引值       
    // var str = "测试们的商品2数量:123价格10.00";
    // var str1 = str.match(/数量:(\S*)价格/)[1];
    // console.log('这是正则匹配的', str1)
    // var str2 = str.match(/(\S*)数量:/)[1];
    // console.log('这是正则匹配的商品名称', str2)
    // var str3 = str.match(/价格(\S*)/)[1];
    // console.log('这是正则匹配的商品价格', str3)
    if (options.ac_index != null) {
      console.log('从别的页面跳转过来的')
      that.setData({
        ac_index: options.ac_index,
        state: options.state
      })
    }
    var menu = app.bottom_menu('/zh_cjpt/pages/index/index')
    that.setData({
      menu: menu
    })
    //====================================获取系统设置=============================================//
    app.getSystem(function(getSystem) {
      console.log(getSystem)
      that.setData({
        getSystem: getSystem,
        distaceShop: Number(getSystem.distance),
        color: getSystem.color
      })
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: getSystem.color,
      })
      app.g_t(function(location) {
        console.log(location)
        that.setData({
          location: location,
          lat: location.split(",")[0],
          lng: location.split(",")[1],
          // lat:'28.678520',
          // lng:'115.943980',
          // location:'28.678520, 115.943980'
        })
        that.nav_data()
        that.timing()
      })
    })

  },
  timing: function(e) {
    var that = this
    // that.setData({
    //   time_1: setInterval(function() {
    //     if (!that.data.inter && that.data.ac_index == 0) {
    //       that.setData({
    //         ac_index: 0
    //       })
    //       that.nav_data()
    //     }
    //   }, 10000)
    // })
  },
  // 确认定位
  locations: function(e) {

  },
  // 订单列表
  order_list: function(e) {
    var that = this
    var a = that.data
    var state = a.state
    var page = a.page
    var qs_id = a.qs_id
    var list = a.list
    var distaceShop = a.distaceShop
    var location = that.data.location.split(",")
    console.log('当前的page为' + page + ' ' + '当前的状态值为' + state + ' ' + '骑手的id为' + qs_id)
    console.log(that.data.lat)
    console.log(that.data.lng)
    // 1为待抢单  2为待取送 4为待完成
    app.util.request({
      url: 'entry/wxapp/JdList',
      data: {
        state: state,
        page: page,
        qs_id: qs_id,
        lat:that.data.lat,
        lng: that.data.lng
      },
      success: res => {
        console.log(res)
        if (res.data.length > 0) {
          for (let i in res.data) {
            res.data[i].distance = app.location(Number(location[0]), Number(res.data[i].sender_lat), Number(location[1]), Number(res.data[i].sender_lng),)
            res.data[i].distance1 = app.location(Number(res.data[i].sender_lat), Number(res.data[i].receiver_lat), Number(res.data[i].sender_lng), Number(res.data[i].receiver_lng), )
            res.data[i].wc_time = app.ormatDate(res.data[i].wc_time)
            res.data[i].goods_info = res.data[i].goods_info.split(",")
            res.data[i].time = app.ormatDate(res.data[i].time)
            // if (res.data[i].distance <= distaceShop) {
            //   list = list.concat(res.data[i])
            // }
            list = list.concat(res.data[i])
          }
          console.log(list)
          if(list.length==0){
            // that.setData({
            //   list: [],
            //   page: page + 1
            // })
            // that.order_list()
          } else {
            that.setData({
              list: list,
              page: page + 1
            })
          }
        } else {

        }
      }
    })
  },
  nav_data: function(e) {
    var that = this
    var a = that.data
    console.log(a.list)
    var nav = a.nav
    var color = a.color
    var ac_index = a.ac_index
    console.log(ac_index)
    for (let i in nav) {
      if (i == ac_index) {
        nav[i].color = color
        nav[i].border = color
      } else {
        nav[i].border = '#f9f9f9'
        nav[i].color = '#333'
      }
    }
    console.log(nav)
    var status = wx.getStorageSync('qs').status
    console.log(status)
    var qs_id = wx.getStorageSync('qs').id
    if (ac_index == 0 && status == 1) {
      that.setData({
        state: 1,
        page: 1,
        list: [],
        qs_id: '',
        lat: this.data.location.split(",")[0],
        lng: this.data.location.split(",")[1],
      })
      that.order_list()
    } else if (ac_index == 1 && status == 1) {
      that.setData({
        state: 2,
        page: 1,
        list: [],
        qs_id: qs_id,
        lat:'',
        lng:''
      })
      that.order_list()
    } else if (ac_index == 2 && status == 1) {
      that.setData({
        state: 3,
        page: 1,
        list: [],
        qs_id: qs_id,
        lat: '',
        lng: ''
      })
      that.order_list()
    } else if (ac_index == 3 && status == 1) {
      that.setData({
        state: 4,
        page: 1,
        list: [],
        qs_id: qs_id,
        lat: '',
        lng: ''
      })
      that.order_list()
    }
    that.setData({
      nav: nav
    })
  },
  nav: function(e) {
    this.setData({
      ac_index: e.currentTarget.dataset.index
    })
    this.nav_data()
  },
  // 跳转路线详情
  route: function(e) {
    console.log(e)
    var lat = e.currentTarget.dataset.lat
    var lng = e.currentTarget.dataset.lng
    var name = e.currentTarget.dataset.name
    var address = e.currentTarget.dataset.address
    wx.navigateTo({
      url: 'info?lat=' + lat + '&lng=' + lng + '&name=' + name + '&address=' + address,
    })
  },
  // 跳转订单详情
  order_info: function(e) {
    wx.navigateTo({
      url: 'order_info?id=' + e.currentTarget.dataset.id + '&index=' + e.currentTarget.dataset.index,
    })
  },
  // 抢单
  robbing: function(e) {
    var that = this
    var a = that.data
    var id = e.currentTarget.dataset.id
    var qs_id = wx.getStorageSync('qs').id
    console.log(qs_id)
    wx.showModal({
      title: '温馨提示',
      content: '是否接单',
      success: res => {
        if (res.confirm) {
          app.util.request({
            url: 'entry/wxapp/Robbing',
            data: {
              qs_id: qs_id,
              id: id,
            },
            success: res => {
              console.log(res)
              if (res.data == 1) {
                app.succ_t('抢单成功', true)
                that.setData({
                  state: 1,
                  page: 1,
                  list: [],
                  qs_id: ''
                })
                that.order_list()
              } else {
                app.succ_t('抢单失败', true)
                wx.showModal({
                  title: '',
                  content: '抢单失败',
                })
                that.setData({
                  state: 1,
                  page: 1,
                  list: [],
                  qs_id: ''
                })
                that.order_list()
              }
            }
          })
        }
      }
    })
  },
  // 拨打商家电话
  sender_tel: function(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.tel
    })
  },
  // 转单
  Slip: function (e) {
    var that = this
    var a = that.data
    var id = e.currentTarget.dataset.id
    var qs_id = wx.getStorageSync('qs').id
    console.log(qs_id)
    wx.showModal({
      title: '温馨提示',
      content: '请确认是否需要转单',
      success: res => {
        if (res.confirm) {
          app.util.request({
            url: 'entry/wxapp/Transfer',
            data: {
              id: id,
            },
            success: res => {
              console.log(res)
              if (res.data == 1) {
                app.succ_t('转单成功', true)
                that.setData({
                  state: 2,
                  page: 1,
                  list: [],
                  qs_id: qs_id
                })
                that.order_list()
              } else {
                app.succ_t('系统出错', true)
              }
            }
          })
        }
      }
    })
  },
  // 确认到店
  g_shop: function(e) {
    var that = this
    var a = that.data
    var id = e.currentTarget.dataset.id
    var qs_id = wx.getStorageSync('qs').id
    console.log(qs_id)
    wx.showModal({
      title: '温馨提示',
      content: '请确认是否已经到店',
      success: res => {
        if (res.confirm) {
          app.util.request({
            url: 'entry/wxapp/Arrival',
            data: {
              order_id: id,
            },
            success: res => {
              console.log(res)
              if (res.data == 1) {
                app.succ_t('确认到店', true)
                that.setData({
                  state: 2,
                  page: 1,
                  list: [],
                  qs_id: qs_id
                })
                that.order_list()
              } else if(res.data=='到店失败'){
                app.succ_t('订单出错', true)
                that.setData({
                  state: 2,
                  page: 1,
                  list: [],
                  qs_id: qs_id
                })
                that.order_list()
              }else{
                app.succ_t('系统出错', true)
              }
            }
          })
        }
      }
    })
  },
  // 确认送达
  service: function(e) {
    var that = this
    var a = that.data
    var id = e.currentTarget.dataset.id
    var qs_id = wx.getStorageSync('qs').id
    console.log(qs_id)
    wx.showModal({
      title: '温馨提示',
      content: '请确认是否已经送达',
      success: res => {
        if (res.confirm) {
          app.util.request({
            url: 'entry/wxapp/Complete',
            data: {
              order_id: id,
            },
            success: res => {
              console.log(res)
              if (res.data == 1) {
                app.succ_t('确认送达', true)
                that.setData({
                  state: 3,
                  page: 1,
                  list: [],
                  qs_id: qs_id
                })
                that.order_list()
              } else {
                app.succ_t('系统出错', true)

              }
            }
          })
        }
      }
    })
  },
  // 底部导航跳转
  route_page: function(e) {
    wx.reLaunch({
      url: e.currentTarget.dataset.url,
    })
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
    app.globalData.refresh = true
    this.setData({
      inter: false
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    console.log('页面隐藏')
    this.setData({
      inter: true
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    console.log('页面卸载')
    this.setData({
      inter: true
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    var that = this

    app.getSystem(function(getSystem) {
      console.log(getSystem)
      that.setData({
        getSystem: getSystem,
        distaceShop: Number(getSystem.distance),
        color: getSystem.color
      })
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: getSystem.color,
      })
      app.g_t(function(location) {
        console.log(location)
        that.setData({
          location: location,
        })
        that.setData({
          list: [],
          page: 1,
          state: 1,
          ac_index: 0,
          qs_id: ''
        })
        that.nav_data()
      })
    })
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.order_list()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})