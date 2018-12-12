// zh_hdbm/pages/cash/cash.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  today: function () {
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
  },
  data: {
    cash_zhi2: false,
    cash_zhi: false,
    status:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    var that = this
    /*当前时间戳 */
    var timestamp = that.today();
    // var timestamp=that.today()
    console.log(timestamp)
    that.setData({
      timestamp: timestamp
    })
    console.log(new Date())
    console.log(timestamp)
    var user_id = options.user_id
    // wx.hideShareMenu()
    // 获取系统设置
    app.util.request({
      url: 'entry/wxapp/SureCash',
      'cachetime': '0',
      data:{
        user_id: user_id
      },
      success: function (res) {
        console.log('这是系统设置')
        console.log(res.data[0])
        var system = res.data
        var system_tip = res.data[0].tx_details;
        //每天最多可提现金额
        var today_total = res.data[0].today_total
        //每天最多提现次数
        var today_num = res.data[0].today_num
        //服务须知
        // var system_tip = system.substring(3, system.length - 4);
        //余额
        var wallet = res.data[0].wallet
        //手续费
        var tx_sxf = res.data[0].tx_sxf
        var sxf = wallet * tx_sxf;
        //实际提现金额
        var tx_money = wallet - sxf
        that.setData({
          system: res.data[0],
          system_tip: system_tip,
          sxf: sxf,
          tx_money: tx_money,  
          today_total: today_total,
          today_num: today_num
        })
      },
    })
    that.reload()
  },
  reload: function (e) {
  },
  formSubmit: function (e) {
    var that = this
    console.log(e)
    console.log(that.data)
    //每天最多可提现金额
    var today_total = that.data.today_total
    var today_num = that.data.today_num
    var num_cha = today_num-1
    console.log(num_cha)
    // 实际金额
    var zd_money = that.data.system.zd_money
    console.log(zd_money)
      //提现次数
    var num = that.data.system.ids
    console.log("提现次数" + num)
    var costs = that.data.system.costs
    //当前时间
    var day = that.data.timestamp
    console.log("当前时间" + num)
    var time = that.data.system.time
    // 可提现金额
    var moneys = Number(that.data.system.wallet)
    console.log(moneys)
    console.log(typeof(moneys))
    // 用户名字
    var name = e.detail.value.name
    // 提现金额
    var tx_cost = e.detail.value.money
    console.log(tx_cost)
    // 用户账号
    var account_number = e.detail.value.account_number
    // 确认用户账号
    var account_number_two = e.detail.value.account_number_two
    // 用户id
    var user_id = wx.getStorageSync("users").id
    console.log("用户id"+user_id)

    var all_money = parseFloat(costs) + parseFloat(tx_cost)
    console.log(all_money)
      
    var title = ''
    if (tx_cost == '' || tx_cost <= 0) {
      title = '请输入提现金额'
    } else if (tx_cost > moneys) {
      title = '不能超过可提现金额'
    } else if (tx_cost > today_total){
      title = '您提现超出2000'
    } else if (tx_cost < zd_money) {
      title = '没有到提现门槛'
    } else if (name == '') {
      title = '请输入姓名'
    } else if (account_number == '') {
      title = '请输入微信账号'
    } else if (account_number_two == '') {
      title = '请再次输入微信账号'
    } else if (account_number != account_number_two) {
      title = '账号输入有误，请重述'
    } else if (num >= today_num && day == time){
      title = '提现次数已超上线'
    } else if (all_money > today_total && day == time){
      title = '提现金额已超上线'
    }
    if (title != '') {
      wx.showModal({
        title: '温馨提示',
        content: title,
      })
    } else {
      app.util.request({
        url: 'entry/wxapp/Withdrawals',
        data: {
          name: name,
          user_id: user_id,
          money: tx_cost,
          wx_hao: account_number,
          check_wx_hao: account_number_two,
          wallet: moneys
        },
        success: res => {
          console.log(res)
          console.log("提交成功")
          wx.navigateBack({
            delta: 1
          })
          var all = res.data.row
        },
        fail:function(res){
          console.log(res)
        }
      })
    }
  },
  inform: function (e) {
    this.setData({
      status:false
    })
  },
  onCancel:function(e){
    this.setData({
      status: true
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
    console.log(that.data)

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
  // onShareAppMessage: function () {

  // }
})