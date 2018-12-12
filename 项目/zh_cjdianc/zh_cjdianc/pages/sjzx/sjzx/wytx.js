// zh_dianc/pages/logs/distribution/fxyj.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    open: true,
    txtype:2,
    zhtext:'微信帐号',
    zhtstext:'请输入微信帐号',
    zhtype:'number',
    disabled: false,
    logintext: '提现',
    fwxy: true,
  },
  lookck: function () {
    this.setData({
      fwxy: false
    })
  },
  queren: function () {
    this.setData({
      fwxy: true,
    })
  },
  tradeinfo: function () {
    var that = this;
    this.setData({
      open: !that.data.open
    })
  },
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    if (e.detail.value == 'zfbtx') {
      this.setData({
        txtype: 1,
        zhtext: '支付宝帐号',
        zhtstext: '请输入支付宝帐号',
        zhtype: 'number',
      })
    }
    if (e.detail.value == 'wxtx') {
      this.setData({
        txtype: 2,
        zhtext: '微信帐号',
        zhtstext: '请输入微信帐号',
        zhtype: 'text',
      })
    }
    if (e.detail.value == 'yhktx') {
      this.setData({
        txtype: 3,
        zhtext: '银行卡号',
        zhtstext: '请输入银行卡号',
        zhtype: 'number',
      })
    }
  },
  formSubmit: function (e) {
    var that=this;
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    var sjdsjid = wx.getStorageSync('sjdsjid'), useryj = Number(this.data.commission);
    var txmoney = Number(this.data.fxset.tx_zdmoney), je = e.detail.value.je, name = e.detail.value.name, sjh = e.detail.value.sjh,
      yhkh = e.detail.value.yhkh, khxx = e.detail.value.khxx,zhlx = e.detail.value.radiogroup;
    //var cb = e.detail.value.checkbox.length;
    console.log(sjdsjid,useryj,txmoney,je,name,sjh,yhkh,khxx)
    if(zhlx==''){
      wx.showModal({
        title: '提示',
        content: '请选择提现方式',
      })
      return false;
    }
    // if(zhlx=='zfbtx'){
    //   var actype=1
    // }
    if (zhlx == 'wxtx') {
      var actype = 1
    }
    if (zhlx == 'yhktx') {
      var actype = 2
    }
    var warn = "";
    var flag = true;
    if (useryj <txmoney) {
      warn = "佣金满"+txmoney+"才能申请提现";
    } else if (je == "") {
      warn = "请填写提现金额！";
    } else if (Number(je) <txmoney) {
      warn = "提现金额未满足提现要求";
    } else if (Number(je) > useryj) {
      warn = "提现金额超出您的实际佣金";
    } else if (name == "") {
      warn = "请填写姓名！";
    } else if (je=='') {
      warn = "请填写提现金额！";
    } else if (sjh == ''&&actype=='2') {
      warn = "请填写手机号！";
    } else if (yhkh == '' && actype == '2') {
      warn = "请填写银行卡号！";
    } else if (khxx == '' && actype == '2') {
      warn = "请填写开户行信息！";
    } 
    // else if (cb == 0) {
    //   warn = "请阅读并同意商家提现协议";
    // }
     else {
      that.setData({
        disabled: true,
        logintext: '提交中...'
      })
      flag = false;//若必要信息都填写，则不用弹框
      app.util.request({
        'url': 'entry/wxapp/StoreTx',
        'cachetime': '0',
        data: { store_id: sjdsjid, is_brand: actype, name: name, tx_cost: je, yhk_num: yhkh || '', tel: sjh || '', yh_info: khxx || ''},
        success: function (res) {
          console.log(res)
          if (res.data == 1) {
            wx.showToast({
              title: '提交成功',
            })
            setTimeout(function () {
              // wx.redirectTo({
              //   url: 'txmx',
              // })
              wx.navigateBack({
                
              })
            }, 1000)
          }
          else {
            wx.showToast({
              title: '请重试！',
              icon: 'loading'
            })
            that.setData({
              disabled: false,
              logintext: '提现',
            })
          }
        }
      })
    }
    if (flag == true) {
      wx.showModal({
        title: '提示',
        content: warn
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this, sjdsjid = wx.getStorageSync('sjdsjid'), user_id = wx.getStorageSync('users').id;
    console.log(sjdsjid, user_id)
    app.setNavigationBarColor(this);
    wx.setNavigationBarTitle({
      title: '提现',
    })
    //商家的余额
    app.util.request({
      'url': 'entry/wxapp/Ktx',
      'cachetime': '0',
      data: { store_id: sjdsjid },
      success: function (res) {
        console.log(res)
        that.setData({
          commission: res.data
        })
      }
    })
    //
    app.util.request({
      'url': 'entry/wxapp/system',
      'cachetime': '0',
      success: function (res) {
        console.log(res.data)
        that.setData({
          iswx: res.data.is_wx,
          iszfb: res.data.is_zfb,
          isyhk: res.data.is_yhk,
          fxset:res.data,
        })
      }
    });
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
    this.onLoad();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
})