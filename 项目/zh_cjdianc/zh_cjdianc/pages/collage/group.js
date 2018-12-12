// zh_cjdianc/pages/collage/group.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    group_list: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    app.setNavigationBarColor(that);
    wx.setNavigationBarTitle({
      title: options.title,
    })
    that.setData({
      store_id:options.id,
      store_logo: options.store_logo
    })
    that.reload()
  },
  refresh: function(e) {
    var that = this
    // 轮播图
    app.util.request({
      'url': 'entry/wxapp/Ad',
      'cachetime': '0',
      data: {
        type: 9
      },
      success: res => {
        console.log('轮播图列表', res)
        that.setData({
          imgArray: res.data
        })
      }
    })
    // 获取拼团分类
    app.util.request({
      'url': 'entry/wxapp/GroupType',
      'cachetime': '0',
      success: res => {
        console.log('分类列表', res)
        if (res.data.length > 5) {
          var height = 340
        } else {
          var height = 170
        }
        var nav_array = []
        for (var i = 0, len = res.data.length; i < len; i += 10) {
          nav_array.push(res.data.slice(i, i + 10));
        }
        that.setData({
          nav_array: nav_array,
          height: height
        })
      }
    })
  },
  reload: function(e) {
    var that = this
    var page = that.data.page
    var group_list = that.data.group_list
    // 商品列表
    app.util.request({
      'url': 'entry/wxapp/GroupGoods',
      'cachetime': '0',
      data: {
        store_id: '',
        type_id: '',
        page: page,
        display:1
      },
      success: res => {
        console.log('商品列表', res)
        if (res.data.length > 0) {
          group_list = group_list.concat(res.data)
          that.setData({
            group_list: group_list,
            page: page + 1
          })
        }
      }
    })
  },
  // 轮播图跳转
  jumps: function(e) {
    var that = this
    var id = e.currentTarget.dataset.id,
      name = e.currentTarget.dataset.name;
    var appid = e.currentTarget.dataset.appid
    var src = e.currentTarget.dataset.src,
      src2 = e.currentTarget.dataset.wb_src
    var type = e.currentTarget.dataset.type
    console.log(id, name, appid, src, src2, type)
    if (type == 1) {
      console.log(src)
      wx: wx.navigateTo({
        url: src,
      })
    } else if (type == 2) {
      wx.setStorageSync('vr', src2)
      wx: wx.navigateTo({
        url: '../car/car',
      })
    } else if (type == 3) {
      wx.navigateToMiniProgram({
        appId: appid,
      })
    }
  },
  // 分类跳转
  nav_child: function(e) {
    wx.navigateTo({
      url: 'list?id=' + e.currentTarget.dataset.id + '&store_id=' +'' + '&store_logo=' + this.data.store_logo+'&display='+1,
    })
  },
  // 详情跳转
  index: function(e) {
    wx.navigateTo({
      url: 'index?id=' + e.currentTarget.dataset.id + '&store_id=' + e.currentTarget.dataset.storeid + '&store_logo=' + this.data.store_logo,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.refresh()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.reload()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})