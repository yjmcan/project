// pages/admission/index.js
Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    color: 'rgb(56, 132, 254)', //56 132 253
    img1: [],
    img2: [],
    img3: [],
    imgArray1: [],
    imgArray2: [],
    ac_index: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    var that = this
    wx.request({
      url: getApp().siteinfo.url +'/hyb/costPackageApi/list',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      success: res => {
        console.log(res)
        that.setData({
          list: res.data.data
        })
      }
    })
    wx.request({
      url: getApp().siteinfo.url +'/hyb/userRuleApi/get',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      success: res => {
        console.log(res)
        that.setData({
          role: res.data.data
        })
      }
    })
    var station = wx.getStorageSync('users')
    that.setData({
      name: station.name,
      tel: station.phone,
    })
    if (station.idCarePhoto != null) {
      station.idCarePhoto = station.idCarePhoto.split(",") || []
      that.setData({
        imgArray2: station.idCarePhoto,
        imgArray1: [
          station.doorheadPhoto
        ],
      })
    }
  },
  choose_img_0: function(e) {
    var that = this
    var imgArray1 = that.data.imgArray1
    console.log(imgArray1.length)
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        console.log(res)
        var tempFilePaths = res.tempFilePaths
        imgArray1 = imgArray1.concat(tempFilePaths)
        // 上传营业执照
        that.uploadimg({
          url: getApp().siteinfo.url +'/hyb/upload/uploadSave',
          path: imgArray1
        });
      }
    })
  },
  choose_img_2: function(e) {
    var that = this
    var imgArray2 = that.data.imgArray2
    wx.chooseImage({
      count: 3 - imgArray2.length,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        var tempFilePaths = res.tempFilePaths
        imgArray2 = imgArray2.concat(tempFilePaths)
        // 上传营业执照
        that.uploadimg1({
          url: getApp().siteinfo.url +'/hyb/upload/uploadSave',
          path: imgArray2
        });
      }
    })
  },

  uploadimg: function(data) {
    var that = this,
      i = data.i ? data.i : 0,
      success = data.success ? data.success : 0,
      fail = data.fail ? data.fail : 0;
    wx.uploadFile({
      url: data.url,
      filePath: data.path[i],
      name: 'file',
      formData: null,
      success: (resp) => {
        if (resp.data != '') {
          success++;
          data.path[i] = resp.data
          that.setData({
            imgArray1: data.path,
          })
          console.log('上传图片时候提交的图片数组', data.path)
        } else {
          wx.showToast({
            icon: "loading",
            title: "请重试"
          })
        }
      },
      fail: (res) => {
        fail++;
      },
      complete: () => {
        i++;
        if (i == data.path.length) {
          console.log(i)
          console.log(data.path.length)
          that.setData({
            images: data.path
          });
        } else {
          data.i = i;
          data.success = success;
          data.fail = fail;
          that.uploadimg(data);
        }

      }
    });
  },
  uploadimg1: function(data) {
    var that = this,
      i = data.i ? data.i : 0,
      success = data.success ? data.success : 0,
      fail = data.fail ? data.fail : 0;
    wx.uploadFile({
      url: data.url,
      filePath: data.path[i],
      name: 'file',
      formData: null,
      success: (resp) => {
        if (resp.data != '') {
          //console.log(resp)
          success++;
          data.path[i] = resp.data
          that.setData({
            imgArray2: data.path,
          })

          console.log('上传图片时候提交的图片数组', data.path)
        } else {
          wx.showToast({
            icon: "loading",
            title: "请重试"
          })
        }
      },
      fail: (res) => {
        fail++;
      },
      complete: () => {
        i++;
        if (i == data.path.length) {
          that.setData({
            images: data.path
          });
        } else {
          //console.log(i);
          data.i = i;
          data.success = success;
          data.fail = fail;
          that.uploadimg1(data);
        }

      }
    });
  },
  delete_img: function(e) {
    var that = this
    var imgArray1 = that.data.imgArray1
    var index = e.currentTarget.dataset.index
    imgArray1.splice(index, 1)
    that.setData({
      imgArray1: imgArray1
    })
  },
  delete_img3: function(e) {
    var that = this
    var imgArray2 = that.data.imgArray2
    var index = e.currentTarget.dataset.index
    imgArray2.splice(index, 1)
    console.log(imgArray2)
    console.log(index)
    that.setData({
      imgArray2: imgArray2
    })
  },
  choose_address: function(e) {
    var that = this
    wx.chooseLocation({
      success: function(res) {
        console.log(res)
        that.setData({
          address: res.address
        })
      }
    })
  },
  sele_index: function(e) {
    this.setData({
      ac_index: e.currentTarget.dataset.index
    })
  },
  // 调用支付套餐
  form_pay:function(e){
    var that = this, a = that.data, list = a.list,listpage = []
    console.log(list)
    list.map(function(item){
      console.log(item)
      var obj = {}
      obj = item.costMoney + '元/'+item.costDays+'天'
      listpage.push(obj)
    })
    console.log(listpage)
    wx.showActionSheet({
      itemList: listpage,
      success: function (res) {
        console.log(res.tapIndex)
        var index = res.tapIndex
        that.setData({
          ac_index:index
        })
        wx.showLoading({
          title: '正在上传图片',
        })
        that.place_info()
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },
  form_sub:function(e){

  },
  formSubmit: function(e) {
    console.log(e)
    var that = this,
      a = that.data,
      imgArray2 = a.imgArray2,
      imgArray1 = a.imgArray1,
      name = e.detail.value.name,
      tel = e.detail.value.tel
    if (name == '') {
      that.tips('请输入货站名称')
    } else if (tel == '') {
      that.tips('请输入联系电话')
    } else if (imgArray1.length != 1) {
      that.tips('请上传门头照或者营业执照')
    } else if (imgArray2.length != 3) {
      that.tips('请上传身份证正反面照片以及本人照片')
    } else {
      that.setData({
        name: name,
        tel: tel
      })
      that.form_pay()
    }
  },
  tips: function(name) {
    wx.showModal({
      title: '温馨提示',
      content: name,
    })
  },
  place_info: function(e) {
    var that = this,
      a = that.data,
      name = a.name,
      tel = a.tel,
      imgArray1 = a.imgArray1,
      imgArray2 = a.imgArray2.join(",")
    var route = [{
        endPlace: '110000',
        startPlace: '110000',
      },
      {
        endPlace: '110000',
        startPlace: '110000',
      },
      {
        endPlace: '110000',
        startPlace: '110000',
      }
    ]

    wx.request({
      // url: url +'/hyb/login/thirdLogin',
      url: getApp().siteinfo.url +'/hyb/goodsStationApi/update',
      data: {
        goodsStationId: wx.getStorageSync('users').id,
        name: name,
        phone: tel,
        businessLicense: imgArray1[0],
        doorheadPhoto: imgArray1[0],
        idCarePhoto: imgArray2
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      success: res => {
        console.log(res)
        wx.hideLoading()
        // wx.navigateBack({
        //   delta:1
        // })
        that.pay_order()
        wx.showLoading({
          title: '正在发起支付',
          mask:true
        })
      },
      complete: res => {
        console.log('执行操作')

      }
    })
  },
  pay_order: function(e) {
    var that = this
    var list = that.data.list
    var ac_index = that.data.ac_index
    wx.request({
      // url: url +'/hyb/login/thirdLogin',
      url: getApp().siteinfo.url +'/hyb/wxPay/orders',
      data: {
        openId: wx.getStorageSync('openid'),
        costPackageId: list[ac_index].id
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: function(res) {
        console.log(res)
        wx.requestPayment({
          'timeStamp': res.data.timeStamp,
          'nonceStr': res.data.nonceStr,
          'package': res.data.package,
          'signType': res.data.signType,
          'paySign': res.data.paySign,
          'success': function(res) {
            console.log('支付成功')
            console.log(res)
            wx.showLoading({
              title: '支付成功',
              mask: true
            })
            wx.navigateBack({
              delta:1
            })
          },

          'fail': function(res) {
            console.log('支付失败')
            console.log(res)
            wx.showLoading({
              title: '支付失败',
              mask: true
            })
            setTimeout(function(){
              wx.navigateBack({
                delta:1
              })
            },1500)
          },
        })
      },
      complete: res => {
        console.log('执行操作')

      }
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})