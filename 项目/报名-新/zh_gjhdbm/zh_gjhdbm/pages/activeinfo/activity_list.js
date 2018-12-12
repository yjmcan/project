// zh_gjhdbm/pages/activeinfo/activity_list.js
const app = getApp()
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
    // 获取报名列表
    app.util.request({
      'url': 'entry/wxapp/BmList',
      'cachetime': '0',
      data: { activity_id: options.id },
      success: function (res) {
        console.log('这是获取报名列表')
        console.log(res)
        var bmlist = res.data
        function checkChinese(obj_val) {
          var reg = new RegExp("[\\u4E00-\\u9FFF]+", "g");
          if (reg.test(obj_val)) {
            return true
          }else{
            return false
          }
        }
        if (bmlist.length > 0) {
          for(let i in bmlist){
            bmlist[i].time = app.ormatDate(bmlist[i].time).slice(0, 16)
            if (bmlist[i].name != '' && bmlist[i].name != null){
              if (bmlist[i].name.length >= 10) {
                bmlist[i].name = bmlist[i].name.slice(0, 10) + '...'
              } else if (checkChinese(bmlist[i].name) == false) {
                bmlist[i].name = ' ...'
              }
            }else{
              bmlist[i].name = ' ...'
            }
           
          }
          that.setData({
            bmlist: bmlist
          })
        } else {
          that.setData({
            bmlist: 1
          })
        }

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
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})