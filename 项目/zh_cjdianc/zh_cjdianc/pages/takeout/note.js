// zh_dianc/pages/takeout/note.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bzarr: [{ name: '不要辣', checked: false }, { name: '少点辣', checked: false }, { name: '不要葱', checked: false }, { name: '多点葱', checked: false }, { name: '多点醋', checked: false }],
    selectedindex:0,
    color:'#34aaff',
    bznr: ''   
  },
  selected:function(e){
    var index = e.currentTarget.dataset.index, bzarr = this.data.bzarr;
    console.log(index)
    bzarr[index].checked=true;
    this.setData({
      bzarr: bzarr,
    })
    // for(let i=0;i<bzarr.length;i++){
       
    // }
  },
  bznr:function(e){
    console.log(e.detail.value)
    this.setData({
      bznr: e.detail.value
    })
  },
  submitbz:function(){
    var that = this, bzarr = this.data.bzarr,arr=[],bznr=this.data.bznr;
    for (let i = 0; i < bzarr.length; i++) {
      if (bzarr[i].checked) {
        arr.push(bzarr[i].name)
      }
    }
    if (bznr==''&&arr.length==0){
      wx.showModal({
        title: '提示',
        content: '请选择标签或者输入备注后提交！',
      })
      return false
    }
    console.log(bznr,arr.toString()+bznr)
    wx.setStorageSync('note', arr.toString() + bznr)
    wx.navigateBack({
      
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.setNavigationBarColor(this);
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