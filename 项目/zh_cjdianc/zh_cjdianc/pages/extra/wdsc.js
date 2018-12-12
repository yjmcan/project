var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pagenum: 1,
    storelist: [],
    bfstorelist: [],
    mygd: false,
    jzgd: true,
    isjzz: true,
    params: { user_id:wx.getStorageSync('users').id},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.setNavigationBarColor(this);
    wx.setNavigationBarTitle({
      title: '我的收藏',
    })
    var that = this;
    // 系统设置
    app.util.request({
      'url': 'entry/wxapp/system',
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        // 实例化API核心类
        // qqmapsdk = new QQMapWX({
        //   key: res.data.map_key
        // });
        that.setData({
          mdxx: res.data
        })
        //that.dwreLoad()
      },
    })
    that.getstorelist();
  },
  tzsjxq: function (e) {
    console.log(e.currentTarget.dataset.sjid, this.data.mdxx)
    if (this.data.mdxx.is_tzms == '1') {
      getApp().sjid = e.currentTarget.dataset.sjid
      wx.navigateTo({
        url: '/zh_cjdianc/pages/seller/index',
      })
    }
    else {
      wx.navigateTo({
        url: '/zh_cjdianc/pages/takeout/takeoutindex?storeid=' + e.currentTarget.dataset.sjid,
      })
    }
  },
  getstorelist: function () {
    var that = this, page = that.data.pagenum; that.data.params.page = page, that.data.params.pagesize = 10;
    console.log(page, that.data.params);
    that.setData({
      isjzz: true
    })
    //推荐商家列表
    app.util.request({
      'url': 'entry/wxapp/MyStoreCollection',
      'cachetime': '0',
      data: that.data.params,
      success: function (res) {
        console.log('分页返回的商家列表数据', res.data)
        if (res.data.length < 10) {
          that.setData({
            mygd: true,
            jzgd: true,
            isjzz: false
          })
        }
        else {
          that.setData({
            jzgd: true,
            pagenum: page + 1,
            isjzz: false
          })
        }
        var storelist = that.data.bfstorelist;
        storelist = storelist.concat(res.data);
        function unrepeat(arr) {
          var newarr = [];
          for (var i = 0; i < arr.length; i++) {
            if (newarr.indexOf(arr[i]) == -1) {
              newarr.push(arr[i]);
            }
          }
          return newarr;
        }
        storelist = unrepeat(storelist)
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].sales == '0.0') {
            res.data[i].sales = '5.0'
          }
          var distance = parseFloat(res.data[i].juli)
          console.log(distance)
          console.log()
          if (distance < 1000) {
            res.data[i].aa = distance + 'm'
            res.data[i].aa1 = distance
          }
          else {
            res.data[i].aa = (distance / 1000).toFixed(2) + 'km'
            res.data[i].aa1 = distance
          }
        }
        that.setData({
          storelist: storelist,
          bfstorelist: storelist,
        })
        console.log(storelist)
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
    console.log('上拉加载', this.data.pagenum)
    var that = this;
    if (!this.data.mygd && this.data.jzgd && !this.data.isjzz) {
      this.setData({
        jzgd: false
      })
      this.getstorelist();
    }
    else {
      // wx.showToast({
      //   title: '没有更多了',
      //   icon: 'loading',
      //   duration: 1000,
      // })
    }
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {
    
  // }
})