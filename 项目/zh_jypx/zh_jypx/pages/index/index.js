//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    activeIndex:0,
    hidden:false
  },

  onLoad: function () {
    var that=this;
    // var id = wx.getStorageSync("users")
    // console.log(id)

    //获取用户信息
    // app.getUserInfo(function (userInfo) {
    //   console.log(userInfo)
    //   that.setData({
    //     userInfo: userInfo,
    //   })
    // })

    // —————————————— 获取网址——————————
    app.util.request({
      "url": "entry/wxapp/Attachurl",
      'cachetime': '0',
      success: function (res) {
        that.setData({
          url: res.data
        })
      }
    })

    // ——————————————幻灯片 ——————————
    app.util.request({
      'url': 'entry/wxapp/GetSlide',
      'cachetime': '0',
      success: function (res) {
        console.log("幻灯片")
        console.log(res.data)
        that.setData({
          imgUrls: res.data.list,
        })
      },
    })

    // ——————————————头条 ——————————
    app.util.request({
      'url': 'entry/wxapp/Articles',
      'cachetime': '0',
      success: function (res) {
        console.log("头条")
        console.log(res.data)
        that.setData({
          title: res.data.list,
        })
      },
    })

    // ——————————————课程级别 ——————————
    app.util.request({
      'url': 'entry/wxapp/CourseCate',
      'cachetime': '0',
      success: function (res) {
        console.log("级别")
        console.log(res.data)
        if(res.data.code==500){
          // that.setData({
          //   hidden: true,
          // })
        }else{
          that.setData({
            level: res.data.list,
            hidden: true,
          })
          that.order()
        }
      },
    })
  },
  order:function(e){
    var that=this;
    console.log(that)
    var first_id = that.data.level[0].id
    var activeIndex = that.data.activeIndex
    console.log(first_id)
    // ——————————————课程 ——————————
    app.util.request({
      'url': 'entry/wxapp/Course',
      'cachetime': '0',
      data: {
        id: first_id
      },
      success: function (res) {
        console.log("级别详情")
        console.log(res.data)
        console.log(that)
        if(res.data.code==501){
          that.setData({
            none: res.data
          })
        }else{
          that.setData({
            con: res.data.list,
            none: res.data
          })         
        }
      },
    })
  },

  /*点击课程选择 */
  onDetail:function(e){
    var that=this;
    console.log(e)
    console.log(that.data)
    var detail_id = e.currentTarget.dataset.id
    var activeIndex = that.data.activeIndex;
    var index = e.currentTarget.dataset.index;
    console.log(activeIndex)
    console.log(index)
    app.util.request({
      'url': 'entry/wxapp/Course',
      'cachetime': '0',
      data: {
        id: detail_id
      },
      success: function (res) {
        console.log("级别详情")
        console.log(res.data)
        if(res.data.code==501){
          that.setData({
            none: res.data
          })
        }else{
          that.setData({
            con: res.data.list,
            none: res.data
          })
        }
      },
    })
    that.setData({
      index: index,
      activeIndex: index
    })

  },

  /*进入教师登录 */
  onTeacher:function(e){
    var return_con = wx.getStorageSync('teacher_msg')
    console.log(return_con)
    if (return_con == "") {
      wx.showToast({
        title: '您还没有登录,请先登录!',
        icon: "none",
        duration: 2000
      })
      setTimeout(function () {
        wx: wx.redirectTo({
          url: '../teacher/t_login',
        })
      }, 2000)
    } else {
      wx: wx.navigateTo({
        url: '../teacher/t_list',
      })
    }
  },

  /*进入排名 */
  // onRank:function(e){
  //   wx: wx.redirectTo({
  //     url: '../rank/rank',
  //   })
  // },

  /*进入我的 */
  onMy: function (e) {
    var return_con = wx.getStorageSync('user_msg')
    console.log("返回的数据:")
    console.log(return_con)
    if (return_con == "") {
      wx.showToast({
        title: '您还没有登录,请先登录!',
        icon: "none",
        duration: 2000
      })
      setTimeout(function () {
        wx: wx.redirectTo({
          url: '../rank/login_firset',
        })
      }, 2000)
    }else{
      wx: wx.redirectTo({
        url: '../my/my',
      })
    }
  },

  /*进入日期列表*/
  task_list:function(e){
    var that=this;
    console.log(e)
    console.log(that)
    var cour_id = e.currentTarget.dataset.id
    console.log(cour_id)
    wx: wx.navigateTo({
      url: 'date_list?cour_id=' + cour_id,
    })
  }
})