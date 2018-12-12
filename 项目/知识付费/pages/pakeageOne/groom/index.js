// pages/groom/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    price:[
      {
        name:'全部',
      },
      {
        name: '免费',
      },
      {
        name: '收费',
      },
      {
        name: 'vip',
      },
    ],
    type: [
      {
        name: '全部',
      },
      {
        name: '视频',
      },
      {
        name: '音频',
      },
      {
        name: '文字',
      },
    ],
    remmoed: [
      {
        name: '全部',
      },
      {
        name: 'PS',
      },
      {
        name: 'AI',
      },
      {
        name: 'CAD',
      },
      {
        name: 'DW',
      },
      {
        name: 'PR',
      },
      {
        name: 'JAVA',
      },
      {
        name: 'Net',
      },
      {
        name: 'javascript',
      },
      {
        name: 'html',
      },
      {
        name: 'css',
      },
      {
        name: 'vue',
      },
    ],
    ac_index_0: 0,
    ac_index_1: 0,
    ac_index_2: 0,
    imgs:[
      {
        charge:0,
        img: "http://c12.eoemarket.net/app0/728/728091/screen/3639313.jpg",
      },
      {
        charge: 1,
        img: "http://fc.topitme.com/c/64/3f/113134240076f3f64co.jpg",
      },
      {
        charge: 2,
        img: "http://pic.uuhy.com/uploads/2011/01/24/DRAGON_CASTLE_by_randis.jpg",
      },
      {
        charge: 2,
        img: "http://pic.58pic.com/58pic/15/16/29/23G58PICcfp_1024.jpg",
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  remmod:function(e){
    this.setData({
      ac_index_0:e.currentTarget.dataset.index
    })
  },
  price: function (e) {
    this.setData({
      ac_index_1: e.currentTarget.dataset.index
    })
  },
  types: function (e) {
    this.setData({
      ac_index_2: e.currentTarget.dataset.index
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