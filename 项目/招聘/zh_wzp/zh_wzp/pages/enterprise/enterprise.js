// zh_wzp/pages/r_z/log_index.js
var app = getApp()
var siteinfo = require('../../../siteinfo.js')
var imgArray1 = []
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: [
      "0-20人",
      "20-99人",
      "100-499人",
      "500-999人",
      "1000-9999人",
      "10000人以上",
    ],
    arr: [
      "未融资",
      "天使轮",
      "A轮",
      "B轮",
      "C轮",
      "D轮及以上",
      "已上市",
      "不需要融资",
    ],
    index: 0,
    index1: 0
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
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  bindPickerChange1: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index1: e.detail.value
    })
  }, // 上传图片
  choose1: function (e) {
    var that = this
    // 获取上传图片所需要的url
    var url = siteinfo.siteroot
    // 获取小程序id
    var uniacid = siteinfo.uniacid
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        console.log(res)
        var tempFilePaths = res.tempFilePaths[0]
        wx.uploadFile({
          url: url + '?i=' + uniacid + '&c=entry&a=wxapp&do=upload&m=zh_wzp',
          filePath: tempFilePaths,
          name: 'upfile',
          formData: {},
          success: function (res) {
            console.log('这是上传成功')
            console.log(res)
            that.setData({
              logo: res.data
            })
          },
          fail: function (res) {
            console.log('这是上传失败')
            console.log(res)
          },
        })
      }
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
      count: 9, // 默认9
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        console.log(res)
        var imgsrc = res.tempFilePaths;
        that.uploadimg({
          url: url + '?i=' + uniacid + '&c=entry&a=wxapp&do=upload&m=zh_wzp',
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
          success++;
          imgArray1.push(resp.data)
          that.setData({
            imgArray1: imgArray1
          })
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
  formSubmit: function (e) {
    console.log(e)
    var that = this
    var user_id = wx.getStorageSync("userinfo").id
    var logo = that.data.logo
    var company_name = e.detail.value.name
    var industry = e.detail.value.name1
    var company_url = e.detail.value.name2
    var description = e.detail.value.text
    var array = that.data.array
    var arr = that.data.arr
    var index = that.data.index
    var index1 = that.data.index1
    var scale = array[index]
    var stage = arr[index1]
    var title = ''
    var contact_name = e.detail.value.contact_name
    var contact = e.detail.value.contact
    if (logo == null) {
      title = '请上传企业logo'
    } else if (company_name == '') {
      title = '请输入企业名称'
    } else if (industry == '') {
      title = '请输入企业行业'
    } else if (company_url == '') {
      title = '请输入企业官网'
    } else if (description == '') {
      title = "请输入公司简介"
    } else if (imgArray1.length == 0) {
      title = "请上传公司照片"
    } else if (contact_name == '') {
      title = "请输入联系人姓名"
    } else if (contact == '') {
      title = "请输入联系人电话"
    }
    var thumb = imgArray1.join(",")
    if (app.title(title) == true) {
      app.util.request({
        url: 'entry/wxapp/Admission',
        data: {
          user_id: user_id,
          company_name: company_name,
          logo: logo,
          description: description,
          scale: scale,
          stage: stage,
          company_url: company_url,
          industry: industry,
          thumb: thumb,
          contact_name: contact_name,
          contact: contact
        },
        success: res => {
          console.log(res)
          if (res.data.code == '200') {
            wx.showToast({
              title: '入驻成功',
            })
            setTimeout(function () {
              wx.navigateBack({
                delta: 1
              }, 1500)
            })
          } else {
            wx.showToast({
              title: '入驻失败',
            })
            setTimeout(function () {
              wx.navigateBack({
                delta: 1
              }, 1500)
            })
          }
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