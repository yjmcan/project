// zh_jypx/pages/teacher/t_login.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  /*登录 */
  formSubmit: function (e) {
    //用户名
    var name = e.detail.value.name;
    //密码
    var code = e.detail.value.code;
    console.log(name)
    console.log(code)

    var tip = ""
    if (name=="") {
      tip = "请输入用户名!"
    } else if (code == "") {
      tip = "请输入密码!"
    }
    if (tip != "") {
      wx.showModal({
        title: '',
        content: tip
      })
    } else {
      app.util.request({
        "url": "entry/wxapp/TeacherLogin",
        "cachetime": "0",
        data: {
          username: name,
          password: code
        },
        success: function (res) {
          console.log("登录成功")
          console.log(res)
          if(res.data.code==502){
            wx.showToast({
              title: '该用户尚未注册，请联系管理员!',
              icon: "none",
              duration: 2000
            })           
          }else if(res.data.code==503){
            wx.showToast({
              title: '用户名与密码不匹配!',
              icon: "none",
              duration: 2000
            })
          }else{
            wx.showToast({
              title: '登录成功',
              icon: "none",
              duration: 2000
            })
            setTimeout(function () {
              wx: wx.navigateTo({
                url: 't_list',
              })
            }, 2000)
            wx.setStorageSync('teacher_msg', res.data.list)
          }
        },
        fail: function (res) {
          console.log("提交失败")
          console.log(res)
        }
      })
    }
  },

  /*进入首页 */
  onIndex: function (e) {
    wx: wx.redirectTo({
      url: '../index/index',
    })
  },

  /*进入我的 */
  onMy: function (e) {
    var return_con = wx.getStorageSync('user_msg')
    console.log(return_con)
    if (return_con == "") {
      wx.showToast({
        title: '您还没有登录,请先登录!',
        icon: "none",
        duration: 2000
      }) 
      // wx.showModal({
      //   title: '',
      //   content: "您还没有登录,请先登录!"
      // })
      setTimeout(function () {
        wx: wx.redirectTo({
          url: '../rank/login_firset',
        })
      }, 2000)
    } else {
      wx: wx.redirectTo({
        url: '../my/my',
      })
    }
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