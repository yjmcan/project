// pages/feedback/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
formSubmit:function(e){
    console.log(e)
    var that = this
    var name = e.detail.value.name
    var text = e.detail.value.text
    var tel = e.detail.value.tel
    var title = ''
    if(text==''){
      title = '请输入您的建议'
    }else if(name==''){
      title = '请输入您的姓名'
    } else if (tel == '') {
      title = '请输入您的手机号'
    }
    if(title!=''){
      wx.showModal({
        title: '',
        content:title,
      })
    }else{
      //提交反馈
      wx.request({

        url: 'https://sanye.nbxiong.com/jz/addFeedBack.do',
        method: "POST",
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        data:{
          feedName:name,
          feedPhone:tel,
          feedMsg:text
        },
        success: res => {
          console.log(res)
          wx.showToast({
            title: '提交成功',
          })
          setTimeout(function(){
            wx.navigateBack({
              delta:1
            })
          },1500)
        },
        fail: res => {
          console.log(res)
        }
      })
    }
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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