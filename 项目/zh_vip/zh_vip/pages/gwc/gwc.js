var app = getApp();
Page({
  data: {
    total_price: 0,
    cart_check_all: !1,
    cart_list: [],
    number: 1
  },
  hdsy:function(){
    wx.redirectTo({
      url: '../index/index',
    })
  },
  onLoad: function (t) {
    app.pageOnLoad(this);
    var that = this;
    var xtxx = wx.getStorageSync('xtxx')
    var url = getApp().imgurl;
    console.log(xtxx)
    this.setData({
      xtxx: xtxx,
      url: url,
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: xtxx.link_color,
    })
  },
  numberSub: function (e) {
    var t = this, cart_id = e.currentTarget.dataset.id, cart_list = this.data.cart_list;
    console.log(cart_id, cart_list)
    for (let i = 0; i < cart_list.length; i++) {
      if (cart_list[i].id == cart_id) {
        if (cart_list[i].num <= 1) {
          return
        }
        cart_list[i].num--
      }
    }
    t.setData({
      cart_list: cart_list
    })
    t.updateTotalPrice()
  },
  numberAdd: function (e) {
    var t = this, cart_id = e.currentTarget.dataset.id, cart_list = this.data.cart_list;
    console.log(cart_id, cart_list)
    for (let i = 0; i < cart_list.length; i++) {
      if (cart_list[i].id == cart_id) {
        if (cart_list[i].num >= cart_list[i].number) {
          wx.showToast({
            title: '库存不足,无法继续添加',
            icon: 'none',
          })
          return
        }
        cart_list[i].num++
      }
    }
    t.setData({
      cart_list: cart_list
    })
    t.updateTotalPrice()
  },
  numberBlur: function (e) {
    console.log(e)
    var t = this, value = Number(e.detail.value), cart_id = e.target.dataset.id, cart_list = this.data.cart_list;
    console.log(value, cart_id, cart_list)
    for (let i = 0; i < cart_list.length; i++) {
      if (cart_list[i].id == cart_id) {
        if (value >= cart_list[i].number) {
          value = cart_list[i].number
        }
        if (value <= 1) {
          value = 1
        }
        cart_list[i].num = value
      }
    }
    t.setData({
      cart_list: cart_list
    })
    t.updateTotalPrice()
  },
  onReady: function () { },
  onShow: function () { 
    this.reLoad()
  },
  reLoad:function(){
    this.setData({
      cart_check_all: !1,
      show_cart_edit: !1,
      total_price:0,
    })
    var that = this, store_id = wx.getStorageSync('mdid'), user_id = wx.getStorageSync('UserData').id;
    app.util.request({
      'url': 'entry/wxapp/MyCar',
      'cachetime': '0',
      data: {
        store_id: store_id, user_id: user_id
      },
      success: function (res) {
        console.log(res)
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
      }
    })
    //Store 
    app.util.request({
      'url': 'entry/wxapp/StoreInfo',
      'cachetime': '0',
      data: { id: store_id },
      success: function (res) {
        console.log('门店信息', res.data)
        that.setData({
          mdinfo: res.data,
        })
      }
    });
  },
  cartCheck: function (t) {
    var a = this,
      c = t.currentTarget.dataset.index,
      e = a.data.cart_list, isall = !0;
    e[c].checked ? e[c].checked = !1 : e[c].checked = !0,
      a.setData({
        cart_list: e
      }),
      a.updateTotalPrice()
    for (var s in e) if (!e[s].checked) {
      isall = !1;
      break
    }
    a.setData({
      cart_check_all: isall
    })
  },
  cartCheckAll: function () {
    var t = this,
      a = t.data.cart_list,
      c = !1;
    c = !t.data.cart_check_all;
    for (var e in a) a[e].disabled && !t.data.show_cart_edit || (a[e].checked = c);
    t.setData({
      cart_check_all: c,
      cart_list: a
    }),
      t.updateTotalPrice()
  },
  updateTotalPrice: function () {
    var t = this,
      a = 0,
      c = t.data.cart_list;
    for (var e in c) c[e].checked && (a += c[e].money * c[e].num);
    t.setData({
      total_price: a.toFixed(2)
    })
  },
  cartSubmit: function () {
    var t = this.data.cart_list,
      a = [];
    for (var c in t) t[c].checked && a.push(t[c]);
    console.log(a)
    wx.setStorageSync('cart_list', a)
    if (0 == a.length) return !0;
    wx.navigateTo({
      url: "tjdd"
    })
  },
  cartEdit: function () {
    var t = this,
      a = t.data.cart_list;
    for (var c in a) a[c].checked = !1;
    t.setData({
      cart_list: a,
      show_cart_edit: !0,
      cart_check_all: !1
    }),
      t.updateTotalPrice()
  },
  cartDone: function () {
    var t = this,
      a = t.data.cart_list;
    for (var c in a) a[c].checked = !1;
    t.setData({
      cart_list: a,
      show_cart_edit: !1,
      cart_check_all: !1
    }),
      t.updateTotalPrice()
  },
  cartDelete: function () {
    var c = this,
      e = c.data.cart_list,
      idarr = [];
      console.log(e)
      for (var r in e) e[r].checked && idarr.push(Number(e[r].id));
    console.log(idarr.toString())
    if (0 == idarr.length) return !0;
    wx.showModal({
      title: "提示",
      content: "确认删除" + idarr.length + "项内容？",
      success: function (e) {
        if (e.cancel) return !0;
        wx.showLoading({
          title: "正在删除",
          mask: !0
        }),
          app.util.request({
          'url': 'entry/wxapp/DelCar',
            'cachetime': '0',
            data: {
              id:idarr.toString()
            },
            success: function (res) {
              console.log(res)
              wx.hideLoading()
              if(res.data=='1'){
                wx.showToast({
                  title: '删除成功',
                })
                c.reLoad();
              }
              else{
                wx.showModal({
                  title: '提示',
                  content: res.data,
                })
              }
            }
          })
      }
    })
  }
});