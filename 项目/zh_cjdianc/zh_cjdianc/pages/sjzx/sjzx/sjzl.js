// zh_zbkq/pages/my/txzl.js
var app = getApp();
var util = require('../../../utils/util.js');
var siteinfo = require('../../../../siteinfo.js');
var imgArray, imgArray1 = [], lbimgArray, lbimgArray1 = [],imglogo = '';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mdid: '',
    issq: false,
    isbj: true,
    isyz: true,
    isbd: false,
    url1: '',
    url2: '',
    VerifyCode: '验证',
    bdsjhtext: '验证微信手机号',
    lxr: '',
    sjh: '',
    yzm: '',
    jwd: '',
    mdmc: '',
    mdgg: '',
    zsnum: 0,
    hy: [],
    checkbox: [],
    hyIndex: 0,
    timestart: "06:00",
    timeend: '22:00',
    weizhi: '',
    checkboxItems: [
      { name: 'WIFI', value: 'WIFI' },
      { name: '停车位', value: '停车位' },
      { name: '支付宝支付', value: '支付宝支付' },
      { name: '微信支付', value: '微信支付' },
    ],
    logo: '../../img/logo.png',
    images: [],
    images1: [],
    lbimages: [],
    lbimages1: [],
    uploadedImages: [],
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
  //获取手机号
  hqsjh: function (e) {
    console.log(e.detail.value)
    this.setData({
      sjh: e.detail.value
    })
    if (e.detail.value != '') {
      this.setData({
        isyz: false
      })
    }
    else {
      this.setData({
        isyz: true
      })
    }
  },
  setVerify: function () {
    var yzm = util.getRandomNum();
    this.setData({
      yzm: yzm
    })
    var sjh = this.data.sjh;
    console.log(sjh)
    console.log(yzm)
    var t = 60;
    var that = this;
    if (!(/^0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$/.test(sjh)) || sjh.length != 11) {
      wx.showToast({
        title: '手机号错误',
        // image: "../../images/mine/jinggao.png",
        duration: 1000
      })
      return false;
    }
    var dsq = setInterval(function () {
      t--;
      if (t > 0) {
        that.setData({
          VerifyCode: t + " 秒",
          isyz: true
        });
      }
      else {
        that.setData({
          VerifyCode: "验证",
          isyz: false
        });
        clearInterval(dsq)
      }
    }, 1000)
    app.util.request({
      'url': 'entry/wxapp/sms2',
      'cachetime': '0',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        tel: sjh,
        code: yzm
      },
      success: function (res) {
        console.log('111111111')
        console.log(res)
        if (res.data.reason == "操作成功") {
          wx.showToast({
            title: '发送成功',
            icon: 'success',
            duration: 1000
          })
        }
      },
      fail: function (res) {
        console.log("error res=")
        console.log(res.data)
      }
    });
  },
  dw: function () {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        console.log(res)
        that.setData({
          weizhi: res.address,
          jwd: res.latitude + ',' + res.longitude
        })
      },
    })
  },
  bindTimeChange: function (e) {
    console.log(e.detail.value)
    this.setData({
      timestart: e.detail.value
    })
  },
  bindTimeChange1: function (e) {
    console.log(e.detail.value)
    this.setData({
      timeend: e.detail.value
    })
  },
  bindTypeChange: function (e) {
    var that = this;
    console.log('picker type 发生选择改变，携带值为', e.detail.value, that.data.hy[e.detail.value].id);
    this.setData({
      hyIndex: e.detail.value,
      hyid: that.data.hy[e.detail.value].id
    })
  },
  checkboxChange: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value);
    this.setData({
      checkbox: e.detail.value
    })
    console.log(util.in_array('WIFI', e.detail.value))
    var checkboxItems = this.data.checkboxItems, values = e.detail.value;
    for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
      checkboxItems[i].checked = false;

      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (checkboxItems[i].value == values[j]) {
          checkboxItems[i].checked = true;
          break;
        }
      }
    }

    this.setData({
      checkboxItems: checkboxItems
    });
  },
  chooseLogo: function () {
    var that = this;
    // 选择图片
    wx.chooseImage({
      count: 1,
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
        wx.uploadFile({
          url: siteinfo.siteroot + '?i=' + siteinfo.uniacid + '&c=entry&a=wxapp&do=upload&m=zh_cjdianc',
          filePath: res.tempFilePaths[0],
          name: 'upfile',
          success: function (res1) {
            console.log(res1);
            imglogo = res1.data
            if (res1.data == '') {
              wx.showModal({
                title: '提示',
                content: '上传失败',
                showCancel: false
              })
              return;
            }
            that.setData({
              logo: tempFilePaths[0]
            });
          },
          fail: function (e) {
            console.log(e);
            wx.showModal({
              title: '提示',
              content: '上传失败',
              showCancel: false
            })
          },
          complete: function () {
            wx.hideToast();  //隐藏Toast
          }
        })
      }
    })
  },
  chooseImage1: function () {
    var that = this, images = this.data.images1;
    imgArray1 = [];
    // 选择图片
    wx.chooseImage({
      count: 9 - images.length - that.data.images.length,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        console.log(tempFilePaths);
        var imgsrc = res.tempFilePaths;
        images = images.concat(imgsrc);
        console.log(images)
        that.setData({
          images1: images
        });
        // that.uploadimg1({
        //   url: getApp().imglink + 'app/index.php?i=' + getApp().getuniacid + '&c=entry&a=wxapp&do=upload&m=zh_zbkq',
        //   path: images
        // });
      }
    })
  },
  lbchooseImage1: function () {
    var that = this, images = this.data.lbimages1;
    lbimgArray1 = [];
    // 选择图片
    wx.chooseImage({
      count: 3 - images.length - that.data.lbimages.length,
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
        that.lbuploadimg1({
          url: getApp().imglink + 'app/index.php?i=' + getApp().getuniacid + '&c=entry&a=wxapp&do=upload&m=zh_zbkq',
          path: images
        });
      }
    })
  },
  previewImage: function () {
    var that = this;
    // 预览图集
    wx.previewImage({
      urls: that.data.images
    });
  },
  uploadimg1: function (data) {
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
          imgArray1.push(resp.data)
          console.log(i);
          console.log('编辑信息时候提交的图片数组', imgArray1)
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
            images1: data.path
          });
          wx.hideToast();
          console.log('执行完毕');
          console.log('成功：' + success + " 失败：" + fail);
        } else {
          console.log(i);
          data.i = i;
          data.success = success;
          data.fail = fail;
          that.uploadimg1(data);
        }

      }
    });
  },
  lbuploadimg1: function (data) {
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
          lbimgArray1.push(resp.data)
          console.log(i);
          console.log('编辑信息时候提交的轮播图片数组', lbimgArray1)
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
            lbimages1: data.path
          });
          wx.hideToast();
          console.log('执行完毕');
          console.log('成功：' + success + " 失败：" + fail);
        } else {
          console.log(i);
          data.i = i;
          data.success = success;
          data.fail = fail;
          that.lbuploadimg1(data);
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
    console.log('删除images里的图片后剩余的图片', images,imgArray)
    that.setData({
      images: images
    });
  },
  delete1: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var images1 = that.data.images1;
    images1.splice(index, 1);
    console.log('删除images1里的图片后剩余的图片', images1)
    that.setData({
      images1: images1
    });
  },
  lbdelete: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var images = that.data.lbimages;
    images.splice(index, 1);
    lbimgArray.splice(index, 1)
    console.log('删除lbimages里的图片后剩余的图片', lbimgArray)
    that.setData({
      lbimages: images
    });
  },
  lbdelete1: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var images1 = that.data.lbimages1;
    images1.splice(index, 1);
    lbimgArray1.splice(index, 1)
    console.log('删除lbimages1里的图片后剩余的图片', lbimgArray1)
    that.setData({
      lbimages1: images1
    });
  },
  formSubmit: function (e) {
    var that = this, images1 = that.data.images1;
    console.log('imgArray', imgArray, 'imgArray1', imgArray1, 'images', that.data.images, 'images1', that.data.images1, 'lbimgArray', lbimgArray, 'lbimgArray1', lbimgArray1, 'lbimages', that.data.lbimages, 'lbimages1', that.data.lbimages1)
    // if (this.data.isbj) {
    //   console.log('此提交是重新编辑')
    //   var mdtp = imgArray.concat(imgArray1),lbtp=lbimgArray.concat(lbimgArray1)
    // }
    // else {
    //   console.log('此提交是开通门店')
    //   var mdtp = imgArray,lbtp=lbimgArray
    // }
    var mdid = wx.getStorageSync('sjdsjid');
    console.log(mdid)
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    console.log(imglogo, imgArray, imgArray1)
    var yzm = this.data.yzm;
    console.log('随机生成的验证码', yzm)
    var sjmc = e.detail.value.sjmc, sjdh = e.detail.value.sjdh, mdwz = e.detail.value.mdwz,
      jwd = this.data.jwd, rjj = e.detail.value.rjj, qsj = e.detail.value.qsj, xyh = e.detail.value.xyh, xyhje = e.detail.value.xyhje, mdgg = e.detail.value.mdgg;
    console.log(sjmc, sjdh, mdwz, jwd, rjj, qsj, xyh, xyhje,mdgg)
    var warn = "";//弹框时提示的内容
    var flag = true;//判断信息输入是否完整
    if (imglogo == "") {
      warn = "请上传商家Logo！";
    } else if (sjmc == "") {
      warn = "请填写商家名称！";
    } else if (sjdh == "") {
      warn = "请填写商家手机号！";
    } else if (sjdh.length != 11) {
      warn = "手机号错误！";
    // } else if (yanzm == "" && that.data.isdx) {
    //   warn = "请填写您收到的验证码！";
    // } else if (yanzm != yzm && that.data.isdx) {
    //   warn = "验证码不正确！";
    } else if (mdwz == '') {
      warn = "请填写门店位置"
    } else if (jwd == '') {
      warn = "请点击定位按钮进行定位"
    } else if (rjj == '') {
      warn = "请填写人均价"
    } else if (qsj == '') {
      warn = "请填写起送价"
    } else if (xyhje== '') {
      warn = "请填写新用户优惠金额"
    } else if (mdgg == '') {
      warn = "请填写门店公告"
    // } else if (mdtp.length == 0) {
    //   warn = "请上传门店图片";
    // } else if (lbtp.length < 3) {
    //   warn = "请上传3张门店轮播图片";
    } else {
      flag = false;
      wx.showLoading({
        title: "正在提交",
        mask: !0
      });
      if (images1.length == 0) {
        e()
      }
      else {
        uploadimg({
          url: siteinfo.siteroot + '?i=' + siteinfo.uniacid + '&c=entry&a=wxapp&do=upload&m=zh_cjdianc',
          path: images1
        });
      }
      function uploadimg(data) {
        var i = data.i ? data.i : 0,
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
              imgArray1.push(resp.data)
              console.log(i);
              console.log('图片数组', imgArray1)
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
              // that.setData({
              //   images: data.path
              // });
              wx.hideToast();
              console.log('执行完毕');
              e()
              console.log('成功：' + success + " 失败：" + fail);
            } else {
              console.log(i);
              data.i = i;
              data.success = success;
              data.fail = fail;
              uploadimg(data);
            }

          }
        });
      }
      function e() {
        var mdtp = imgArray.concat(imgArray1)
        console.log('请求接口', mdtp, mdtp.toString())
        // return
        //UpdStoreInfo
        app.util.request({
          'url': 'entry/wxapp/UpdStoreInfo',
          'cachetime': '0',
          data: { id: mdid, logo: imglogo, name: sjmc, tel: sjdh, address: mdwz, coordinates: jwd, capita: rjj, start_at: qsj, announcement: mdgg, xyh_money: xyhje, xyh_open: xyh ? 1 : 2, environment: mdtp.toString() },
          success: function (res) {
            if (res.data == '1') {
              wx.showModal({
                title: '提示',
                content: '提交成功',
              })
              setTimeout(function () {
                wx.navigateBack({
                  
                })
              }, 1000)
            }
            else if (res.data == '2') {
              wx.showModal({
                title: '提示',
                content: '请修改后提交',
              })
            }
            else {
              wx.showToast({
                title: '网络错误',
              })
            }
            console.log('Assess', res.data)
          }
        });
      }
    }
    if (flag == true) {
      wx.showModal({
        title: '提示',
        content: warn
      })
    }
  },
  cxkt: function () {
    this.setData({
      issq: true
    })
  },
  gongg: function (e) {
    console.log(e.detail.value)
    var zsnum = parseInt(e.detail.value.length);
    this.setData({
      zsnum: zsnum
    })
  },
  getPhoneNumber: function (e) {
    var that = this;
    console.log(e)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
    if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '您未授权获取您的手机号',
        success: function (res) { }
      })
    }
    else {
      app.util.request({
        'url': 'entry/wxapp/Jiemi',
        'cachetime': '0',
        data: { sessionKey: getApp().getSK, data: e.detail.encryptedData, iv: e.detail.iv },
        success: function (res) {
          console.log('解密后的数据', res)
          if (res.data.phoneNumber != null) {
            that.setData({
              sjh: res.data.phoneNumber,
              isbd: true,
              bdsjhtext: '验证成功'
            })
          }
        }
      });
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    imgArray = [], imgArray1 = [], lbimgArray = [],lbimgArray1=[];
    var uid = wx.getStorageSync('users').id, sjid = wx.getStorageSync('sjdsjid');
    var that = this;
    console.log( getApp().getuniacid,uid,sjid)
    app.setNavigationBarColor(this);
    //取短信设置
    // app.util.request({
    //   'url': 'entry/wxapp/IsSms',
    //   'cachetime': '0',
    //   success: function (res) {
    //     console.log(res.data)
    //     if (res.data.is_sms == '1') {
    //       console.log('关闭了短信')
    //       that.setData({
    //         isdx: false,
    //       })
    //     }
    //     if (res.data.is_sms == '2') {
    //       console.log('开启了短信')
    //       that.setData({
    //         isdx: true
    //       })
    //     }
    //   }
    // });
    //取平台信息
    app.util.request({
      'url': 'entry/wxapp/Url',
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        that.setData({
          url: res.data,
        })
      }
    });
    //取行业分类
    // app.util.request({
    //   'url': 'entry/wxapp/Type',
    //   'cachetime': '0',
    //   success: function (res) {
    //     console.log(res.data)
    //     that.setData({
    //       hy: res.data,
    //       hyid: res.data[0].id
    //     })
    //   }
    // });
    //isrz
    app.util.request({
      'url': 'entry/wxapp/StoreInfo',
      'cachetime': '0',
      data: { store_id: sjid },
      success: function (res) {
        console.log(res)
        var store=res.data.store
        imglogo = store.logo, imgArray = store.environment, lbimgArray = store.yyzz;
        that.setData({
          logo: store.logo,
          sjmc: store.name,
          sjdh: store.tel,
          weizhi: store.address,
          jwd: store.coordinates,
          rjj: store.capita,
          qsj: store.start_at,
          xyhje: res.data.storeset.xyh_money,
          mdgg: store.announcement,
          zsnum: parseInt(store.announcement.length),
          images: store.environment,
          lbimages: store.yyzz,
          xyh_open: res.data.storeset.xyh_open==1?true:false
        })
        console.log('imgArray', imgArray, 'imgArray1', imgArray1, 'images', that.data.images, 'images1', that.data.images1, 'lbimgArray', lbimgArray, 'lbimgArray1', lbimgArray1, 'lbimages', that.data.lbimages, 'lbimages1', that.data.lbimages1)
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