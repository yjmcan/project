// zh_cjdianc/pages/sjzx/dndd/dndd.js
var app = getApp();
var dsq;
var siteinfo = require('../../../../siteinfo.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navbar: [{name:'全部',id:''}],
    selectedindex: 0,
    mask1Hidden: true,
    img: 'http://img1.imgtn.bdimg.com/it/u=4078366710,4168441355&fm=200&gp=0.jpg',
    status: 1,
    pagenum: 1,
    order_list: [],
    storelist: [],
    mygd: false,
    jzgd: true,
  },
  onOverallTag: function (e) {
    console.log(e)
    this.setData({
      mask1Hidden: false
    })
  },
  mask1Cancel: function () {
    this.setData({
      mask1Hidden: true
    })
  },
  selectednavbar: function (e) {
    console.log(e)
    this.setData({
      pagenum: 1,
      order_list: [],
      storelist: [],
      mygd: false,
      jzgd: true,
      selectedindex: e.currentTarget.dataset.index,
      toView: 'a' + (e.currentTarget.dataset.index - 1),
      status: Number(e.currentTarget.dataset.index) + 1
    })
    this.reLoad();
  },
  reLoad: function () {
    var that = this, status = this.data.status || 1, store_id = wx.getStorageSync('sjdsjid'), page = this.data.pagenum;
    var type_id;
    if (status == 1) {
      type_id = ''
    }
    else{
      type_id = that.data.navbar[status-1].id
    }
    console.log(status, type_id, store_id, page)
    app.util.request({
      'url': 'entry/wxapp/Table2',
      'cachetime': '0',
      data: { type_id: type_id,store_id: store_id, page: page, pagesize: 20 },
      success: function (res) {
        console.log('分页返回的列表数据', res.data)
        if (res.data.length < 20) {
          that.setData({
            mygd: true,
            jzgd: true,
          })
        }
        else {
          that.setData({
            jzgd: true,
            pagenum: that.data.pagenum + 1,
          })
        }
        var storelist = that.data.storelist;
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
        that.setData({
          order_list: storelist,
          storelist: storelist
        })
        console.log(storelist)
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this, sjdsjid = wx.getStorageSync('sjdsjid'), root = siteinfo.siteroot.replace("app/index.php", "");
    console.log(sjdsjid, wx.getStorageSync('system'))
    wx.setNavigationBarTitle({
      title: wx.getStorageSync('system').dc_name || '店内',
    })
    app.setNavigationBarColor(this);
    app.sjdpageOnLoad(this);
    app.util.request({
      'url': 'entry/wxapp/TableType',
      'cachetime': '0',
      data: { store_id: sjdsjid },
      success: function (res) {
        var navbar = that.data.navbar.concat(res.data)
        console.log(res, navbar)
        that.setData({
          navbar: navbar,
        })
      },
    })
    dsq = setInterval(function () {
      if (wx.getStorageSync('yybb')) {
        app.util.request({
          'url': 'entry/wxapp/NewOrder',
          'cachetime': '0',
          data: {
            store_id: sjdsjid
          },
          success: function (res) {
            console.log(res)
            if (res.data == 1) {
              wx.playBackgroundAudio({
                dataUrl: root + 'addons/zh_cjdianc/template/images/wm.wav',
                title: '语音播报',
              })
            }
            if (res.data == 2) {
              wx.playBackgroundAudio({
                dataUrl: root + 'addons/zh_cjdianc/template/images/dn.wav',
                title: '语音播报',
              })
            }
            // if (res.data == 3) {
            //   wx.playBackgroundAudio({
            //     dataUrl: root + 'addons/zh_cjdianc/template/images/yy.wav',
            //     title: '语音播报',
            //   })
            // }
          },
        })
      }
      else {
        clearInterval(dsq)
      }
    }, 10000)
    this.reLoad();
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
    clearInterval(dsq)
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
    if (!this.data.mygd && this.data.jzgd) {
      this.setData({
        jzgd: false
      })
      this.reLoad();
    }
    else {
    }
  },
})