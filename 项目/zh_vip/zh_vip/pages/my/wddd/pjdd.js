var app = getApp();
var siteinfo = require('../../../../siteinfo.js');
Page({
  data: {
    goods_list: [],
    images: [],
  },
  onLoad: function (i) {
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
    // o.pageOnLoad(this);
    var a = this, userinfo = wx.getStorageSync('UserData');
    console.log(i, userinfo)
    a.setData({
      order_id: i.oid
    }),
      wx.showLoading({
        title: "正在加载",
        mask: !0
      }),
      app.util.request({
        'url': 'entry/wxapp/MallOrderInfo',
        data: {
          order_id: i.oid
        },
        success: function (res) {
          console.log(res)
          for (let i = 0; i < res.data.good.length; i++) {
            res.data.good[i].pic_list = [];
            res.data.good[i].uploaded_pic_list=[];
          }
          a.setData({
            goods_list: res.data.good,
            orderinfo: res.data,
          })
        }
      })
  },
  setScore: function (t) {
    var o = this,
      i = t.currentTarget.dataset.index,
      a = t.currentTarget.dataset.score,
      e = o.data.goods_list;
    e[i].score = a,
      o.setData({
        goods_list: e
      })
  },
  contentInput: function (t) {
    var o = this,
      i = t.currentTarget.dataset.index;
    o.data.goods_list[i].content = t.detail.value,
      o.setData({
        goods_list: o.data.goods_list
      })
  },
  chooseImage: function (t) {
    var o = this,
      i = t.currentTarget.dataset.index,
      a = o.data.goods_list,
      e = a[i].pic_list.length;
    console.log(i, a)
    wx.chooseImage({
      count: 3 - e,
      success: function (t) {
        a[i].pic_list = a[i].pic_list.concat(t.tempFilePaths),
          o.setData({
            goods_list: a
          })
        console.log(a)
      }
    })
  },
  deleteImage: function (t) {
    var o = this,
      i = t.currentTarget.dataset.index,
      a = t.currentTarget.dataset.picIndex,
      e = o.data.goods_list;
    console.log(i, a)
    e[i].pic_list.splice(a, 1),
      o.setData({
        goods_list: e
      })
    console.log(e)
  },
  commentSubmit: function (i) {
    // function e() {
    //   o.request({
    //     url: t.order.comment,
    //     method: "post",
    //     data: {
    //       order_id: s.data.order_id,
    //       goods_list: JSON.stringify(n)
    //     },
    //     success: function (t) {
    //       wx.hideLoading(),
    //         0 == t.code && wx.showModal({
    //           title: "提示",
    //           content: t.msg,
    //           showCancel: !1,
    //           success: function (t) {
    //             t.confirm && wx.redirectTo({
    //               url: "/pages/order/order?status=3"
    //             })
    //           }
    //         }),
    //         1 == t.code && wx.showToast({
    //           title: t.msg,
    //           image: "/images/icon-warning.png"
    //         })
    //     }
    //   })
    // }
    var s = this;
    wx.showLoading({
      title: "正在提交",
      mask: !0
    });
    var n = s.data.goods_list;
    console.log(n)
    for (var i in n) if (!n[i].score) {
      wx.showModal({
        title: '提示',
        content: '有商品未置评！',
      })
      return
    }
    a(0)
    function a(o) {
      if (o == n.length) return e();
      var i = 0;
      if (!n[o].pic_list.length || 0 == n[o].pic_list.length) return a(o + 1);
      for (var s in n[o].pic_list) !
        function (e) {
          wx.uploadFile({
            url: siteinfo.siteroot + '?i=' + siteinfo.uniacid + '&c=entry&a=wxapp&do=upload&m=zh_vip',
            name: "upfile",
            filePath: n[o].pic_list[e],
            success: function (resp) {
              console.log('上传图片返回值',resp)
              if (resp.data != '') {
                n[o].uploaded_pic_list[e] = resp.data
              }
              // if (console.log(t), t.data) {
              //   var s = JSON.parse(t.data);
              //   0 == s.code && (n[o].uploaded_pic_list[e] = s.data.url)
              // }
              if (++i == n[o].pic_list.length) return a(o + 1)
            }
          })
        }(s)
    }
    function e() {
      var user_id = wx.getStorageSync('UserData').id, user_name = wx.getStorageSync('UserData').nickname, user_img = wx.getStorageSync('UserData').img, store_id = s.data.orderinfo.order.store_id, oid = s.data.orderinfo.order.id;
      console.log('上传图片完毕', n, user_id,user_img,user_name,store_id)
      var list = [], cart_list = n;
      cart_list.map(function (item) {
        if (item.content==null){
          item.content=''
        }
          var obj = {};
          obj.user_id = user_id;
          obj.user_img = user_img;
          obj.user_name = user_name;
          obj.store_id = store_id;
          obj.good_id = item.good_id;
          obj.spec = item.spec;
          obj.score = item.score;
          obj.content = item.content;
          obj.img = item.uploaded_pic_list.toString();
          list.push(obj);
      })
      console.log(list)
      //Assess
      app.util.request({
        'url': 'entry/wxapp/Assess',
        'cachetime': '0',
        data: { sz: list, order_id: oid},
        success: function (res) {
          wx.showToast({
            title: '评价成功',
            icon: 'success',
            duration: 1000,
          })
          setTimeout(function () {
            wx.redirectTo({
              url: 'order?status=4',
            })
          }, 1000)
          console.log('Assess', res.data)
        }
      });
    }
  },
  onReady: function () { },
  onShow: function () { },
  onHide: function () { },
  onUnload: function () { },
  onPullDownRefresh: function () { },
  onReachBottom: function () { }
});