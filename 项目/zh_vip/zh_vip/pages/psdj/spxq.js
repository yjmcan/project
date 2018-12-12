var app = getApp();
Page({
  data: {
    id: null,
    goods: {},
    show_attr_picker: !1,
    form: {
      number: 1
    },
    tab_detail: "active",
    tab_comment: "",
    comment_list: [],
    comment_count: {
      score_all: 0,
      score_3: 0,
      score_2: 0,
      score_1: 0
    },
    autoplay: !1,
    hide: "hide",
    show: !1,
    x: wx.getSystemInfoSync().windowWidth,
    y: wx.getSystemInfoSync().windowHeight - 20,
    xdggid: '',
    pjindex: 0,
    pagenum: 1,
    storelist: [],
    mygd: false,
    jzgd: true,
  },
  form_save: function (e) {
    console.log(e)
    var form_id = e.detail.formId
    app.util.request({
      'url': 'entry/wxapp/AddFormId',
      data: {
        user_id: wx.getStorageSync('UserData').id,
        form_id: form_id
      },
      success: res => {
        console.log(res)
      }
    })
  },
  onLoad: function (t) {
    var that = this;
    app.getUserInfo(function (userInfo) {
      console.log(userInfo)
    })
    //取平台信息
    app.util.request({
      'url': 'entry/wxapp/system',
      'cachetime': '0',
      success: function (res) {
        console.log(res.data)
        that.setData({
          xtxx: res.data,
        })
        wx.setNavigationBarColor({
          frontColor: '#ffffff',
          backgroundColor: res.data.link_color,
        })
      }
    });
    //取imglink
    app.util.request({
      'url': 'entry/wxapp/url',
      'cachetime': '0',
      success: function (res) {
        console.log(res.data)
        that.setData({
          url: res.data,
        })
      }
    });
    var l = this;
    l.setData({
      id: t.id
    }),
      l.getGoodInfo();
    l.reLoad();
    l.getCommentList('0');
    l.getpjnum();
  },
  reLoad: function () {
    var that = this, store_id = wx.getStorageSync('mdid'), user_id = wx.getStorageSync('UserData').id;
    app.util.request({
      'url': 'entry/wxapp/MyCarNum',
      'cachetime': '0',
      data: {
        store_id: store_id, user_id: user_id
      },
      success: function (res) {
        console.log(res)
        that.setData({
          gwccd: res.data,
        })
      }
    })
  },
  getGoodInfo: function () {
    var t = this;
    app.util.request({
      'url': 'entry/wxapp/GoodInfo',
      'cachetime': '0',
      data: {
        good_id: t.data.id
      },
      success: function (res) {
        console.log(res)
        res.data.details = res.data.details.replace(/\<img/gi, '<img style="max-width:100%;height:auto" '),
        t.setData({
          goodinfo: res.data,
        })
      }
    })
  
  },
  djpj: function (e) {
    console.log(e.currentTarget.dataset.pjindex)
    this.setData({
      pjindex: e.currentTarget.dataset.pjindex,
      pagenum: 1,
      storelist: [],
      mygd: false,
      jzgd: true,
    })
    this.getCommentList(e.currentTarget.dataset.pjindex);
  },
  getCommentList: function (a) {
    // var e = this;
    // a && "active" != e.data.tab_comment || s || r && (s = !0, o.request({
    //   url: t.
    //     default.comment_list,
    //   data: {
    //     goods_id: e.data.id,
    //     page: i
    //   },
    //   success: function (t) {
    //     0 == t.code && (s = !1, i++ , e.setData({
    //       comment_count: t.data.comment_count,
    //       comment_list: a ? e.data.comment_list.concat(t.data.list) : t.data.list
    //     }), 0 == t.data.list.length && (r = !1))
    //   }
    // }))
    var t = this;
    console.log(a, t.data.pagenum)
    app.util.request({
      'url': 'entry/wxapp/PjList',
      'cachetime': '0',
      data: {
        good_id: t.data.id, score: a, page: t.data.pagenum,pagesize:10
      },
      success: function (res) {
        console.log('分页返回数据', res.data)
        if (res.data.length < 10) {
          t.setData({
            mygd: true,
            jzgd: true,
          })
        }
        else {
          t.setData({
            jzgd: true,
            pagenum: t.data.pagenum + 1,
          })
        }
        var storelist = t.data.storelist;
        storelist = storelist.concat(res.data);
        function unrepeat(arr) {
          var newarr = [];
          for (var i = 0; i < arr.length; i++) {
            if (newarr.indexOf(arr[i]) == -1) {
              newarr.push(arr[i]);
            }
          }
          return newarr;
        }
        storelist = unrepeat(storelist)
        console.log(storelist)
        for(var i in res.data) res.data[i].img=res.data[i].img.split(',')
        t.setData({
          comment_list: storelist,
          storelist: storelist,
        })
      }
    })
  },
  getpjnum:function(){
    var t = this;
    app.util.request({
      'url': 'entry/wxapp/PjNum',
      'cachetime': '0',
      data: {
        good_id: t.data.id
      },
      success: function (res) {
        console.log(res)
        t.setData({
          pjnum: res.data,
        })
      }
    })
  },
  onGoodsImageClick: function (t) {
    var a = this,
      o = [],
      e = t.currentTarget.dataset.index;
    for (var i in a.data.goodinfo.img) o.push(a.data.url + a.data.goodinfo.img[i]);
    wx.previewImage({
      urls: o,
      current: o[e]
    })
  },
  numberSub: function () {
    var t = this,
      a = t.data.form.number;
    if (a <= 1) return !0;
    a-- ,
      t.setData({
        form: {
          number: a
        }
      })
  },
  numberAdd: function () {
    var t = this,
      a = t.data.form.number;
    a++ ,
      t.setData({
        form: {
          number: a
        }
      })
  },
  numberBlur: function (t) {
    var a = this,
      o = t.detail.value;
    o = parseInt(o),
      isNaN(o) && (o = 1),
      o <= 0 && (o = 1),
      a.setData({
        form: {
          number: o
        }
      })
  },
  addCart: function () {
    this.submit("ADD_CART")
  },
  buyNow: function () {
    this.submit("BUY_NOW")
  },
  submit: function (a) {
    var e = this;
    if (!e.data.show_attr_picker) return e.setData({
      show_attr_picker: !0
    }),
      !0;
    console.log(e.data.form.number, Number(e.data.goodinfo.inventory))
    if (e.data.form.number > Number(e.data.goodinfo.inventory)) return wx.showToast({
      title: "商品库存不足，请选择其它规格或数量",
      image: "../../img/jg.png"
    }),
      !0;
    var i = e.data.goodinfo.spec,
      s = [];
    for (var r in i) {
      var n = !1;
      for (var d in i[r].spec_val) if (i[r].spec_val[d].checked) {
        n = {
          spec_val_id: i[r].spec_val[d].spec_val_id,
          spec_val_name: i[r].spec_val[d].spec_val_name
        };
        break
      }
      if (!n) return wx.showToast({
        title: "请选择" + i[r].spec_name,
        image: "../../img/jg.png"
      }),
        !0;
      // s.push({
      //   spec_id: i[r].spec_id,
      //   spec_name: i[r].spec_name,
      //   spec_val_id: n.spec_val_id,
      //   spec_val_name: n.spec_val_name
      // })
      var ggstring = i[r].spec_name + ':' + n.spec_val_name
      s.push(ggstring)
    }
    var xdggid = e.data.xdggid, good_id = e.data.goodinfo.id, money = e.data.goodinfo.money, store_id = wx.getStorageSync('mdid'), user_id = wx.getStorageSync('UserData').id, num = e.data.form.number, spec = s.toString()
    console.log(s, xdggid, money, good_id, store_id, user_id, num, spec)
    "ADD_CART" == a && (wx.showLoading({
      title: "正在提交",
      mask: !0
    }),
      app.util.request({
        'url': 'entry/wxapp/AddCar',
        'cachetime': '0',
        data: {
          money: money, good_id: good_id, store_id: store_id, user_id: user_id, num: num, spec: spec, combination_id: xdggid
        },
        success: function (res) {
          console.log(res)
          if (res.data == '1') {
            wx.showToast({
              title: '添加成功',
            })
          }
          if (res.data == '超出库存!') {
            wx.showModal({
              title: '提示',
              content: '您的购物车已添加过此商品，总计购买数量超出库存!请重新选择',
            })
          }
        }
      })
    ),
      "BUY_NOW" == a && (e.setData({
        show_attr_picker: !1
      }), wx.setStorageSync('cart_list', [{
        good_id: good_id,
        combination_id: xdggid,
        logo: e.data.goodinfo.logo,
        name: e.data.goodinfo.name,
        money: money,
        num: num,
        spec: spec,
        store_id: store_id,
        user_id: user_id,
      }]), wx.redirectTo({
        url: "../gwc/tjdd"
      }))
  },
  hideAttrPicker: function () {
    this.setData({
      show_attr_picker: !1
    })
  },
  showAttrPicker: function () {
    this.setData({
      show_attr_picker: !0
    })
  },
  attrClick: function (a) {
    var e = this,
      i = a.target.dataset.groupId,
      s = a.target.dataset.id,
      r = e.data.goodinfo;
    console.log(i, s, r)
    for (var n in r.spec) if (r.spec[n].spec_id == i) for (var d in r.spec[n].spec_val) r.spec[n].spec_val[d].spec_val_id == s ? r.spec[n].spec_val[d].checked = !0 : r.spec[n].spec_val[d].checked = !1;
    e.setData({
      goodinfo: r
    });
    var c = [],
      u = !0;
    for (var n in r.spec) {
      var l = !1;
      for (var d in r.spec[n].spec_val) if (r.spec[n].spec_val[d].checked) {
        c.push(r.spec[n].spec_val[d].spec_val_name),
          l = !0;
        break
      }
      if (!l) {
        u = !1;
        break
      }
    }
    console.log(e.data.goodinfo.id, c, c.toString())
    u && (wx.showLoading({
      title: "正在加载",
      mask: !0
    }),
      app.util.request({
        'url': 'entry/wxapp/GgZh',
        'cachetime': '0',
        data: {
          combination: c.toString(),
          good_id: e.data.goodinfo.id
        },
        success: function (res) {
          console.log(res)
          var g = e.data.goodinfo
          g.money = res.data.money
          g.inventory = res.data.number
          e.setData({
            goodinfo: g,
            xdggid: res.data.id,
          })
        }
      }))
  },
  favoriteAdd: function () {
    var a = this;
    o.request({
      url: t.user.favorite_add,
      method: "post",
      data: {
        goods_id: a.data.goods.id
      },
      success: function (t) {
        if (0 == t.code) {
          var o = a.data.goods;
          o.is_favorite = 1,
            a.setData({
              goods: o
            })
        }
      }
    })
  },
  favoriteRemove: function () {
    var a = this;
    o.request({
      url: t.user.favorite_remove,
      method: "post",
      data: {
        goods_id: a.data.goods.id
      },
      success: function (t) {
        if (0 == t.code) {
          var o = a.data.goods;
          o.is_favorite = 0,
            a.setData({
              goods: o
            })
        }
      }
    })
  },
  tabSwitch: function (t) {
    var a = this;
    "detail" == t.currentTarget.dataset.tab ? a.setData({
      tab_detail: "active",
      tab_comment: ""
    }) : a.setData({
      tab_detail: "",
      tab_comment: "active"
    })
  },
  commentPicView: function (t) {
    console.log(t);
    var comment_list = this.data.comment_list;
    var urls = []
    var a = this,
      o = t.currentTarget.dataset.index,
      e = t.currentTarget.dataset.picindex,
      id = t.currentTarget.dataset.id;
    console.log(o, e, id)
    if (id == comment_list[o].id) {
      var pictures = comment_list[o].img
      for (let i in pictures) {
        urls.push(a.data.url + pictures[i]);
      }
      wx.previewImage({
        current: a.data.url + pictures[e],
        urls: urls
      })
    }
  },
  onReady: function () { },
  onShow: function () { },
  onHide: function () { },
  onUnload: function () { },
  onPullDownRefresh: function () { },
  onReachBottom: function () {
    // this.getCommentList(!0)
    var that = this, pjindex = that.data.pjindex;
    console.log('上拉加载', this.data.pagenum,pjindex)
    if (!this.data.mygd && this.data.jzgd) {
      this.setData({
        jzgd: false
      })
      this.getCommentList(pjindex);
    }
    else {
      // wx.showToast({
      //   title: '没有更多了',
      //   icon: 'loading',
      //   duration: 1000,
      // })
    }
  },
  onShareAppMessage: function () {
    var t = this, username = wx.getStorageSync('UserData').nickname,
      a = wx.getStorageSync("user_info");
    return {
      path: "/zh_vip/pages/psdj/spxq?id=" + t.data.id,
      success: function (a) {
        console.log(a);
          // 1 == ++n && o.shareSendCoupon(t)
      },
      title: username+'邀请你来看'+t.data.goodinfo.name,
      imageUrl: t.data.url+t.data.goodinfo.img[0]
    }
  },
  play: function (t) {
    var a = t.target.dataset.url;
    this.setData({
      url: a,
      hide: "",
      show: !0
    }),
      wx.createVideoContext("video").play()
  },
  close: function (t) {
    if ("video" == t.target.id) return !0;
    this.setData({
      hide: "hide",
      show: !1
    }),
      wx.createVideoContext("video").pause()
  },
  hide: function (t) {
    0 == t.detail.current ? this.setData({
      img_hide: ""
    }) : this.setData({
      img_hide: "hide"
    })
  },
  showShareModal: function () {
    this.setData({
      share_modal_active: "active",
      no_scroll: !0
    })
  },
  shareModalClose: function () {
    this.setData({
      share_modal_active: "",
      no_scroll: !1
    })
  },
  getGoodsQrcode: function () {
    var a = this;
    if (a.setData({
      goods_qrcode_active: "active",
      share_modal_active: ""
    }), a.data.goods_qrcode) return !0;
    o.request({
      url: t.
        default.goods_qrcode,
      data: {
        goods_id: a.data.id
      },
      success: function (t) {
        0 == t.code && a.setData({
          goods_qrcode: t.data.pic_url
        }),
          1 == t.code && (a.goodsQrcodeClose(), wx.showModal({
            title: "提示",
            content: t.msg,
            showCancel: !1,
            success: function (t) {
              t.confirm
            }
          }))
      }
    })
  },
  goodsQrcodeClose: function () {
    this.setData({
      goods_qrcode_active: "",
      no_scroll: !1
    })
  },
  saveGoodsQrcode: function () {
    var t = this;
    wx.saveImageToPhotosAlbum ? (wx.showLoading({
      title: "正在保存图片",
      mask: !1
    }), wx.downloadFile({
      url: t.data.goods_qrcode,
      success: function (t) {
        wx.showLoading({
          title: "正在保存图片",
          mask: !1
        }),
          wx.saveImageToPhotosAlbum({
            filePath: t.tempFilePath,
            success: function () {
              wx.showModal({
                title: "提示",
                content: "商品海报保存成功",
                showCancel: !1
              })
            },
            fail: function (t) {
              wx.showModal({
                title: "图片保存失败",
                content: t.errMsg,
                showCancel: !1
              })
            },
            complete: function (t) {
              console.log(t),
                wx.hideLoading()
            }
          })
      },
      fail: function (a) {
        wx.showModal({
          title: "图片下载失败",
          content: a.errMsg + ";" + t.data.goods_qrcode,
          showCancel: !1
        })
      },
      complete: function (t) {
        console.log(t),
          wx.hideLoading()
      }
    })) : wx.showModal({
      title: "提示",
      content: "当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。",
      showCancel: !1
    })
  },
  goodsQrcodeClick: function (t) {
    var a = t.currentTarget.dataset.src;
    wx.previewImage({
      urls: [a]
    })
  },
  closeCouponBox: function (t) {
    this.setData({
      get_coupon_list: ""
    })
  },
  to_dial: function (t) {
    var a = this.data.store.contact_tel;
    wx.makePhoneCall({
      phoneNumber: a
    })
  }
});