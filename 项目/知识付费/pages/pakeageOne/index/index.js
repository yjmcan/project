Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    nav:[
      {
        name:'大师课',
        img:''
      },
      {
        name: '大师课',
        img: ''
      },
      {
        name: '大师课',
        img: ''
      },
      {
        name: '大师课',
        img: ''
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let rgb = []
    for (let i = 0; i < 3; ++i) {
      let color = Math.floor(Math.random() * 256).toString(16)
      // console.log(color)
      color = color.length == 1 ? '0' + color : color
      console.log(color = color.length == 1 ? '0' + color : color)
      rgb.push(color)
    }
    var color =  '#' + rgb.join('')
    console.log(rgb)
    
  },
  master:function(e){
    wx.navigateTo({
      url: '../master/index',
    })
  },
  info:function(e){
    wx.navigateTo({
      url: 'info',
    })
  },
  more:function(e){
    wx.navigateTo({
      url: '../more/index',
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