// pages/logs/zj.js
const app = getApp()
const date = new Date()
const years = []
const months = []

for (let i = 1990; i <= date.getFullYear(); i++) {
  years.push(i)
}

for (let i = 1; i <= 12; i++) {
  months.push(i)
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    history: [],
    years: years,
    year: date.getFullYear(), //当前的年份
    months: months,
    month: '01', //默认月份为1
    start: {
      year: date.getFullYear(),
      month: '01',
    }, //默认的开始日期
    start_time: app.today_month(), //进页面加载的当月数据
    end_time: app.today_month(), //进页面加载的当月数据
    value: [9999, 0, 1], //默认的年月
    color_1: '#999', //非选中状态的字体以及下边框颜色
    start_month: true, //决定开始日期是否是选中状态
    end_month: false, //决定结束日期是否是选中状态
    type: 0, //来确认默认选择的是开始日期还是结束日期
    sele_month: true, //时间选择器显示与否
    tx_statu: true, //判断当前页面的展示为提现明细或者账单明细
    list: [],
    tx_list: []
  },
  // 切换提现明细或者账单明细
  // change_tx: function(e) {
  //   let tx_statu = this.data.tx_statu
  //   if (tx_statu == true) {
  //     this.setData({
  //       tx_statu: false,
  //       list: [],
  //       page: 1
  //     })
  //     this.order_info()
  //   } else {
  //     this.setData({
  //       tx_statu: true,
  //       list: [],
  //       page: 1
  //     })
  //     this.tx_list()
  //   }
  // },
  change_tx1:function(e){
    this.setData({
      tx_statu: true,
      list: [],
      page: 1
    })
    this.tx_list()
  },
  change_tx2: function (e) {
    this.setData({
      tx_statu: false,
      list: [],
      page: 1
    })
    this.order_info()
  },
  // 选择时间
  bindChange: function(e) {
    const val = e.detail.value
    let type = this.data.type,
      year = this.data.years[val[0]],
      month = this.data.months[val[1]]
      console.log(month)
      if(month<10){
        month = '0'+month
      }
    console.log(val)
    if (type == 0) {
      this.setData({
        start: {
          year: year,
          month: month,
        },
        start_time: year + '-' + month
      })
    } else {
      this.setData({
        end: {
          year: year,
          month: month,
        },
        end_time: year + '-' + month,
      })
    }
  },
  // 确定选择时间
  determine: function(e) {
    if(this.data.end_time<this.data.start_time){
      app.succ_m("请选择正确的时间")
    } else {
      this.setData({
        sele_month: true,
        list: [],
        page: 1
      })
      // 调用接口选择时间
      this.order_info()
    }
  },
  // 显示时间选择器
  month_show: function(e) {
    this.setData({
      sele_month: false
    })
  },
  // 取消选择时间
  cancel: function(e) {
    this.setData({
      sele_month: true
    })
  },
  // 切换开始和结束时间
  sele_month: function(e) {
    var that = this,
      type = e.currentTarget.dataset.type,
      start_month = that.data.start_month,
      end_month = that.data.end_month
    console.log(type)
    if (type == 0) {
      that.setData({
        start_month: true,
        end_month: false,
        type: 0
      })
    } else {
      that.setData({
        start_month: false,
        end_month: true,
        type: 1,
      })
      if (this.data.end != null) {
        this.setData({
          end: {
            year: this.data.end.year,
            month: this.data.end.month,
          }
        })
      } else {
        this.setData({
          end: {
            year: date.getFullYear(),
            month: 1,
          }
        })
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    wx.hideShareMenu()
    that.order_info()
    //====================================获取系统设置=============================================//
    app.getSystem(function(getSystem) {
      console.log(getSystem)
      that.setData({
        getSystem: getSystem,
        color: getSystem.color
      })
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: getSystem.color,
      })
    })
    // var today_time = app.today_time()
    // that.setData({
    //   today_time: today_time
    // })
  },
  // 查看骑手账户余额
  money: function(e) {
    var that = this
    var qs_id = wx.getStorageSync('qs').id
    // 获取可提现金额
    app.util.request({
      'url': 'entry/wxapp/KtxMoney',
      'cachetime': '0',
      data: {
        qs_id: qs_id
      },
      success: function(res) {
        console.log('这是可提现金额')
        console.log(res)
        that.setData({
          price: res.data
        })
      },
    })
  },
  // // 查看骑手今日流水
  // today: function(e) {
  //   var that = this
  //   var qs_id = wx.getStorageSync('qs').id
  //   // 获取可提现金额
  //   app.util.request({
  //     'url': 'entry/wxapp/Today',
  //     'cachetime': '0',
  //     data: {
  //       qs_id: qs_id
  //     },
  //     success: function(res) {
  //       console.log('这是骑手今日预计收入')
  //       console.log(res)
  //       if (res.data.wc.money == null) {
  //         res.data.wc.money = 0
  //       }
  //       if (res.data.wwc.money == null) {
  //         res.data.wwc.money = 0
  //       }
  //       that.setData({
  //         today_money: res.data
  //       })
  //     },
  //   })
  // },
  // 本月账单
  order_info: function(e) {
    var that = this
    var a = that.data
    var qs_id = wx.getStorageSync('qs').id,
      page = that.data.page,
      list = that.data.list
    app.util.request({
      url: 'entry/wxapp/SearchList',
      data: {
        qs_id: qs_id,
        start_time: that.data.start_time,
        end_time: that.data.end_time,
        page: page,
        pagesize: 10
      },
      success: res => {
        console.log(res)
        if (res.data.length > 0) {
          for(let i in res.data){
            res.data[i].jd_time = app.ormatDate(res.data[i].jd_time)
          }
          list = list.concat(res.data)
          that.setData({
            list: list,
            page: page + 1
          })
        }
      }
    })
  },
  tx_list: function(e) {
    var that = this
    var a = that.data
    var qs_id = wx.getStorageSync('qs').id
    app.util.request({
      url: 'entry/wxapp/txlist',
      data: {
        qs_id: qs_id,
      },
      success: res => {
        console.log('提现列表', res)
        for(let i in res.data){
          res.data[i].time = app.ormatDate(res.data[i].time)
        }
        that.setData({
          tx_list: res.data
        })
      }
    })
  },
  // 历史账单
  History_list: function(e) {
    var that = this
    var qs_id = wx.getStorageSync('qs').id
    var page = that.data.page
    var history = that.data.history
    // 获取可提现金额
    app.util.request({
      'url': 'entry/wxapp/History',
      'cachetime': '0',
      data: {
        qs_id: qs_id,
        page: page,
      },
      success: function(res) {
        console.log('这是历史账单')
        console.log(res)
        if (res.data.length > 0) {
          history = history.concat(res.data)
          for (let i in res.data) {
            res.data[i].year = res.data[i].days.substr(0, 4)
            res.data[i].month = res.data[i].days.substr(5, 2)
          }
          that.setData({
            history: history,
            page: page + 1
          })
        }

      },
    })
  },
  capital: function(e) {
    wx.navigateTo({
      url: 'capital',
    })
  },
  reward: function(e) {
    wx.navigateTo({
      url: 'reward',
    })
  },
  bill: function(e) {
    var a = e.currentTarget.dataset
    wx.navigateTo({
      url: 'bill?days=' + a.days + '&money=' + a.money + '&count=' + a.count,
    })
  },
  tixian: function(e) {
    wx.navigateTo({
      url: 'tixian',
    })
  },
  // 跳转提现详情
  tx_info: function(e) {
    wx.navigateTo({
      url: 'tx_info?id=' + e.currentTarget.dataset.id,
    })
  },
  // 跳转账单详情
  zd_info: function(e) {
    wx.navigateTo({
      url: 'zd_info?id=' + e.currentTarget.dataset.id,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this
    that.money()
    that.tx_list()
    // that.History_list()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.data.tx_statu == false) {
      this.order_info()
    }
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})