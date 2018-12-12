// zh_wzp/pages/tabbar/index.js
var app = getApp()
var siteinfo = require('../../../siteinfo.js')
var imgArray1 = []
Page({

  /**
   * 页面的初始数据
   */
  data: {
    obj : {
      name: '首页',
      color: 'red',
      active: true,
      url: 'zh_wzp/pages/index/index',
      sele_color: '#f66925',
      icon: 'http://mall.ltsq.com.cn/addons/zjhj_mall/core/web/statics/images/appnavbar/nav-icon-index.png',
      sele_icon: 'http://mall.ltsq.com.cn/addons/zjhj_mall/core/web/statics/images/appnavbar/nav-icon-index.active.png',
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.route(this)
    var that = this
    that.setData({
      color: wx.getStorageSync("color")
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: wx.getStorageSync("color"),
    })
    app.util.request({
      url: 'entry/wxapp/Attachurl',
      success: res => {
        console.log(res)
        that.setData({
          url: res.data
        })
      }
    })
    var obj = that.data.obj
    wx.setStorageSync('tabbar', obj)
    app.route(that)
  },
  tabbar:function(e){
    console.log(e)
    var that = this
    var url = e.currentTarget.dataset.url
    wx.redirectTo({
      url: url,
    })
  },
  // 上传图片
  choose: function (e) {
    var that = this
    // 获取上传图片所需要的url
    var url = siteinfo.siteroot
    // 获取小程序id
    var uniacid = siteinfo.uniacid
    wx.chooseImage({
      count: 5, // 默认9
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        console.log(res)
        var tempFilePaths = res.tempFilePaths
        var imgsrc = res.tempFilePaths;
        console.log(imgArray1)
        if (imgArray1.length < 5) {
          that.uploadimg({
            url: url + '?i=' + uniacid + '&c=entry&a=wxapp&do=upload&m=zh_wzp',
            path: imgsrc
          });
        }else{
          wx.showModal({
            title: '',
            content: '仅可以上传5张',
          })
        }
      }
    })
  },
  uploadimg: function (data) {
    var that = this,
      i = data.i ? data.i : 0,
      success = data.success ? data.success : 0,
      fail = data.fail ? data.fail : 0;
    wx.uploadFile({
      url: data.url,
      filePath: data.path[i],
      name: 'upfile',
      formData: null,
      success: (resp) => {
        if (resp.data != '') {
          //console.log(resp)
          success++;
          imgArray1.push(resp.data)
          console.log(imgArray1)
          if (imgArray1.length > 0) {
            that.setData({
              imgArray1: imgArray1,
              edit: true
            })
          } else {
            that.setData({
              edit: false
            })
          }

          console.log('上传商家轮播图时候提交的图片数组', imgArray1)
        }
        else {
          wx.showToast({
            icon: "loading",
            title: "请重试"
          })
        }
      },
      fail: (res) => {
        fail++;
        //console.log('fail:' + i + "fail:" + fail);
      },
      complete: () => {
        //console.log(i);
        i++;
        if (i == data.path.length) {
          that.setData({
            images: data.path
          });
          wx.hideToast();
          //console.log('执行完毕');
          // console.log('成功：' + success + " 失败：" + fail);
        } else {
          //console.log(i);
          data.i = i;
          data.success = success;
          data.fail = fail;
          that.uploadimg(data);
        }

      }
    });
  },
  formSubmit:function(e){
    var that = this
    console.log(e)
    var company_name = e.detail.value.mingc
    var company_nature = e.detail.value.xingzhi
    var company_main = e.detail.value.hangye
    var legal_name = e.detail.value.name
    var user_id = wx.getStorageSync("userinfo").id
    var thumb = imgArray1.join(",")
    app.util.request({
      url: 'entry/wxapp/GetMember',
      data:{
        user_id: user_id,
        company_name: company_name,
        company_nature: company_nature,
        company_main: company_main,
        legal_name: legal_name,
        thumb: thumb
      },
      success: res => {
        console.log(res)
        if (res.data.code=='200'){
          wx.showToast({
            title: '认证成功',
          })
          setTimeout(function(){
            wx.navigateBack({
              delta:1
            })
          }, 1500)
        }else{
          wx.showToast({
            title: '认证失败',
          })
          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
          }, 1500)
        }
      }
    })
  },// 删除图片
  delete: function (e) {
    console.log(e)
    var that = this
    var index = e.currentTarget.dataset.index
    Array.prototype.indexOf = function (val) {
      for (var i = 0; i < this.length; i++) {
        if (this[i] == val) return i;
      }
      return -1;
    };
    Array.prototype.remove = function (val) {
      var index = this.indexOf(val);
      if (index > -1) {
        this.splice(index, 1);
      }
    };
    imgArray1.remove(imgArray1[index])
    that.setData({
      imgArray1: imgArray1
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
    if (imgArray1.length > 0) {
      imgArray1.splice(0, imgArray1.length)
    }
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