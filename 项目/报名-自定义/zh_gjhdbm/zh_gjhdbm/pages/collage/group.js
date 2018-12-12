// zh_cjpt/pages/canvas/collageInfo.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    group: '拼团开始',
    button_text: '我要参团',
    sec: ''
  },
  // 拼团步骤详解
  // 获取用户信息=>判断用户是否已经参团或者发起拼团=>加载商品信息=>参团
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    app.setNavigationBarColor(that);
    wx.setNavigationBarTitle({
      title: options.title,
    })
    console.log(options)
    that.setData({
      id: options.id,
      options: options,
      goods_id: options.goods_id
    })
  },
  // 获取商品和已经开团的数据
  reload: function (e) {
    var that = this
    var a = that.data
    // 商品详情
    app.util.request({
      'url': 'entry/wxapp/GoodsInfo',
      'cachetime': '0',
      data: {
        goods_id: that.data.goods_id,
      },
      success: res => {
        console.log(res)
        that.getCountDown(Number(res.data.goods.end_time))
        that.setData({
          goods: res.data.goods
        })
        for (let i in res.data.group) {

          if (res.data.group[i].name.length >= 6) {
            res.data.group[i].name = res.data.group[i].name.slice(0, 6) + '...'
          }
          if (res.data.group[i].user_id == a.options.user_id) {
            console.log('已经有开的团了')
            // 查看剩余可参团的人数
            var sy_num = Number(res.data.group[i].kt_num) - Number(res.data.group[i].yg_num)
            console.log(sy_num)
            that.setData({
              already_group: true,
              already: res.data.group[i],
              sy_num: sy_num
            })
            that.refresh()
          }
        }
      }
    })
  },
  refresh: function (e) {
    var that = this
    var a = that.data
    let group_id = a.already.id
    // 拼团详情
    app.util.request({
      url: 'entry/wxapp/GroupInfo',
      data: {
        group_id: group_id
      },
      success: res => {
        console.log(res)
        that.setData({
          goods_info: res.data
        })
      }
    })
    // 拼团人数详情
    app.util.request({
      url: 'entry/wxapp/GetGroupUserInfo',
      data: {
        group_id: group_id
      },
      success: res => {
        console.log(res)
        for (let i in res.data) {
          if (wx.getStorageSync('userInfo').name == res.data[i].name || wx.getStorageSync('userInfo').id == that.data.options.user_id) {
            that.setData({
              button_text: '邀请好友参团',
              button: 'invite',
              button_type: "share"
            })
          }else{
            that.setData({
              button_text: '我要参团',
              button: 'join_group'
            })
          }
        }
        that.setData({
          group_user: res.data
        })
      }
    })
  },
  getCountDown: function (timestamp) {
    var that = this
    var group = that.data.group
    if (group == '拼团开始') {
      setInterval(function () {
        var nowTime = new Date();
        var endTime = new Date(timestamp * 1000);
        var t = endTime.getTime() - nowTime.getTime();
        var hour = Math.floor(t / 1000 / 60 / 60) + ''
        var min = Math.floor(t / 1000 / 60 % 60) + ''
        var sec = Math.floor(t / 1000 % 60) + ''
        // console.log(hour)
        if (t > 0) {
          if (hour < 10) {
            hour = "0" + hour;
          }
          if (min < 10) {
            min = "0" + min;
          }
          if (sec < 10) {
            sec = "0" + sec;
          }
          hour = hour.split("")
          min = min.split("")
          sec = sec.split("")
          that.setData({
            hour: hour,
            min: min,
            sec: sec,
          })
        } else {
          that.setData({
            group: '拼团已结束'
          })
        }
      }, 1000)
    }
  },
  // 这是邀请好友参团
  invite: function (e) {
    var that = this
    var a = that.data
    // wx.showModal({
    //   title: '',
    //   content: '这是邀请参团',
    // })
  },
  // 这是参团
  join_group: function (e) {
    var that = this
    var a = that.data
    wx.navigateTo({
      url: 'place_order?id=' + a.goods.id + '&type=' + 2 + '&group_id=' + a.already.id + '&price=' + a.goods.pt_price
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
    var that = this
    app.getUserInfo(function (userInfo) {
      console.log(userInfo)
      that.setData({
        userInfo: userInfo
      })
      that.reload()
    })
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
    var that = this
    var a = that.data
    console.log(a.options)
    return {
      title: a.userInfo.name + '邀请您一起来拼团',
      path: '/zh_gjhdbm/pages/collage/group?user_id=' + a.options.user_id + '&goods_id=' + a.options.goods_id + '&user_logo=' + a.already.img,
      success: res => {
        console.log(res)
      },
      complete: res => {
        console.log('执行')
      }
    }
  }
})