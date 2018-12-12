// zh_wzp/pages/resume/index.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nav:[
      {
        name:'简历1',
      },
      {
        name: '简历2',
      },
      {
        name: '简历3',
      },
      {
        name: '简历4',
      },
      {
        name: '简历5',
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.route(this)
    var that = this
    that.setData({
      color: wx.getStorageSync("color")
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: wx.getStorageSync("color"),
    })
  },
  users:function(e){
    var user_id = wx.getStorageSync("userinfo").id
    app.util.request({
      url: 'entry/wxapp/GetCenter',
      data: {
        user_id: user_id
      },
      success: res => {
        console.log(res)
        var userInfo = res.data
        if (userInfo.code == '500') {
          wx.showModal({
            title: '提示',
            content: '您还没有完善个人信息，点击确定去完善',
            success: function (res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '../user/index',
                })
              } else if (res.cancel) {
                wx.navigateBack({
                  delta: 1
                })
              }
            }
          })
        }
      }
    })
  },
  mine_resume:function(e){
    var that = this
    var user_id = wx.getStorageSync("userinfo").id
    app.util.request({
      url: 'entry/wxapp/MyResume',
      data:{
        user_id:user_id
      },
      success: res => {
        console.log(res)
        that.setData({
          nav:res.data
        })
      }
    })
  },
  bianji:function(e){
    wx.navigateTo({
      url: 'set_up?type=' + e.currentTarget.dataset.type + '&id=' + e.currentTarget.dataset.id,
    })
  },
  cancel:function(e){
    var that =this
    var id = e.currentTarget.dataset.id
    wx.showModal({
      title: '',
      content: '确定删除此简历？',
      success:res=>{
        if(res.confirm){
          app.util.request({
            url: 'entry/wxapp/DelResume',
            data: {
              id: id
            },
            success: res => {
              wx.showToast({
                title: res.data.msg,
              })
              setTimeout(function(){
                that.mine_resume()
              },1500)
            }
          })
        }
      }
    })
  },
  default: function (e) {
    var that = this
    var user_id = wx.getStorageSync('userinfo').id
    var id = e.currentTarget.dataset.id
    wx.showModal({
      title: '',
      content: '是否设置此简历为默认简历？',
      success: res => {
        if (res.confirm) {
          app.util.request({
            url: 'entry/wxapp/Default',
            data: {
              id: id,
              user_id: user_id
            },
            success: res => {
              wx.showToast({
                title: '设置成功',
              })
              setTimeout(function () {
                that.mine_resume()
              }, 1500)
            }
          })
        }
      }
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
    this.users()
    this.mine_resume()
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