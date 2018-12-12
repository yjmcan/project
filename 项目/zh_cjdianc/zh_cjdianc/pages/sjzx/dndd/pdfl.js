// zh_dianc/pages/seller/cp/spfl.js
var app = getApp();
var util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeid:'',
    disabled:false,
    disabled1:false,
    isxz:false,
  },
  qxbj: function () {
    this.setData({
      activeid: ''
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '排队分类',
    })
    app.setNavigationBarColor(this);
    this.reLoad();
  },
  xzfl:function(){
    this.setData({
      isxz: true,
      activeid: '',
    })
  },
  qx: function () {
    this.setData({
      isxz: false,
    })
  },
  bianji:function(e){
    var id = e.currentTarget.dataset.id;
    console.log(id)
    this.setData({
      activeid:id,
    })
  },
  sc: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    console.log(id);
    wx.showModal({
      title: '提示',
      content: '确认删除此分类吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          app.util.request({
            'url': 'entry/wxapp/DelNumberType',
            'cachetime': '0',
            data: { id: id },
            success: function (res) {
              console.log(res)
              if (res.data == 1) {
                wx.showToast({
                  title: '操作成功',
                  duration: 1000,
                })
                setTimeout(function () {
                  that.reLoad()
                }, 1000)
              }
            },
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  reLoad: function () {
    var that = this
    var sjdsjid = wx.getStorageSync('sjdsjid')
    console.log(sjdsjid)
    // 菜品信息
    app.util.request({
      'url': 'entry/wxapp/NumberTypeList',
      'cachetime': '0',
      data: { store_id: sjdsjid },
      success: function (res) {
        console.log(res.data)
        that.setData({
          flarr: res.data,
        })
      },
    })
  }, 
  formSubmit1:function(e){
    console.log('form1发生了submit事件，携带数据为：', e.detail.value)
    var that = this;
    var flid = '';
    if (e.detail.value.sfxs) {
      var sfxs = 1
    }
    else {
      var sfxs = 2
    }
    var sjdsjid = wx.getStorageSync('sjdsjid'), flmc = e.detail.value.flmc, pxxh = e.detail.value.pxxh;
    console.log(flid, sjdsjid, flmc, pxxh, sfxs)
    var warn = "";
    var flag = true;
    if (flmc == '') {
      warn = "请填写商品名称！";
    } else if (pxxh == "") {
      warn = "请填写排序序号！";
    } else {
      that.setData({
        disabled1: true,
      })
      flag = false;//若必要信息都填写，则不用弹框
      app.util.request({
        'url': 'entry/wxapp/EditNumberType',
        'cachetime': '0',
        data: { sort: pxxh, typename: flmc, store_id: sjdsjid, id: flid },
        success: function (res) {
          console.log(res)
          if (res.data == 1) {
            wx.showToast({
              title: '操作成功',
            })
            setTimeout(function () {
              that.reLoad()
              that.setData({
                isxz:false,
                disabled1: false,
              })
            }, 1000)
          }
          else {
            that.setData({
              disabled1: false,
            })
            wx.showToast({
              title: '请修改后提交！',
              icon: 'loading'
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
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    var that = this;
    var flid = this.data.activeid;
    if (e.detail.value.sfxs){
      var sfxs = 1
    }
    else{
      var sfxs = 2
    }
    var sjdsjid = wx.getStorageSync('sjdsjid'), flmc = e.detail.value.flmc, pxxh = e.detail.value.pxxh;
    console.log(flid,sjdsjid,flmc,pxxh,sfxs)
    var warn = "";
    var flag = true;
    if (flmc == '') {
      warn = "请填写商品名称！";
    } else if (pxxh == "") {
      warn = "请填写排序序号！";
    } else {
      that.setData({
        disabled: true,
      })
      flag = false;//若必要信息都填写，则不用弹框
      app.util.request({
        'url': 'entry/wxapp/EditNumberType',
        'cachetime': '0',
        data: { sort: pxxh, typename: flmc, store_id: sjdsjid, id: flid },
        success: function (res) {
          console.log(res)
          if (res.data == 1) {
            wx.showToast({
              title: '操作成功',
            })
            setTimeout(function () {
              that.reLoad()
              that.setData({
                activeid: '',
                disabled: false,
              })
            }, 1000)
          }
          else {
            that.setData({
              disabled: false,
            })
            wx.showToast({
              title: '请修改后提交！',
              icon: 'loading'
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
  
  }
})