// pages/waste_recovery/waste_recovery.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user_info: false,
    getmsg: "发送验证码",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  var that = this
  that.refresh()
  },

  refresh: function (e) {
    var that = this
    var user_id = wx.getStorageSync('user_info').data.userid
    that.setData({
      user_id:user_id
    })
    // 获取用户地址
    wx.request({
      
      url: 'https://sanye.nbxiong.com/jz/getAddressList.do',
      data: {
        userid: user_id,
      },
      success: res => {
        console.log(res)
        if(res.data.address!=null){
          that.setData({
            address: res.data.address[0].conaddress,
            conphone: res.data.address[0].conphone,
            conname: res.data.address[0].conname,
            user_info: true
          })
        }
        
      },
      fail: res => {
        console.log(res)
      }
    })
    // 获取回收商品
    wx.request({
      url: 'https://sanye.nbxiong.com/jz/listRecProduct.do',
      method: "POST",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        userid: user_id,
      },
      success: res => {
        console.log(res)
        that.setData({
          list: res.data.recproduct
        })
      },
      fail: res => {
        console.log(res)
      }
    })
  },
  choose_address:function(e){
    var that = this
    wx.chooseAddress({
      success: function (res) {
        console.log(res.userName)
        console.log(res.postalCode)
        console.log(res.provinceName)
        console.log(res.cityName)
        console.log(res.countyName)
        console.log(res.detailInfo)
        console.log(res.nationalCode)
        console.log(res.telNumber)
        var address = res.provinceName + res.cityName + res.countyName + res.detailInfo
        var name = res.userName
        var phone = res.telNumber
        var user_id = that.data.user_id
        console.log(user_id)
        
        wx.request({
          url: 'https://sanye.nbxiong.com/jz/addAddress.do',
          method: "POST",
          header: {
            "content-type": "application/x-www-form-urlencoded"
          },
          data: {
            userid: user_id,
            conPhone: phone,
            conAddress: address,
            conName: name,

          },
          success: res => {
            console.log(res)
          },
          fail: res => {
            console.log(res)
          }
        })
        that.setData({
          address:address,
          name:name,
          phone:phone,
          user_info:true
        })
      }
    })
  },
  phone:function(e){
    var that = this
    that.setData({
      phone:e.detail.value
    })
  },
  // 发送验证码
  message:function(e){
    var that = this
    var phone = that.data.phone
    console.log(phone)
    if (phone == '' || phone == null) {
      wx: wx.showToast({
        title: '请输入手机号',
        icon: '',
        image: '',
        duration: 2000,
        mask: true,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    } else {
      // 获取6位数的随机数
      var Num = "";
      for (var i = 0; i < 6; i++) {
        Num += Math.floor(Math.random() * 10);
      }
      console.log(Num)
      // 随机数传给后台
      wx.request({
        url: 'https://sanye.nbxiong.com/jz/sendCodeMes.do',
        data: {
          phone: phone
        },
        success: res => {
          console.log(res)
        },
        fail: res => {
          console.log(res)
        }
      })
      var time = 60
      // 60秒倒计时
      var inter = setInterval(function () {
        that.setData({
          getmsg: time + "s后重新发送",
          send: true
        })
        time--
        if (time <= 0) {
          // 停止倒计时
          clearInterval(inter)
          that.setData({
            getmsg: "获取验证码",
            send: false,
            num: 0
          })
        }
      }, 1000)
    }
  },
  formSubmit:function(e){
    var that = this
    var address = that.data.address
    var name = e.detail.value.people
    var phone = e.detail.value.phone
    var code = e.detail.value.code
    var title = ''
    if(address==null){
      title = '请选择地址'
    }else if(name==''){
      title = '请输入您的姓名'
    }else if(phone==''){
      title = '请输入您的手机号'
    }else if(code==''){
      title = '请输入验证码'
    }
    if(title!=''){
      wx.showModal({
        title: '温馨提示',
        content: title,
      })
    }else{
      var user_id = that.data.user_id
      // 判断验证码是否输入正确
      wx.request({
        url: 'https://sanye.nbxiong.com/jz/checkCode.do',
        method: "POST",
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        data: {
          inputcode: code,
          phone: phone,
        },
        success: res => {
          console.log(res)
          if (res.data.result == 1) {
            // 提交订单
            wx.request({
              url: 'https://sanye.nbxiong.com/jz/generatRecOrder.do',
              method: "POST",
              header: {
                "content-type": "application/x-www-form-urlencoded"
              },
              data: {
                userid: user_id,
                resname: name,
                resphone: phone,
                name: that.data.conname,
                phone: that.data.conphone,
                address: that.data.address,
                code: code
              },
              success: res => {
                console.log(res)
                if (res.data.result == 1) {
                  wx.showToast({
                    title: '订单提交成功',
                  })
                  setTimeout(function () {
                    wx.redirectTo({
                      url: 'exchange/exchange',
                    })
                  }, 1500)
                }
                if (res.data.result == 0) {
                  wx.showToast({
                    title: '验证码错误',
                  })
                }
                if (res.data.result == -1) {
                  wx.showToast({
                    title: '验证码失效',
                  })
                }
              },
              fail: res => {
                console.log(res)
              }
            })
          }
          
        },
      })
    }
  },
  exchange:function(e){
    wx.navigateTo({
      url: '../exchange/exchange',
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