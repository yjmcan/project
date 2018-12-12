var amapFile = require('../../utils/amap-wx.js'); //如：..­/..­/libs/amap-wx.js
Page({
  data: {
    markers: [{
      iconPath: "../img/dao.png",
      id: 0,
      latitude: 30.5258734882,
      longitude: 114.3536210060,
      width: 22,
      height: 32
    }, {
      iconPath: "../img/qi.png",
      id: 0,
      latitude: 30.5162060656,
      longitude: 114.3349313736,
      width: 22,
      height: 32
    }],
    distance: '',
    cost: '',
    polyline: []
  },
  onLoad: function () {
    var that = this;
    console.log(amapFile)
    var key = 'b6839a2765b006854ce143c4a96df671';
    var myAmapFun = new amapFile.AMapWX({ key: 'b6839a2765b006854ce143c4a96df671' });
    myAmapFun.getRidingRoute({
      origin: '114.3349313736,30.5162060656',
      destination: '114.3536210060,30.5258734882',
      success: function (data) {
        console.log(data)
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

goDetail: function (e) {
  wx.openLocation({
    latitude: 30.52969,
    longitude: 114.34272,
    name: '这是名字',
    address: '这是地址'
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