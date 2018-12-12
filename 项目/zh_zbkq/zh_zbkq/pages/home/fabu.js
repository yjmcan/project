// zh_zbkq/pages/home/fabu.js
var app = getApp();
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var util = require('../../utils/util.js');
var qqmapsdk;
var imgArray = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fwxy: true,
    images: [],
    btntext: '立即发布',
    tjz: false,
    nr: '',
  },
  lookck: function () {
    this.setData({
      fwxy: false
    })
  },
  queren: function () {
    this.setData({
      fwxy: true
    })
  },
  jyfbnr: function (e) {
    console.log(e.detail.value)
    this.setData({
      nr: e.detail.value
    })
  },
  chooseImage: function () {
    var that = this, images = this.data.images;
    imgArray = [];
    // 选择图片
    wx.chooseImage({
      count: 9 - images.length,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        wx.showToast({
          icon: "loading",
          title: "正在上传"
        })
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        console.log(tempFilePaths);
        var imgsrc = res.tempFilePaths;
        images = images.concat(imgsrc);
        console.log(images)
        // that.setData({
        //   images: images
        // });
        that.uploadimg({
          url: getApp().imglink + 'app/index.php?i=' + getApp().getuniacid + '&c=entry&a=wxapp&do=upload&m=zh_zbkq',
          path: images
        });
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
          console.log(resp)
          success++;
          imgArray.push(resp.data)
          console.log(i);
          console.log('提交的图片数组', imgArray)
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
        console.log('fail:' + i + "fail:" + fail);
      },
      complete: () => {
        console.log(i);
        i++;
        if (i == data.path.length) {
          that.setData({
            images: data.path
          });
          wx.hideToast();
          console.log('执行完毕');
          console.log('成功：' + success + " 失败：" + fail);
        } else {
          console.log(i);
          data.i = i;
          data.success = success;
          data.fail = fail;
          that.uploadimg(data);
        }

      }
    });
  },
  delete: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var images = that.data.images;
    images.splice(index, 1);
    imgArray.splice(index, 1)
    console.log('删除images里的图片后剩余的图片', imgArray)
    that.setData({
      images: images
    });
  },
  dw: function () {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        console.log(res)
        that.setData({
          weizhi: res.address + res.name,
          lat: res.latitude,
          lng: res.longitude,
        })
      },
    })
  },
  previewImage: function () {
    var that = this;
    // 预览图集
    wx.previewImage({
      urls: that.data.images
    });
  },
  formSubmit: function (e) {
    var that = this;
    var uid = wx.getStorageSync('UserData').id;
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    var mdtp = imgArray, fbnr = e.detail.value.fbnr, weizhi = e.detail.value.weizhi, tel = e.detail.value.tel, checkbox = e.detail.value.checkbox, lat = that.data.lat, lng = that.data.lng;
    console.log(uid, mdtp, fbnr, weizhi, tel, checkbox, lat, lng)
    var warn = "";
    var flag = true;
    if (fbnr == "") {
      warn = "请填写发布内容";
    } else if (weizhi == "") {
      warn = "请填写位置";
    } else if (tel == "") {
      warn = "请填写手机号！";
    } else if (!(/^0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$/.test(tel)) || tel.length != 11) {
      warn = "手机号错误！";
    } else if (checkbox.length == 0) {
      warn = "请查看用户协议并勾选";
    }
    else {
      flag = false;
      var that = this;
      that.setData({
        tjz: true,
        btntext: '提交中...'
      })
      //取行业分类
      app.util.request({
        'url': 'entry/wxapp/SaveZx',
        'cachetime': '0',
        data: { user_id: uid, content: fbnr, tel: tel, address: weizhi, lat: lat, lng: lng, imgs: mdtp },
        success: function (res) {
          console.log(res.data)
          if (res.data == 1) {
            wx.showToast({
              title: '提交成功',
              icon: 'success',
              duration: 1000
            })
            setTimeout(function () {
              wx.switchTab({
                url: 'home',
              })
            }, 1000)
          }
          if (res.data == 2) {
            wx.showToast({
              title: '提交失败请重试',
              icon: 'loading',
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
    imgArray = [];
    var that = this;
    var uid = wx.getStorageSync('UserData').id;
    app.util.request({
      'url': 'entry/wxapp/GetZxInfo',
      'cachetime': '0',
      success: function (res) {
        console.log(res.data)
        that.setData({
          headinfo: res.data
        })
      }
    });
    //isrz
    app.util.request({
      'url': 'entry/wxapp/GetMdid',
      'cachetime': '0',
      data: { user_id: uid },
      success: function (res) {
        console.log(res)
        if (!(res.data.is_check == '2' && res.data.is_open == '1')) {
          wx.showModal({
            title: '提示',
            content: '开通门店并通过审核后方能发布资讯',
            showCancel: false,
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { },
          })
          setTimeout(function () {
            wx.navigateBack({

            })
          }, 2000)
        }
      }
    });
    app.util.request({
      'url': 'entry/wxapp/GetMapKey',
      'cachetime': '0',
      success: function (res) {
        console.log(res.data)
        // 实例化API核心类
        qqmapsdk = new QQMapWX({
          key: res.data.map_key
        });
        wx.getLocation({
          type: 'wgs84',
          success: function (res) {
            console.log(res)
            qqmapsdk.reverseGeocoder({
              location: {
                latitude: res.latitude,
                longitude: res.longitude
              },
              coord_type: 1,
              success: function (res) {
                var start = res.result.ad_info.location
                console.log(res);
                console.log(res.result.formatted_addresses.recommend);
                console.log('坐标转地址后的经纬度：', res.result.ad_info.location)
                that.setData({
                  weizhi: res.result.formatted_addresses.recommend,
                  lat: res.result.ad_info.location.lat,
                  lng: res.result.ad_info.location.lng,
                })
              }
            })
          }
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})