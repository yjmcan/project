//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    nav: [
      '全部订单',
      '待处理',
      '已完成'
    ],
    ac_index: 0
  },
  onLoad: function () {
    var that= this
    that.refresh()
  },
  refresh:function(e){
    var that = this
    var ac_index = that.data.ac_index

    var user_id = wx.getStorageSync('user_info').data.userid
    // 所有订单
    wx.request({
      url: 'https://sanye.nbxiong.com/jz/showAllRecOrder.do',
      method: "POST",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        userid: user_id
      },
      success: res => {
        console.log(res)
        var order = res.data.recorder
        var order1 = [],order2 = []
        for(let i in order){
          order[i].createdate = app.ormatDate(order[i].createdate).slice(0,10)
          if (order[i].orderstate =='1'){
            // 等待回收
            order1.push(order[i])
          } else if (order[i].orderstate == '2'){
            // 正在回收
            order2.push(order[i])
          }
        }
        if (ac_index==0){
          that.setData({
            order:order
          })
        } else if (ac_index==1){
          that.setData({
            order: order1
          })
        } else if (ac_index == 2) {
          that.setData({
            order: order2
          })
        }
      },
      fail: res => {
        console.log(res)
      }
    })
  },
  tabClick: function (e) {
    this.setData({
      ac_index: e.currentTarget.dataset.index,
    })
    this.refresh()
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
