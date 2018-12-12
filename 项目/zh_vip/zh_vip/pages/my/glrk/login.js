// zh_dianc/pages/seller/login.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    disabled:true,
    zh:'',
    mm:'',
    logintext:'登录'
  },
  tel: function () {
    var that = this;
    wx.makePhoneCall({
      phoneNumber: that.data.tel //仅为示例，并非真实的电话号码
    })
  },
  form_save: function (e) {
    console.log(e)
    var form_id = e.detail.formId
    app.util.request({
      'url': 'entry/wxapp/AddFormId',
      data: {
        user_id: wx.getStorageSync('UserData').id,
        form_id: form_id
      },
      success: res => {
        console.log(res)
      }
    })
  },
  srzh:function(e){
    console.log(e.detail.value)
    this.setData({
      zh: e.detail.value
    })
    if(this.data.zh!=''&&this.data.mm!=''){
      this.setData({
        disabled:false
      })
    }
    else{
      this.setData({
        disabled: true
      })
    }
  },
  srmm: function (e) {
    console.log(e.detail.value)
    this.setData({
      mm: e.detail.value
    })
    if (this.data.zh != '' && this.data.mm != '') {
      this.setData({
        disabled: false
      })
    }
    else {
      this.setData({
        disabled: true
      })
    }
  },
  login:function(){
    var zh=this.data.zh,mm=this.data.mm
    console.log(zh,mm)
    this.setData({
      logintext:'登录中...',
      disabled:true,
    })
    var that=this;
    app.util.request({
      'url': 'entry/wxapp/storelogin',
      'cachetime': '0',
      data:{user:zh,password:mm},
      success: function (res) {
        console.log(res)
        that.setData({
          logintext: '登录',
          disabled: false,
        })
        if (res.data.storeid!=null){
          wx.setStorageSync('sjdsjid', res.data.storeid)
          wx.setStorageSync('acountid', res.data.id)
          wx.redirectTo({
            url: 'index'
          })
        }
        else{
          wx.showModal({
            title: '提示',
            content: res.data,
          })
        }
      },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(this);
    // var sjdsjid = wx.getStorageSync('sjdsjid')
    // console.log(sjdsjid)
    // if(sjdsjid){
    //   console.log('已存在')
    //   wx.redirectTo({
    //     url: 'index'
    //   })
    // }
    // else{
    //   console.log('不存在')
    // }
    // 系统设置
    app.util.request({
      'url': 'entry/wxapp/system',
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        that.setData({
          bqxx: res.data,
          tel: res.data.link_tel,
          url:getApp().imgurl, 
        })
        // wx.setNavigationBarTitle({
        //   title: res.data.pt_name+'客服中心'
        // })
      },
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