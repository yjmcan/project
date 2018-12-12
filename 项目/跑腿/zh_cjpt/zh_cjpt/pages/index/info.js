var amapFile = require('../../utils/amap-wx.js'); //如：..­/..­/libs/amap-wx.js
const app = getApp()
Page({
  data: {
   
  },
  onLoad: function(options) {
    var that = this
    wx.hideShareMenu()
    console.log(options)
    var users = '30.527259,114.324417'
    app.g_t(function (a) {
      that.setData({
        latitude: Number(a.split(",")[0]),
        longitude: Number(a.split(",")[1])
      })
    })
    //====================================获取系统设置=============================================//
    app.getSystem(function (getSystem) {
      that.setData({
        getSystem: getSystem,
        color: getSystem.color
      })
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: getSystem.color,
      })
      var lat = options.lat
      var lng = options.lng
      that.setData({
        name: options.name,
        address: options.address
      })
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
            latitude: users.split(",")[0],
            longitude: users.split(",")[1],
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
    })
  },
  route: function(e) {
    var that = this
    var a = that.data
    var key = a.getSystem.map_key
    var myAmapFun = new amapFile.AMapWX({
      key: key
    });
    myAmapFun.getRidingRoute({
      origin: a.lng+','+a.lat,
      destination: a.location[1] + ',' + a.location[0],
      success: function(data) {
        console.log("第一次执行",data)
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
      fail: function(info) {

      }
    })
  },
  route1: function (e) {
    var that = this
    console.log('第二次执行查看当前的路线', that.data.polyline)
    var a = that.data
    var key = a.getSystem.map_key
    var myAmapFun = new amapFile.AMapWX({
      key: key
    });
    console.log('查看当前骑手的经纬度',a.location)
    myAmapFun.getRidingRoute({
      origin: '114.324417,30.527259',
      destination: a.lng + ',' + a.lat,
      success: function (data) {
        console.log('第二次执行',data)
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
        console.log("失败原因",info)
      },
      complete:res=>{
        console.log('每一步都执行了',res)
      }
    })
  },
  goDetail: function(e) {
    wx.openLocation({
      latitude: Number(this.data.lat),
      longitude: Number(this.data.lng),
      name: this.data.name,
      address: this.data.address
    })
  },
})
// Page({
//   data: {
//     markers: [{
//       iconPath: "../img/dao.png",
//       id: 0,
//       latitude: 30.52557,
//       longitude: 114.35382,
//       width: 22,
//       height: 32
//     }, {
//       iconPath: "../img/qi.png",
//       id: 0,
//       latitude: 30.52969,
//       longitude: 114.34272,
//       width: 22,
//       height: 32
//     }],
//     distance: '',
//     cost: '',
//     polyline: []
//   },
//   onLoad: function() {
//     var that = this;
//     var key = 'b6839a2765b006854ce143c4a96df671';
//     var myAmapFun = new amapFile.AMapWX({
//       key: 'b6839a2765b006854ce143c4a96df671'
//     });
//     myAmapFun.getRidingRoute({
//       origin: '114.35382,30.52557',
//       destination: '114.34272,30.52969',
//       success: function(data) {
//         console.log(data)
//         var points = [];
//         if (data.paths && data.paths[0] && data.paths[0].rides) {
//           var steps = data.paths[0].rides;
//           for (var i = 0; i < steps.length; i++) {
//             var poLen = steps[i].polyline.split(';');
//             for (var j = 0; j < poLen.length; j++) {
//               points.push({
//                 longitude: parseFloat(poLen[j].split(',')[0]),
//                 latitude: parseFloat(poLen[j].split(',')[1])
//               })
//             }
//           }
//         }
//         that.setData({
//           polyline: [{
//             points: points,
//             color: "#0091ff",
//             width: 6
//           }]
//         });
//         if (data.paths[0] && data.paths[0].distance) {
//           that.setData({
//             distance: data.paths[0].distance + '米'
//           });
//         }
//         if (data.taxi_cost) {
//           that.setData({
//             cost: '打车约' + parseInt(data.taxi_cost) + '元'
//           });
//         }

//       },
//       fail: function(info) {

//       }
//     })
//   },
//   goDetail: function(e) {
//     wx.openLocation({
//       latitude: 30.52969,
//       longitude: 114.34272,
//       name: '这是名字',
//       address: '这是地址'
//     })
//   },
// })