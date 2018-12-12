var app = getApp();
var count = 0, imgArray = [];
var siteinfo = require('../../../siteinfo.js');
Page({
  data: {
    stars: [0, 1, 2, 3, 4],
    normalSrc: '../../img/no-star.png',
    selectedSrc: '../../img/full-star.png',
    key: 0,
    count: 0,
    images: [],
    sctp: false,
  },
  sctp: function () {
    this.setData({
      sctp: true
    })
  },
  //点击左边,半颗星
  selectLeft: function (e) {
    console.log('111111');
    var key = e.currentTarget.dataset.key
    if (this.data.key == 1 && e.currentTarget.dataset.key == 1) {
      //只有一颗星的时候,再次点击,变为0颗
      key = 0;
    }
    count = key
    this.setData({
      key: key,
      count: count
    })
  },
  onLoad: function (i) {
    var that = this;
    app.setNavigationBarColor(this);
    // o.pageOnLoad(this);
    var a = this, userinfo = wx.getStorageSync('users');
    console.log(i, userinfo)
    a.setData({
      order_id: i.oid
    }),
      wx.showLoading({
        title: "正在加载",
        mask: !0
      }),
      app.util.request({
        'url': 'entry/wxapp/OrderInfo',
        data: {
          order_id: i.oid
        },
        success: function (res) {
          console.log(res)
          // for (let i = 0; i < res.data.good.length; i++) {
          //   res.data.good[i].pic_list = [];
          //   res.data.good[i].uploaded_pic_list=[];
          // }
          a.setData({
            good: res.data.good,
            orderinfo: res.data,
          })
        }
      })
  },
  contentInput: function (t) {
    var o = this;
    o.setData({
      pjnr: t.detail.value
    })
  },
  chooseImage: function (t) {
    var o = this,
      a = this.data.images,
      e = a.length;
    console.log(a)
    wx.chooseImage({
      count: 3 - e,
      success: function (t) {
        a = a.concat(t.tempFilePaths),
          o.setData({
            images: a
          })
        console.log(a)
      }
    })
  },
  deleteImage: function (t) {
    var o = this,
      i = t.currentTarget.dataset.index,
      e = this.data.images;
    console.log(i)
    e.splice(i, 1),
      o.setData({
        images: e
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
    var s = this, user_id = wx.getStorageSync('users').id, store_id = this.data.orderinfo.store.id, oid = this.data.orderinfo.order.id, pjnr = this.data.pjnr, count = this.data.count, images = this.data.images;
    console.log(oid, user_id, store_id, pjnr, count, images)
    if (count == 0) {
      wx.showModal({
        title: '提示',
        content: '请选择评分',
      })
    }
    else if (pjnr == null || pjnr == '') {
      wx.showModal({
        title: '提示',
        content: '请输入评价内容',
      })
    }
    else {
      wx.showLoading({
        title: "正在提交",
        mask: !0
      });
      if (images.length == 0) {
        e()
      }
      else {
        uploadimg({
          url: siteinfo.siteroot + '?i=' + siteinfo.uniacid + '&c=entry&a=wxapp&do=upload&m=zh_cjdianc',
          path: images
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
              imgArray.push(resp.data)
              console.log(i);
              console.log('图片数组', imgArray)
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
        console.log('请求接口', imgArray, imgArray.toString())
        //Assess
        app.util.request({
          'url': 'entry/wxapp/Assess',
          'cachetime': '0',
          data: { store_id: store_id, user_id: user_id, order_id: oid, stars: count, content: pjnr, img: imgArray.toString() },
          success: function (res) {
            if (res.data == '1') {
              wx.showModal({
                title: '提示',
                content: '提交成功',
              })
              setTimeout(function () {
                wx.redirectTo({
                  url: 'order?status=4',
                })
              }, 1000)
            }
            console.log('Assess', res.data)
          }
        });
      }
    }
  },
  onReady: function () { },
  onShow: function () { },
  onHide: function () { },
  onUnload: function () { },
  onPullDownRefresh: function () { },
  onReachBottom: function () { }
});