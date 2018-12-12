// pages/my/myfabu.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeIndex: 0,
    hidden:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var id = options.s_id;
    console.log(id)

    /*获取用户头像 */
    var avatarUrl = wx.getStorageSync("user_info").avatarUrl
    console.log(avatarUrl)

    /*获取当前时间 */
    var now = that.today_time();
    console.log(now)
    this.setData({
      now: now,
      id: id,
      avatarUrl: avatarUrl
    }); 

    //—————————————————————————————— 产品分类 ——————————————————————————————
    app.util.request({
      url: 'entry/wxapp/Category',
      'cachetime': '0',
      success: function (res) {
        console.log("产品分类数据")
        console.log(res.data)
        that.setData({
          all: res.data
        })
        if(res.data.code==500){
          console.log("暂无数据")
        }else{
          var id = res.data[0].id
          console.log(id)
          that.setData({
            prolist: res.data,
            hidden: true
          })
          that.order()
        }
      },
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
  order: function (e) {
    var that = this
    var id = that.data.prolist[0].id;
    console.log(id)
    var userid = wx.getStorageSync('users').id
    console.log(userid)
    app.util.request({
      url: 'entry/wxapp/Published',
      'cachetime': '0',
      data: {
        c_id:id,
        s_id: userid
       },
      success: function (res) {
       console.log("产品列表数据")
        console.log(res.data)
        that.setData({
          luntext: res.data
        })
      },
    })
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
      url: 'entry/wxapp/Published',
      'cachetime': '0',
      data: { 
        c_id: id,
        s_id: userid
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

  // ———————————点击进入产品详情———————————
  pcinfo: function (e) {
    var that = this;
    console.log(e)
    var index = e.currentTarget.dataset.id
    console.log(e.currentTarget.dataset)
    console.log(index)
    console.log(that.data)
    var prolistid = that.data.luntext;
    console.log(prolistid)
    for (var i = 0; i < prolistid.length; i++) {
      if (prolistid[i].id == prolistid[index].id) {
        console.log(prolistid[i].id)
        wx: wx.navigateTo({
          url: '../xuanshang/xsinfo?id=' + prolistid[i].id,
        })
      }
    }

  },
  // ——————————退款——————————
  money:function(e){
    var that=this;
    console.log(e)
    var order_id = e.currentTarget.dataset.orderid
    app.util.request({
      url: 'entry/wxapp/Refund',
      'cachetime': '0',
      data: {
        order_id: order_id
      },
      success: function (res) {
        console.log(res)
      }
    })
  },

  // ——————————跳转到个人中心——————————
  fabu: function(e) {
    wx: wx.navigateTo({
      url: '../fabu/fabu',
    })
  },  

  tabClick: function (e) {
    this.setData({
      activeIndex: e.currentTarget.id
    });
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