// zh_vip/pages/my/hykxq.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },
  last:function(){
    var dqdj=this.data.dqdj;
    console.log(dqdj)
    this.setData({
      dqdj: dqdj-1
    })
  },
  next: function () {
    var dqdj = this.data.dqdj;
    console.log(dqdj)
    this.setData({
      dqdj: dqdj + 1
    })
  },
  swiperchange:function(e){
    console.log(e)
    this.setData({
      dqdj: e.detail.current
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var url = getApp().imgurl;
    var xtxx = wx.getStorageSync('xtxx')
    console.log(xtxx)
    this.setData({
      xtxx: xtxx,
      url:url,
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: xtxx.link_color,
    })
    var uid = wx.getStorageSync('UserData').id
    console.log(uid)
    //UserInfo
    app.util.request({
      'url': 'entry/wxapp/UserInfo',
      'cachetime': '0',
      data: { user_id: uid },
      success: function (res1) {
        console.log('用户信息', res1.data)
        //Upgrade 
        app.util.request({
          'url': 'entry/wxapp/Upgrade',
          'cachetime': '0',
          data: { level: res1.data.grade },
          success: function (res) {
            console.log('Upgrade', res.data)
            if (res.data) {
              var sjxfje = (Number(res.data.threshold) - Number(res1.data.level_cumulative)).toFixed(2)
              console.log(sjxfje)
              var sjjd = ((Number(res1.data.level_cumulative) / Number(res.data.threshold)) * 100).toFixed(2)
              that.setData({
                Upgrade: res.data,
                sjxfje: sjxfje,
                sjjd: sjjd,
              })
            }
            else {
              that.setData({
                Upgrade: '',
                sjxfje: '',
                sjjd: 100,
              })
            }
          }
        });
        app.util.request({
          'url': 'entry/wxapp/level',
          'cachetime': '0',
          success: function (res) {
            console.log(res.data)
            for(let i=0;i<res.data.length;i++){
              if (res.data[i].id == res1.data.grade){
                console.log(i)
                that.setData({
                  dqdj: i,
                  userdqdj:i,
                })
              }
            }
            that.setData({
              imgarr: res.data,
            })
          }
        });
        that.setData({
          userInfo: res1.data,
        })
      }
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
  
  }
})