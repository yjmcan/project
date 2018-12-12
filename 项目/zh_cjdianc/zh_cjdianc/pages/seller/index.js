// zh_dianc/pages/seller/index.js
var app = getApp()
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: 1,
    navbar: [],
    nav: [
      {
        bindtap: 'takeout',
        img: '../../img/seller/two.png',
        name: '外卖',
        active: false,
        smwz:'快速送达',
      },
      {
        bindtap: 'smdc',
        img: '../../img/seller/six.png',
        name: '扫码点餐',
        active: false,
        smwz: '扫一扫轻松下单'
      },
      {
        bindtap: 'plan',
        img: '../../img/seller/one.png',
        name: '预约',
        active: false,
        smwz: '提前预定'
      },
      {
        bindtap: 'sy',
        img: '../../img/seller/four.png',
        name: '收银',
        active: false,
        smwz: '当面收款'
      },
      {
        bindtap: 'qg',
        img: '../../img/seller/yysj.png',
        name: '抢购',
        active: false,
        smwz: '限时抢购'
      },
      {
        bindtap: 'pt',
        img: '../../img/seller/zdjd.png',
        name: '拼团',
        active: false,
        smwz: '拼团活动'
      },
      {
        bindtap: 'pdqh',
        img: '../../img/seller/eight.png',
        name: '排队取号',
        active: false,
      },
      {
        bindtap: 'cj',
        img: '../../img/seller/three.png',
        name: '存酒',
        active: false,
      },
      {
        bindtap: 'hjfwy',
        img: '../../img/seller/five.png',
        name: '呼叫服务员',
        active: false,
      },
      {
        bindtap: 'yhq',
        img: '../../img/seller/seven.png',
        name: '优惠券',
        active: false,
      },
    ],
    selectedindex: 0,
    isytpj:false,
    pagenum: 1,
    storelist: [],
    bfstorelist: [],
    mygd: false,
    jzgd: true,
    arr:[{
      logo: '/zh_cjdianc/img/tabindexf.png', logo2: '/zh_cjdianc/img/tabindex.png', title: '首页', title_color: '#34aaff', title_color2: '#888', url: "/zh_cjdianc/pages/index/index"
    }, {
      logo: '/zh_cjdianc/img/tabddf.png', logo2: '/zh_cjdianc/img/tabdd.png', title: '订单', title_color: '#34aaff', title_color2: '#888', url: "/zh_cjdianc/pages/wddd/order"
    }, {
      logo: '/zh_cjdianc/img/tabmyf.png', logo2: '/zh_cjdianc/img/tabmy.png', title: '我的', title_color: '#34aaff', title_color2: '#888', url: "/zh_cjdianc/pages/my/index"
    }],
    bjyylb: 'laba',
    opendh: false,
    mdoaltoggle: true,
  },
  closehbtoggle: function () {
    this.setData({
      hbtoggle: false,
    })
  },
  previewImage: function (e) {
    var qrcode = this.data.store_info.qrcode
    console.log(qrcode)
    wx.previewImage({
      current: qrcode, // 当前显示图片的http链接
      urls: [qrcode] // 需要预览的图片http链接列表
    })
  },
  sjmp: function () {
    this.setData({
      mdoaltoggle: false,
      opendh: false,
    })
  },
  mdoalclose: function () {
    this.setData({
      mdoaltoggle: true,
    })
  },
  opennav: function () {
    this.setData({
      opendh: !this.data.opendh
    })
  },
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
  ytpj:function(){
    var that = this, params = this.data.params;
    if (that.data.isytpj){
      params.img = ''
    }
    else{
      params.img = '1'
    }
    this.setData({
      pagenum: 1,
      storelist: [],
      bfstorelist: [],
      mygd: false,
      jzgd: true,
      isytpj:!that.data.isytpj,
      params: params
    })
    this.getstorelist()
  },
  selectednavbar: function (e) {
    console.log(e)
    var that = this, params = this.data.params;
    if (e.currentTarget.dataset.index==0){
      params.type='全部'
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
      selectedindex: e.currentTarget.dataset.index,
      params: params
    })
    this.getstorelist()
  },
  pdqh: function () {
    var that = this;
    wx.navigateTo({
      url: 'getnum?storeid=' + that.data.store_info.id,
    })
  },
  sy: function () {
    var that = this;
    wx.navigateTo({
      url: 'fukuan?storeid=' + that.data.store_info.id,
    })
  },
  qg: function () {
    var that = this;
    wx.navigateTo({
      url: '../xsqg/xsqg?storeid=' + that.data.store_info.id,
    })
  },
  pt: function (e) {
    var that = this;
    wx.navigateTo({
      url: '../collage/list?store_id=' + that.data.store_info.id + '&store_logo=' + that.data.store_info.logo,
    })
  },
  smdc: function () {
    //var storeid = wx.getStorageSync('sjdsjid'), acountid = wx.getStorageSync('acountid');
    // var path = "zh_vip/pages/my/wdck/hx?scene=2"
    // var tnurl = '/' + path
    // wx.navigateTo({
    //   url: tnurl + '&storeid=' + storeid,
    // })
    wx.scanCode({
      success: (res) => {
        console.log(res)
        var path = res.path
        var tnurl = '/' + path
        wx.navigateTo({
          url: tnurl,
        })
      },
      fail: (res) => {
        console.log('扫码fail')
        // wx.showToast({
        //   title: '二维码错误',
        //   image:'../images/x.png'
        // })
      }
    })
  },
  takeout:function(){
    var that=this;
    wx.navigateTo({
      url: '/zh_cjdianc/pages/takeout/takeoutindex?storeid=' + that.data.store_info.id,
    })
  },
  plan: function () {
    var that = this;
    wx.navigateTo({
      url: '/zh_cjdianc/pages/reserve/reserve?storeid=' + that.data.store_info.id,
    })
  },
  qsy:function(e){
    var that = this;
    console.log(e.currentTarget.dataset.type)
    if (e.currentTarget.dataset.type!='2'){
      wx.navigateTo({
        url: '/zh_cjdianc/pages/takeout/takeoutindex?storeid=' + that.data.store_info.id,
      })
    }
  },
  ljlq:function(e){
    console.log(e.currentTarget.dataset.qid)
    var that = this, user_id = wx.getStorageSync('users').id;
    wx.showLoading({
      title: "正在加载",
      mask: !0
    }), app.util.request({
      'url': 'entry/wxapp/LqCoupons',
      'cachetime': '0',
      data: {
        user_id: user_id,   coupon_id:e.currentTarget.dataset.qid
      },
      success: function (res) {
        console.log(res)
        if (res.data == '1') {
          wx.showLoading({
            title: '领取成功',
            mask: !0,
          })
          setTimeout(()=>{
            that.Coupons()
          },1000)
        }
      }
    })
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
        var navbar = [{ name: '全部', num: res.data.all }, { name: '满意', num: res.data.ok }, { name: '不满意', num: res.data.no }]
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
          navbar: navbar,
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    app.setNavigationBarColor(this);
    var scene = decodeURIComponent(options.scene)
    console.log('scene', scene)
    if (scene != 'undefined') {
      getApp().sjid = scene
    }
    if (options.sjid != null) {
      console.log('转发获取到的sjid:', options.sjid)
      getApp().sjid = options.sjid
    }
    console.log(options, getApp().sjid)
    //
    this.setData({
      params: { store_id: getApp().sjid, type:'全部',img:''}
    })
    this.getstorelist()
    that.refresh(getApp().sjid)
    app.util.request({
      'url': 'entry/wxapp/system',
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        // if (res.data.model == '3') {
        //   wx.reLaunch({
        //     url: '../Liar/Liar',
        //   })
        // }
        var xtxx = res.data;
        getApp().xtxx1 = xtxx
        app.pageOnLoad(that);
        that.setData({
          xtxx: xtxx,
        })
      },
    })
    //
    app.util.request({
      'url': 'entry/wxapp/Llz',
      'cachetime': '0',
      data: { type: '5' },
      success: function (res) {
        console.log(res)
        that.setData({
          dbllz: res.data,
        })
      },
    })
    //
    app.util.request({
      'url': 'entry/wxapp/StoreAd',
      'cachetime': '0',
      data: { store_id: getApp().sjid},
      success: function (res) {
        console.log(res.data)
        that.setData({
          slider: res.data
        })
      },
    })
    //TjGoods
    app.util.request({
      'url': 'entry/wxapp/TjGoods',
      'cachetime': '0',
      data: { store_id: getApp().sjid },
      success: function (res) {
        console.log(res.data)
        for (let i = 0; i < res.data.length; i++) {
          res.data[i].discount = (Number(res.data[i].money) / Number(res.data[i].money2)*10).toFixed(1)
        }
        that.setData({
          tjcarr: res.data
        })
      },
    })
  },
  Coupons: function () {
    var that = this, user_id = wx.getStorageSync('users').id;
    app.util.request({
      'url': 'entry/wxapp/Coupons',
      'cachetime': '0',
      data: { store_id: getApp().sjid, user_id: user_id },
      success: function (res) {
        console.log(res.data)
        var wlqyhq = [];
        for (let i = 0; i < res.data.length; i++) {
          res.data[i].sysl = parseInt((Number(res.data[i].number) - Number(res.data[i].stock)) / Number(res.data[i].number) * 100)
        }
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].state == '2' && res.data[i].sysl < 100) {
            wlqyhq.push(res.data[i])
          }
        }
        that.setData({
          Coupons: res.data,
          wlqyhq: wlqyhq,
          hbtoggle: wlqyhq.length > 0 ? true : false,
        })
        console.log(wlqyhq)
      },
    })
  },
  jumps: function (e) {
    var that = this
    var id = e.currentTarget.dataset.id, name = e.currentTarget.dataset.name;
    var appid = e.currentTarget.dataset.appid
    var src = e.currentTarget.dataset.src, src2 = e.currentTarget.dataset.wb_src
    var type = e.currentTarget.dataset.type
    console.log(id, name, appid, src, src2, type)
    if (type == 1) {
      console.log(src)
      wx: wx.navigateTo({
        url: src,
      })
    } else if (type == 2) {
      wx.setStorageSync('vr', src2)
      wx: wx.navigateTo({
        url: '../car/car',
      })
    } else if (type == 3) {
      wx.navigateToMiniProgram({
        appId: appid,
      })
    }
  },
  refresh: function (storeid) {
    var that = this
    var time = util.formatTime(new Date());
    var current_time = time.slice(11, 16)
    app.util.request({
      'url': 'entry/wxapp/StoreInfo',
      'cachetime': '0',
      data: {
        store_id: storeid
      },
      success:(res)=>{
        console.log('商家详情')
        console.log(res)
        if (res.data.store.store_mp3 != '' && res.data.store.is_mp3 == '1') {
          wx.playBackgroundAudio({
            dataUrl: res.data.store.store_mp3,
          })
          wx.getBackgroundAudioPlayerState({
            success: function (res) {
              console.log(res)
              var status = res.status
              var dataUrl = res.dataUrl
              var currentPosition = res.currentPosition
              var duration = res.duration
              var downloadPercent = res.downloadPercent
            },
            fail: function (res) {
              console.log(res)
            },
            complete: function (res) {
              console.log(res)
            }
          })
        }
        wx.setNavigationBarTitle({
          title: res.data.store.name,
        })
        that.setData({
          store_info:res.data.store,
          storeset: res.data.storeset,
        })
        var storeset = res.data.storeset,nav=that.data.nav;
        if (storeset.is_dn=='1'){
          nav[1].active=true;
          if (storeset.dn_img != ''){
            nav[1].img = storeset.dn_img
          }
          if (storeset.dn_name != '') {
            nav[1].name = storeset.dn_name
          }
          if (storeset.dnsm != '') {
            nav[1].smwz = storeset.dnsm
          }
        }
        if (storeset.is_wm == '1') {
          nav[0].active = true;
          if (storeset.wm_img != '') {
            nav[0].img = storeset.wm_img
          }
          if (storeset.wm_name != '') {
            nav[0].name = storeset.wm_name
          }
          if (storeset.wmsm != '') {
            nav[0].smwz = storeset.wmsm
          }
        }
        if (storeset.is_yy == '1') {
          nav[2].active = true;
          if (storeset.yy_img != '') {
            nav[2].img = storeset.yy_img
          }
          if (storeset.yy_name != '') {
            nav[2].name = storeset.yy_name
          }
          if (storeset.sysm != '') {
            nav[2].smwz = storeset.yysm
          }
        }
        if (storeset.is_sy == '1') {
          nav[3].active = true;
          if (storeset.sy_img != '') {
            nav[3].img = storeset.sy_img
          }
          if (storeset.sy_name != '') {
            nav[3].name = storeset.sy_name
          }
          if (storeset.sysm != '') {
            nav[3].smwz = storeset.sysm
          }
        }
        if (storeset.is_qg == '1' && getApp().xtxx.qggn == '1') {
          nav[4].active = true;
          if (storeset.qg_img != '') {
            nav[4].img = storeset.qg_img
          }
          if (storeset.qg_name != '') {
            nav[4].name = storeset.qg_name
          }
          if (storeset.qgsm != '') {
            nav[4].smwz = storeset.qgsm
          }
        }
        if (storeset.is_pt == '1' && getApp().xtxx.ptgn == '1') {
          nav[5].active = true;
          if (storeset.pt_img != '') {
            nav[5].img = storeset.pt_img
          }
          if (storeset.pt_name != '') {
            nav[5].name = storeset.pt_name
          }
          if (storeset.ptsm != '') {
            nav[5].smwz = storeset.ptsm
          }
        }
        if (storeset.is_pd == '1') {
          nav[6].active = true;
          if (storeset.pd_img != '') {
            nav[6].img = storeset.pd_img
          }
          if (storeset.pd_name != '') {
            nav[6].name = storeset.pd_name
          }
          if (storeset.pdsm != '') {
            nav[6].smwz = storeset.pdsm
          }
        }
        console.log(nav)
        that.setData({
          nav:nav
        })
        //
        var shop_time = res.data.store.time
        var close_time = res.data.store.time2
        var shop_time1 = res.data.store.time3
        var close_time1 = res.data.store.time4
        var rest = res.data.store.is_rest
        console.log('当前的系统时间为' + current_time)
        console.log('商家的营业时间从' + shop_time + '至' + close_time, shop_time1 + '至' + close_time1)

        if (rest == 1) {
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
              time: 2
            })
          }
          else if (current_time > close_time1) {
            console.log('商家以及关店啦，明天再来吧')
            that.setData({
              time: 3
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
              time: 2
            })
          }
          else if (current_time > close_time1) {
            console.log('商家以及关店啦，明天再来吧')
            that.setData({
              time: 3
            })
          }
        }
      },
    })
  },
  // 为了方便底部边框和主色调一致 
  seller_coupon: function () {
    this.setData({
      index: 0
    })
  },
  seller_dishes: function () {
    this.setData({
      index: 1
    })
  },
  seller_evalate: function () {
    this.setData({
      index: 2
    })
  },
  seller_info:function(e){
    // wx.navigateTo({
    //   url: 'infomation',
    // })
    var jwd = this.data.store_info.coordinates.split(','), t = this.data.store_info;
    console.log(jwd)
    wx.openLocation({
      latitude: parseFloat(jwd[0]),
      longitude: parseFloat(jwd[1]),
      address: t.address,
      name: t.name
    })
  }, 
  maketel:function(){
    var that=this;
    wx.makePhoneCall({
      phoneNumber: that.data.store_info.tel,
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
    var that = this;
    app.getUserInfo(function (userinfo) {
      console.log(userinfo)
      that.Coupons();
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  gbbjyy: function () {
    var bjyylb = this.data.bjyylb;
    var that = this;
    if (bjyylb == 'laba') {
      wx.stopBackgroundAudio()
      this.setData({
        bjyylb: 'laba1'
      })
      wx.showToast({
        title: '音乐已关闭',
      })
    }
    if (bjyylb == 'laba1') {
      wx.playBackgroundAudio({
        dataUrl: that.data.store_info.store_mp3,
      })
      this.setData({
        bjyylb: 'laba'
      })
      wx.showToast({
        title: '音乐已开启',
      })
    }
  },
  onUnload: function () {
    wx.stopBackgroundAudio()
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

  // /**
  //  * 用户点击右上角分享
  //  */
  onShareAppMessage: function () {
    var that = this,xtxx=this.data.xtxx;
    console.log(xtxx)
    return {
      title: that.data.store_info.name,
      path: '/zh_cjdianc/pages/seller/index?sjid=' + that.data.store_info.id,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})