// zh_zbkq/pages/my/txzl.js
var app = getApp();
var util = require('../../utils/util.js');
var imgArray = [], lbimgArray = [],imglogo = '';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mdid: '',
    issq: false,
    isbj: false,
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
    lbimages: [],
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
          url: getApp().imglink + 'app/index.php?i=' + getApp().getuniacid + '&c=entry&a=wxapp&do=upload&m=zh_zbkq',
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
            if (that.data.isbj) {
              that.setData({
                url1: ''
              })
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
  lbchooseImage: function () {
    var that = this, images = this.data.lbimages;
    lbimgArray = [];
    // 选择图片
    wx.chooseImage({
      count: 3 - images.length,
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
        that.lbuploadimg({
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
  // sctp: function () {
  //   var pics = this.data.images;
  //   this.uploadimg({
  //     url: getApp().imglink + 'app/index.php?i=' + getApp().getuniacid + '&c=entry&a=wxapp&do=upload&m=zh_zbkq',
  //     path: pics
  //   });
  // },
  //
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
          console.log('开通门店时候提交的图片数组', imgArray)
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
  lbuploadimg: function (data) {
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
          lbimgArray.push(resp.data)
          console.log(i);
          console.log('开通门店时候提交的轮播图片数组', lbimgArray)
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
            lbimages: data.path
          });
          wx.hideToast();
          console.log('执行完毕');
          console.log('成功：' + success + " 失败：" + fail);
        } else {
          console.log(i);
          data.i = i;
          data.success = success;
          data.fail = fail;
          that.lbuploadimg(data);
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
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);
    var that = this;
    var radioItems = this.data.radioItems;
    for (var i = 0, len = radioItems.length; i < len; ++i) {
      radioItems[i].checked = radioItems[i].id == e.detail.value;
      if (radioItems[i].checked) {
        that.setData({
          zfmoney: radioItems[i].money,
          zfts: radioItems[i].days,
        })
      }
    }

    this.setData({
      radioItems: radioItems
    });
  },
  formSubmit: function (e) {
    var that = this;
    var money = parseFloat(this.data.zfmoney), zfts = this.data.zfts;
    console.log('imgArray', imgArray, 'images', that.data.images,'lbimgArray', lbimgArray, 'lbimages', that.data.lbimages)
    if (this.data.isbj) {
      console.log('此提交是重新编辑')
    }
    else {
      console.log('此提交是开通门店')
      var mdtp = imgArray,lbtp=lbimgArray
    }
    var mdid = this.data.mdid;
    var uid = wx.getStorageSync('UserData').id;
    console.log(mdid, uid)
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    var vipid = e.detail.value.radiogroup
    console.log(imglogo, imgArray, mdtp,lbtp,vipid,money,zfts)
    var mdlogo = imglogo;
    var yzm = this.data.yzm;
    console.log('随机生成的验证码', yzm)
    var lxr = e.detail.value.lxr, sjh = e.detail.value.sjh, yanzm = e.detail.value.yanzm, mdwz = e.detail.value.mdwz,
      jwd = this.data.jwd, mdmc = e.detail.value.mdmc, mddh = e.detail.value.mddh, mdgg = e.detail.value.mdgg;
    console.log(lxr, sjh, yanzm, mdwz, mddh, jwd, mdmc, mdgg)
    var stime = this.data.timestart, etime = this.data.timeend, hyid = this.data.hyid, checkbox = this.data.checkbox, wifi = util.in_array('WIFI', this.data.checkbox), tcw = util.in_array('停车位', this.data.checkbox), zfbzf = util.in_array('支付宝支付', this.data.checkbox), wxzf = util.in_array('微信支付', this.data.checkbox);
    console.log(stime, etime, hyid, checkbox, wifi, tcw, zfbzf, wxzf)
    var warn = "";//弹框时提示的内容
    var flag = true;//判断信息输入是否完整
    //判断的顺序依次是：姓名-手机号-地址-具体地址-预约日期-预约时间-开荒面积
    if (mdlogo == "") {
      warn = "请上传商家LOGO！";
    } else if (lxr == "") {
      warn = "请填写联系人！";
    } else if (sjh == "") {
      warn = "请填写手机号！";
    } else if (!(/^0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$/.test(sjh)) || sjh.length != 11) {
      warn = "手机号错误！";
    } else if (yanzm == "" && that.data.isdx) {
      warn = "请填写您收到的验证码！";
    } else if (yanzm != yzm && that.data.isdx) {
      warn = "验证码不正确！";
    } else if (mdwz == '') {
      warn = "请填写门店位置"
    } else if (jwd == '') {
      warn = "请点击定位按钮进行定位"
    } else if (mdmc == '') {
      warn = "请填写门店名称"
    } else if (mddh == '') {
      warn = "请填写门店电话"
    } else if (checkbox.length == 0) {
      warn = "请选择店内设施"
    } else if (mdgg == '') {
      warn = "请填写门店公告"
    } else if (mdtp.length == 0) {
      warn = "请上传门店图片";
    } else if (lbtp.length < 3) {
      warn = "请上传3张门店轮播图片";
    } else if (vipid == '') {
      warn = "请选择入驻期限";
    } else {
      flag = false;
      //取行业分类
      if (money <= 0) {
      app.util.request({
        'url': 'entry/wxapp/SaveMd',
        'cachetime': '0',
        data: {
          md_id: mdid, user_id: uid, link_name: lxr, yz_tel: sjh, address: mdwz, md_name: mdmc, md_logo: mdlogo, start_time: stime, end_time: etime,
          type_id: hyid, WiFi: wifi, park: tcw, apy: zfbzf, wei: wxzf, notice: mdgg, imgs: mdtp, lb_imgs:lbtp, coordinates: jwd, link_tel: mddh,day:zfts
        },
        success: function (res) {
          console.log(res.data)
          var rzid = res.data;
          if (rzid != '入驻失败') {
            wx.showModal({
              title: '提示',
              content: '提交成功',
            })
            //RzOrder
            app.util.request({
              'url': 'entry/wxapp/RzOrder',
              'cachetime': '0',
              data: { user_id: uid, store_id: rzid, day: zfts, money: money },
              success: function (res) {
                console.log(res)
              }
            });
            if(that.data.isdx){
              //Sms
              app.util.request({
                'url': 'entry/wxapp/Sms',
                'cachetime': '0',
                success: function (res) {
                  console.log(res)
                }
              });
            }
            setTimeout(function () {
              wx.navigateBack({

              })
            }, 1000)
          }
          if (res.data == '入驻失败') {
            wx.showToast({
              title: '提交失败请重试',
              icon: 'loading',
              duration: 1000
            })
          }
          if (res.data == '该门店已存在') {
            wx.showModal({
              title: '提示',
              content: '您的门店名称已存在，请重新填写',
            })
          }
        }
      });
      }
      else{
        app.util.request({
          'url': 'entry/wxapp/pay',
          'cachetime': '0',
          method: "GET",
          data: {
            openid: getApp().getOpenId, money: money
          },
          success: function (res) {
            //订单生成成功，发起支付请求
            wx.requestPayment({
              'timeStamp': res.data.timeStamp,
              'nonceStr': res.data.nonceStr,   //字符串随机数
              'package': res.data.package,
              'signType': res.data.signType,
              'paySign': res.data.paySign,
              'success': function (res) {
                console.log(res);//requestPayment:ok==>调用支付成功
                //发送模板消息
                app.util.request({
                  'url': 'entry/wxapp/SaveFxMoney',
                  'cachetime': '0',
                  data: { user_id: uid, money: money },
                  dataType: 'json',
                  success: function (res) {
                  }
                })
                app.util.request({
                  'url': 'entry/wxapp/SaveMd',
                  'cachetime': '0',
                  data: {
                    md_id: mdid, user_id: uid, link_name: lxr, yz_tel: sjh, address: mdwz, md_name: mdmc, md_logo: mdlogo, start_time: stime, end_time: etime,
                    type_id: hyid, WiFi: wifi, park: tcw, apy: zfbzf, wei: wxzf, notice: mdgg, imgs: mdtp, lb_imgs: lbtp, coordinates: jwd, link_tel: mddh, day: zfts
                  },
                  success: function (res) {
                    var rzid = res.data;
                    if (rzid != '入驻失败') {
                      wx.showModal({
                        title: '提示',
                        content: '提交成功',
                      })
                      //RzOrder
                      app.util.request({
                        'url': 'entry/wxapp/RzOrder',
                        'cachetime': '0',
                        data: { user_id: uid, store_id: rzid, day: zfts, money: money },
                        success: function (res) {
                          console.log(res)
                        }
                      });
                      if (that.data.isdx) {
                        //Sms
                        app.util.request({
                          'url': 'entry/wxapp/Sms',
                          'cachetime': '0',
                          success: function (res) {
                            console.log(res)
                          }
                        });
                      }
                      setTimeout(function () {
                        wx.navigateBack({

                        })
                      }, 1000)
                    }
                    if (res.data == '入驻失败') {
                      wx.showToast({
                        title: '提交失败请重试',
                        icon: 'loading',
                        duration: 1000
                      })
                    }
                    if (res.data == '该门店已存在') {
                      wx.showModal({
                        title: '提示',
                        content: '您的门店名称已存在，请重新填写',
                      })
                    }
                  }
                });
              },
              'complete': function (res) {
                console.log(res.errMsg);
                wx.showToast({
                  title: '取消支付',
                  icon: "loading",
                  duration: 1000
                })
              },
            })
          }
        })
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
    imgArray = [], lbimgArray = [], imglogo = '';
    var uid = wx.getStorageSync('UserData').id;
    var that = this;
    console.log(getApp().imglink, getApp().getuniacid)
    //取短信设置
    app.util.request({
      'url': 'entry/wxapp/IsSms',
      'cachetime': '0',
      success: function (res) {
        console.log(res.data)
        if (res.data.is_sms == '1') {
          console.log('关闭了短信')
          that.setData({
            isdx: false,
          })
        }
        if (res.data.is_sms == '2') {
          console.log('开启了短信')
          that.setData({
            isdx: true
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
          ptxx: res.data,
        })
      }
    });
    //取行业分类
    app.util.request({
      'url': 'entry/wxapp/Type',
      'cachetime': '0',
      success: function (res) {
        console.log(res.data)
        that.setData({
          hy: res.data,
          hyid: res.data[0].id
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
        if (res.data != '') {
          that.setData({
            is_check: res.data.is_check,
            mdid: res.data.id,
          })
          if (res.data.is_check == '2' && res.data.is_rz != '1') {
            that.setData({
              issq: true,
              isbj: true,
            })
            wx.showModal({
              title: '提示',
              content: '您的入驻已到期，请前往商家中心续费！',
              success: function (res) {
                wx.navigateBack({

                })
              }
            })
          }
          else if (res.data.is_check == '2') {
            that.setData({
              issq: true,
              isbj: true,
            })
            wx.showModal({
              title: '提示',
              content: '您已成功开通门店，不能重复入驻！',
              success: function (res) {
                wx.navigateBack({

                })
              }
            })
          }
        }
        else {
          that.setData({
            issq: true,
            isbj: false,
          })
        }
      }
    });
    app.util.request({
      'url': 'entry/wxapp/RzSet',
      'cachetime': '0',
      success: function (res) {
        console.log(res.data)
        that.setData({
          radioItems: res.data,
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