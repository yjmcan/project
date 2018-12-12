// pages/index/order_info.js
var amapFile = require('../../utils/amap-wx.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status:[
      '待抢单','待取货','待配送','已完成'
    ],
    order_statu:[
      {
        name:'待抢单',
      },
      {
        name: '待取货',
      },
      {
        name: '配送中',
      },
      {
        name: '已完成',
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.hideShareMenu()
    that.setData({
      index:options.index,
      id:options.id
    })
    var users = '30.527259,114.324417'
    // 获取当前骑手的经纬度
    app.g_t(function (a) {
      that.setData({
        latitude: Number(a.split(",")[0]),
        longitude: Number(a.split(",")[1]),
      })
    })
    that.location()
    //====================================获取系统设置=============================================//
    app.getSystem(function (getSystem) {
      console.log(getSystem)
      that.setData({
        getSystem: getSystem,
        color: getSystem.color
      })
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: getSystem.color,
      })
    })
  },
  location:function(e){
    var that = this,id = that.data.id
    app.g_t(function (location) {
      console.log(location)
      var location = location.split(",")
      app.util.request({
        url: 'entry/wxapp/OrderInfo',
        data: {
          order_id:id
        },
        success: res => {
          console.log(res)
          if(res.data.goods_info!=''){
            res.data.goods_info = res.data.goods_info.split("#")
            var goods = res.data.goods_info
            var goodNum = []
            goods.map(function (item) {
              console.log(item)
              var a = {}
              a.name = item.match(/(\S*)数量:/)[1];
              a.num = item.match(/数量:(\S*)价格/)[1];
              a.price = item.match(/价格(\S*)/)[1];
              goodNum.push(a)
            })
            console.log(goodNum)
          }
          res.data.distance = app.location(Number(location[0]), Number(res.data.sender_lat), Number(location[1]), Number(res.data.sender_lng), )
          res.data.distance1 = app.location(Number(res.data.sender_lat), Number(res.data.receiver_lat), Number(res.data.sender_lng), Number(res.data.receiver_lng), )
          res.data.time = app.ormatDate(res.data.time)
          res.data.price = (Number(res.data.yh_money) + Number(res.data.goods_price)).toFixed(2)
          that.setData({
            order_info: res.data,
            goodNum: goodNum
          })
          if (res.data.state == 1) {
            that.setData({
              width: '0'
            })
          } else if (res.data.state == 2) {
            that.setData({
              width: '33%'
            })
          } else if (res.data.state == 3) {
            that.setData({
              width: '66%'
            })
          } else if (res.data.state == 4) {
            that.setData({
              width: '100%'
            })
          }
          that.order()
          that.map()
        }
      })
    })
  },
  // 地图设置
  map:function(e){
    var that = this, order_info = that.data.order_info
    var lat1= order_info.receiver_lat
    var lng1 = order_info.receiver_lng
    var lat = order_info.sender_lat
    var lng = order_info.sender_lng
    app.g_t(function (location) {
      var markers = [{
        iconPath: "../img/dao.png",
        id: 0,
        latitude: lat,
        longitude: lng,
        width: 25,
        height: 30
      }, {
        iconPath: "../img/qi.png",
        id: 0,
        latitude: location.split(",")[0],
        longitude: location.split(",")[1],
        width: 25,
        height: 30
      }, {
        iconPath: "../img/user.png",
        id: 0,
          latitude: lat1,
          longitude: lng1,
        width: 25,
        height: 30
      }]
      var distance = ''
      var cost = ''
      var polyline = []
      that.setData({
        markers: markers,
        distance: distance,
        cost: cost,
        polyline: polyline,
        lat: lat,
        lng: lng,
        location: location.split(",")
      })
      that.route()
    })
  },
  // 骑手到商家的距离
  route: function (e) {
    var that = this
    var a = that.data
    var key = a.getSystem.map_key
    var myAmapFun = new amapFile.AMapWX({
      key: key
    });
    myAmapFun.getRidingRoute({
      origin: a.lng + ',' + a.lat,
      destination: a.location[1] + ',' + a.location[0],
      success: function (data) {
        console.log("第一次执行", data)
        var points = [];
        if (data.paths && data.paths[0] && data.paths[0].steps) {
          var steps = data.paths[0].steps;
          for (var i = 0; i < steps.length; i++) {
            var poLen = steps[i].polyline.split(';');
            for (var j = 0; j < poLen.length; j++) {
              points.push({
                longitude: parseFloat(poLen[j].split(',')[0]),
                latitude: parseFloat(poLen[j].split(',')[1])
              })
            }
          }
        }
        that.setData({
          polyline: [{
            points: points,
            color: "#0091ff",
            width: 6
          }]
        });

        that.route1()
        if (data.paths[0] && data.paths[0].distance) {
          that.setData({
            distance: data.paths[0].distance + '米'
          });
        }
        if (data.taxi_cost) {
          that.setData({
            cost: '打车约' + parseInt(data.taxi_cost) + '元'
          });
        }

      },
      fail: function (info) {

      }
    })
  },
  // 商家到客户的距离
  route1: function (e) {
    var that = this
    var a = that.data
    var key = a.getSystem.map_key
    var myAmapFun = new amapFile.AMapWX({
      key: key
    });
    var lat1 = a.order_info.receiver_lat
    var lng1 = a.order_info.receiver_lng
    myAmapFun.getRidingRoute({
      origin: a.order_info.receiver_lng + ',' + a.order_info.receiver_lat,
      destination: a.lng + ',' + a.lat,
      success: function (data) {
        console.log('第二次执行', data)
        var points = [];
        if (data.paths && data.paths[0] && data.paths[0].steps) {
          var steps = data.paths[0].steps;
          for (var i = 0; i < steps.length; i++) {
            var poLen = steps[i].polyline.split(';');
            for (var j = 0; j < poLen.length; j++) {
              points.push({
                longitude: parseFloat(poLen[j].split(',')[0]),
                latitude: parseFloat(poLen[j].split(',')[1])
              })
            }
          }
        }
        let polyline1 = {
          points: points,
          color: "#F66925",
          width: 6
        }
        console.log('第一次的路线', that.data.polyline)
        console.log('第二次查找路线', polyline1)
        let polyline = that.data.polyline
        polyline = polyline.concat(polyline1)
        console.log('查看路线')
        console.log(polyline)
        that.setData({
          polyline: polyline
        });
        if (data.paths[0] && data.paths[0].distance) {
          that.setData({
            distance1: data.paths[0].distance + '米'
          });
        }
        if (data.taxi_cost) {
          that.setData({
            cost1: '打车约' + parseInt(data.taxi_cost) + '元'
          });
        }

      },
      fail: function (info) {
        console.log("失败原因", info)
      },
      complete: res => {
        console.log('每一步都执行了', res)
      }
    })
  },
  order:function(e){
    var that = this, index = that.data.index, order_info = that.data.order_info, order_statu = that.data.order_statu
    for (let i in order_statu) {
      if (order_info.state == 1) {
        if (i <= 0) {
          order_statu[i].img = '../img/gou.png'
        } else {
          order_statu[i].img = '../img/gou_1.png'
        }
      } else if (order_info.state == 2) {
        if (i <= 1) {
          order_statu[i].img = '../img/gou.png'
        } else {
          order_statu[i].img = '../img/gou_1.png'
        }
      } else if (order_info.state == 3) {
        if (i <= 2) {
          order_statu[i].img = '../img/gou.png'
        } else {
          order_statu[i].img = '../img/gou_1.png'
        }
      } else if (order_info.state == 4) {
        if (i <= 3) {
          order_statu[i].img = '../img/gou.png'
        } else {
          order_statu[i].img = '../img/gou_1.png'
        }
      }
    }
    console.log(order_statu)
    that.setData({
      order_statu: order_statu
    })
  },
  phone:function(e){
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.tel,
    })
  },
  // 抢单
  robbing: function (e) {
    var that = this
    var a = that.data
    var id = that.data.order_info.id
    var qs_id = wx.getStorageSync('qs').id
    console.log(qs_id)
    wx.showModal({
      title: '温馨提示',
      content: '是否确认接单',
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
                that.location()
                wx.reLaunch({
                  url: 'index?ac_index=' + '1' + '&state=' + '2',
                })
              } else {
                app.succ_t('抢单失败', true)
                wx.showModal({
                  title: '',
                  content: '抢单失败',
                })
              }
            }
          })
        }
      }
    })
  },
  // 确认到店
  g_shop: function (e) {
    var that = this
    var a = that.data
    var id = that.data.order_info.id
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
                that.location()
                wx.reLaunch({
                  url: 'index?ac_index=' + 2 + '&state=' + 3,
                })
              } else {
                app.succ_t('系统出错', true)
              }
            }
          })
        }
      }
    })
  },
  // 确认送达
  service: function (e) {
    var that = this
    var a = that.data
    var id = that.data.order_info.id
    var qs_id = wx.getStorageSync('qs').id
    console.log(qs_id)
    wx.showModal({
      title: '温馨提示',
      content: '请确认是否送达',
      success:res=>{
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
                that.location()

              } else {
                app.succ_t('系统出错', true)

              }
            }
          })
        }
      }
    })
  },
  // 跳转路线详情
  routes: function (e) {
    console.log(e)
    var lat = e.currentTarget.dataset.lat
    var lng = e.currentTarget.dataset.lng
    var name = e.currentTarget.dataset.name
    var address = e.currentTarget.dataset.address
    wx.openLocation({
      latitude: Number(lat),
      longitude: Number(lng),
      name: name,
      address: address
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
  onShareAppMessage: function () {
  
  }
})