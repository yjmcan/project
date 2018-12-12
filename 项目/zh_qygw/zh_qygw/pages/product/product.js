// pages/product/product.js
var app = getApp();
var Data = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    luntext: ['综合', '最新', '综合', '最新', '综合', '最新',],
    activeIndex: 0,
    hidden:true,
    meiyou:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // —————————————————————————————— 获取网址——————————————————————————————
    app.util.request({
      'url': 'entry/wxapp/Url',
      'cachetime': '0',
      success: function (res) {
        // —————————————————————————————— 异步保存网址前缀——————————————————————————————
        wx.setStorageSync('url', res.data)
        that.setData({
          url: res.data
        })
      },
    })

    //—————————————————————————————— 产品分类 ——————————————————————————————
    app.util.request({
      'url': 'entry/wxapp/getProductType',
      'cachetime': '0',
      success: function (res) {
        // console.log("产品分类数据")
        // console.log(res.data)
        for(var i=0;i<res.data.length;i++){
          var id = res.data[0].id
          // console.log(id)
          that.setData({
            protype: res.data       
          })
          app.util.request({
            'url': 'entry/wxapp/ProductList',
            'cachetime': '0',
            data: { type_id: id},
            success: function (res) {
              // console.log("产品列表数据")
              // console.log(res.data)
              that.setData({
                prolist: res.data
              })
            },
          })
        }        
      },
    })
  },

  // ———————————跳转到产品页面———————————
  home: function (e) {
    wx: wx.reLaunch({
      url: '../home/home',
    })
  },
  // ———————————跳转到方案页面———————————
  program1: function (e) {
    wx: wx.reLaunch({
      url: '../program/program',
    })
  },

  // ———————————跳转到企业动态页面———————————
  dynamic1: function (e) {
    wx: wx.reLaunch({
      url: '../dynamic/dynamic',
    })
  },

  // ———————————跳转到我们页面———————————
  ahout1: function (e) {
    wx: wx.reLaunch({
      url: '../about/about',
    })
  },

  pcinfo:function(e){
    var that = this;
    var index = e.currentTarget.dataset.id
    console.log(index)
    console.log(e)
    console.log(that.data.prolist)
    var prolistid = that.data.prolist;
    for (var i = 0; i < prolistid.length; i++) {
      // console.log(that.data.prolistid[i].content1)
      if (prolistid[i].id == prolistid[index].id){      
        wx: wx.navigateTo({
          url: 'productinfo?id=' + prolistid[i].id,
        })
      }
    }
    
  },

  // 产品列表的点击事件
  tabClick: function (e) {
    var that = this; 
    console.log(e)
    var id = e.currentTarget.id
    var index = e.currentTarget.dataset.index
    app.util.request({
      'url': 'entry/wxapp/ProductList',
      'cachetime': '0',
      data: { type_id: id },
      success: function (res) {
        console.log("产品列表数据")
        console.log(res.data)
        that.setData({
          activeIndex: index,
          index:index,
          prolist: res.data
        })
      },
    })
  },

  //  ————————————搜索框市区焦点事件——————————————
  bindblur: function (e) {
    var that = this;
    console.log(e)
    event.detail = { blur: false }
    that.setData({
      hidden: true,
      meiyou: true
    })
  },

  sousuo: function (e) {
    var that = this;
    // console.log("这是搜索的内容" + e.detail.value)
    var search = e.detail.value
    app.util.request({
      'url': 'entry/wxapp/ProductList',//接口
      headers: {
        'Content-Type': 'application/json',
      },
      'cachetime': '0',
      data: { keywords: search },//传给后台的值，实时变化
      success: function (res) {        
        if(res.data=='' || res.data==null){          
          that.setData({
            meiyou: false,
            hidden: true
          })
        }else{
          for (var i = 0; i < res.data.length; i++) {
            console.log(res.data)
            that.setData({
              sousuo: res.data,
              hidden: false,
              meiyou:true
            })

          }
        }

      },

    })
    // that.setData({
    //   search: search
    // })
  },

  // ————————————搜索点击事件——————————————
  // search:function(e){
  //   var that = this;
    
    
  // },

  // 搜索的点击详情事件
  infoYemian1: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.id
    console.log(e)
    console.log(that.data.sousuo)
    var sousuoid = that.data.sousuo;
    for (var i = 0; i < sousuoid.length; i++) {
      // console.log(that.data.prolistid[i].content1)
      if (sousuoid[i].id == sousuoid[index].id) {
        wx: wx.navigateTo({
          url: 'productinfo?id=' + sousuoid[i].id,
        })
      }
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