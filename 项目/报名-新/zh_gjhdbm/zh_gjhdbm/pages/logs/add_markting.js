// zh_gjhdbm/pages/logs/add_markting.js
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
    var that = this
    app.setNavigationBarColor(this);
    that.refresh()
  },  
  isinarray: function (arr, value){
    for (var i = 0; i < arr.length; i++) {
      if (value === arr[i].name) {
        return true;
      }
    }
    return false;
  },
  refresh:function(e){
    var that = this
    var user_id = wx.getStorageSync('userInfo').id
    var user_name = wx.getStorageSync('userInfo').name
    console.log(user_id)
   
    app.util.request({
      'url': 'entry/wxapp/HxCode',
      'cachetime': '0',
      data:{user_id:user_id},
      success: function (res) {
        console.log(res)
        that.setData({
          hx_code: res.data
        })
      },
    })
    app.util.request({
      'url': 'entry/wxapp/HxList',
      'cachetime': '0',
      data:{
        user_id: user_id
      },
      success: function (res) {
        console.log(res)
        var isarray = that.isinarray(res.data, user_name)
        if (isarray==false){
          app.util.request({
            'url': 'entry/wxapp/AddVerification',
            'cachetime': '0',
            data: {
              user_id: user_id,
              hx_id: user_id
            },
            success: function (res) {
              console.log(res)
              if(res.data==1){
                that.refresh()
              }
            },
          })
        }
        that.setData({
          hx_list: res.data
        })
      },
    })
  },
  // 删除核销员
  delete_hx:function(e){
    var that = this
    var id =e.currentTarget.dataset.id

    wx.showModal({
      title: '',
      content: '确认删除此核销员？',
      success: res => {
        if (res.confirm) {
          console.log('用户点击确定')
          app.util.request({
            'url': 'entry/wxapp/DelVerification',
            'cachetime': '0',
            data: {
              id: id
            },
            success: function (res) {
              console.log(res)
              that.refresh()
            },
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
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
})