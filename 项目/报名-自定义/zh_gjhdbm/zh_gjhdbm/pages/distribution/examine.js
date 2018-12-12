// zh_jdgjb/pages/distribution/examine.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fwxy:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    app.setNavigationBarColor(this);
    // that.refresh()
  },
  refresh:function(e){
    var that = this
    // 动态设置顶部导航栏颜色
    // wx.setNavigationBarColor({
    //   frontColor: '#ffffff',
    //   backgroundColor: wx.getStorageSync('platform').color,
    // })
    // that.setData({
    //   color: wx.getStorageSync('platform').color,
    // })
    var user_id = wx.getStorageSync('userInfo').id
    // 查看用户上线
    app.util.request({
      url: 'entry/wxapp/MySx',
      data: {
        user_id: user_id,
      },
      success: res => {
        console.log(res)
        if (res.data == false) {
          that.setData({
            name: wx.getStorageSync('platform').pt_name,
            bind_userid:0
          })
        } else {
          if (res.data.user_id == 0) {
            that.setData({
              name: wx.getStorageSync('platform').pt_name,
              bind_userid: 0
            })
          } else {
            that.setData({
              name: res.data.name,
            bind_userid: res.data.user_id
            })
          }
        }
      }
    })
    app.util.request({
      url: 'entry/wxapp/GetFxSet',
      success: res => {
        console.log(res)
        that.setData({
          GetFxSet: res.data,
          url: wx.getStorageSync('url')
        })
      }
    })
  },
  formSubmit:function(e){
    console.log(e)
    var that = this
    var name = e.detail.value.name
    var tel = e.detail.value.tel
    var user_id = wx.getStorageSync('userInfo').id
    var bind_userid = that.data.bind_userid
    console.log(bind_userid)
    console.log(user_id)
    var title = ''
    if(name==''){
      title = '请输入您的真实姓名'
    }else if(tel==''){
      title = '请输入您的手机号码'
    }
    if(title!=''){
      wx.showModal({
        content: title,
      })
    }else{
      app.util.request({
        'url': 'entry/wxapp/Binding',
        'cachetime': '0',
        data: {
          fx_user: user_id,
          user_id: bind_userid
        },
        success: function (res) {
          console.log('这是成为下级分销商')
          console.log(res)
         
        },
      })
      app.util.request({
        url: 'entry/wxapp/Distribution',
        data: {
          user_id: user_id,
          user_name: name,
          user_tel: tel
        },
        success: res => {
          console.log(res)
          wx.showToast({
            title: '已提交申请',
          })
          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
          }, 1500)
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
    this.refresh()
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

})