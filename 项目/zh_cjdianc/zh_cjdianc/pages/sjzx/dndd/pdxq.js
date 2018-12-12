// zh_cjdianc/pages/sjzx/dndd/dnddlb.js
var app = getApp();
var util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectedindex: 0,
    topnav: [{ img: '../../../img/icon/dzt.png', img1: '../../../img/icon/wdzt.png', name: '全部' }, { img: '../../../img/icon/djd.png', img1: '../../../img/icon/wdjd.png', name: '待支付' }, { img: '../../../img/icon/ywc.png', img1: '../../../img/icon/wywc.png', name: '已完成' }, { img: '../../../img/icon/sh.png', img1: '../../../img/icon/wsh.png', name: '已关闭' },],
    open: false,
    pagenum: 1,
    order_list: [],
    storelist: [],
    mygd: false,
    jzgd: true,
    selecttype: false,
    typename: '选择类型',
    selectdate: false,
    datetype: ['全部', '今天', '昨天', '近七天', '本月'],
    start: '',
    timestart: "",
    timeend: '',
    start_time: '',
    end_time: '',
  },
  reLoad: function () {
    var that = this, store_id = wx.getStorageSync('sjdsjid'), page = this.data.pagenum, typename = this.data.typename;
    console.log(store_id, page, typename)
    app.util.request({
      'url': 'entry/wxapp/lqNumberList',
      'cachetime': '0',
      data: { typename:typename, store_id: store_id, page: page, pagesize: 10 },
      success: function (res) {
        console.log('分页返回的列表数据', res.data)
        if (res.data.length < 10) {
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
    var that = this, sjdsjid = wx.getStorageSync('sjdsjid');
    console.log(sjdsjid, options)
    var start = util.formatTime(new Date).substring(0, 10).replace(/\//g, "-");
    console.log(start.toString())
    this.setData({
      // table_id: options.table_id,
      typename: options.typename,
      start: start,
      timestart: start,
      timeend: start
    })
    wx.setNavigationBarTitle({
      title: options.typename+'领取记录',
    })
    this.reLoad();
    app.setNavigationBarColor(this);
  },
  sc: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    console.log(id);
    wx.showModal({
      title: '提示',
      content: '确认删除此记录吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          app.util.request({
            'url': 'entry/wxapp/DelNumberCode',
            'cachetime': '0',
            data: { id: id },
            success: function (res) {
              console.log(res)
              if (res.data == 1) {
                wx.showToast({
                  title: '操作成功',
                  duration: 1000,
                })
                setTimeout(function () {
                  that.setData({
                    pagenum: 1,
                    order_list: [],
                    storelist: [],
                    mygd: false,
                    jzgd: true,
                  })
                  that.reLoad()
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
  }
})