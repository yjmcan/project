// zh_dianc/pages/takeout/takeoutindex.js
var app = getApp()
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isloading: false,
    store_id: '1',
    navbar: ['外卖', '评价', '详情'],
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
  },
  //
  cartaddformSubmit: function (e) {
    console.log('formid', e.detail.formId)
    app.util.request({
      'url': 'entry/wxapp/AddFormId',
      'cachetime': '0',
      data: { user_id: wx.getStorageSync('UserData').id, form_id: e.detail.formId },
      success: function (res) {
        console.log(res.data)
      },
    })
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
          if (res.data[i].type != '2') {
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
          wx.showToast({
            title: '领取成功',
          })
          setTimeout(() => {
            that.Coupons()
          }, 1000)
        }
      }
    })
  },
  submit: function () {
    var that = this, cart_list = this.data.cart_list;
    console.log(cart_list)
    wx.setStorageSync('cart_list', cart_list)
    if (0 == cart_list.length) return !0;
    wx.navigateTo({
      url: "../gwc/tjdd"
    })
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
    var itemIndex = e.currentTarget.dataset.itemIndex, parentindex = e.currentTarget.dataset.parentindex, dishes = this.data.dishes, cart_list = this.data.cart_list, goodid = e.currentTarget.dataset.goodid, that = this, spinfo = this.data.dishes[parentindex].good[itemIndex], user_id = wx.getStorageSync('UserData').id, store_id = this.data.store_id;
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
    var itemIndex = e.currentTarget.dataset.itemIndex, parentindex = e.currentTarget.dataset.parentindex, dishes = this.data.dishes, cart_list = this.data.cart_list, goodid = e.currentTarget.dataset.goodid, that = this, spinfo = this.data.dishes[parentindex].good[itemIndex], user_id = wx.getStorageSync('UserData').id, store_id = this.data.store_id;
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
    var itemIndex = e.currentTarget.dataset.itemIndex, parentindex = e.currentTarget.dataset.parentindex, dishes = this.data.dishes, goodid = e.currentTarget.dataset.goodid, that = this, spinfo = this.data.dishes[parentindex].good[itemIndex], user_id = wx.getStorageSync('UserData').id, store_id = this.data.store_id;
    console.log(itemIndex, parentindex, goodid, spinfo, user_id, store_id)
    wx.showLoading({
      title: "正在加载",
      mask: !0
    }), app.util.request({
      'url': 'entry/wxapp/AddCar',
      'cachetime': '0',
      data: {
        money: spinfo.money, good_id: goodid, store_id: store_id, user_id: user_id, num: 1, spec: '', combination_id: ''
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
    var itemIndex = this.data.itemIndex, parentindex = this.data.parentindex, dishes = this.data.dishes, that = this, gginfo = this.data.gginfo, user_id = wx.getStorageSync('UserData').id, r = this.data.gg, store_id = this.data.store_id;
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
        money: gginfo.money, good_id: gginfo.good_id, store_id: store_id, user_id: user_id, num: 1, spec: c.toString(), combination_id: gginfo.id,
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
    var dishes = this.data.dishes, that = this, user_id = wx.getStorageSync('UserData').id, store_id = this.data.store_id;
    console.log(dishes, user_id, store_id)
    app.util.request({
      'url': 'entry/wxapp/MyCar',
      'cachetime': '0',
      data: {
        store_id: store_id, user_id: user_id
      },
      success: function (res) {
        console.log(res)
        console.log(dishes)
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].combination_id == '0') {
            res.data[i].number = res.data[i].inventory
          }
          res.data[i].num = Number(res.data[i].num)
          res.data[i].number = Number(res.data[i].number)
          res.data[i].money = Number(res.data[i].money)
        }
        that.setData({
          cart_list: res.data,
        })
        that.jstotalPrice()
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
  selectMenu: function (e) {
    var dishes = this.data.dishes, that = this, user_id = wx.getStorageSync('UserData').id, store_id = that.data.store_id, typeindex = e.currentTarget.dataset.itemIndex;
    console.log(dishes, user_id, store_id, typeindex)
    this.setData({
      catalogSelect: e.currentTarget.dataset.itemIndex,
    })
    if (dishes[e.currentTarget.dataset.itemIndex].good.length == 0) {
      var typeid = dishes[e.currentTarget.dataset.itemIndex].id;
      console.log('还没加载过数据', typeid)
      that.setData({
        cpjzz: true,
      })
      app.util.request({
        'url': 'entry/wxapp/Dishes',
        'cachetime': '0',
        data: { type_id: typeid, type: 2, },
        success: function (res) {
          console.log(res.data)
          for (let i = 0; i < res.data.length; i++) {
            res.data[i].quantity = Number(res.data[i].quantity)
          }
          dishes[e.currentTarget.dataset.itemIndex].good = res.data
          that.setData({
            cpjzz: false,
          })
          app.util.request({
            'url': 'entry/wxapp/MyCar',
            'cachetime': '0',
            data: {
              store_id: store_id, user_id: user_id
            },
            success: function (res) {
              console.log(res)
              var cart_list = res.data
              for (let i = 0; i < cart_list.length; i++) {
                for (let k = 0; k < dishes[typeindex].good.length; k++) {
                  if (cart_list[i].good_id == dishes[typeindex].good[k].id) {
                    dishes[typeindex].good[k].quantity = dishes[typeindex].good[k].quantity + Number(cart_list[i].num)
                  }
                }
              }
              console.log(dishes)
              that.setData({
                dishes: dishes,
              })
            }
          })
        },
      })
    }
    else {
      console.log('已有缓存数据')
    }
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
    var that = this, dishes = this.data.dishes, user_id = wx.getStorageSync('UserData').id, store_id = that.data.store_id;
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
              'url': 'entry/wxapp/DelCar2',
              'cachetime': '0',
              data: {
                user_id: user_id, store_id: store_id
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
  jstotalPrice:function(){
    var t = this,
      a = 0,b=0,
      c = t.data.cart_list;
    for (var e in c) (a += c[e].money * c[e].num,b += c[e].num);
    t.setData({
      total_price: a.toFixed(2),
      total_num:b,
    })
    var totalPrice = parseFloat(this.data.total_price), subtext;
    console.log(totalPrice)
    if (totalPrice <= 0) {
      subtext = '未选购商品';
    } else {
      console.log(totalPrice)
      subtext = '去结算';
    }
    this.setData({
      subtext: subtext,
    })
  },
  //tjdd
  subText() {
    console.log(this.data)
    var totalPrice = parseFloat(this.data.totalPrice), subtext;
    console.log(totalPrice)
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
    this.setData({
      subtext: subtext,
    })
  },
  tzweb: function (e) {
    console.log(e.currentTarget.dataset.index, this.data.lblist)
    var item = this.data.lblist[e.currentTarget.dataset.index]
    console.log(item)
    if (item.item == '1') {
      wx.navigateTo({
        url: item.src,
      })
    }
    if (item.item == '2') {
      wx.setStorageSync('vr', item.src2)
      wx.navigateTo({
        url: '../car/car'
      })
    }
    if (item.item == '3') {
      wx.navigateToMiniProgram({
        appId: item.appid,
        success(res) {
          // 打开成功
          console.log(res)
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.pageOnLoad(this);
    console.log('options', options)
    //
    // this.setData({
    //   params: { store_id: mdid, type: '全部', img: '' }
    // })
    //this.getstorelist()
    //
    var that = this;
    var time = util.formatTime(new Date());
    var current_time = time.slice(11, 16)
    var xtxx = wx.getStorageSync('xtxx')
    var url = getApp().imgurl;
    console.log(xtxx)
    this.setData({
      xtxx: xtxx,
      url: url,
      color: xtxx.link_color,
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: xtxx.link_color,
    })
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        that.setData({
          height: res.windowHeight - 145,
        })
      }
    })
    app.util.request({
      'url': 'entry/wxapp/StoreAd',
      'cachetime': '0',
      data: { store_id: wx.getStorageSync('mdid') },
      success: function (res) {
        console.log(res.data)
        that.setData({
          lblist: res.data
        })
      },
    })
  },
  reLoad:function(){
    var  mdid = wx.getStorageSync('mdid')
    console.log(mdid)
    this.setData({
      store_id: mdid
    })
    var that = this, store_id = that.data.store_id;
    app.util.request({
      'url': 'entry/wxapp/StoreInfo',
      'cachetime': '0',
      data: { id: store_id, type: 2 },
      success: function (res) {
        console.log(res.data)
        // for (let i = 0; i < res.data.store.environment.length; i++) {
        //   res.data.store.environment[i] = res1.data + res.data.store.environment[i]
        // }
        // for (let i = 0; i < res.data.store.yyzz.length; i++) {
        //   res.data.store.yyzz[i] = res1.data + res.data.store.yyzz[i]
        // }
        that.setData({
          store: res.data,
        })
      },
    })
    app.getUserInfo(function (userinfo) {
      console.log(userinfo)
      var user_id = wx.getStorageSync('UserData').id, store_id = that.data.store_id;
      console.log('uid', user_id, store_id)
      that.Coupons();
      // 菜品信息
      app.util.request({
        'url': 'entry/wxapp/DishesType',
        'cachetime': '0',
        data: { store_id: store_id, type: 2 },
        success: function (res) {
          // for (var i = 0; i < res.data.length; i++) {
          //   for (var j = 0; j < res.data[i].goods.length; j++) {
          //     res.data[i].goods[j].xs_num = Number(res.data[i].goods[j].xs_num)
          //     res.data[i].goods[j].sit_ys_num = Number(res.data[i].goods[j].sit_ys_num)
          //   }
          // }
          console.log(res.data)
          let dishes = res.data;
          if(dishes.length==0){
            that.setData({
              nosp:true,
              isloading: false,
            }) 
          }
          else{
          //Dishes
          app.util.request({
            'url': 'entry/wxapp/Dishes',
            'cachetime': '0',
            data: { type_id: dishes[0].id, type: 2, },
            success: function (res) {
              console.log(res.data)
              for (let i = 0; i < res.data.length; i++) {
                res.data[i].quantity = Number(res.data[i].quantity)
              }
              dishes[0].good = res.data
              that.setData({
                cpjzz: false,
              })
              app.util.request({
                'url': 'entry/wxapp/MyCar',
                'cachetime': '0',
                data: {
                  store_id: store_id, user_id: user_id
                },
                success: function (res) {
                  console.log(res)
                  var cart_list = res.data
                  for (let i = 0; i < cart_list.length; i++) {
                    for (let j = 0; j < dishes.length; j++) {
                      for (let k = 0; k < dishes[j].good.length; k++) {
                        if (cart_list[i].good_id == dishes[j].good[k].id) {
                          dishes[j].good[k].quantity = dishes[j].good[k].quantity + Number(cart_list[i].num)
                        }
                      }
                    }
                  }
                  for (let i = 0; i < res.data.length; i++) {
                    if (res.data[i].combination_id == '0') {
                      res.data[i].number = res.data[i].inventory
                    }
                    res.data[i].num = Number(res.data[i].num)
                    res.data[i].number = Number(res.data[i].number)
                    res.data[i].money = Number(res.data[i].money)
                  }
                  console.log(dishes)
                  that.setData({
                    cart_list: res.data,
                    dishes: dishes,
                    nosp: false,
                    isloading: false,
                  })
                  that.jstotalPrice()
                }
              })
            },
          })
          }
        },
      })
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
    this.reLoad()
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
  onShareAppMessage: function () {
    var that = this;
    return {
      title: that.data.store.name,
      path: '/zh_cjdianc/pages/takeout/takeoutindex?storeid=' + that.data.store_id,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})