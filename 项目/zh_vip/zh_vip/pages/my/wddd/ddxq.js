var app = getApp();
Page({
  data: {
    order: null,
    getGoodsTotalPrice: function () {
      return this.data.order.total_price
    }
  },
  onLoad: function (p) {
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
      wx.showLoading({
        title: "正在加载"
      }),
        app.util.request({
          'url': 'entry/wxapp/MallOrderInfo',
          data: {
            order_id: p.oid
          },
          success: function (res) {
            console.log(res)
            var spnum=0;
            for(let i=0;i<res.data.good.length;i++){
              spnum += Number(res.data.good[i].number)
            }
            res.data.order.spnum=spnum;
            that.setData({
              order: res.data.order,
              good:res.data.good,
            })
            //Store 
            app.util.request({
              'url': 'entry/wxapp/StoreInfo',
              'cachetime': '0',
              data: { id: res.data.order.store_id },
              success: function (res) {
                console.log('门店信息', res.data)
                that.setData({
                  mdinfo: res.data,
                })
              }
            });
        },
        complete: function () {
          wx.hideLoading()
        }
      })
  },
  copyText: function (t) {
    var a = t.currentTarget.dataset.text;
    wx.setClipboardData({
      data: a,
      success: function () {
        wx.showToast({
          title: "已复制"
        })
      }
    })
  },
  location: function () {
    var jwd = this.data.mdinfo.coordinates.split(','), t = this.data.mdinfo;
    console.log(jwd)
    wx.openLocation({
      latitude: parseFloat(jwd[0]),
      longitude: parseFloat(jwd[1]),
      address: t.address,
      name: t.name
    })
  }
});