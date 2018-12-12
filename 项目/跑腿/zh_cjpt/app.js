//app.js
App({
  onLaunch: function(e) {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    var that = this
    // wx.setKeepScreenOn({
    //   keepScreenOn: true
    // });
  },
  getUrl: function(a) {
    var url = this.globalData.url
    a.setData({
      url: url
    })
    var b = this
    url || b.util.request({
      url: 'entry/wxapp/Attachurl',
      success: res => {
        b.globalData.url = res.data
        b.getUrl(a)
      }
    })
  },
  // request : function (option) {
  //   wx.request({
  //     'url': option.url,
  //     'data': option.data ? option.data : {},
  //     'header': option.header ? option.header : {},
  //     'method': option.method ? option.method : 'GET',
  //     'header': {
  //       'content-type': 'application/x-www-form-urlencoded'
  //     },
  //     'success': function (response) {
  //       option.success(response);
  //     },
  //     'fail': function (response) {
  //       option.success(response);
  //     },
  //   })
  // },
  //多维数组判断是否存在某值
  ifArrVal: function(arr, value) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] instanceof Array) {
        return ifArrVal(arr[i].url, value);
      } else {
        if (arr[i].url == value) {
          arr[i].active = true
          return arr; //存在
        } else {

        }
      }
    }
    return false; //不存在
  },
  // 数组去重
  repeat: function(arr) {
    var hash = {};
    return arr.reduce(function(item, next) {
      hash[next.url] ? '' : hash[next.url] = true && item.push(next);
      return item;
    }, []);
  },
  bottom_menu: function(e) {
    var a = this
    console.log(a)
    var menu = [{
        img: '../img/qiang.png',
        sele_img: '../img/z_qiang.png',
        name: '任务大厅',
        color: '#999',
        active: false,
        url: '/zh_cjpt/pages/index/index',
      },
      {
        img: '../img/index.png',
        sele_img: '../img/z_index.png',
        name: '我的',
        color: '#999',
        active: false,
        sele_color: '#89f7fe',
        url: '/zh_cjpt/pages/logs/logs',
      },
    ]
    var route = menu
    console.log(this.route)
    var url = e
    var current_page = a.ifArrVal(route, url)
    // console.log(current_page)
    if (current_page != false) {
      return a.repeat(current_page)
    } else {
      return false
    }
  },
  // 定位骑手位置
  g_t: function(a) {
    wx.getLocation({
      type: 'wgs84',
      success: res => {
        console.log(res)
        let latitude = res.latitude
        let longitude = res.longitude
        let op = latitude + ',' + longitude;
        location = op
        a(op)
        console.log(op)
        wx.setStorageSync('loacation', op)
      },
      fail: res => {
        console.log(res)
        wx.hideLoading()
        location = 1
        wx: wx.showModal({
          title: '授权提示',
          content: '您取消了位置授权，小程序将无法正常使用，如需再次授权，请在我的-授权管理中进行授权，再次进入小程序即可',
          showCancel: true,
          cancelText: '取消',
          cancelColor: '#333',
          confirmText: '确定',
          confirmColor: '#333',
          success: function(res) {},
          fail: function(res) {},
          complete: function(res) {},
        })
      }
    })
  },
  onShow: function(e) {
    console.log('这是显示')
    var that = this
    // setInterval(function () {
    //   if (that.globalData.refresh == true) {
    //     that.util.request({
    //       url: 'entry/wxapp/JdList',
    //       data: {
    //         state: 1,
    //         page: 1,
    //         qs_id: ''
    //       },
    //       success: res => {
    //         console.log(res)
    //         if (res.data.length >= 1) {
    //           // console.log('确定大于0')
    //           wx.vibrateLong(function (res) {
    //             console.log('正在远程执行操作')
    //           })
    //           const backgroundAudioManager = wx.getBackgroundAudioManager()
    //           backgroundAudioManager.src = 'https://hl.zhycms.com/addons/zh_jd/template/images/text2audio.mp3'
    //         }
    //       }
    //     })
    //   }

    // }, 10000)

  },
  onHide: function(e) {
    console.log('这是小程序从前台进入后台')
    this.globalData.sign_out = true
    // wx.reLaunch({
    //   url: '../mine/zhuce'
    // })
  },
  // //获取当前时间，格式YYYY-MM-DD
  today_time: function(e) {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    // var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
    //   + " " + date.getHours() + seperator2 + date.getMinutes()
    //   + seperator2 + date.getSeconds();
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate

    return currentdate;
  },

  // //获取当前时间，格式YYYY-MM-DD
  today_month: function (e) {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    // var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
    //   + " " + date.getHours() + seperator2 + date.getMinutes()
    //   + seperator2 + date.getSeconds();
    var currentdate = date.getFullYear() + seperator1 + month

    return currentdate;
  },
  // -----------------------------时间戳转换日期时分秒--------------------------------
  ormatDate: function(dateNum) {
    var date = new Date(dateNum * 1000);
    return date.getFullYear() + "-" + fixZero(date.getMonth() + 1, 2) + "-" + fixZero(date.getDate(), 2) + " " + fixZero(date.getHours(), 2) + ":" + fixZero(date.getMinutes(), 2) + ":" + fixZero(date.getSeconds(), 2);

    function fixZero(num, length) {
      var str = "" + num;
      var len = str.length;
      var s = "";
      for (var i = length; i-- > len;) {
        s += "0";
      }
      return s + str;
    }
  },
  // 封装计算距离方法
  location: function(lat1, lat2, lng1, lng2) {
    var radLat1 = lat1 * Math.PI / 180.0;
    var radLat2 = lat2 * Math.PI / 180.0;
    var a = radLat1 - radLat2;
    var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
    s = s * 6378.137;
    s = Math.round(s);
    var s = s.toFixed(2)
    return s
  },
  util: require('we7/resource/js/util.js'),
  siteInfo: require('siteinfo.js'),
  // 用户登录
  getUserInfo: function(cb) {
    var that = this
    wx.login({
      success: function(res) {
        console.log(res)
        that.util.request({
          'url': 'entry/wxapp/Openid',
          'cachetime': '0',
          data: {
            code: res.code
          },
          success: function(res) {
            console.log(res)
            cb(res.data)
          },
        })
      }
    })
  },
  // 获取系统设置
  getSystem: function(a) {
    var that = this
    that.util.request({
      'url': 'entry/wxapp/GetSystem',
      'cachetime': '0',
      success: function(res) {
        console.log(res)
        a(res.data)
      },
    })
  },
  // showtoast弹框
  succ_t: function(str, route) {
    wx.showToast({
      title: str,
    })
    // 如果route为true 代表只是提示 不做任何跳转 false则返回上一页
    if (route == false) {
      setTimeout(function() {
        wx.navigateBack({
          delta: 1
        })
      }, 1500)
    }
  },
  // showModel弹框
  succ_m: function (str, route) {
    wx.showModal({
      title: '温馨提示',
      content: str,
      success:res=>{
        if(res.confirm){
          return true
        }else{
          return false
        }
      }
    })
  },
  // 验证手机号
  isTelCode: function(str) {
    var reg = /^1[3|4|5|7|8|9][0-9]\d{4,8}$/;
    return reg.test(str);
    console.log(reg.test(str))
  },
  // 获取订单列表
  list: function(e) {
    var that = this
    // 1为待抢单  2为待取送 4为待完成

  },
  globalData: {
    userInfo: null,
    mid: 0,
    refresh: false
  }
})