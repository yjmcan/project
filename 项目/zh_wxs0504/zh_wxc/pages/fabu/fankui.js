// pages/fabu/fankui.js
const app = getApp()
var fabu = require("../../utils/util.js");
var msg = require("../../../siteinfo.js");
var imgArray1 = []
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tempFilePaths: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var id = options.id;
    console.log(id)
    that.setData({
      id: id
    })
    // —————————————— 获取网址——————————
    app.util.request({
      url:'entry/wxapp/Attachurl',
      'cachetime': '0',
      success: function (res) {
        // —————————— 异步保存网址前缀————————
        wx.setStorageSync('url', res.data)
        that.setData({
          url: res.data
        })
      },
    })
  },


  // —————————点击上传图片———————————
  chooseImg: function (e) {
    var that = this;
    wx.chooseImage({
      count: 5, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        console.log(res.tempFilePaths)
        var imgsrc = res.tempFilePaths;
        that.uploadimg({
          url: 'entry/wxapp/upload',
          path: imgsrc
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
          //console.log(resp)
          success++;
          imgArray1.push(resp.data)
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

  // 删除图片
  deleteImg: function (e) {
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

  // —————————表单验证,提交———————————
  formSubmit: function (e) {
    console.log(e)
    var that = this
    console.log(that.data)
    var id = that.data.id;
    var con = e.detail.value.con;
    var userid = wx.getStorageSync('users').id
    var arr = imgArray1.join()
    console.log(userid)
    console.log(con)
    if(con==""){
      wx.showModal({
        title: '凭证内容不能为空',
        duration: 1000
      })
    }else{
      app.util.request({
        url: 'entry/wxapp/SubCheck',
        'cachetime': '0',
        data: {
         order_id:id,
         u_id: userid,
         voucher:con,
         pic: arr
        },
        success: function (res) {
          console.log("提交成功")
          console.log(res)
          wx.navigateBack({
            delta: 1
          })
        }
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