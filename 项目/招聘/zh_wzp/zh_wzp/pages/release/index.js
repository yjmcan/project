// zh_wzp/pages/release/index.js
var app = getApp()
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
    app.route(this)
    var that = this
    that.setData({
      color: wx.getStorageSync("color")
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: wx.getStorageSync("color"),
    })
    app.util.request({
      url: 'entry/wxapp/Attachurl',
      success: res => {
        console.log(res)
        that.setData({
          url: res.data
        })
      }
    })
    // 查看是否已经认证
    var user_id = wx.getStorageSync("userinfo").id
    app.util.request({
      url: 'entry/wxapp/IsAdmission',
      data: {
        user_id: user_id
      },
      success: res => {
        console.log(res)
        if (res.data == 1) {
        } else {
          wx.showModal({
            title: '',
            content: '你还没有入驻,入驻了再来发布吧',
            success: res => {
              if (res.confirm) {
                wx.redirectTo({
                  url: '../logs/index',
                })
              } else {
                wx.redirectTo({
                  url: '../logs/index',
                })
              }
            }
          })
        }

      }
    })
    that.types()
  },
  tabbar: function (e) {
    console.log(e)
    var that = this
    var url = e.currentTarget.dataset.url
    wx.redirectTo({
      url: url,
    })
  },
  // 一级联动
  types:function(e){
    var that = this
    app.util.request({
      url: 'entry/wxapp/type',
      success: res => {
        console.log(res)
        that.setData({
          types:res.data
        })
      }
    })
    app.util.request({
      url: 'entry/wxapp/Attachurl',
      success: res => {
        console.log(res)
        that.setData({
          url: res.data
        })
      }
    })
  },
  edit:function(e){
    var that = this
    var children = e.currentTarget.dataset.children
    var class_a = e.currentTarget.dataset.id
    if (children.length>0){
      var second_level = []
      children.map(function (item) {
        var obj = {}
        obj = item.name
        second_level.push(obj)
      })
      wx.showActionSheet({
        itemList: second_level,
        success: function (res) {
          console.log(res.tapIndex)
          var index = res.tapIndex
          var name = second_level[index]
          for(let i in children){
            if (children[i].name == name){
              var second_id = children[i].id
              var second_name = children[i].name
              wx.navigateTo({
                url: 'info?type=' + class_a + '&type_id=' + second_id + '&type2_name=' + second_name,
              })
            }
          }
        },
        fail: function (res) {
          console.log(res.errMsg)
        }
      })
    }else{
      wx.showModal({
        title: '',
        content: '此分类没有二级栏目',
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
    var that = this
    return{
      title:'这是转发',
      success:res=>{
        console.log(res)
        wx.getShareInfo({
          success:res=>{
            console.log(res)
          }
        })
      }
    }
  }
})