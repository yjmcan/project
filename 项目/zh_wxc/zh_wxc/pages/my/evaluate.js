// zh_wxc/pages/my/evaluate.js
const app = getApp()
var imgArray1 = []
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userStars: [
      '../img/xin@2x.png',
      '../img/xin@2x.png',
      '../img/xin@2x.png',
      '../img/xin@2x.png',
      '../img/xin@2x.png',
    ],
    star:5
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.order_id)
    this.setData({
      order_id: options.order_id
    })
  },

  // —————————————— 星星评分——————————
  starTap: function (e) {
    var index = e.currentTarget.dataset.index; // 获取当前点击的是第几颗星星
    console.log(index)
    var tempUserStars = this.data.userStars; // 暂存星星数组
    var len = tempUserStars.length; // 获取星星数组的长度
    for (var i = 0; i < len; i++) {
      if (i <= index-1) { // 小于等于index的是满心
        tempUserStars[i] = '../img/xin@2x.png'
      } else { // 其他是空心
        tempUserStars[i] = '../img/xingxin@2x.png'
      }
    }
    // 重新赋值就可以显示了
    this.setData({
      userStars: tempUserStars,
      star: index,
    })
  },

  // —————————表单验证,提交———————————
  formSubmit: function (e) {
    console.log(e)
    var that = this
    var content = e.detail.value.content;
    var star = that.data.star;
    var order_id = that.data.order_id;
    var user_id = wx.getStorageSync('users').id
    console.log(that.data)
    console.log(content)
    console.log(that.data.star)
    if (content==""){
      wx.showToast({
        title: '评论内容不能为空!',
        icon: 'success',
        duration: 1000
      })
    }else{
      app.util.request({
        url: 'entry/wxapp/Score',
        'cachetime': '0',
        data: {
          user_id: user_id,
          content: content,
          score: star,
          order_id: order_id
        },
        success: function (res) {
          console.log(res)
          wx.navigateBack({
            delta: 1
          })
          wx.showToast({
            title: '提交成功',
            icon: 'success',
            duration: 1000
          })
        }
      })
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