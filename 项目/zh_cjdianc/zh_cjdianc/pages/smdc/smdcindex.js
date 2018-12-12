// zh_dianc/pages/takeout/takeoutindex.js
var app = getApp()
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isloading: true,
    store_id: '1',
    navbar: ['店内', '评价', '详情'],
    selectedindex: 0,
    catalogSelect: 0,
    share_modal_active: false,
    color: '',
    fwxy: true,
    cpjzz: true,
    spggtoggle: true,
    yysjtoggle: true,
    spxqtoggle: true,
    gg: [],
    storeyyzz: [],
    pjselectedindex: 0,
    isytpj: false,
    pagenum: 1,
    storelist: [],
    bfstorelist: [],
    mygd: false,
    jzgd: true,
    scroll: "scroll",
    iszk: false,
  },
  drdc: function () {
    var that = this, userinfo = this.data.userinfo;
    console.log(userinfo)
    if (userinfo.img == '' || userinfo.name == '') {
      wx.navigateTo({
        url: 'getdl',
      })
    }
    else {
      wx.showModal({
        title: '提示',
        content: '确定多人选购拼单吗？',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            // wx.setStorageSync('pin', '1')
            wx.redirectTo({
              url: 'drdc?storeid=' + that.data.store_id + '&tableid=' + that.data.tableid + '&type_name=' + that.data.tableinfo.type_name + '&table_name=' + that.data.tableinfo.table_name,
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },
  //
  commentPicView: function (t) {
    console.log(t);
    var comment_list = this.data.storelist;
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
  ytpj: function () {
    var that = this, params = this.data.params;
    if (that.data.isytpj) {
      params.img = ''
    }
    else {
      params.img = '1'
    }
    this.setData({
      pagenum: 1,
      storelist: [],
      bfstorelist: [],
      mygd: false,
      jzgd: true,
      isytpj: !that.data.isytpj,
      params: params
    })
    this.getstorelist()
  },
  pjselectednavbar: function (e) {
    console.log(e)
    var that = this, params = this.data.params;
    if (e.currentTarget.dataset.index == 0) {
      params.type = '全部'
    }
    if (e.currentTarget.dataset.index == 1) {
      params.type = '1'
    }
    if (e.currentTarget.dataset.index == 2) {
      params.type = '2'
    }
    this.setData({
      pagenum: 1,
      storelist: [],
      bfstorelist: [],
      mygd: false,
      jzgd: true,
      pjselectedindex: e.currentTarget.dataset.index,
      params: params
    })
    this.getstorelist()
  },
  getstorelist: function () {
    var that = this, page = that.data.pagenum; that.data.params.page = page, that.data.params.pagesize = 10;
    console.log(page, that.data.params);
    that.setData({
      isjzz: true
    })
    //推荐商家列表
    app.util.request({
      'url': 'entry/wxapp/AssessList',
      'cachetime': '0',
      data: that.data.params,
      success: function (res) {
        console.log('分页返回的商家列表数据', res.data)
        var pjnavbar = [{ name: '全部', num: res.data.all }, { name: '满意', num: res.data.ok }, { name: '不满意', num: res.data.no }]
        var storelist = that.data.bfstorelist;
        storelist = storelist.concat(res.data.assess);
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
        // for (let i = 0; i < res.data.length; i++) {
        // }
        that.setData({
          storelist: storelist,
          bfstorelist: storelist,
          pjnavbar: pjnavbar,
        })
        if (res.data.assess.length < 10) {
          that.setData({
            mygd: true,
            jzgd: true,
            isjzz: false
          })
        }
        else {
          that.setData({
            jzgd: true,
            pagenum: page + 1,
            isjzz: false
          })
        }
        console.log(storelist)
      },
    })
  },
  //
  Coupons: function () {
    var that = this, user_id = wx.getStorageSync('users').id, store_id = that.data.store_id;
    app.util.request({
      'url': 'entry/wxapp/Coupons',
      'cachetime': '0',
      data: { store_id: store_id, user_id: user_id },
      success: function (res) {
        console.log(res.data)
        var arr = [];
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].type != '1') {
            arr.push(res.data[i])
          }
        }
        that.setData({
          Coupons: arr
        })
      },
    })
  },
  ljlq: function (e) {
    console.log(e.currentTarget.dataset.qid)
    var that = this, user_id = wx.getStorageSync('users').id;
    wx.showLoading({
      title: "正在加载",
      mask: !0
    }), app.util.request({
      'url': 'entry/wxapp/LqCoupons',
      'cachetime': '0',
      data: {
        user_id: user_id, coupon_id: e.currentTarget.dataset.qid
      },
      success: function (res) {
        console.log(res)
        if (res.data == '1') {
          wx.showLoading({
            title: '领取成功',
            mask: !0,
          })
          setTimeout(() => {
            that.Coupons()
          }, 1000)
        }
      }
    })
  },
  submit: function () {
    var that = this, userinfo = this.data.userinfo;
    console.log(userinfo)
    if (userinfo.img == '' || userinfo.name == '') {
      wx.navigateTo({
        url: 'getdl',
      })
    }
    else {
      // console.log(wx.getStorageSync('cxxg'))
      // if (wx.getStorageSync('cxxg') == '1') {
      //   wx.navigateTo({
      //     url: 'drdc?storeid=' + that.data.store_id + '&tableid=' + that.data.tableid + '&type_name=' + that.data.tableinfo.type_name + '&table_name=' + that.data.tableinfo.table_name,
      //   })
      // }
      // else { }
      wx.navigateTo({
        url: 'smdcform?storeid=' + that.data.store_id + '&tableid=' + that.data.tableid,
      })
    }
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
  // tzspxq: function () {
  //   wx.navigateTo({
  //     url: 'takeoutspxq',
  //   })
  // },
  spxqck: function (e) {
    var itemIndex = e.currentTarget.dataset.itemIndex, parentindex = e.currentTarget.dataset.parentindex, dishes = this.data.dishes, cart_list = this.data.cart_list.res, goodid = e.currentTarget.dataset.goodid, that = this, spinfo = this.data.dishes[parentindex].good[itemIndex], user_id = wx.getStorageSync('users').id, store_id = this.data.store_id;
    spinfo.goodindex = itemIndex, spinfo.catalogSelect = parentindex;
    console.log(dishes, cart_list, itemIndex, parentindex, goodid, spinfo, user_id, store_id)
    this.setData({
      spxqinfo: spinfo,
      spxqtoggle: false
    })
    // this.setData({
    //   spxqtoggle: false
    // })
  },
  ckcd: function () {
    this.setData({
      yysjtoggle: true,
    })
  },
  gdsh: function () {
    wx.navigateBack({

    })
  },
  gbspxq: function () {
    this.setData({
      spxqtoggle: true,
    })
  },
  ggcartdec: function () {
    var t = this;
    wx.showModal({
      title: '提示',
      content: '多规格商品请在购物车中删除对应的规格商品！',
      success: function (res) {
        t.setData({
          share_modal_active: true,
        })
      }
    })
  },
  gwcdec: function (e) {
    var that = this, dishes = this.data.dishes, goodid = e.currentTarget.dataset.goodid, num = Number(e.currentTarget.dataset.num) - 1, id = e.currentTarget.dataset.id;
    console.log(dishes, goodid, num, id)
    wx.showLoading({
      title: "正在加载",
      mask: !0
    }), app.util.request({
      'url': 'entry/wxapp/UpdCar',
      'cachetime': '0',
      data: {
        num: num, id: id
      },
      success: function (res) {
        console.log(res)
        if (res.data == '1') {
          for (let i = 0; i < dishes.length; i++) {
            for (let j = 0; j < dishes[i].good.length; j++) {
              if (dishes[i].good[j].id == goodid) {
                dishes[i].good[j].quantity--
              }
            }
          }
          that.setData({
            dishes: dishes
          })
          that.gwcreload()
        }
        if (res.data == '超出库存!') {
          wx.showModal({
            title: '提示',
            content: '超出库存!',
          })
        }
      }
    })
  },
  gwcadd: function (e) {
    var that = this, dishes = this.data.dishes, goodid = e.currentTarget.dataset.goodid, num = Number(e.currentTarget.dataset.num) + 1, id = e.currentTarget.dataset.id;
    console.log(dishes, goodid, num, id)
    wx.showLoading({
      title: "正在加载",
      mask: !0
    }), app.util.request({
      'url': 'entry/wxapp/UpdCar',
      'cachetime': '0',
      data: {
        num: num, id: id
      },
      success: function (res) {
        console.log(res)
        if (res.data == '1') {
          for (let i = 0; i < dishes.length; i++) {
            for (let j = 0; j < dishes[i].good.length; j++) {
              if (dishes[i].good[j].id == goodid) {
                dishes[i].good[j].quantity++
              }
            }
          }
          that.setData({
            dishes: dishes
          })
          that.gwcreload()
        }
        if (res.data == '超出库存!') {
          wx.showModal({
            title: '提示',
            content: '超出库存!请选择其他商品',
          })
        }
      }
    })
  },
  cartdec: function (e) {
    var itemIndex = e.currentTarget.dataset.itemIndex, parentindex = e.currentTarget.dataset.parentindex, dishes = this.data.dishes, cart_list = this.data.cart_list.res, goodid = e.currentTarget.dataset.goodid, that = this, spinfo = this.data.dishes[parentindex].good[itemIndex], user_id = wx.getStorageSync('users').id, store_id = this.data.store_id;
    console.log(dishes, cart_list, itemIndex, parentindex, goodid, spinfo, user_id, store_id)
    for (let i = 0; i < cart_list.length; i++) {
      if (cart_list[i].good_id == goodid) {
        var num = Number(cart_list[i].num) - 1, id = cart_list[i].id
        console.log(cart_list[i], num, id)
        wx.showLoading({
          title: "正在加载",
          mask: !0
        }), app.util.request({
          'url': 'entry/wxapp/UpdCar',
          'cachetime': '0',
          data: {
            num: num, id: id
          },
          success: function (res) {
            console.log(res)
            if (res.data == '1') {
              // dishes[parentindex].good[itemIndex].quantity--
              for (let i = 0; i < dishes.length; i++) {
                for (let j = 0; j < dishes[i].good.length; j++) {
                  if (dishes[i].good[j].id == goodid) {
                    dishes[i].good[j].quantity--
                  }
                }
              }
              that.setData({
                dishes: dishes
              })
              that.gwcreload()
            }
            if (res.data == '超出库存!') {
              wx.showModal({
                title: '提示',
                content: '超出库存!',
              })
            }
          }
        })
      }
    }
  },
  cartadd: function (e) {
    var itemIndex = e.currentTarget.dataset.itemIndex, parentindex = e.currentTarget.dataset.parentindex, dishes = this.data.dishes, goodid = e.currentTarget.dataset.goodid, that = this, spinfo = this.data.dishes[parentindex].good[itemIndex], user_id = wx.getStorageSync('users').id, store_id = this.data.store_id, isvipm = this.data.iszk && (spinfo.dn_hymoney != '0.00') ? 1 : 0;
    console.log(itemIndex, parentindex, goodid, spinfo, user_id, store_id)
    wx.showLoading({
      title: "正在加载",
      mask: !0
    }), app.util.request({
      'url': 'entry/wxapp/AddCar',
      'cachetime': '0',
      data: {
        money: isvipm ? spinfo.dn_hymoney : spinfo.dn_money, good_id: goodid, store_id: store_id, user_id: user_id, num: 1, spec: '', combination_id: '', box_money: spinfo.box_money, type: 2
      },
      success: function (res) {
        console.log(res)
        if (res.data == '1') {
          // dishes[parentindex].good[itemIndex].quantity++
          for (let i = 0; i < dishes.length; i++) {
            for (let j = 0; j < dishes[i].good.length; j++) {
              if (dishes[i].good[j].id == goodid) {
                dishes[i].good[j].quantity++
              }
            }
          }
          that.setData({
            dishes: dishes
          })
          console.log(dishes)
          that.gwcreload()
        }
        if (res.data == '超出库存!') {
          wx.showModal({
            title: '提示',
            content: '库存不足!请重新选择',
          })
        }
      }
    })
  },
  spggck: function (e) {
    var itemIndex = e.currentTarget.dataset.itemIndex, parentindex = e.currentTarget.dataset.parentindex, goodid = e.currentTarget.dataset.goodid, that = this;
    console.log(itemIndex, parentindex, goodid)
    //GoodInfo
    app.util.request({
      'url': 'entry/wxapp/GoodInfo',
      'cachetime': '0',
      data: { good_id: goodid },
      success: function (res) {
        console.log(res.data)
        var gg = res.data.spec, spname = res.data.name;;
        for (var n in gg) for (var d in gg[n].spec_val) d == 0 ? gg[n].spec_val[d].checked = !0 : gg[n].spec_val[d].checked = !1
        that.setData({
          gg: gg,
          spname: spname,
        })
        console.log(gg)
        var c = [],
          u = !0;
        for (var n in gg) {
          var l = !1;
          for (var d in gg[n].spec_val) if (gg[n].spec_val[d].checked) {
            c.push(gg[n].spec_val[d].spec_val_name),
              l = !0;
            break
          }
          if (!l) {
            u = !1;
            break
          }
        }
        console.log(goodid, c, c.toString())
        u && (wx.showLoading({
          title: "正在加载",
          mask: !0
        }),
          app.util.request({
            'url': 'entry/wxapp/GgZh',
            'cachetime': '0',
            data: {
              combination: c.toString(),
              good_id: goodid
            },
            success: function (res) {
              console.log(res)
              that.setData({
                spggtoggle: false,
                gginfo: res.data,
                itemIndex: itemIndex,
                parentindex: parentindex
              })
            }
          }))
      },
    })
  },
  attrClick: function (a) {
    var e = this, goodid = this.data.gginfo.good_id,
      i = a.target.dataset.groupId,
      s = a.target.dataset.id,
      r = e.data.gg;
    console.log(i, s, r)
    for (var n in r) if (r[n].spec_id == i) for (var d in r[n].spec_val) r[n].spec_val[d].spec_val_id == s ? r[n].spec_val[d].checked = !0 : r[n].spec_val[d].checked = !1;
    e.setData({
      gg: r
    });
    var c = [],
      u = !0;
    for (var n in r) {
      var l = !1;
      for (var d in r[n].spec_val) if (r[n].spec_val[d].checked) {
        c.push(r[n].spec_val[d].spec_val_name),
          l = !0;
        break
      }
      if (!l) {
        u = !1;
        break
      }
    }
    console.log(goodid, c, c.toString())
    u && (wx.showLoading({
      title: "正在加载",
      mask: !0
    }),
      app.util.request({
        'url': 'entry/wxapp/GgZh',
        'cachetime': '0',
        data: {
          combination: c.toString(),
          good_id: goodid
        },
        success: function (res) {
          console.log(res)
          e.setData({
            gginfo: res.data,
          })
        }
      }))
  },
  ggaddcart: function () {
    var itemIndex = this.data.itemIndex, parentindex = this.data.parentindex, dishes = this.data.dishes, that = this, gginfo = this.data.gginfo, user_id = wx.getStorageSync('users').id, r = this.data.gg, store_id = this.data.store_id;
    var c = [],
      u = !0;
    for (var n in r) {
      var l = !1;
      for (var d in r[n].spec_val) if (r[n].spec_val[d].checked) {
        c.push(r[n].spec_name + ":" + r[n].spec_val[d].spec_val_name),
          l = !0;
        break
      }
      if (!l) {
        u = !1;
        break
      }
    }
    console.log('加入购物车', itemIndex, parentindex, dishes, gginfo, user_id, store_id, r, c, c.toString())
    u && (wx.showLoading({
      title: "正在加载",
      mask: !0
    }), app.util.request({
      'url': 'entry/wxapp/AddCar',
      'cachetime': '0',
      data: {
        money: gginfo.dn_money, good_id: gginfo.good_id, store_id: store_id, user_id: user_id, num: 1, spec: c.toString(), combination_id: gginfo.id, box_money: gginfo.box_money, type: 2
      },
      success: function (res) {
        console.log(res)
        if (res.data == '1') {
          // dishes[parentindex].good[itemIndex].quantity++
          for (let i = 0; i < dishes.length; i++) {
            for (let j = 0; j < dishes[i].good.length; j++) {
              if (dishes[i].good[j].id == gginfo.good_id) {
                dishes[i].good[j].quantity++
              }
            }
          }
          that.setData({
            dishes: dishes
          })
          that.gwcreload()
          that.setData({
            spggtoggle: true,
          })
        }
        if (res.data == '超出库存!') {
          wx.showModal({
            title: '提示',
            content: '暂无库存!请选择其他规格或商品',
          })
        }
      }
    }))
  },
  gwcreload: function () {
    var dishes = this.data.dishes, that = this, user_id = wx.getStorageSync('users').id, store_id = this.data.store_id;
    console.log(dishes, user_id, store_id)
    app.util.request({
      'url': 'entry/wxapp/MyCar',
      'cachetime': '0',
      data: {
        store_id: store_id, user_id: user_id, type: 2
      },
      success: function (res) {
        console.log(res)
        console.log(dishes)
        // for (let i = 0; i < res.data.length; i++) {
        //   if (res.data[i].combination_id == '0') {
        //     res.data[i].number = res.data[i].inventory
        //   }
        //   res.data[i].num = Number(res.data[i].num)
        //   res.data[i].number = Number(res.data[i].number)
        //   res.data[i].money = Number(res.data[i].money)
        // }
        that.setData({
          cart_list: res.data,
        })
        that.subText()
      }
    })
  },
  gbspgg: function () {
    this.setData({
      spggtoggle: true,
    })
  },
  gbyysj: function () {
    this.setData({
      yysjtoggle: true,
    })
  },
  selectednavbar: function (e) {
    console.log(e)
    this.setData({
      selectedindex: e.currentTarget.dataset.index
    })
  },
  scroll: function (e) {
    console.log(e);
    var that = this, dishes = this.data.dishes, dataheith = this.data.dataheith, linheightid = this.data.catalogSelect;
    console.log(e.detail.scrollTop, dataheith, linheightid)
    // return
    var scrolltop = e.detail.scrollTop;
    for (var i = 0; i < dataheith.length; i++) {
      if (scrolltop <= dataheith[i]) {
        console.log(i);
        console.log(scrolltop, linheightid)
        this.setData({
          catalogSelect: i,
          toType: 'type' + (i - 2),
        })
        break
      }
    }
  },
  selectMenu: function (e) {
    var dishes = this.data.dishes, that = this, user_id = wx.getStorageSync('users').id, store_id = that.data.store_id, typeindex = e.currentTarget.dataset.itemIndex;
    console.log(dishes, user_id, store_id, typeindex)
    this.setData({
      catalogSelect: e.currentTarget.dataset.itemIndex,
      toView: 'order' + typeindex.toString(),
      toType: 'type' + (typeindex - 2),
      scroll: ""
    });
    setTimeout(function () {
      that.setData({
        scroll: "scroll"
      });
    }, 500)
    // var dishes = this.data.dishes, that = this, user_id = wx.getStorageSync('users').id, store_id = that.data.store_id, typeindex = e.currentTarget.dataset.itemIndex;
    // console.log(dishes, user_id, store_id, typeindex)
    // this.setData({
    //   catalogSelect: e.currentTarget.dataset.itemIndex,
    // })
    // if (dishes[e.currentTarget.dataset.itemIndex].good.length == 0) {
    //   var typeid = dishes[e.currentTarget.dataset.itemIndex].id;
    //   console.log('还没加载过数据', typeid)
    //   that.setData({
    //     cpjzz: true,
    //   })
    //   app.util.request({
    //     'url': 'entry/wxapp/Dishes',
    //     'cachetime': '0',
    //     data: { type_id: typeid, type: 1, },
    //     success: function (res) {
    //       console.log(res.data)
    //       for (let i = 0; i < res.data.length; i++) {
    //         res.data[i].quantity = Number(res.data[i].quantity)
    //       }
    //       dishes[e.currentTarget.dataset.itemIndex].good = res.data
    //       that.setData({
    //         cpjzz: false,
    //       })
    //       app.util.request({
    //         'url': 'entry/wxapp/MyCar',
    //         'cachetime': '0',
    //         data: {
    //           store_id: store_id, user_id: user_id, type: 2
    //         },
    //         success: function (res) {
    //           console.log(res)
    //           var cart_list = res.data.res
    //           for (let i = 0; i < cart_list.length; i++) {
    //             for (let k = 0; k < dishes[typeindex].good.length; k++) {
    //               if (cart_list[i].good_id == dishes[typeindex].good[k].id) {
    //                 dishes[typeindex].good[k].quantity = dishes[typeindex].good[k].quantity + Number(cart_list[i].num)
    //               }
    //             }
    //           }
    //           console.log(dishes)
    //           that.setData({
    //             dishes: dishes,
    //           })
    //         }
    //       })
    //     },
    //   })
    // }
    // else {
    //   console.log('已有缓存数据')
    // }
  },
  swiperChange: function (e) {
    console.log(e)
    this.setData({
      selectedindex: e.detail.current
    })
  },
  showcart: function () {
    var that = this;
    this.setData({
      share_modal_active: !that.data.share_modal_active,
    })
  },
  closecart: function () {
    var page = this;
    page.setData({
      share_modal_active: false,
    });
  },
  clear: function () {
    var that = this, dishes = this.data.dishes, user_id = wx.getStorageSync('users').id, store_id = that.data.store_id;
    console.log(dishes, user_id, store_id)
    wx.showModal({
      title: '提示',
      content: '确定清空此商家的购物车吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.showLoading({
            title: "正在加载",
            mask: !0
          }),
            app.util.request({
              'url': 'entry/wxapp/DelCar',
              'cachetime': '0',
              data: {
                user_id: user_id, store_id: store_id, type: 2
              },
              success: function (res) {
                console.log(res.data)
                if (res.data == '1') {
                  for (let i = 0; i < dishes.length; i++) {
                    for (let j = 0; j < dishes[i].good.length; j++) {
                      dishes[i].good[j].quantity = 0
                    }
                  }
                  that.setData({
                    dishes: dishes,
                    share_modal_active: false,
                  })
                  that.gwcreload()
                }
              },
            })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //tjdd
  subText() {
    console.log(this.data)
    var totalPrice = parseFloat(this.data.cart_list.money), start_at = parseFloat(this.data.start_at), subtext;
    console.log(totalPrice, start_at)
    // if (totalPrice <= 0) {
    //   subtext = '￥' + this.data.start_at + '元起送';
    // } else if (totalPrice < start_at) {
    //   let diff = start_at - totalPrice;
    //   console.log(diff)
    //   subtext = '还差' + diff.toFixed(2) + '元起送';
    // } else {
    //   console.log(totalPrice)
    //   subtext = '去结算';
    // }
    if (totalPrice <= 0) {
      subtext = '还没有选购商品';
    } else {
      console.log(totalPrice)
      subtext = '去结算';
    }
    this.setData({
      subtext: subtext,
    })
  },
  //hjfwy
  hjfwy: function () {
    var that = this, store_id = this.data.store_id, tableid = this.data.tableid;
    console.log(store_id, tableid)
    wx.showModal({
      title: '提示',
      content: '确定呼叫服务员吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          app.util.request({
            'url': 'entry/wxapp/VoiceCall',
            'cachetime': '0',
            data: { store_id: store_id, id: tableid },
            success: function (res) {
              console.log(res.data)
              wx.showModal({
                title: '提示',
                content: '成功呼叫服务员,系统存在网络延迟,请您不要重复点击呼叫',
              })
            },
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //wddd
  wddd: function () {
    wx.navigateTo({
      url: '../wddd/order',
    })
  },
  addsp: function () {
    var that = this, oid = this.data.oid, list = [], cart_list = this.data.cart_list.res, money = this.data.cart_list.money;
    cart_list.map(function (item) {
      if (item.num > 0) {
        var obj = {};
        obj.name = item.name;
        obj.img = item.logo;
        obj.num = item.num;
        obj.money = item.money;
        obj.dishes_id = item.good_id;
        obj.spec = item.spec;
        list.push(obj);
      }
    })
    console.log(oid, money, cart_list, list)
    wx.showModal({
      title: '提示',
      content: '确定添加商品吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.showLoading({
            title: '加载中',
            mask: !0
          })
          app.util.request({
            'url': 'entry/wxapp/Addgoods',
            'cachetime': '0',
            data: { sz: list, money: money, order_id: oid },
            success: function (res) {
              console.log(res.data)
              if (res.data == '1') {
                wx.showLoading({
                  title: '添加成功',
                  mask: !0
                })
                setTimeout(function () {
                  wx.reLaunch({
                    url: '../wddd/order',
                  })
                }, 1000)
              }
            },
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('options', options, options.store_id)
    // options 中的 scene 需要使用 decodeURIComponent 才能获取到生成二维码时传入的 scene
    var scene = decodeURIComponent(options.scene).split(',')
    console.log(decodeURIComponent(options.scene),scene)
    app.setNavigationBarColor(this);
    if (decodeURIComponent(options.scene) != 'undefined') {
      this.setData({
        store_id: scene[1],
        tableid: scene[0]
      })
    }
    if (options.store_id != null){
      this.setData({
        store_id: options.store_id,
        tableid: options.tableid,
        oid: options.oid
      })
    }
    //
    var that = this, store_id = that.data.store_id, tableid = that.data.tableid;
    //
    this.setData({
      params: { store_id: store_id, type: '全部', img: '' }
    })
    this.getstorelist()
    var time = util.formatTime(new Date());
    var current_time = time.slice(11, 16)
    app.util.request({
      'url': 'entry/wxapp/StoreInfo',
      'cachetime': '0',
      data: { store_id: store_id, type: 1 },
      success: function (res) {
        console.log(res.data)
        var storeinfo = res.data
        // 获取桌子信息
        app.util.request({
          'url': 'entry/wxapp/Zhuohao',
          'cachetime': '0',
          data: { id: tableid },
          success: function (res) {
            console.log(res)
            that.setData({
              tableinfo: res.data,
            })
            if (storeinfo.storeset.is_czztpd == '1') {
              if (res.data.status == '0') {
                that.setData({
                  iskt: false,
                })
              }
              else {
                that.setData({
                  iskt: true,
                })
                // wx.showModal({
                //   title: '提示',
                //   content: '此桌已开台暂不能点餐,请选择其他座位',
                //   showCancel: false,
                //   success: function (res) {
                //   },
                //   fail: function (res) { },
                //   complete: function (res) { },
                // })
              }
            }
            else {
              that.setData({
                iskt: false,
              })
            }
          },
        })
        var shop_time = res.data.store.time
        var close_time = res.data.store.time2
        var shop_time1 = res.data.store.time3
        var close_time1 = res.data.store.time4
        var rest = res.data.store.is_rest
        console.log('当前的系统时间为' + current_time)
        console.log('商家的营业时间从' + shop_time + '至' + close_time, shop_time1 + '至' + close_time1)

        if (rest == 1) {
          that.setData({
            yysjtoggle: false,
          })
          console.log('商家正在休息' + rest)
        } else {
          console.log('商家正在营业' + rest)
        }
        if (close_time1 > shop_time) {
          if (current_time > shop_time && current_time < close_time || current_time > shop_time1 && current_time < close_time1 || current_time > shop_time1 && shop_time1 > close_time1) {
            console.log('商家正常营业')
            that.setData({
              time: 1
            })
          }
          else if (current_time < shop_time || current_time > close_time && current_time < shop_time1) {
            console.log('商家还没开店呐，稍等一会儿可以吗？')
            that.setData({
              time: 2,
              yysjtoggle: false,
            })
          }
          else if (current_time > close_time1) {
            console.log('商家以及关店啦，明天再来吧')
            that.setData({
              time: 3,
              yysjtoggle: false,
            })
          }
        }
        else if (close_time1 < shop_time) {
          if (current_time > shop_time && current_time < close_time || current_time > shop_time1 && current_time > close_time1 || current_time < shop_time1 && current_time < close_time1) {
            console.log('商家正常营业')
            that.setData({
              time: 1
            })
          }
          else if (current_time < shop_time || current_time > close_time && current_time < shop_time1) {
            console.log('商家还没开店呐，稍等一会儿可以吗？')
            that.setData({
              time: 2,
              yysjtoggle: false,
            })
          }
          else if (current_time > close_time1) {
            console.log('商家以及关店啦，明天再来吧')
            that.setData({
              time: 3,
              yysjtoggle: false,
            })
          }
        }
        for (let i = 0; i < res.data.store.environment.length; i++) {
          res.data.store.environment[i] = that.data.url + res.data.store.environment[i]
        }
        for (let i = 0; i < res.data.store.yyzz.length; i++) {
          res.data.store.yyzz[i] = that.data.url + res.data.store.yyzz[i]
        }
        if (res.data.storeset.dn_name != '') {
          wx.setNavigationBarTitle({
            title: res.data.storeset.dn_name,
          })
          that.setData({
            navbar: [res.data.storeset.dn_name, '评价', '详情'],
          })
        }
        that.setData({
          psf: res.data.psf,
          reduction: res.data.reduction,
          store: res.data.store,
          storeset: res.data.storeset,
          start_at: 0,
        })
      },
    })
    app.getUserInfo(function (userinfo) {
      app.util.request({
        'url': 'entry/wxapp/DelCar',
        'cachetime': '0',
        data: {
          user_id: userinfo.id, store_id: that.data.store_id, type: 2
        },
        success: function (res) {
          console.log(res.data)
        },
      })
      var date = util.formatTime(new Date).substring(0, 10).replace(/\//g, "-");
      console.log(userinfo, date)
      that.setData({
        userinfo: userinfo,
      })
      if (userinfo.dq_time != '' && userinfo.dq_time >= date.toString()) {
        that.setData({
          iszk: true
        })
      }
      var user_id = wx.getStorageSync('users').id, store_id = that.data.store_id;
      console.log('uid', user_id)
      that.Coupons();
      //Hot 
      app.util.request({
        'url': 'entry/wxapp/Hot',
        'cachetime': '0',
        data: { store_id: store_id, type: 1 },
        success: function (res) {
          console.log(res.data)
          for (let i = 0; i < res.data.length; i++) {
            res.data[i].quantity = Number(res.data[i].quantity)
          }
          if (res.data.length > 0) {
            let hot = new Array,
              obj = new Object();
            obj.good = res.data,
              obj.type_name = '热销',
              obj.id = '0'
            hot.push(obj)
            // 菜品信息
            app.util.request({
              'url': 'entry/wxapp/DishesList',
              'cachetime': '0',
              data: { store_id: store_id, type: 1 },
              success: function (res) {
                console.log(res.data)
                var dishes = hot.concat(res.data)
                for (let i = 0; i < dishes.length; i++) {
                  for (let k = 0; k < dishes[i].good.length; k++) {
                    dishes[i].good[k].quantity = Number(dishes[i].good[k].quantity)
                  }
                }
                console.log(dishes)
                var indexheight = 0, dataheith = [];
                for (var i = 0; i < dishes.length; i++) {
                  indexheight += (dishes[i].good.length) * 105;
                  dataheith.push(indexheight);
                }
                console.log(dishes)
                that.setData({
                  cpjzz: false,
                  dataheith: dataheith,
                })
                app.util.request({
                  'url': 'entry/wxapp/MyCar',
                  'cachetime': '0',
                  data: {
                    store_id: store_id, user_id: user_id, type: 2
                  },
                  success: function (res) {
                    console.log(res)
                    var cart_list = res.data.res
                    for (let i = 0; i < cart_list.length; i++) {
                      for (let j = 0; j < dishes.length; j++) {
                        for (let k = 0; k < dishes[j].good.length; k++) {
                          if (cart_list[i].good_id == dishes[j].good[k].id) {
                            dishes[j].good[k].quantity = dishes[j].good[k].quantity + Number(cart_list[i].num)
                          }
                        }
                      }
                    }
                    console.log(dishes)
                    that.setData({
                      cart_list: res.data,
                      dishes: dishes,
                      isloading: false,
                    })
                    that.subText()
                  }
                })
              },
            })
          }
          else {
            // 菜品信息
            app.util.request({
              'url': 'entry/wxapp/DishesList',
              'cachetime': '0',
              data: { store_id: store_id, type: 1 },
              success: function (res) {
                console.log(res.data)
                var dishes = res.data
                for (let i = 0; i < dishes.length; i++) {
                  for (let k = 0; k < dishes[i].good.length; k++) {
                    dishes[i].good[k].quantity = Number(dishes[i].good[k].quantity)
                  }
                }
                console.log(dishes)
                var indexheight = 0, dataheith = [];
                for (var i = 0; i < dishes.length; i++) {
                  indexheight += (dishes[i].good.length) * 105;
                  dataheith.push(indexheight);
                }
                console.log(dishes)
                that.setData({
                  cpjzz: false,
                  dataheith: dataheith,
                })
                app.util.request({
                  'url': 'entry/wxapp/MyCar',
                  'cachetime': '0',
                  data: {
                    store_id: store_id, user_id: user_id, type: 2
                  },
                  success: function (res) {
                    console.log(res)
                    var cart_list = res.data.res
                    for (let i = 0; i < cart_list.length; i++) {
                      for (let j = 0; j < dishes.length; j++) {
                        for (let k = 0; k < dishes[j].good.length; k++) {
                          if (cart_list[i].good_id == dishes[j].good[k].id) {
                            dishes[j].good[k].quantity = dishes[j].good[k].quantity + Number(cart_list[i].num)
                          }
                        }
                      }
                    }
                    console.log(dishes)
                    that.setData({
                      cart_list: res.data,
                      dishes: dishes,
                      isloading: false,
                    })
                    that.subText()
                  }
                })
              },
            })
            // 菜品信息
            // app.util.request({
            //   'url': 'entry/wxapp/DishesType',
            //   'cachetime': '0',
            //   data: { store_id: store_id, type: 1 },
            //   success: function (res) {
            //     // for (var i = 0; i < res.data.length; i++) {
            //     //   for (var j = 0; j < res.data[i].goods.length; j++) {
            //     //     res.data[i].goods[j].xs_num = Number(res.data[i].goods[j].xs_num)
            //     //     res.data[i].goods[j].sit_ys_num = Number(res.data[i].goods[j].sit_ys_num)
            //     //   }
            //     // }
            //     console.log(res.data)
            //     let dishes = res.data;
            //     //Dishes
            //     app.util.request({
            //       'url': 'entry/wxapp/Dishes',
            //       'cachetime': '0',
            //       data: { type_id: dishes[0].id, type: 1, },
            //       success: function (res) {
            //         console.log(res.data)
            //         for (let i = 0; i < res.data.length; i++) {
            //           res.data[i].quantity = Number(res.data[i].quantity)
            //         }
            //         dishes[0].good = res.data
            //         that.setData({
            //           cpjzz: false,
            //         })
            //         app.util.request({
            //           'url': 'entry/wxapp/MyCar',
            //           'cachetime': '0',
            //           data: {
            //             store_id: store_id, user_id: user_id, type: 2
            //           },
            //           success: function (res) {
            //             console.log(res)
            //             var cart_list = res.data.res
            //             for (let i = 0; i < cart_list.length; i++) {
            //               for (let j = 0; j < dishes.length; j++) {
            //                 for (let k = 0; k < dishes[j].good.length; k++) {
            //                   if (cart_list[i].good_id == dishes[j].good[k].id) {
            //                     dishes[j].good[k].quantity = dishes[j].good[k].quantity + Number(cart_list[i].num)
            //                   }
            //                 }
            //               }
            //             }
            //             console.log(dishes)
            //             that.setData({
            //               cart_list: res.data,
            //               dishes: dishes,
            //               isloading: false,
            //             })
            //             that.subText()
            //           }
            //         })
            //       },
            //     })
            //   },
            // })
          }
        },
      })
    })
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        that.setData({
          height: res.windowHeight - 145,
        })
      }
    })
  },
  maketel: function (t) {
    var a = this.data.store.tel;
    wx.makePhoneCall({
      phoneNumber: a,
    })
  },
  location: function () {
    var jwd = this.data.store.coordinates.split(','), t = this.data.store;
    console.log(jwd)
    wx.openLocation({
      latitude: parseFloat(jwd[0]),
      longitude: parseFloat(jwd[1]),
      address: t.address,
      name: t.name
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

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },
  pjmore: function () {
    console.log('上拉加载', this.data.pagenum)
    var that = this;
    if (!this.data.mygd && this.data.jzgd && !this.data.isjzz) {
      this.setData({
        jzgd: false
      })
      this.getstorelist();
    }
    else {
      // wx.showToast({
      //   title: '没有更多了',
      //   icon: 'loading',
      //   duration: 1000,
      // })
    }
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {
  //   var that = this;
  //   return {
  //     title: that.data.store.name,
  //     path: '/zh_cjdianc/pages/takeout/takeoutindex?storeid=' + that.data.store_id,
  //     success: function (res) {
  //       // 转发成功
  //     },
  //     fail: function (res) {
  //       // 转发失败
  //     }
  //   }
  // }
})