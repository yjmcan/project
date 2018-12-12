// zh_zbkq/pages/index/sjdl.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ispl:false,
    showModal: false,
    score:0,
    plist:[],
    pjnum1: ['../../img/xing-fill@2x.png'],
    pjnum2: ['../../img/xing-fill@2x.png', '../../img/xing-fill@2x.png'],
    pjnum3: ['../../img/xing-fill@2x.png', '../../img/xing-fill@2x.png', '../../img/xing-fill@2x.png'],
    pjnum4: ['../../img/xing-fill@2x.png', '../../img/xing-fill@2x.png', '../../img/xing-fill@2x.png', '../../img/xing-fill@2x.png'],
    pjnum5: ['../../img/xing-fill@2x.png', '../../img/xing-fill@2x.png', '../../img/xing-fill@2x.png', '../../img/xing-fill@2x.png', '../../img/xing-fill@2x.png'],
    tabs: ['抢券', '评论'],
    activeIndex: 0, 
    lblist: ['https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1510045912469&di=8f88a5101d9fa308713c72b526b33519&imgtype=0&src=http%3A%2F%2Fiphone.tgbus.com%2FUploadFiles%2F201309%2F2013091714344627.jpg']
  },
  tabClick: function (e) {
    this.setData({
      activeIndex: e.currentTarget.id
    });
  },
  openmap: function (e) {
    var that = this
    wx.openLocation({
      latitude: Number(that.data.sjinfo.lat),
      longitude: Number(that.data.sjinfo.lng),
      name: that.data.sjinfo.md_name,
      address: that.data.sjinfo.address
    })
  },
  maketel:function(){
    var that=this;
    wx.makePhoneCall({
      phoneNumber: that.data.sjinfo.link_tel,
    })
  },
  previewImage:function(e){
    var that=this;
    console.log(e.currentTarget.dataset.imgarr)
    var imgarr = e.currentTarget.dataset.imgarr
    for(var i=0;i<imgarr.length;i++){
      imgarr[i]=that.data.url+imgarr[i]
    }
    console.log(imgarr)
    wx.previewImage({
      urls: imgarr
    })
  },
  ckgg:function(){
    this.setData({
      showModal:true
    })
  },
  yczz: function () {
    this.setData({
      showModal: false,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var sjmid = decodeURIComponent(options.scene)
    console.log(sjmid)
    var that=this;
    if(options.sjid!=null){
      that.setData({
        mdid: options.sjid
      })
    }
    if (sjmid != 'undefined'){
      that.setData({
        mdid: sjmid
      })
    }
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //登录
      console.log(app.globalData)
      app.userlogin(function (userdata) {
        console.log(userdata)
        var uid = wx.getStorageSync('UserData').id;
        //取优惠券详情;
        app.util.request({
          'url': 'entry/wxapp/TypeCoupons',
          'cachetime': '0',
          data: { md_id: that.data.mdid },
          success: function (res) {
            console.log(res.data)
            var yhqlist = res.data
            for (var i = 0; i < yhqlist.length; i++) {
              if (yhqlist[i].name == '通用券') {
                yhqlist[i].cost = parseInt(yhqlist[i].cost)
              }
            }
            //我的券;
            app.util.request({
              'url': 'entry/wxapp/MyCoupons',
              'cachetime': '0',
              data: { user_id: uid },
              success: function (res) {
                console.log(res.data)
                var myyhq = res.data
                for (var i = 0; i < myyhq.length; i++) {
                  for (var j = 0; j < yhqlist.length; j++) {
                    if (yhqlist[j].id == myyhq[i].id && myyhq[i].state == '1') {
                      yhqlist[j].islq = '1'
                    }
                  }
                }
                that.setData({
                  yhqlist: yhqlist
                })
              }
            });
          }
        });
      })
    })
    //取imgurl;
    app.util.request({
      'url': 'entry/wxapp/Attachurl',
      'cachetime': '0',
      success: function (res) {
        console.log(res.data)
        that.setData({
          url: res.data
        })
        getApp().imgurl = res.data
      }
    });
    //取商家详情;
    app.util.request({
      'url': 'entry/wxapp/GetMdInfo',
      'cachetime': '0',
      data: { md_id:that.data.mdid},
      success: function (res) {
        console.log(res.data)
        wx.setNavigationBarTitle({
          title: res.data.md_name
        })
        that.setData({
          sjinfo: res.data,
          score:Number(res.data.score).toFixed(1)
        })
      }
    });
    //取pl;
    app.util.request({
      'url': 'entry/wxapp/GetPlatform',
      'cachetime': '0',
      success: function (res) {
        console.log(res.data)
        if (res.data.is_open=='2'){
          that.setData({
            ispl:true,
          })
        }
        that.setData({
          ptxx: res.data
        })
      }
    });
    //poster;
    app.util.request({
      'url': 'entry/wxapp/Poster',
      'cachetime': '0',
      data: { md_id: that.data.mdid },
      success: function (res) {
        console.log(res)
        that.setData({
          storecode:res.data
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
    var that = this;
    //取商家pl;
    app.util.request({
      'url': 'entry/wxapp/AssessList',
      'cachetime': '0',
      data: { md_id: that.data.mdid },
      success: function (res) {
        console.log(res.data)
        var plist=res.data;
        for(var i=0;i<plist.length;i++){
          plist[i].img = (plist[i].img).split(",");
        }
        console.log(plist)
        that.setData({
          plist:plist
        })
      }
    });
  },
  showShareModal: function () {
    var page = this;
    page.setData({
      share_modal_active: "active",
      no_scroll: true,
    });
  },

  shareModalClose: function () {
    var page = this;
    page.setData({
      share_modal_active: "",
      no_scroll: false,
    });
  },

  getGoodsQrcode: function () {
    var page = this;
    page.setData({
      goods_qrcode_active: "active",
      share_modal_active: "",
    });
    page.setData({
      goods_qrcode: page.data.storecode,
    });
  },

  goodsQrcodeClose: function () {
    var page = this;
    page.setData({
      goods_qrcode_active: "",
      no_scroll: false,
    });
  },
  goodsQrcodeClick: function (e) {
    var src = e.currentTarget.dataset.src;
    wx.previewImage({
      urls: [src],
    });
  },
  saveGoodsQrcode: function () {
    var page = this;
    if (!wx.saveImageToPhotosAlbum) {
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。',
        showCancel: false,
      });
      return;
    }

    wx.showLoading({
      title: "正在保存图片",
      mask: false,
    });
    console.log(page.data.goods_qrcode)
    wx.downloadFile({
      url:page.data.goods_qrcode,
      success: function (urlres) {
        console.log(urlres)
        wx.showLoading({
          title: "正在保存图片",
          mask: false,
        });
        wx.saveImageToPhotosAlbum({
          filePath: urlres.tempFilePath,
          success: function () {
            page.goodsQrcodeClose()
            wx.showModal({
              title: '提示',
              content: '商家海报保存成功',
              showCancel: false,
            });
          },
          fail: function (e) {
            wx.showModal({
              title: '警告',
              content: '您点击了拒绝授权,无法保存图片,点击确定重新获取授权。',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  wx.openSetting({
                    success: (res) => {
                      if (res.authSetting["scope.writePhotosAlbum"]) {////如果用户重新同意了授权登录
                        wx.saveImageToPhotosAlbum({
                          filePath: urlres.tempFilePath,
                          success: function () {
                            page.goodsQrcodeClose()
                            wx.showModal({
                              title: '提示',
                              content: '商家海报保存成功',
                              showCancel: false,
                            });
                          },
                          fail: function () {
                            wx.showModal({
                              title: '图片保存失败',
                              content: e.errMsg,
                              showCancel: false,
                            });
                          }
                        })
                      }
                    },
                    fail: function (res) {
                    }
                  })
                }
                else {
                  wx.showModal({
                    title: '图片保存失败',
                    content: e.errMsg,
                    showCancel: false,
                  });
                }
              }
            })
          },
          complete: function (e) {
            console.log(e);
            wx.hideLoading();
          }
        });
      },
      fail: function (e) {
        wx.showModal({
          title: '图片下载失败',
          content: e.errMsg + ";" + page.data.goods_qrcode,
          showCancel: false,
        });
      },
      complete: function (e) {
        console.log(e);
        wx.hideLoading();
      }
    });

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
    var that = this;
    that.setData({
      share_modal_active: "",
      no_scroll: false,
    });
    return {
      title: '来' + that.data.ptxx.name+'-'+that.data.sjinfo.md_name+'抢券啦！',
      path: 'zh_zbkq/pages/index/sjdl?sjid=' + that.data.mdid,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})