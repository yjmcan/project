var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    user_info: false,
    time: '08:00',
    buytimes: 1,
    zhekou: 0,
    num:1,
    items: [
      { name: '抵扣', value: '抵扣' },
    ],
    know: [
      { name: '上门前请打电话', value: '上门前请打电话' },
      { name: '家里有狗狗', value: '家里有狗狗' },
      { name: '需要擦玻璃', value: '需要擦玻璃' },
      { name: '很久未打扫', value: '很久未打扫' },
      { name: '请重点打扫卧室', value: '请重点打扫卧室' },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    console.log(app.today())
    that.setData({
      id: options.id,
      type: options.type,
      date: app.today()
    })
    if (options.type == 1) {
      that.setData({
        buytimes: 1,
        discount: options.discount
      })
    }
    if (options.type == 2) {
      that.setData({
        buytimes: 1,
        discount: 10
      })
    }
    if (options.type == 3) {
      that.setData({
        buytimes: Number(options.buytimes),
        discount: options.discount
      })
    }
    var id = options.id
    var user_id = wx.getStorageSync('user_info').data.userid
    that.setData({
      productname: options.productname
    })
    // 用户信息
    wx.request({
      url: 'https://sanye.nbxiong.com/jz/getUserInfo.do',
      method: "POST",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: { userid: user_id },
      success: res => {
        console.log(res)
        that.setData({
          user_infos: res.data.user
        })
        var integral = res.data.user.integral
        // 商品详情
        wx.request({
          url: 'https://sanye.nbxiong.com/jz/showServiceProduct.do',
          method: "POST",
          header: {
            "content-type": "application/x-www-form-urlencoded"
          },
          data: { productid: id },
          success: res => {
            console.log(res)
            if (integral >= res.data.serviceproduct.deductibleintegral){
              that.setData({
                integral: res.data.serviceproduct.deductibleintegral
              })
            }else{
              that.setData({
                integral: false
              })
            }
            that.setData({
              commodity: res.data.serviceproduct
            })
            that.cost()
          },
          fail: res => {
            console.log(res)
          }
        })
      },
      fail: res => {
        console.log(res)
      }
    })
  
    // 卡次
    wx.request({
      url: 'https://sanye.nbxiong.com/jz/showAllCards.do',
      method: "POST",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        userid: user_id
      },
      success: res => {
        console.log(res)
        that.setData({
          card_number: res.data
        })
      },
      fail: res => {
        console.log(res)
      }
    })
    
    that.refresh()
  },
  refresh: function (e) {
    var that = this
    var user_id = wx.getStorageSync('user_info').data.userid
  },
  // 选择居家保洁数量
  baojie_nums:function(e){
    this.setData({
      num:e.detail.value
    })
    this.cost()
  },
  // 选择日期
  bindDateChange: function (e) {
    var that = this
    var date = e.detail.value
    var today = app.today()
    var week = app.getTime2Time(today,7)
    console.log(week)
    if (date > week) {
      wx.showModal({
        title: '',
        content: '只能选择7天以内的日期哦',
      })
      that.setData({
        date: today
      })
    }else{
      that.setData({
        date: date
      })
    }

  },
  // 选择时间
  bindTimeChange: function (e) {
    this.setData({
      time: e.detail.value
    })

  },
  // 选择地址
  choose_address: function (e) {
    var that = this
    wx.chooseAddress({
      success: res => {
        console.log(res)
        that.setData({
          name: res.userName,
          tel: res.telNumber,
          address: res.provinceName + res.cityName + res.countyName + res.detailInfo,
          user_info: true
        })
      }
    })
  },
  checkboxChange: function (e) {
    console.log(e)
    var that = this
    if (e.detail.value.length == 0) {
      that.setData({
        dikou: false,
        zhekou: 0
      })
      that.cost()
    } else {

      var integral = that.data.user_infos.integral
      var z_cost = that.data.z_cost
      var sj_cost = that.data.sj_cost
      var commodity = that.data.commodity
      if (integral >= commodity.deductibleintegral) {
        that.setData({
          zhekou: Number(commodity.deductibleintegral)*0.05,
          integral: Number(commodity.deductibleintegral),
          dikou:true
        })
        that.cost()
      } else {
        wx.showModal({
          title: '',
          content: '可用积分不足',
        })
      }
    }
  },
  checkboxChanges: function (e) {
    console.log(e)
    var items = e.detail.value
    this.setData({
      knows: items
    })

  },
  nums: function (e) {
    this.setData({
      nums: e.detail.value
    })
    this.cost()
  },
  cost: function (e) {
    var that = this
    var num = that.data.num
    var discount = that.data.discount / 10
    var zhekou = that.data.zhekou
    discount = Number(discount)
    var commodity = that.data.commodity
    var buytimes = that.data.buytimes
    var price = commodity.price*num
    console.log(price)
    console.log(buytimes)
    var z_cost = price * buytimes
    z_cost = z_cost.toFixed(2)
    console.log(z_cost)
    console.log(discount)
    var sj_cost = z_cost * discount - zhekou
    sj_cost = sj_cost.toFixed(2)
    console.log(sj_cost)
    // if (sj_cost<=0){
    //   sj_cost = 0.01
    // }
    that.setData({
      z_cost: z_cost,
      sj_cost: sj_cost
    })
  },
  // 提交表单
  formSubmit: function (e) {
    var that = this
    var num = that.data.num
    var user_id = wx.getStorageSync('user_info').data.userid
    function isTelCode(str) {
      var reg = /^1[3|4|5|7|8|9][0-9]\d{4,8}$/;
      return reg.test(str);
    }
    console.log(user_id)
    console.log(that.data.dikou)
    var sj_cost = that.data.sj_cost
    var zhekou = that.data.zhekou
    var commodity = that.data.commodity
    var id = that.data.id
    var address = that.data.address
    var date = that.data.date
    var time = that.data.time
    var nums = e.detail.value.nums
    var name = e.detail.value.name
    var phone = e.detail.value.tel
    var textarea = e.detail.value.textarea
    var know = that.data.knows
    var integral = that.data.user_infos.integral
    if (know == null) {
      know = ''
    } else {
      know = know.join(",")
    }
    if (zhekou != 0) {
      var orderintegral = String(integral)
    } else {
      var orderintegral = String(0)
    }

    console.log(know)
    console.log(date + ' ' + time)
    var title = ''
    if (address == null || address == '') {
      title = '请选择地址'
    } else if (date == '') {
      title = '请选择日期'
    } else if (time == '') {
      title = '请选择时间'
    } else if (name == '') {
      title = '请输入预约人姓名'
    } else if (phone == '') {
      title = '请输入预约人电话'
    } else if (isTelCode(phone) == false) {
      title = '请输入正确的手机号'
    }
    if (title != '') {
      wx.showModal({
        title: '',
        content: title,
      })
    } else {
      var date = that.data.date + ' ' + that.data.time
      // 
      console.log(that.data.type)
      // 先生成订单
      wx.request({
        url: 'https://sanye.nbxiong.com/jz/createUserOrder.do',
        method: "POST",
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        data: {
          userid: user_id,
          ordercontent: commodity.productname,
          appdate: date,
          orderaddress: address,
          ordername: name,
          orderphone: phone,
          reservemoney: that.data.sj_cost,
          productid: that.data.id,
          telmsg: know,
          orderremarks: textarea,
        },
        success: res => {
          console.log('这是生成订单')
          console.log(res)
          var order_id = res.data.serviceorder.orderid
          console.log(typeof (user_id))
          console.log(typeof (sj_cost))
          console.log(typeof (orderintegral))
          console.log(typeof (res.data.serviceorder.orderid))
          // 直接购买
          if (that.data.type == 2 || that.data.type == 3) {
            wx.request({
              url: 'https://sanye.nbxiong.com/jz/createUnifiedOrder.do',
              method: "POST",
              header: {
                "content-type": "application/x-www-form-urlencoded"
              },
              data: {
                userid: user_id,
                amount: sj_cost,
                intg: orderintegral,
                orderid: order_id
              },
              success: res => {
                var pay = res.data
                console.log('这是支付')
                console.log(res)
                if (res.data.result != 0){
                  wx.requestPayment({
                    'timeStamp': pay.timeStamp,
                    'nonceStr': pay.nonceStr,
                    'package': pay.package,
                    'signType': pay.signType,
                    'paySign': pay.paySign,
                    'success': function (res) {
                      // 验证支付是否成功
                      wx.request({
                        url: 'https://sanye.nbxiong.com/jz/generatServiceOrder.do',
                        method: "POST",
                        header: {
                          "content-type": "application/x-www-form-urlencoded"
                        },
                        data: {
                          serviceorderid: pay.serviceorderid,
                          nonce_str: pay.nonceStr,
                          sign: pay.signType,
                          orderpaytype: 0,
                          count: that.data.buytimes,
                          productsize: num
                        },
                        success: res => {
                          var pay = res.data
                          console.log('这是验证支付')
                          console.log(res)
                          if (res.data.result == 1) {
                            wx.showToast({
                              title: '订单提交成功',
                            })
                            setTimeout(function () {
                              wx.navigateTo({
                                url: '../order/order',
                              })
                            }, 1500)
                          }
                        },
                        fail: res => {
                          console.log(res)
                        }
                      })
                    },
                    'fail': function (res) {
                    }
                  })
                }else{
                  wx.showModal({
                    title: '',
                    content: res.data.info,
                  })
                }
              
              },
              fail: res => {
                console.log(res)
              }
            })
          } else {
            // 卡次预约
            wx.request({
              url: 'https://sanye.nbxiong.com/jz/generatServiceOrder.do',
              method: "POST",
              header: {
                "content-type": "application/x-www-form-urlencoded"
              },
              data: {
                serviceorderid: order_id,
                orderpaytype: 1,
                count: 1,
                productsize: ''
              },
              success: res => {
                var pay = res.data
                console.log('这是预约卡次')
                console.log(res)
                if (res.data.result == 1) {
                  wx.showToast({
                    title: '订单提交成功',
                  })
                  setTimeout(function () {
                    wx.navigateTo({
                      url: '../order/order',
                    })
                  }, 1500)
                }
              },
              fail: res => {
                console.log(res)
              }
            })
          }
        },
        fail: res => {
          console.log(res)
        }
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