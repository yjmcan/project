// pages/my/myjoin.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeIndex: 0,
    hidden: false,
    season:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id=options
    console.log(id)

    var that=this;
    /*获取当前时间 */
    var now = that.today_time();
    console.log(now)
    this.setData({
      now: now
    }); 
    
    that.refresh()    
  },
  // order: function (e) {

  //   var id = that.data.prolist[0].id;
  //   var userid = wx.getStorageSync('users').id
  //   //console.log(userid)
  //   app.util.request({
  //     'url': 'entry/wxapp/Partake',
  //     'cachetime': '0',
  //     data: {
  //       c_id: id,
  //       u_id: userid
  //     },
  //     success: function (res) {
  //       console.log("产品列表数据")
  //       console.log(res.data)
  //       that.setData({
  //         luntext: res.data
  //       })
  //     },
  //   })
  // },

  refresh:function(e){
    var that = this
    //—————————————————————————————— 产品分类 ——————————————————————————————
    app.util.request({
      url: 'entry/wxapp/Category',
      'cachetime': '0',
      success: function (res) {
        console.log("产品分类数据")
        console.log(res.data)
        // var id = res.data[0].id
        // console.log(id)
        if(res.data.code==500){
          console.log("暂无数据")
          that.setData({
            all_con: res.data
          })
        }else{
          that.setData({
            prolist: res.data,
            hidden: true
          })
          var id = that.data.prolist[0].id;
          var userid = wx.getStorageSync('users').id
          console.log(userid)
          console.log(id)

          app.util.request({
            url: 'entry/wxapp/Partake',
            'cachetime': '0',
            data: {
              c_id: id,
              u_id: userid
            },
            success: function (res) {
              console.log("产品列表数据")
              console.log(res.data)
              that.setData({
                luntext: res.data
              })
            },
          })
        }
      },
    });
  },
  // 产品列表的点击事件
  onClick: function (e) {
    var that = this;
    console.log(e)
    var id = e.currentTarget.id
    var userid = wx.getStorageSync('users').id
    console.log(id)
    var index = e.currentTarget.dataset.index
    console.log(index)
    app.util.request({
      url: 'entry/wxapp/Partake',
      'cachetime': '0',
      data: {
        c_id: id,
        u_id: userid
      },
      success: function (res) {
        console.log("产品列表数据")
        console.log(res.data)
        that.setData({
          activeIndex: index,
          index: index,
          luntext: res.data
        })
      },
    })
  },
  // 重新提交
  place_order:e=>{
    // wx.showModal({
    //   title: '',
    //   content: '是否重新提交任务',
    //   success:res=>{
    //     console.log(res)
    //     if (res.confirm){
    //       wx.navigateTo({
    //         url: '../fabu/fankui?id='+e.currentTarget.dataset.id+'&type='+1,
    //       })
    //     }
    //   }
    // })
    wx.navigateTo({
      url: 'season?id=' + e.currentTarget.dataset.id + '&type=' + 1 + '&note=' + e.currentTarget.dataset.note,
    })
  },
  evaluate:function(e){
    wx.navigateTo({
      url: '../my/mywait',
    })
  },
  // ———————————点击进入产品详情———————————
  pcinfo: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id
    wx: wx.navigateTo({
      url: '../xuanshang/xsinfo?id=' + id,
    })
  },

  tabClick: function (e) {
    this.setData({
      activeIndex: e.currentTarget.id
    });
  },

  // //获取当前时间，格式YYYY-MM-DD
  today_time: function (e) {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
      + " " + date.getHours() + seperator2 + date.getMinutes()
      + seperator2 + date.getSeconds();
    return currentdate;
  },
  reason:function(e){
    var that= this
    var note = e.currentTarget.dataset.note
    that.setData({
      reason:false,
      note:note
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
    var that=this;
    that.refresh()
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