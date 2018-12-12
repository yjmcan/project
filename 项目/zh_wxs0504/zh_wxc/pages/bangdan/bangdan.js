// pages/bangdan/bangdan.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeIndex:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    console.log(that)

    // —————————————— 获取网址——————————
    app.util.request({
      url: 'entry/wxapp/Attachurl',
      'cachetime': '0',
      success: function (res) {
        // —————————— 异步保存网址前缀————————
        wx.setStorageSync('url', res.data)
        that.setData({
          url: res.data
        })
      },
    })       

  // ——————————获取列表——————————
    app.util.request({
      url: 'entry/wxapp/CateList',
      'cachetime': '0',
      success: function (res) {
        console.log(res.data)
        that.setData({
          nav: res.data
        })
         var listid = that.data.nav[0].id;
        // ——————————获取列表内容——————————
        app.util.request({
          url: 'entry/wxapp/List',
          'cachetime': '0',
          data: {
            catelist_id: listid
          },
          success: function (res) {
            console.log(res.data)
            var all = res.data
            // console.log(all.length)
            that.setData({
              all: all,
            })
            if (res.data.code==200){
              var reset = all.slice(3)
              var one = all[0]
              var two = all[1]
              var three = all[2]
              console.log(all)
              console.log(one)
              console.log(two)
              console.log(three)
              console.log(reset)
              that.setData({
                one: one,
                two: two,
                three: three,
                reset: reset,
              })
            }
          },
        })
      },
    });
  },

  // ——————————点击获取列表内容——————————
  tabClick: function (e) {
    var that = this;
    console.log(e.currentTarget.id)
    var id = e.currentTarget.id;
    console.log("当前的id"+id)
    var index = e.currentTarget.dataset.index
    console.log("下标"+index)
    app.util.request({
      url: 'entry/wxapp/List',
      'cachetime': '0',
      data: {
        catelist_id: id
      },
      success: function (res) {
        console.log(res.data)
        if(res.data.code==501){
          console.log("暂无数据")
        }else{
          var all = res.data
          var reset = all.slice(3)
          var one = all[0]
          var two = all[1]
          var three = all[2]
          console.log(all)
          console.log(one)
          console.log(two)
          console.log(three)
          console.log(reset)
          that.setData({
            one: one,
            two: two,
            three: three,
            reset: reset,
          })
        }
        that.setData({
          activeIndex: index,
          index: index,
        })
      },
    })
  },



  // ——————————跳转到个人中心——————————
  wode: function (e) {
    wx: wx.redirectTo({
      url: '../logs/logs',
    })
  },

  // ——————————跳转到发布——————————
  fabu: function (e) {
    wx: wx.redirectTo({
      url: '../fabu/fabuyewu',
    })
  },

  // ——————————跳转到首页——————————
  index: function (e) {
    wx: wx.redirectTo({
      url: '../index/index',
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