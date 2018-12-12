// zh_jypx/pages/rank/login.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    time: '获取验证码', //倒计时 
    currentTime: 60,
    disabled: false,
    hidden: true,
    cou: true,
    class_c: true,
    index: 0,
    grade_index:0,
    u_index:0,
    c_index:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(that)
    wx.login({
      success: function (res) {
        var code = res.code
        console.log(res)
        wx.setStorageSync("code", code)
        wx.getUserInfo({
          success: function (res) {
            console.log(res)
            wx.setStorageSync("user_info", res.userInfo)
            var nickName = res.userInfo.nickName
            var avatarUrl = res.userInfo.avatarUrl
            app.util.request({
              'url': 'entry/wxapp/openid',
              'cachetime': '0',
              data: { code: code },
              success: function (res) {
                console.log(res)
                wx.setStorageSync("key", res.data.session_key)
                wx.setStorageSync("openid", res.data.openid)
              }
            })
          }
        })
      }
    })

    that.school()

  },

  //学校
  school:function(e){
    var that = this
    var index= that.data.index
    //获取所有的学校
    app.util.request({
      "url": "entry/wxapp/School",
      "cachetime": "0",
      success: function (res) {
        console.log(res)
        if (res.data.code == 200) {
          var school_id = res.data.list[index].id
          var school = []
          res.data.list.map(function (item) {
            var obj = {};
            obj = item.cate_name,
              school.push(obj);
          })
          console.log(school)
          that.setData({
            school: school,
            school_id: school_id,
            s_none:res.data
          })
          that.grade()
        }else{
          that.setData({
            s_none: res.data
          })
        }
      }
    })
  },

  // 年级 
  grade:function(e){
    var that = this
    var school_id= that.data.school_id
    var grade_index = that.data.grade_index
    app.util.request({
      "url": "entry/wxapp/CourseCate",
      "cachetime": "0",
      data: {
        school_id: school_id
      },
      success: function (res) {
        console.log(res)
        if (res.data.code == 201) {
          var grade_id = res.data.list[grade_index].id
          console.log(grade_id)
          var grade = []
          res.data.list.map(function (item) {
            var obj = {};
            obj = item.course_name,
              grade.push(obj);
          })
          console.log(grade)
          that.setData({
            grade: grade,
            grade_id: grade_id,
          
          })
          that.course()
        }else{
          console.log("无年级")

          var grade = [
            '暂无数据'
          ]
          that.setData({
            grade:grade
          })
        }
      }
    })
  },

  //课程
  course:function(e){
    var that = this
    var grade_id = that.data.grade_id
    var u_index = that.data.u_index
    app.util.request({
      "url": "entry/wxapp/Course",
      "cachetime": "0",
      data: {
        id: grade_id
      },
      success: function (res) {
        console.log(res)
        if (res.data.code == 200) {
          var u_id = res.data.list[u_index].id
          var course = []
          res.data.list.map(function (item) {
            var obj = {};
            obj = item.name,
              course.push(obj);
          })
          that.setData({
            course: course,
            u_id: u_id
          })
          that.classes()
        } else {
          console.log("无课程")

          var course = [
            '暂无数据'
          ]
          that.setData({
            course: course
          })
        }
      }
    })
  },

  //班级
  classes: function (e) {
    var that = this
    var u_id = that.data.u_id
    console.log(u_id)
    var c_index = that.data.c_index
    app.util.request({
      "url": "entry/wxapp/Class",
      "cachetime": "0",
      data: {
        cou_id: u_id
      },
      success: function (res) {
        console.log(res)
        if (res.data.code == 200) {
          var cou_id = res.data.list[c_index].id

          var classes = []
          res.data.list.map(function (item) {
            var obj = {};
            obj = item.class_name,
              classes.push(obj);
          })
          that.setData({
            classes: classes,
            cou_id: cou_id
          })
        }else{
          console.log("无班级")
          var classes = [
            '暂无数据'
          ]
          that.setData({
            classes: classes
          })          
        }
      }
    })
  },

  /*选择学校 */
  bindPickerSchoole: function (e) {
    console.log(e)
    var that = this;
    this.setData({
      index: e.detail.value
    })
    that.school()
  },

  /*选择年级 */
  bindPickerGrade: function (e) {
    console.log(e)
    var that=this
    this.setData({
      grade_index: e.detail.value
    })
    that.grade()
  },

  /*选择课程 */
  bindPickerCourse: function (e) {
    var that=this;
    this.setData({
      u_index: e.detail.value
    })
    that.course()
  },

  /*选择班级 */
  bindPickerClasses: function (e) {
    this.setData({
      c_index: e.detail.value
    })
  },

  /*提交注册 */
  formSubmit: function (e) {
    var that = this;
    console.log(that)
    var avatarUrl = wx.getStorageSync("user_info").avatarUrl
    var nickName = wx.getStorageSync("user_info").nickName
    var openid = wx.getStorageSync("openid")
    console.log(avatarUrl + "" + nickName + "" + openid)
    var school = e.detail.value.school;
    var classes = e.detail.value.classes;
    var course = e.detail.value.course;
    var grade = e.detail.value.grade;
    var parent_name = e.detail.value.parent_name;
    var child_name = e.detail.value.child_name;
    var phone = e.detail.value.phone;
    var code = e.detail.value.code;
    var recive_code = that.data.recive_code;
    var password = e.detail.value.password;
    //班级的id
    var class_id = that.data.cou_id;
    console.log("班级的id:"+class_id)
    // var index = that.data.c_index;
    // var all_list = that.data.all.list
    // console.log(all_list)
    // // var id = all_list[index].id
    // // console.log(id)
    // // var con=that.data.
    // //获取对应班级的iduy
    // for (var i = 0; i < all_list.length; i++) {
    //   if (classes == all_list[i].class_name) {
    //     var id = all_list[i].id
    //     console.log(id)
    //   }
    // }
    // console.log(id)

    console.log("所在学校 : " + school)
    console.log("所在年级 : " + grade)
    console.log("选择课程 : " + course)
    console.log("所在班级 : " + classes)
    console.log("家长姓名 : " + parent_name)
    console.log("孩子姓名 : " + child_name)
    console.log("联系电话 : " + phone)
    console.log("验证码 : " + code)
    console.log("登录密码 : " + password)
    console.log("随机六位数 : " + recive_code)
    console.log(that)

    var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
    var tip = ""
    if (school == "") {
      tip = "请选择学校!"
    } else if (grade == "") {
      tip = "请选择年级!"
    } else if (course == "") {
      tip = "请选择课程!"
    } else if (classes == "") {
      tip = "请选择班级!"
    } else if (parent_name == "") {
      tip = "请输入家长姓名!"
    } else if (child_name == "") {
      tip = "请输入孩子姓名!"
    } else if (!myreg.test(phone)) {
      tip = "您输入的电话格式有误!"
    } else if (code == "") {
      tip = "请输入验证码!"
    } else if (code != recive_code) {
      tip = "您输入验证码有误!"
    } else if (password == "") {
      tip = "请输入登录密码!"
    }
    // } else if (code != recive_code){
    //   tip = "您输入的验证码不正确!"
    // }
    if (tip != "") {
      wx.showModal({
        title: '',
        content: tip
      })
    } else {
      app.util.request({
        "url": "entry/wxapp/Register",
        "cachetime": "0",
        data: {
          class_id: class_id,
          parents_name: parent_name,
          students_name: child_name,
          phone: phone,
          code: code,
          pass_word: password,
          openid: openid,
          img: avatarUrl,
          nickname: nickName
        },
        success: function (res) {
          console.log("注册成功")
          console.log(res)

          if (res.data.code == 505) {
            wx.showToast({
              title: '该手机号已被注册!',
              icon: "none",
              duration: 2000
            })
            setTimeout(function () {
              wx: wx.redirectTo({
                url: 'login_firset',
              })
            }, 2000)
          } else {
            wx.showToast({
              title: '注册成功待审核!',
              icon: "none",
              duration: 2000
            })
            setTimeout(function () {
              wx: wx.redirectTo({
                url: 'login_firset',
              })
            }, 2000)
          }
        }
      })
    }
  },

  //获取电话号码
  onChange: function (e) {
    var num = e.detail.value;
    console.log(num)
    this.setData({
      num: num
    })
  },

  //获取验证码
  onCode: function (e) {
    var that = this;
    // console.log(that)
    var currentNum = that.data.num;
    console.log(currentNum)
    var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;

    if (!myreg.test(currentNum)) {
      wx.showToast({
        title: '您输入的手机号有误!',
        icon: "none",
        duration: 2000
      })
    } else {
      that.getCode();
      // // 获取6位数的随机数
      var recive_code = "";
      for (var i = 0; i < 6; i++) {
        recive_code += Math.floor(Math.random() * 10);
      }
      console.log(recive_code)
      that.setData({
        disabled: true,
        recive_code: recive_code
      })
      // 随机数传给后台
      app.util.request({
        'url': 'entry/wxapp/Code',
        'cachetime': '0',
        data: {
          code: recive_code,
          phone: currentNum
        },
        success: function (res) {
          console.log(res)
        }
      })
    }
  },

  //倒计时
  getCode: function (e) {
    var that = this;
    console.log(that)
    //输入的手机号
    var currentNum = that.data.num;
    var currentTime = that.data.currentTime;
    var interval = setInterval(function () {
      currentTime--;
      that.setData({
        time: currentTime + '秒'
      })
      if (currentTime <= 0) {
        clearInterval(interval)
        that.setData({
          time: "重新获取",
          currentTime: 60,
          disabled: false
        })
      }
    }, 1000)

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