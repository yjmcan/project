// zh_wzp/pages/look_wor/info.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nav:[
      {

      },
      {
        
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
      id:options.id
    })
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
    var user_id = wx.getStorageSync("userinfo").id
    // 查看是否已经发送过面试邀请
    app.util.request({
      url: 'entry/wxapp/IsResume',
      data:{
        user_id:user_id,
        resume_id:options.id
      },
      success: res => {
        console.log(res)
        that.setData({
          IsResume: res.data
        })
      }
    })
    that.info()
    that.iscollec()
    // 查看用户发布的职位
    app.util.request({
      url: 'entry/wxapp/PositionList',
      data: {
        user_id: user_id
      },
      success: res => {
        console.log(res)
        if(res.data.length==0){
          wx.showModal({
            title: '',
            content: '您还没有发布过职位',
            success:res=>{
              if(res.confirm){
                wx.navigateBack({
                  delta:1
                })
              }else{
                wx.navigateBack({
                  delta: 1
                })
              }
            }
          })
        } else {
          that.setData({
            user_resume: res.data
          })
        }
      }
    })
  },
  info:function(e){
    var that = this
    var id = that.data.id
    function computeAge(startDate) {
      // 获得今天的时间
      var date = new Date();
      startDate = new Date(startDate);
      console.log(date)
      console.log(startDate)
      var newDate = Number(date.getTime()) - Number(startDate.getTime());
      console.log(newDate)
      // 向下取整  例如 10岁 20天 会计算成 10岁
      // 如果要向上取整 计算成11岁，把floor替换成 ceil
      return Math.ceil(newDate / 1000 / 60 / 60 / 24 / 365);
    }
    app.util.request({
      url: 'entry/wxapp/AllDetails',
      data:{
        id:id
      },
      success: res => {
        console.log(res)
        res.data.area = res.data.area.split(",")
        res.data.birthday = computeAge(res.data.birthday)
        that.setData({
          info: res.data
        })
      }
    })
  },
  iscollec:function(e){
    var that = this
    var user_id = wx.getStorageSync("userinfo").id
    var id = that.data.id
    app.util.request({
      url: 'entry/wxapp/IsCollection',
      data: {
        user_id: user_id,
        resume_id: id
      },
      success: res => {
        console.log(res)
        if(res.data==1){
          that.setData({
            coll:false
          })
        }else{
          that.setData({
            coll: true
          })
        }
      }
    })
  },
  collections:function(e){
    var that = this
    var coll = that.data.coll
    var user_id = wx.getStorageSync("userinfo").id
    var id = that.data.id
    app.util.request({
      url: 'entry/wxapp/CollectionResume',
      data: {
        user_id: user_id,
        resume_id: id
      },
      success: res => {
        console.log(res)
        if (res.data.code == '200') {
          wx.showToast({
            title: '收藏成功',
          })
          that.setData({
            coll: false
          })
        } else {
          wx.showToast({
            title: '取消收藏',
          })
          that.setData({
            coll: true
          })
        }
      
      }
    })
    // // 为true没收藏
    // if(coll==true){
    //   console.log('收藏成功')
    //   wx.showToast({
    //     title: '收藏成功',
    //   })
    //   that.collection()
    //   that.iscollec()
    // } else {
    //   console.log('取消收藏')
    //   console.log('取消收藏')
    //   wx.showToast({
    //     title: '取消收藏',
    //   })
    //   that.collection()
    //   that.iscollec()
    // }
  },
  choise:function(e){
    var that = this
    var user_resume = that.data.user_resume
    var resume_id = that.data.id
    var user_id = wx.getStorageSync("userinfo").id
    var resume = []
    for (let i in user_resume){
      resume.push(user_resume[i].type_name)
    }
    wx.showActionSheet({
      itemList: resume,
      success: function (res) {
        console.log(res.tapIndex)
        var index = res.tapIndex
        var name = resume[index]
        for (let i in user_resume) {
          if (user_resume[i].type_name == name) {
            var id = user_resume[i].id
            app.util.request({
              url: 'entry/wxapp/SetMeet',
              data: {
                user_id: user_id,
                resume_id: resume_id,
                position_id:id
              },
              success: res => {
                console.log(res)
                if (res.data.code == "200") {
                  wx.showToast({
                    title: '发送成功',
                  })
                  setTimeout(function () {
                    wx.redirectTo({
                      url: '../Interview/index',
                    })
                  }, 1500)
                } else {
                  wx.showToast({
                    title: '发送失败',
                  })
                  setTimeout(function () {
                    wx.navigateBack({
                      delta: 1
                    })
                  }, 1500)
                }
              }
            })
          }
        }
      },
      fail: function (res) {
        console.log(res.errMsg)
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