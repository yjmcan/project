// zh_tcwq/pages/distribution/distribution.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fwxy:true,
    disabled: false,
    logintext: '申请成为分销商'
  },
  lookck:function(){
    this.setData({
      fwxy:false
    })
  },
  queren: function () {
    this.setData({
      fwxy: true,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var url = wx.getStorageSync('imglink');
    var user_id = wx.getStorageSync('users').id;
    // 系统设置
    app.util.request({
      'url': 'entry/wxapp/system',
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        that.setData({
          pt_name: res.data.pt_name,
          url:url,
        })
      },
    })
    //
    app.util.request({
      'url': 'entry/wxapp/FxSet',
      'cachetime': '0',
      success: function (res) {
        console.log(res.data)
        that.setData({
          img:res.data.img2,
          fx_details: res.data.fx_details,
          fxset: res.data,
        })
      }
    });
    //邀请人
    app.util.request({
      'url': 'entry/wxapp/MySx',
      'cachetime': '0',
      data: { user_id:user_id},
      success: function (res) {
        console.log(res.data)
        if(!res.data){
          that.setData({
            yqr:'总店'
          })
        }
        else{
          that.setData({
            yqr: res.data.name
          })
        }
      }
    });
  },
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    var that = this;
    var user_id = wx.getStorageSync('users').id, name = e.detail.value.name, tel = e.detail.value.tel, cb = e.detail.value.checkbox.length;
    console.log(user_id, name,tel,cb)
    var warn = "";
    var flag = true;
    if (name == "") {
      warn = "请填写姓名！";
    } else if (tel == "") {
      warn = "请填写联系电话！";
    } else if (!(/^0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$/.test(tel)) || tel.length != 11) {
      warn = "手机号错误！";
    } else if (cb == 0) {
      warn = "阅读并同意分销商申请协议";
    } else {
      that.setData({
        disabled:true,
        logintext:'提交中...'
      })
      flag = false;//若必要信息都填写，则不用弹框
      app.util.request({
        'url': 'entry/wxapp/Distribution',
        'cachetime': '0',
        data: { user_id: user_id, user_name: name, user_tel:tel },
        success: function (res) {
          console.log(res)
          if (res.data == 1) {
            wx.showToast({
              title: '提交成功',
            })
            setTimeout(function () {
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
              logintext: '申请成为分销商',
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
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})