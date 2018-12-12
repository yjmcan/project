// zh_dianc/pages/seller/cp/cplb.js
var app = getApp();
var util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    catalogSelect: 0,
  },
  spfl:function(){
    wx.navigateTo({
      url: 'spfl',
    })
  },
  tjsp: function () {
    wx.navigateTo({
      url: 'bjcp',
    })
  },
  selectMenu: function (e) {
    var index = e.currentTarget.dataset.itemIndex;
    this.setData({
      toView: 'order' + (Number(index)-3),
      catalogSelect: e.currentTarget.dataset.itemIndex
    })
    console.log('order' + index.toString())

  },
  tjgg: function (e) {
    var cpid = e.currentTarget.dataset.cpid;
    console.log(cpid);
    wx.navigateTo({
      url: 'tjgg?cpid=' + cpid,
    })
  },
  bianj:function(e){
    var cpid = e.currentTarget.dataset.cpid;
    console.log(cpid);
    wx.navigateTo({
      url: 'bjcp?cpid='+cpid,
    })
  },
  sjxj: function (e) {
    var that = this;
    var cpid = e.currentTarget.dataset.cpid, isshelvess = e.currentTarget.dataset.shelves;
    console.log(cpid,isshelvess);
    wx.showModal({
      title: '提示',
      content: '确认进行上下架操作吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          app.util.request({
            'url': 'entry/wxapp/AddStoreDishes',
            'cachetime': '0',
            data: { id: cpid, is_show: isshelvess },
            success: function (res) {
              console.log(res)
              if (res.data == 1) {
                wx.showToast({
                  title: '操作成功',
                  duration: 1000,
                })
                setTimeout(function () {
                  that.reLoad()
                }, 1000)
              }
            },
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  sccp: function (e) {
    var that = this;
    var cpid = e.currentTarget.dataset.cpid;
    console.log(cpid);
    wx.showModal({
      title: '提示',
      content: '确认删除此菜品吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          app.util.request({
            'url': 'entry/wxapp/DelStoreGood',
            'cachetime': '0',
            data: { id: cpid},
            success: function (res) {
              console.log(res)
              if (res.data == 1) {
                wx.showToast({
                  title: '操作成功',
                  duration: 1000,
                })
                setTimeout(function () {
                  that.reLoad()
                }, 1000)
              }
            },
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.setNavigationBarColor(this);
    app.sjdpageOnLoad(this);
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        console.log(res.windowWidth)
        console.log(res.windowHeight)
        that.setData({
          height: (res.windowHeight / res.windowWidth *750) - 235,
        })
      }
    })
  },
  reLoad:function(){
    var that = this
    var sjdsjid = wx.getStorageSync('sjdsjid')
    console.log(sjdsjid)
    // 菜品信息
    app.util.request({
      'url': 'entry/wxapp/AppDishes',
      'cachetime': '0',
      data: { store_id: sjdsjid },
      success: function (res) {
        // for (var i = 0; i < res.data.length; i++) {
        //   for (var j = 0; j < res.data[i].goods.length; j++) {
        //     res.data[i].goods[j].xs_num = Number(res.data[i].goods[j].xs_num)
        //     res.data[i].goods[j].sit_ys_num = Number(res.data[i].goods[j].sit_ys_num)
        //   }
        // }
        console.log(res.data)
        that.setData({
          dishes: res.data,
        })
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
    this.reLoad();
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
   this.reLoad();
   wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  }
})