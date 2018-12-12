//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    hidden: true,
    activeIndex: -1,

  },

  onLoad: function () {
    var that = this;

    /*获取当前时间 */
    var now = that.today_time();
    console.log(now)
    this.setData({
      now: now
    }); 

    // ————————————————————获取用户登录信息—————————————
    //获取用户信息
    app.getUserInfo(function (userInfo) {
      console.log(userInfo)
      that.setData({
        userInfo: userInfo,
      })
    })
    wx.login({
      success: function (res) {
        console.log('这是登录所需要的code')
        console.log(res.code)
        var code = res.code
        wx.setStorageSync("code", code)
        wx.getUserInfo({
          success: function (res) {
            // ————异步保存用户登录信息——————————————
            wx.setStorageSync("user_info", res.userInfo)
            // ——————————————————用户登录的名字——————————————
            var nickName = res.userInfo.nickName
            // —————————————用户登录的头像———————————————
            var avatarUrl = res.userInfo.avatarUrl
            console.log('用户名字')
            console.log(res.userInfo.nickName)
            console.log('用户头像')
            console.log(res.userInfo.avatarUrl)
            app.util.request({
              url: 'entry/wxapp/Openid',
              'cachetime': '0',
              data: { code: code },
              success: function (res) {
                // 异步保存session-key
                console.log(res)
                wx.setStorageSync("key", res.data.session_key)
                //  ——————————需要上传给后台的值 包括名字和头像
                var img = avatarUrl
                var name = nickName
                // 异步保存用户openid
                wx.setStorageSync("openid", res.data.openid)
                var openid = res.data.openid
                console.log('这是用户的openid')
                console.log(openid)
                // ——————————————— 获取用户登录信息———————
                app.util.request({
                  url: 'entry/wxapp/Login',
                  'cachetime': '0',
                  data: { openid: openid, img: img, nickname: name },
                  success: function (res) {
                    console.log('这是用户的登录信息')
                    console.log(res)
                    // —————————异步保存用户信息————————————
                    wx.setStorageSync('users', res.data)
                    wx.setStorageSync('uniacid', res.data.uniacid)
                  },
                })
              },
            })
          }
        })
      },
      complete:function(){
   
      }
    });
    console.log(that.data)

    // ——————————幻灯片——————————
    app.util.request({
      url: 'entry/wxapp/GetSlide',
      'cachetime': '0',
      success: function (res) {
        console.log(res.data)
        that.setData({
          movies: res.data
        });
      },
    }) 

    // —————————————— 获取网址——————————
    app.util.request({
      url: 'entry/wxapp/Attachurl',
      'cachetime': '0',
      success: function (res) {
        // —————————— 异步保存网址前缀————————
        wx.setStorageSync('url', res.data)
        that.setData({
          url: res.data
        })
      },
    })

  that.refresh()
  },

  // ———————————轮播图片预览———————————
  swiperChange: function (e) {
    var current = e.target.dataset.src;
    var url = e.target.dataset.url;
    console.log(url)

    console.log(e.target)
    var movies = this.data.movies
    console.log(movies)
    for (var i = 1; i<movies.length;i++){
      var lists=movies[i].thumb
      console.log(lists)
      var list = url + lists
      console.log(list)
      var list = list.split(",")
      console.log(list)
    }
    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: list // 需要预览的图片http链接列表  
    })
    // this.setData({
    //   swiperCurrent: e.detail.current
    // })
  },

  refresh:function(e){
    var that = this
    //—————————————————————————————— 产品分类 ——————————————————————————————
    app.util.request({
      url: 'entry/wxapp/Category',
      'cachetime': '0',
      success: function (res) {
        console.log("产品分类数据")
        console.log(res.data)
        // var id = res.data[0].id
        // console.log(id)
        that.setData({
          infortype: res.data
        })
        that.order()
      },
    })

  },
  order: function (e) {
    var that =this
    // console.log(e)
    //  var id = that.data.infortype[0].id;
    // console.log(that.data)
    // console.log(that.data.infortype[0].id)
    // var delist = that.data.infortype
    app.util.request({
      url: 'entry/wxapp/order',
      'cachetime': '0',
      data: {},
      success: function (res) {
        console.log("产品列表数据")
        console.log(res.data)
        that.setData({
          prolist: res.data
        })
        }
    })
  },
  
  // 产品列表的点击事件
  tabClick: function (e) {
    var that = this;
    console.log(e)
    var id = e.currentTarget.id
    console.log(id)
    var index = e.currentTarget.dataset.index
    console.log(index)
    app.util.request({
      url: 'entry/wxapp/order',
      'cachetime': '0',
      data: { c_id: id },
      success: function (res) {
        console.log("产品列表数据")
        console.log(res.data)
        that.setData({
          activeIndex: index,
          index: index,
          prolist: res.data
        })
      },
    })
  },

  // ———————————点击进入产品详情———————————
  pcinfo: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.id
    console.log(e.currentTarget.dataset)
    console.log(index)
    console.log(that.data )
    var prolistid = that.data.prolist;
    console.log(prolistid)
    for (var i = 0; i < prolistid.length; i++) {
      if (prolistid[i].id == prolistid[index].id) {
        console.log(prolistid[i].id)
        wx: wx.navigateTo({
          url: '../xuanshang/xsinfo?id=' + prolistid[i].id,
        })
      }
     }

  },
  // //获取当前时间，格式YYYY-MM-DD
  today_time: function (e) {
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
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
      + " " + date.getHours() + seperator2 + date.getMinutes()
      + seperator2 + date.getSeconds();
    return currentdate;
  },

  //——————————搜索关键字——————————
  onSearch: function (e) {
    wx.showToast({
      title: '正在加载',
      icon: 'loading',
      duration: 1000
    })
    var that = this;
    console.log(e.detail.value)
    var con = e.detail.value;
    if (con != "") {
      app.util.request({
        url: 'entry/wxapp/order',
        'cachetime': '0',
        data: { c_id: '', keywords: con },
        success: function (res) {
          console.log("产品列表数据")
          console.log(res.data)
          that.setData({
            prolist: res.data
          })
          wx.hideToast({
            title: '成功',
            icon: 'loading',
            duration: 1000
          })
        },
      })
      that.setData({
        con: con
      })
    }else{
      that.order()
    }
  },

  // ——————————跳转到个人中心——————————
  wode: function (e) {
    wx: wx.redirectTo({
      url: '../logs/logs',
    })
  },

  // ——————————跳转到发布——————————
  fabu: function (e) {
    wx: wx.redirectTo({
      url: '../fabu/fabuyewu',
    })
  },

  // ——————————跳转到榜单——————————
  bangdan: function (e) {
    wx: wx.redirectTo({
      url: '../bangdan/bangdan',
    })
  },

  // ——————————跳转到悬赏详情——————————
  xsinfo: function (e) {
    wx: wx.navigateTo({
      url: '../xuanshang/xsinfo',
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.refresh()
    wx.stopPullDownRefresh()
  },
  /**监听页面显示
   * 
   */
  onShow:function(){
    //this.refresh()
  }
})
