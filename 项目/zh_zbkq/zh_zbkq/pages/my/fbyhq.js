// zh_zbkq/pages/my/fbyhq.js
var app = getApp();
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    countries: ["代金券", "折扣券", '通用券'],
    countryIndex: 0,
    lqcountries: ["付费领取+分享领取", "仅限付费领取", '仅限分享领取'],
    lqcountryIndex: 0,
    jesz: true,
    qssz: true,
    yhqtype:'元',
    start:'',
    timestart: "",
    timeend: '',
    issq:false,
    is_check:'',
    zsnum:0,
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
  jyfxsl:function(e){
    console.log(e.detail.value)
    if (e.detail.value=='0'){
      wx.showToast({
        title: '数量不能为0',
        icon:'loading'
      })
    }
  },
  bindTypeChange: function (e) {
    console.log('picker type 发生选择改变，携带值为', e.detail.value);
    if (e.detail.value=='0'){
      this.setData({
        countryIndex: e.detail.value,
        yhqtype: '元',
      })
    }
    if (e.detail.value == '1') {
      this.setData({
        countryIndex: e.detail.value,
        yhqtype: '折',
      })
    }
    if (e.detail.value == '2') {
      this.setData({
        countryIndex: e.detail.value,
        yhqtype: '',
      })
    }
  },
  bindTypeChange1: function (e) {
    console.log('picker1 type 发生选择改变，携带值为', e.detail.value);
    if (e.detail.value == '0') {
      this.setData({
        lqcountryIndex: e.detail.value,
        jesz:true,
        qssz:true,
      })
    }
    if (e.detail.value == '1') {
      this.setData({
        lqcountryIndex: e.detail.value,
        jesz: true,
        qssz: false,
      })
    }
    if (e.detail.value == '2') {
      this.setData({
        lqcountryIndex: e.detail.value,
        jesz: false,
        qssz: true,
      })
    }
  },
  bindTimeChange: function (e) {
    console.log('picker 发生选择改变，携带值为', e.detail.value);
    this.setData({
      timestart: e.detail.value
    })
  },
  bindTimeChange1: function (e) {
    console.log('picker  发生选择改变，携带值为', e.detail.value);
    this.setData({
      timeend: e.detail.value
    })
  },
  qwkt:function(){
    wx.redirectTo({
      url: 'txzl',
    })
  },
  gongg: function (e) {
    console.log(e.detail.value)
    var zsnum = parseInt(e.detail.value.length);
    this.setData({
      zsnum: zsnum
    })
  },
  formSubmit: function (e) {
    var mdid=this.data.mdid;
    var uid = wx.getStorageSync('UserData').id;
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    var yhqlx = this.data.countries[this.data.countryIndex], yhje = e.detail.value.yhje, yhtj = e.detail.value.yhtj,
      ffsl = e.detail.value.ffsl, timestart = this.data.timestart, timeend = this.data.timeend,syxz = e.detail.value.syxz,
      lqje = e.detail.value.lqje, fxsl = e.detail.value.fxsl, tyqmc = e.detail.value.tyqmc;
      if(lqje==null){
        lqje='';
      }
      if (fxsl == null) {
        fxsl = '';
      }
      if (tyqmc==null){
        tyqmc='';
      }
      if(yhqlx=='通用券'){
        if(tyqmc==''){
          wx.showModal({
            title: '提示',
            content: '您选择的通用券类型，请填写通用券名称',
          })
          return false
        }
      }
      console.log(mdid,uid,yhqlx,yhje,yhtj,ffsl,timestart,timeend,syxz,lqje,fxsl,tyqmc)
      console.log(util.validTime(timestart,timeend))
      var is_couset = this.data.is_couset, szlx = this.data.lqcountryIndex;
      console.log(is_couset,szlx)
      if(is_couset=='2'){
        var lqmode=0;
      }
      if(is_couset=='1'){
        if (szlx=='0'){
        var lqmode=1; 
        }
        if (szlx == '1') {
          var lqmode = 2;
        }
        if (szlx == '2') {
          var lqmode = 3;
        }
      }
      var warn = "";
      var flag = true;
      if(is_couset=='1'&&szlx=='0'){
        if (lqje == "") {
          wx.showModal({
            title: '提示',
            content: "请填写领券金额！"
          })
          return
        } else if (fxsl == "") {
          wx.showModal({
            title: '提示',
            content: "请填写分享数量！"
          })
          return
        } else if (Number(fxsl) > 10) {
          wx.showModal({
            title: '提示',
            content: "分享数量不能大于10"
          })
          return
        }
      } 
      if (is_couset == '1' && szlx == '1') {
        if (lqje == "") {
          wx.showModal({
            title: '提示',
            content: "请填写领券金额！"
          })
          return
        }
      }
      if (is_couset == '1' && szlx == '2') {
        if (fxsl == "") {
          wx.showModal({
            title: '提示',
            content: "请填写分享数量！"
          })
          return
        }
        if (Number(fxsl) > 10) {
          wx.showModal({
            title: '提示',
            content: "分享数量不能大于10"
          })
          return
        }
      } 
      if (yhje == "") {
        warn = "请填写优惠金额！";
      } else if (ffsl == "") {
        warn = "请填写发放数量！";
      } else if (!(util.validTime(timestart, timeend))) {
        warn = "有效日期的起始日期不能大于结束日期！";
      } else if (syxz == "") {
        warn = "请填写优惠券使用说明！";
      }  else {
        flag = false;
        var that = this;
        //取发布优惠券
        app.util.request({
          'url': 'entry/wxapp/AddCoupons',
          'cachetime': '0',
          data: { md_id: mdid, name: yhqlx, cost: yhje, conditions: yhtj, number: ffsl, start_time: timestart, end_time: timeend, introduce: syxz, lq_money: lqje, zf_num: fxsl, lq_mode: lqmode, kq_name:tyqmc},
          success: function (res) {
            console.log(res.data)
            if (res.data == 1) {
              wx.showToast({
                title: '提交成功',
                icon: 'success',
                duration: 1000
              })
              setTimeout(function () {
                wx.navigateBack({

                })
              }, 1000)
            }
            else if(res.data=='不能发布'){
              wx.showModal({
                title: '提示',
                content: '您需要升级为VIP后才能继续发布券',
                confirmText:'前往升级',
                success: function (res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                    wx.redirectTo({
                      url: 'sjzx/sjvip',
                    })
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
              })
            }
            else{
              wx.showToast({
                title: '请重试',
                icon:'loading',
                duration: 1000
              })
            }
          }
        });
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
    var sjid = wx.getStorageSync('store_id');
    var that = this;
    var start = util.formatTime(new Date).substring(0, 10).replace(/\//g, "-");
    console.log(start.toString())
    this.setData({
      start:start,
      timestart: start,
      timeend:start
    });
    //isrz
    app.util.request({
      'url': 'entry/wxapp/StoreInfo',
      'cachetime': '0',
      data: { store_id: sjid },
      success: function (res) {
        console.log(res)
        if (res.data != '') {
          that.setData({
            is_check: res.data.is_check,
            mdid: res.data.id,
            mdinfo:res.data
          })
          if (res.data.is_check == '2') {
            if (res.data.is_open=='1'){
              that.setData({
                issq: true,
              })
            }
          }
          if (res.data.is_rz!='1'){
            wx.showModal({
              title: '提示',
              content: '您的入驻已到期，请续费后发布券',
              success: function (res) {
                wx.navigateBack({
                  
                })
              }
            })
          }
        }
        else {
          that.setData({
            issq: false,
          })
        }
      }
    });
    //取平台信息
    app.util.request({
      'url': 'entry/wxapp/GetPlatform',
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        that.setData({
          is_couset: res.data.is_couset,
          ptxx:res.data,
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
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },
})