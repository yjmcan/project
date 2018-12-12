// zh_dianc/pages/takeout/takeoutform.js
var app = getApp();
var util = require('../../utils/util.js');
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var qqmapsdk;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    share_modal_active:false,
    activeradio:'',
    hbshare_modal_active: false,
    hbactiveradio:'',
    sjshare_modal_active: false,
    sjindex: 0,
    radioItems: [],
    timearr: [],
    isloading:true,
    navbar: [],
    fwxy:true, 
    xymc:'到店自取服务协议',
    xynr:'',
    selectedindex: 0,
    color: '#019fff',
    checked: true,
    cart_list: [],
    wmindex: 0,
    wmtimearray: ['尽快送达'],
    cjindex: 0,
    cjarray: ['1份', '2份', '3份', '4份', '5份', '6份', '7份', '8份', '9份', '10份', '10份以上'],
    mdoaltoggle: true,
    total: 0,
    showModal: false,
    zffs: 1,
    zfz: false,
    zfwz: '微信支付',
    btntype: 'btn_ok1',
    yhqkdje:0,
    hbkdje:0,
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
  hbshowcart: function () {
    var that = this;
    this.setData({
      hbshare_modal_active: !that.data.hbshare_modal_active,
    })
  },
  hbclosecart: function () {
    var page = this;
    page.setData({
      hbshare_modal_active: false,
    });
  },
  sjshowcart: function () {
    var that = this;
    this.setData({
      sjshare_modal_active: !that.data.sjshare_modal_active,
    })
  },
  sjclosecart: function () {
    var page = this;
    page.setData({
      sjshare_modal_active: false,
    });
  },
  sjradioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);
    var radioItems = this.data.radioItems;
    for (var i = 0, len = radioItems.length; i < len; ++i) {
      radioItems[i].checked = radioItems[i].id == e.detail.value;
      if (radioItems[i].id == e.detail.value) {
        this.setData({
          xztime: this.data.timearr[this.data.sjindex].time + ' ' + radioItems[i].time
        })
      }
    }
    this.setData({
      radioItems: radioItems,
      sjshare_modal_active: false,
    });
  },
  selectedime: function (e) {
    console.log(e)
    var that = this;
    this.setData({
      //toType: 'a' + (Number(e.currentTarget.dataset.index)+2),
      sjindex: e.currentTarget.dataset.index,
      radioItems: that.data.timearr[e.currentTarget.dataset.index].ej
    })
  },
  openxy:function(){
    this.setData({
      fwxy:false,
    })
  },
  queren: function () {
    this.setData({
      fwxy: true,
    })
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      wmindex: e.detail.value
    })
  },
  bindcjPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      cjindex: e.detail.value
    })
  },
  selectednavbar: function (e) {
    console.log(e)
    var that = this;
    this.setData({
      selectedindex: e.currentTarget.dataset.index
    })
    var s = this.data.psfbf;
    console.log(s)
    1 == e.currentTarget.dataset.index ? this.setData({
      psf: 0,
    }) : this.setData({
      psf: s
    }),
      that.gettotalprice()
  },
  checkboxChange: function (e) {
    var that = this;
    this.setData({
      checked: !that.data.checked,
    })
  },
  ckwz: function (e) {
    console.log(e.currentTarget.dataset.jwd)
    var jwd = e.currentTarget.dataset.jwd.split(',')
    console.log(jwd)
    var that = this
    wx.openLocation({
      latitude: Number(jwd[0]),
      longitude: Number(jwd[1]),
      name: that.data.store.name,
      address: that.data.store.address
    })
  },
  radioChange1: function (e) {
    console.log('radio1发生change事件，携带value值为：', e.detail.value)
    if (e.detail.value == 'wxzf') {
      this.setData({
        zffs: 1,
        zfwz: '微信支付',
        btntype: 'btn_ok1',
      })
    }
    if (e.detail.value == 'yezf') {
      this.setData({
        zffs: 2,
        zfwz: '余额支付',
        btntype: 'btn_ok2',
      })
    }
    if (e.detail.value == 'jfzf') {
      this.setData({
        zffs: 3,
        zfwz: '积分支付',
        btntype: 'btn_ok3',
      })
    }
    if (e.detail.value == 'hdfk') {
      this.setData({
        zffs: 4,
        zfwz: '货到付款',
        btntype: 'btn_ok4',
      })
    }
  },
  //自定义算距离方法
  distance: function (f, t, cbk) {
    // 调用距离接口
    var distance;
    qqmapsdk.calculateDistance({
      mode: 'driving',
      from: {
        latitude: f.lat,
        longitude: f.lng
      },
      to: [{
        latitude: t.lat,
        longitude: t.lng
      }],
      success: function (res) {
        console.log(res);
        if (res.status == 0) {
          distance = Math.round(res.result.elements[0].distance)
          cbk(distance)
        }
      },
      fail: function (res) {
        console.log(res);
        if (res.status == 373) {
          distance = 15000;
          cbk(distance)
        }
      },
      complete: function (res) {
        console.log(res);
      }
    });
  },
  KeyName: function (t) {
    this.setData({
      name: t.detail.value
    })
  },
  KeyMobile: function (t) {
    this.setData({
      mobile: t.detail.value
    })
  },
  tjddformSubmit: function (e) {
    console.log(e)
    this.setData({
      form_id2: e.detail.formId
    })
    var that = this, address = this.data.address, i = this.data.selectedindex, storeset = this.data.storeset;
    console.log(address, i,storeset)
    if (i == 0 && address == null && storeset.is_ps == '1') {
      wx.showModal({
        title: '提示',
        content: '请选择收货地址',
      })
      return false
    }
    else if (i == 0 && !this.data.dzisnormall && storeset.is_ps == '1') {
      wx.showModal({
        title: '提示',
        content: '当前选择的收货地址超出商家配送距离,请选择其他地址',
        showCancel: false,
        success: function (res) {
          wx.navigateTo({
            url: '../wddz/xzdz',
          })
        }
      })
    }
    else if (i == 0 && this.data.dzisnormall && storeset.is_ps == '1'){
      this.setData({
        showModal: true,
      })
    }
    else if (i == 1 || (i == 0 && storeset.is_ps == '2')) {
      var username = that.data.name, tel = this.data.mobile, checked = this.data.checked;
      console.log(username, tel)
      if (username == '' || tel == '' || username == null || tel == null) {
        wx.showModal({
          title: '提示',
          content: '到店自提必须填写收货人和联系电话！',
        })
        return false
      }
      if (!checked) {
        wx.showModal({
          title: '提示',
          content: '请阅读并同意《到店自取服务协议》',
        })
        return false
      }
      this.setData({
        showModal: true,
      })
    }
  },
  yczz: function () {
    this.setData({
      showModal: false,
    })
  },
  mdoalclose: function () {
    this.setData({
      mdoaltoggle: true,
    })
  },
  bindDateChange: function (e) {
    console.log('date 发生 change 事件，携带值为', e.detail.value, this.data.datestart)
    this.setData({
      date: e.detail.value
    })
    if (e.detail.value == this.data.datestart) {
      console.log('日期没有修改')
      this.setData({
        timestart: util.formatTime(new Date).substring(11, 16)
      })
    }
    else {
      console.log('修改了日期')
      this.setData({
        timestart: "00:01"
      })
    }
  },
  bindTimeChange: function (e) {
    console.log('time 发生 change 事件，携带值为', e.detail.value)
    this.setData({
      time: e.detail.value
    })
  },
  radioChange: function (e) {
    this.setData({
      radioChange: e.detail.value,
    })
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  },
  hbradioChange: function (e) {
    this.setData({
      hbradioChange: e.detail.value,
    })
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  },
  xzq: function (e) {
    console.log(e.currentTarget.dataset, this.data.gwcinfo.money, this.data.CouponSet.yhq_set)
    if (Number(e.currentTarget.dataset.full) > this.data.gwcinfo.money) {
      wx.showModal({
        title: '提示',
        content: '您的消费金额不满足此优惠券条件',
      })
      return false;
    }
    if (this.data.CouponSet.yhq_set=='1'){
      this.setData({
        share_modal_active: false,
        activeradio: e.currentTarget.dataset.rdid,
        yhqkdje: e.currentTarget.dataset.kdje,
      })
    }
    else{
      this.setData({
        share_modal_active: false,
        activeradio: e.currentTarget.dataset.rdid,
        yhqkdje: e.currentTarget.dataset.kdje,
        hbactiveradio: '',
        hbkdje: 0,
      })
    }
    this.gettotalprice();
  },
  xzhb: function (e) {
    console.log(e.currentTarget.dataset, this.data.gwcinfo.money, this.data.CouponSet.yhq_set)
    if (Number(e.currentTarget.dataset.full) > this.data.gwcinfo.money) {
      wx.showModal({
        title: '提示',
        content: '您的消费金额不满足此红包条件',
      })
      return false;
    }
    if (this.data.CouponSet.yhq_set == '1'){
      this.setData({
        hbshare_modal_active: false,
        hbactiveradio: e.currentTarget.dataset.rdid,
        hbkdje: e.currentTarget.dataset.kdje,
      })
    }
    else{
      wx.showModal({
        title: '提示',
        content: '优惠券与红包不可同时享用',
      })
      this.setData({
        hbshare_modal_active: false,
        hbactiveradio: e.currentTarget.dataset.rdid,
        hbkdje: e.currentTarget.dataset.kdje,
        activeradio: '',
        yhqkdje:0,
      })
    }
    this.gettotalprice();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.setNavigationBarColor(this);
    console.log(options)
    var nowtime = util.formatTime(new Date)
    var date = util.formatTime(new Date).substring(0, 10).replace(/\//g, "-");
    var time = util.formatTime(new Date).substring(11, 16);
    console.log(nowtime, date.toString(), time.toString())
    var now = new Date();
    var time1 = now.getTime();
    var timelimit = (24 - new Date(time1).getHours()) * 2
    console.log(timelimit, new Date(time1), new Date(time1).getHours(), new Date(time1).getMinutes())
    var wmtimearray = ['尽快送达'];
    for (let i = 1; i < timelimit; i++) {
      var time1 = now.getTime() + 1000 * 60 * 30 * i, getMinutes = new Date(time1).getMinutes();
      if (getMinutes < 10) {
        getMinutes = '0' + getMinutes
      }
      var str = new Date(time1).getHours() + ':' + getMinutes
      wmtimearray.push(str)
    }
    console.log(wmtimearray)
    this.setData({
      datestart: date,
      timestart: time,
      date: date,
      time: time,
      wmtimearray: wmtimearray,
    })
    var that = this, storeid = options.storeid, user_id = wx.getStorageSync('users').id;
    wx.removeStorageSync('note')
    // GetStoreService
    app.util.request({
      'url': 'entry/wxapp/GetStoreService',
      'cachetime': '0',
      data: { store_id: storeid },
      success: function (res) {
        console.log(res)
        if (res.data && res.data.length > 0) {
          res.data[0].ej[0].checked = true
          that.setData({
            timearr: res.data,
            radioItems: res.data[0].ej,
            xztime: res.data[0].time + ' ' + res.data[0].ej[0].time
          })
        }
      }
    })
    // UserInfo
    app.util.request({
      'url': 'entry/wxapp/UserInfo',
      'cachetime': '0',
      data: { user_id: user_id },
      success: function (res) {
        var date = util.formatTime(new Date).substring(0, 10).replace(/\//g, "-");
        console.log(res, date.toString())
        if (res.data.dq_time != '' && res.data.dq_time >= date.toString()) {
          res.data.ishy = 1
        }
        that.setData({
          userInfo: res.data
        })
      }
    })
    app.util.request({
      'url': 'entry/wxapp/MyCoupons',
      'cachetime': '0',
      data: { store_id: storeid, user_id: user_id },
      success: function (res) {
        console.log(res.data)
        var arr = [],hbarr=[];
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].coupon_type != '2' && res.data[i].type=='1') {
            arr.push(res.data[i])
          }
          if (res.data[i].coupon_type != '2' && res.data[i].type == '2'){
            hbarr.push(res.data[i])
          }
        }
        console.log(arr,hbarr)
        that.setData({
          Coupons: arr,
          hbarr: hbarr,
        })
      },
    })
    /* */
    app.util.request({
      'url': 'entry/wxapp/CouponSet',
      'cachetime': '0',
      success: function (res) {
        console.log(res.data)
        that.setData({
          CouponSet: res.data
        })
      },
    })
    // app.util.request({
    //   'url': 'entry/wxapp/System',
    //   'cachetime': '0',
    //   success: function (res) {
    //     console.log(res)
    //     that.setData({
    //       System: res.data,
    //     })
    //     // 实例化API核心类
    //     qqmapsdk = new QQMapWX({
    //       key: res.data.map_key
    //     });
    //   }
    // });
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: getApp().xtxx.map_key
    });
    that.setData({
      xtxx: getApp().xtxx
    })
    app.util.request({
      'url': 'entry/wxapp/StoreInfo',
      'cachetime': '0',
      data: { store_id: storeid, type: 2 },
      success: function (res) {
        console.log(res.data)
        res.data.storeset.wmps_name = res.data.storeset.wmps_name != '' ? res.data.storeset.wmps_name : '外卖配送'
        var StoreInfo = res.data;
        var loc = res.data.store.coordinates.split(',')
        var sjstart = { lng: Number(loc[1]), lat: Number(loc[0]) }
        console.log(sjstart)
        if (StoreInfo.storeset.is_ps == '1' && StoreInfo.storeset.is_zt == '1') {
          that.setData({
            navbar: [StoreInfo.storeset.wmps_name, '到店自取'],
          })
        }
        if (StoreInfo.storeset.is_zt == '2') {
          that.setData({
            navbar: [StoreInfo.storeset.wmps_name],
          })
        }
        if (StoreInfo.storeset.is_ps == '2') {
          that.setData({
            navbar: ['到店自取'],
          })
        }
        if (StoreInfo.storeset.is_hdfk == '1' || StoreInfo.storeset.is_hdfk == '3') {
          that.setData({
            hdfk: true,
          })
        }
        if (getApp().xtxx.is_yuepay == '1' &&StoreInfo.storeset.is_yuepay == '1') {
          that.setData({
            kqyue: true,
          })
        }
        that.setData({
          // url: getApp().imgurl,
          psfarr: res.data.psf,
          reduction: res.data.reduction,
          store: res.data.store,
          storeset: res.data.storeset,
          sjstart: sjstart,
          xynr: res.data.storeset.ztxy,
        })
        app.util.request({
          'url': 'entry/wxapp/MyCar',
          'cachetime': '0',
          data: {
            store_id: storeid, user_id: user_id
          },
          success: function (res) {
            console.log(res)
            app.util.request({
              'url': 'entry/wxapp/IsNew',
              data: {
                store_id: storeid, user_id: user_id
              },
              'cachetime': '0',
              success: function (res) {
                console.log(res.data)
                if (StoreInfo.storeset.xyh_open == '1' &&res.data == 1) {
                  that.setData({
                    xyhmoney: StoreInfo.storeset.xyh_money,
                    isnewuser: '1',
                  })
                }
                else {
                  that.setData({
                    xyhmoney: 0,
                    isnewuser: '2',
                  })
                }
                that.countMj()
                that.countpsf()
                // that.gettotalprice()
              },
            })
            that.setData({
              cart_list: res.data.res,
              gwcinfo: res.data,
              gwcprice: res.data.money,
            })
          }
        })
      },
    })
  },
  gettotalprice: function () {
    var that = this, gwcprice = this.data.gwcprice, bzf = this.data.gwcinfo.box_money, psf = this.data.psf, mjmoney = this.data.mjmoney, xyhmoney = this.data.xyhmoney, yhqkdje = this.data.yhqkdje, hbkdje = this.data.hbkdje, zkmoney;
    // if (this.data.userInfo.ishy == 1) {
    //   zkmoney = parseFloat((Number(gwcprice) * (1 - Number(getApp().xtxx.hy_discount) / 100)).toFixed(2))
    // }
    // else {
    //   zkmoney = 0
    // }
    zkmoney = 0
    var totalyh = (Number(mjmoney) + Number(xyhmoney) + zkmoney + Number(yhqkdje) + Number(hbkdje)).toFixed(2),
      totalPrice = (Number(gwcprice) + Number(psf) - totalyh).toFixed(2);
    if (totalPrice < 0) {
      totalPrice = 0
    }
    console.log('gwcprice', gwcprice, 'bzf', bzf, 'psf', psf, 'mjmoney', mjmoney, 'xyhmoney', xyhmoney, 'totalyh', totalyh, 'totalPrice', totalPrice, 'yhqkdje', yhqkdje, 'hbkdje', hbkdje, 'zkmoney', zkmoney)
    that.setData({
      totalyh: totalyh,
      totalPrice: totalPrice,
      zkmoney: zkmoney,
      isloading:false,
    })
  },
  jsmj: function (num, arr) {
    var index;
    for (let i = 0; i < arr.length; i++) {
      if (Number(num) >= Number(arr[i].full)) {
        index = i;
        break;
      }
    }
    return index
  },
  countMj: function () {
    var that = this, gwcprice = this.data.gwcprice, reduction = this.data.reduction.reverse(), mjindex = that.jsmj(gwcprice, reduction), isnewuser = this.data.isnewuser;
    console.log(gwcprice, reduction, mjindex, isnewuser)
    var mjmoney = 0
    if (reduction.length > 0 && mjindex!=null&& isnewuser == '2') {
      mjmoney = reduction[mjindex].reduction
    }
    this.setData({
      reduction: reduction,
      mjindex: mjindex,
      mjmoney: mjmoney,
    })
  },
  countpsf: function () {
    var that = this, user_id = wx.getStorageSync('users').id, sjstart = that.data.sjstart, psdistance = Number(this.data.storeset.ps_jl) * 1000, psfarr = this.data.psfarr;
    console.log(psfarr)
    app.util.request({
      'url': 'entry/wxapp/MyDefaultAddress',
      'cachetime': '0',
      data: { user_id: user_id },
      success: function (res) {
        console.log(res.data)
        if (res.data && that.data.storeset.is_ps == '1') {
          var dzend = { lng: res.data.lng, lat: res.data.lat }
          console.log(sjstart, dzend, psdistance)
          // res.data.area = res.data.area.replace(/,/g, "")
          that.setData({
            address: res.data,
            mobile: res.data.tel,
            name: res.data.user_name
          })
          that.distance(sjstart, dzend, function (juli) {
            if (psdistance < juli) {
              that.setData({
                dzisnormall:false,
              })
              wx.showModal({
                title: '提示',
                content: '当前选择的收货地址超出商家配送距离,请选择其他地址',
                success: function (res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                    wx.navigateTo({
                      url: '../wddz/xzdz',
                    })
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
              })
            }
            else{
              that.setData({
                dzisnormall: true,
              })
            }
            var distance = (juli / 1000).toFixed(2)
            console.log(juli, psdistance, distance)
            for (let i = psfarr.length - 1; i >= 0; i--) {
              console.log(i)
              if (Number(distance) >= Number(psfarr[i].end) || (Number(distance) >= Number(psfarr[i].start) && Number(distance) < Number(psfarr[i].end))) {
                console.log(i, psfarr[i].money)
                that.setData({
                  psf: psfarr[i].money,
                  psfbf: psfarr[i].money
                })
                that.gettotalprice()
                break
              }
            }
          })
        }
        else if (!res.data && that.data.storeset.is_ps == '1') {
          that.setData({
            psf: psfarr[0].money,
            psfbf: psfarr[0].money,
          })
          that.gettotalprice()
        }
        else {
          that.setData({
            psf: 0,
            psfbf: 0,
          })
          that.gettotalprice()
        }
      }
    });
  },
  formSubmit: function (e) {
    var list = [], cart_list = this.data.cart_list;
    cart_list.map(function (item) {
      if (item.num > 0) {
        var obj = {};
        obj.name = item.is_qg == '1' ? item.qg_name : item.name;
        obj.img = item.is_qg == '1' ? item.qg_logo : item.logo;
        obj.num = item.num;
        obj.money = item.money;
        obj.dishes_id = item.good_id;
        obj.spec = item.spec;
        obj.is_qg = item.is_qg;
        list.push(obj);
      }
    })
    console.log(list)
    var that = this, storeset = this.data.storeset;
    var openid = getApp().getOpenId;
    console.log('form发生了submit事件，携带数据为：', e.detail.value.radiogroup, this.data.activeradio, this.data.hbactiveradio,)
    var form_id = e.detail.formId, form_id2 = this.data.form_id2, uid = wx.getStorageSync('users').id, sjid = this.data.store.id, money = this.data.totalPrice, totalyh = this.data.totalyh, box_money = this.data.gwcinfo.box_money, ps_money = this.data.psf, mj_money = this.data.mjmoney, xyh_money = this.data.xyhmoney, note = this.data.note, tableware = this.data.cjarray[this.data.cjindex], delivery_time, yhq_money = this.data.yhqkdje, coupon_id = this.data.activeradio, coupon_id2 = this.data.hbactiveradio, yhq_money2 = this.data.hbkdje, zk_money = this.data.zkmoney;
    if (e.detail.value.radiogroup == 'hdfk' && storeset.is_hdfk == '3' && Number(ps_money) <= 0) {
      wx.showModal({
        title: '提示',
        content: '货到付款，配送费不能为0，请选择其他付款方式',
      })
      return
    }
    var order_type = parseInt(this.data.selectedindex) + 1;
    if (that.data.storeset.is_ps == '2') {
      order_type = 2
    }
    if (order_type == 2) {
      if (this.data.timearr.length > 0) {
        delivery_time = this.data.xztime;
      }
      else {
        delivery_time = this.data.date + ' ' + this.data.time;
      }
    }
    else {
      if (this.data.timearr.length > 0) {
        delivery_time = this.data.xztime;
      }
      else {
        delivery_time = this.data.wmtimearray[this.data.wmindex];
      }
    }
    if (this.data.address != null) {
      var address = this.data.address.area.replace(/,/g, "") + this.data.address.address, username = this.data.address.user_name, tel = this.data.address.tel, sex = this.data.address.sex;
      var area = this.data.address.area, lat = this.data.address.lat, lng = this.data.address.lng;
    }
    else {
      var address = '', username = '', tel = '', sex='0';
      var area = '', lat = '', lng = '';
    }
    if (order_type == 2) {
      username = that.data.name, tel = this.data.mobile;
      if (username == '' || tel == '') {
        wx.showModal({
          title: '提示',
          content: '到店自提必须填写收货人和联系电话！',
        })
        return false
      }
    }
    console.log(openid, form_id, form_id2, uid, sjid, '实付', money, '总优惠', totalyh, '包装费', box_money, '运费', ps_money, '满减金额', mj_money, '新用户money', xyh_money, '优惠券', yhq_money, '红包', yhq_money2, '折扣', zk_money, '订单类型', order_type,area,lat,lng, '收货人',username, '收获电话', tel, '收货地址', address, '留言', note, 'sz', list, '配送时间', delivery_time,'餐具数量',tableware,sex)
    if (e.detail.value.radiogroup == 'yezf') {
      var ye = Number(this.data.userInfo.wallet), total = Number(money);
      console.log(ye, total)
      if (ye < total) {
        wx.showToast({
          title: '余额不足支付',
          icon: 'loading',
        })
        return
      }
    }
    // var dyjf = 0;
    // if (e.detail.value.radiogroup == 'jfzf') {
    //   var jf = Number(this.data.integral) / Number(this.data.jf_proportion), sfmoney = Number(this.data.totalprice);
    //   dyjf = (sfmoney * Number(this.data.jf_proportion)).toFixed(2);
    //   console.log(jf, sfmoney, dyjf)
    //   if (jf < sfmoney) {
    //     wx.showToast({
    //       title: '积分不足支付',
    //       icon: 'loading',
    //     })
    //     return
    //   }
    // }
    if (e.detail.value.radiogroup == 'yezf') {
      var pay_type = 2;
    }
    if (e.detail.value.radiogroup == 'wxzf') {
      var pay_type = 1;
    }
    if (e.detail.value.radiogroup == 'jfzf') {
      var pay_type = 3;
    }
    if (e.detail.value.radiogroup == 'hdfk') {
      var pay_type = 4;
    }
    console.log('支付方式', pay_type)
    if (form_id == '') {
      wx: wx.showToast({
        title: '没有获取到formid',
        icon: 'loading',
        duration: 1000,
      })
    } else {
      this.setData({
        zfz: true,
      })
      //下单
      app.util.request({
        'url': 'entry/wxapp/AddOrder',
        'cachetime': '0',
        'method': 'POST',
        data: { user_id: uid, store_id: sjid, money: money, discount: totalyh, box_money: box_money, ps_money: ps_money, mj_money: mj_money, xyh_money: xyh_money, tel: tel, name: username, address: address, note: note, type: 1, area: area, lat: lat, lng: lng, form_id: form_id, form_id2: form_id2, delivery_time: delivery_time, order_type: order_type, pay_type: pay_type, sz: JSON.stringify(list), tableware: tableware, sex: sex, yhq_money: yhq_money, yhq_money2: yhq_money2, coupon_id: coupon_id, coupon_id2: coupon_id2, zk_money: zk_money},
        success: function (res) {
          console.log(res)
          var order_id = res.data;
          that.setData({
            zfz: false,
            showModal: false,
          })
          if (e.detail.value.radiogroup == 'yezf') {
            console.log('余额流程')
            if (order_id != '下单失败') {
              that.setData({
                mdoaltoggle: false,
              })
              setTimeout(function () {
                wx.reLaunch({
                  url: '../wddd/order?status=2',
                })
              }, 1000)
            }
            else {
              wx.showToast({
                title: '支付失败',
                icon: 'loading',
              })
            }
          }
          if (e.detail.value.radiogroup == 'hdfk' && storeset.is_hdfk == '1') {
            console.log('货到付款流程')
            if (order_id != '下单失败') {
              that.setData({
                mdoaltoggle: false,
              })
              setTimeout(function () {
                wx.reLaunch({
                  url: '../wddd/order?status=2',
                })
              }, 1000)
            }
            else {
              wx.showToast({
                title: '支付失败',
                icon: 'loading',
              })
            }
          }
          if (e.detail.value.radiogroup == 'hdfk' && storeset.is_hdfk == '3') {
            console.log('货到付款3流程')
            if (order_id != '下单失败') {
              app.util.request({
                'url': 'entry/wxapp/pay',
                'cachetime': '0',
                data: { openid: openid, money: ps_money, order_id: order_id },
                success: function (res) {
                  console.log(res)
                  wx.requestPayment({
                    'timeStamp': res.data.timeStamp,
                    'nonceStr': res.data.nonceStr,
                    'package': res.data.package,
                    'signType': res.data.signType,
                    'paySign': res.data.paySign,
                    'success': function (res) {
                      console.log(res.data)
                      console.log(res)
                      console.log(form_id)
                    },
                    'complete': function (res) {
                      console.log(res);
                      if (res.errMsg == 'requestPayment:fail cancel') {
                        wx.showToast({
                          title: '取消支付',
                          icon: 'loading',
                          duration: 1000
                        })
                        setTimeout(function () {
                          wx.reLaunch({
                            url: '../wddd/order',
                          })
                        }, 1000)
                      }
                      if (res.errMsg == 'requestPayment:ok') {
                        that.setData({
                          mdoaltoggle: false,
                        })
                        setTimeout(function () {
                          wx.reLaunch({
                            url: '../wddd/order?status=2',
                          })
                        }, 1000)
                      }
                    }
                  })
                },
              })
            }
            else {
              wx.showToast({
                title: '支付失败',
                icon: 'loading',
              })
            }
          }
          if (e.detail.value.radiogroup == 'wxzf') {
            console.log('微信支付流程')
            if (money == 0) {
              wx.showModal({
                title: '提示',
                content: '0元买单请选择其他方式支付',
              })
              that.setData({
                zfz: false,
              })
            }
            else {
              // 下单
              if (order_id != '下单失败') {
                app.util.request({
                  'url': 'entry/wxapp/pay',
                  'cachetime': '0',
                  data: { openid: openid, money: money, order_id: order_id },
                  success: function (res) {
                    console.log(res)
                    wx.requestPayment({
                      'timeStamp': res.data.timeStamp,
                      'nonceStr': res.data.nonceStr,
                      'package': res.data.package,
                      'signType': res.data.signType,
                      'paySign': res.data.paySign,
                      'success': function (res) {
                        console.log(res.data)
                        console.log(res)
                        console.log(form_id)
                      },
                      'complete': function (res) {
                        console.log(res);
                        if (res.errMsg == 'requestPayment:fail cancel') {
                          wx.showToast({
                            title: '取消支付',
                            icon: 'loading',
                            duration: 1000
                          })
                          setTimeout(function () {
                            wx.reLaunch({
                              url: '../wddd/order',
                            })
                          }, 1000)
                        }
                        if (res.errMsg == 'requestPayment:ok') {
                          that.setData({
                            mdoaltoggle: false,
                          })
                          setTimeout(function () {
                            wx.reLaunch({
                              url: '../wddd/order?status=2',
                            })
                          }, 1000)
                        }
                      }
                    })
                  },
                })
              }
            }
          }
        },
      })
    }
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
    var note=wx.getStorageSync('note')
    console.log(note)
    this.setData({
      note:note
    })
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

  }
})