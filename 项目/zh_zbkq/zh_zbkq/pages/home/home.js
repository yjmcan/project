// zh_zbkq/pages/home/home.js
const app = getApp()
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var util = require('../../utils/util.js');
var qqmapsdk;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    luntext: ['全部', '最新','离我最近'],
    activeIndex: 0,
    sliderOffset: 0,
    select: 1,
    xspl:true,
    qqsj: false,
  },
  ckwz:function(e){
    console.log(e.currentTarget.dataset.lat, e.currentTarget.dataset.lng,e.currentTarget.dataset.address)
    wx.openLocation({
      latitude: Number(e.currentTarget.dataset.lat),
      longitude:Number(e.currentTarget.dataset.lng),
      address: e.currentTarget.dataset.address,
    })
  },
  reLoad:function(){
    var that = this;
    //取imgurl;
    app.util.request({
      'url': 'entry/wxapp/GetZxInfo',
      'cachetime': '0',
      success: function (res) {
        console.log(res.data)
        that.setData({
          headinfo: res.data
        })
        wx.setNavigationBarTitle({
          title: res.data.db_title,
        })
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(this);
    // //取key
    // app.util.request({
    //   'url': 'entry/wxapp/GetMapKey',
    //   'cachetime': '0',
    //   success: function (res) {
    //     console.log(res.data)
    //     // 实例化API核心类
    //     qqmapsdk = new QQMapWX({
    //       key: res.data.map_key
    //     });
    //     that.reLoad();
    //   }
    // });
    //取imgurl;
    app.util.request({
      'url': 'entry/wxapp/Attachurl',
      'cachetime': '0',
      success: function (res) {
        console.log(res.data)
        that.setData({
          url: res.data
        })
        that.reLoad();
        that.onShowzx(1);
      }
    });
    //取平台信息
    app.util.request({
      'url': 'entry/wxapp/GetPlatform',
      'cachetime': '0',
      success: function (res) {
        console.log(res.data)
        that.setData({
          ptxx: res.data
        })
      }
    });
    var uid = wx.getStorageSync('UserData').id;
    //isrz
    app.util.request({
      'url': 'entry/wxapp/GetMdid',
      'cachetime': '0',
      data: { user_id: uid },
      success: function (res) {
        console.log(res)
        that.setData({
          mdinfo:res.data,
        })
        }
    });
  },
   
  // --------------------点击事件----------------------
  tabClick: function (e) {
    var that=this;
    console.log(e.currentTarget.id)
    this.setData({
      activeIndex: e.currentTarget.id,
      qqsj: false,
    });
    if (e.currentTarget.id==0){
      this.onShowzx(1);
    }
    if (e.currentTarget.id == 1) {
      this.onShowzx(2);
    }
    if (e.currentTarget.id == 2) {
      wx.getLocation({
        success: function(res) {
          console.log(res)
          that.onShowzx(3, res.latitude, res.longitude);
        },
      })
    }
  },
  tzfb:function(){
    wx.navigateTo({
      url: 'fabu',
    })
  },
  ycpl:function(){
    this.setData({
      select: 1
    })
    console.log('ycpl')
  },
  plxy:function(){
    this.setData({
      xspl: true,
    })
  },
  toggle:function(e){
    var that=this;
    var uid = wx.getStorageSync('UserData').id, zxid = e.currentTarget.id;
    console.log('用户id', uid, '资讯id', zxid)
    this.setData({
      acitiveid: e.currentTarget.id,
    })
    //zan
    app.util.request({
      'url': 'entry/wxapp/IsMyCollect',
      'cachetime': '0',
      data: { user_id: uid, zx_id: zxid },
      success: function (res) {
        console.log(res.data)
        if(res.data==1){
          that.setData({
            zantext:'取消'
          })
        }
        else{
          that.setData({
            zantext: '赞'
          })
        }
      }
    });
    var that = this
    var select = that.data.select;
    if (select == 1) {
      that.setData({
        select: 0
      })
    } else {
      that.setData({
        select: 1
      })
    }
  },
  zan:function(e){
    var that=this;
    var uid = wx.getStorageSync('UserData').id, zxid = e.currentTarget.id;
    console.log('用户id',uid,'资讯id',zxid)
     //zan
    app.util.request({
      'url': 'entry/wxapp/SaveZxCollect',
      'cachetime': '0',
      data: { user_id:uid,zx_id:zxid},
      success: function (res) {
        console.log(res.data)
        if(res.data==1){
          that.setData({
            select:1
          })
        }
        if (that.data.activeIndex == 0) {
          that.onShowzx(1);
        }
        if (that.data.activeIndex == 1) {
          that.onShowzx(2);
        }
        if (that.data.activeIndex == 2) {
          wx.getLocation({
            success: function (res) {
              console.log(res)
              that.onShowzx(3, res.latitude, res.longitude);
            },
          })
        }
      }
    });
  },
  pl: function (e) {
    var that = this;
    var uid = wx.getStorageSync('UserData').id, zxid = e.currentTarget.id;
    console.log('用户id', uid, '资讯id', zxid)
    that.setData({
      xspl:false,
      select: 1,
      plzxid:zxid
    })
  },
  fspl:function(e){
    var that = this;
    var uid = wx.getStorageSync('UserData').id, zxid = this.data.plzxid;
    console.log('用户id', uid, '资讯id', zxid, '评论内容', e.detail.value)
    //zan
    app.util.request({
      'url': 'entry/wxapp/SaveZxAssess',
      'cachetime': '0',
      data: { user_id: uid, zx_id: zxid, content: e.detail.value},
      success: function (res) {
        console.log(res.data)
        if (res.data == 1) {
          that.setData({
            xspl: true,
          })
        }
        if (that.data.activeIndex == 0) {
          that.onShowzx(1);
        }
        if (that.data.activeIndex == 1) {
          that.onShowzx(2);
        }
        if (that.data.activeIndex == 2) {
          wx.getLocation({
            success: function (res) {
              console.log(res)
              that.onShowzx(3, res.latitude, res.longitude);
            },
          })
        }
      }
    });
  },
  delete:function(e){
    var that = this;
    var zxid = e.currentTarget.id;
    console.log('资讯id', zxid)
    wx.showModal({
      title: '提示',
      content: '确定删除此条资讯吗？',
      confirmColor:'#f44444',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          //sc
          app.util.request({
            'url': 'entry/wxapp/DelZx',
            'cachetime': '0',
            data: { zx_id:zxid},
            success: function (res) {
              console.log(res.data)
              if(res.data==1){
                wx.showToast({
                  title: '删除成功',
                  duration:1000,
                })
                setTimeout(function(){
                  if (that.data.activeIndex == 0) {
                    that.onShowzx(1);
                  }
                  if (that.data.activeIndex == 1) {
                    that.onShowzx(2);
                  }
                  if (that.data.activeIndex == 2) {
                    wx.getLocation({
                      success: function (res) {
                        console.log(res)
                        that.onShowzx(3, res.latitude, res.longitude);
                      },
                    })
                  }
                },1000)
              }
              else{
                wx.showToast({
                  title: '删除失败',
                })
              }
            }
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  tel: function (e){
    var that = this;
    console.log(e.currentTarget.dataset.tel)
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.tel,
    })
  },
  previewImage: function (e) {
    var that = this;
    console.log(e.currentTarget.dataset.imgarr, e.currentTarget.dataset.src)
    wx.previewImage({
      current: e.currentTarget.dataset.src,
      urls: e.currentTarget.dataset.imgarr
    })
  },
  tzxq:function(){
    console.log('跳转详情')
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  onShowzx: function (sjtype,lat,lng) {
    var that = this;
    var imgurl = this.data.url;
    console.log(imgurl)
    var time = util.getNowFormatDate();
    console.log(time)
    //取list;
    app.util.request({
      'url': 'entry/wxapp/ZxList',
      'cachetime': '0',
      data:{type:sjtype,lat:lat,lng:lng},
      success: function (res) {
        console.log(res.data)
        that.setData({
          qqsj: true,
        })
        var zxlist = res.data;
        for (var i = 0; i < zxlist.length; i++) {
          var imgarr = zxlist[i].imgs.split(',');
          console.log(util.xctsfm(zxlist[i].time, time))
          zxlist[i].xctime = util.xctsfm(zxlist[i].time, time);
          for (var j = 0; j < imgarr.length; j++) {
            imgarr[j] = imgurl + imgarr[j]
          }
          zxlist[i].imgarr = imgarr;
        }
        console.log(zxlist)
        that.setData({
          zxlist: zxlist,
        })
      }
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('onshow()')
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
    this.onShowzx(1)
    this.setData({
      activeIndex:0,
      qqsj: false,
    })
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {
  
  // }
})