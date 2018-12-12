// pages/jifen/jifeninfo.js
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    edit: false,
    text:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      id: options.id
    })
    app.getUserInfo(function (userInfo) {
      console.log(userInfo)
      that.setData({
        userInfo: userInfo,
      })
    })
    var user_id = wx.getStorageSync('user_info').data.userid
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
      },
      fail: res => {
        console.log(res)
      }
    })
    var id = options.id
    // 积分商城
    wx.request({
      url: 'https://sanye.nbxiong.com/jz/showMallProduct.do',
      method: "POST",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: { productid: id },
      success: res => {
        console.log(res)
        // res.data.mallproduct.productdetailimgs = res.data.mallproduct.productdetailimgs.split(";")
        that.setData({
          score_info: res.data.mallproduct
        })
      },
      fail: res => {
        console.log(res)
      }
    })
  },
  // 选择收货地址
  select_address: function (e) {
    var that = this
    wx.chooseAddress({
      success: res => {
        console.log(res)
        var tel = res.telNumber
        var name = res.userName
        var address = res.provinceName + res.cityName + res.countyName + res.detailInfo
        that.setData({
          tel: tel,
          name: name,
          address: address,
          edit: true
        })
      }
    })
  },
  text:function(e){
    this.setData({
      text:e.detail.value
    })
  },
  // 立即兑换
  exchange: function (e) {
    var that = this
    var edit = that.data.edit
    var tel = that.data.tel
    var name = that.data.name
    var address = that.data.address
    var score_info = that.data.score_info
    var user_infos = that.data.user_infos
    var text = that.data.text
    console.log(text)
    var title = ''
    if (score_info.priceintegral > user_infos.integral){
      title = '当前碳币不足以兑换'
    }else if (edit == false) {
      title = '请选择收货地址'
    } else if (name == '' || name == null) {
      title = '请填写姓名'
    } else if (tel == '' || tel == null) {
      title = '请填写联系方式'
    } else if (address == '' || address == null) {
      title = '请填写地址'
    }
    if (title != '') {
      wx.showModal({
        title: '',
        content: title,
      })
    } else {
      var user_id = wx.getStorageSync('user_info').data.userid
      // 积分商城
      wx.request({
        url: 'https://sanye.nbxiong.com/jz/generatMallOrder.do',
        method: "POST",
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        data: { 
          userid: user_id,
          orderName:name,
          remark: text,
          orderPhone:tel,
          orderAddress:address,
          orderIngegral: score_info.priceintegral,
          orderContent: score_info.productid,
          productid:that.data.id
         },
        success: res => {
          console.log(res)
          if (res.data.result==1){
            wx.showToast({
              title: '兑换成功',
            })
            setTimeout(function(){
              wx.redirectTo({
                url: '../shop_order/shop_order',
              })
            },1500)
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