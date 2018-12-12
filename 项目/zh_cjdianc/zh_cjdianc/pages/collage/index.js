const app = getApp()
const siteinfo = require('../../../siteinfo.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    share: true,
    friendsImage: true,
    clock:true,
  },
  maketel: function (t) {
    var a = this.data.StoreInfo.store.tel;
    wx.makePhoneCall({
      phoneNumber: a,
    })
  },
  location: function () {
    var jwd = this.data.StoreInfo.store.coordinates.split(','), t = this.data.StoreInfo.store;
    console.log(jwd)
    wx.openLocation({
      latitude: parseFloat(jwd[0]),
      longitude: parseFloat(jwd[1]),
      address: t.address,
      name: t.name
    })
  },
  back:function(){
    wx.navigateBack({
      
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    console.log(options)
    app.setNavigationBarColor(this);
    wx.setNavigationBarTitle({
      title: options.title,
    })
    that.setData({
      store_id:options.store_id,
      store_logo:options.store_logo
    })
    app.util.request({
      'url': 'entry/wxapp/StoreInfo',
      'cachetime': '0',
      data: {
        store_id: options.store_id
      },
      success: (res) => {
        console.log('商家详情', res)
        that.setData({
          StoreInfo: res.data,
        })
      },
    })
    var scene = decodeURIComponent(options.scene)
    if (options.scene == null) {
      that.setData({
        id: options.id
      })
      that.reload()
    } else {
      that.setData({
        id: scene
      })
      that.reload()
    }
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          width: res.windowWidth,
          height: res.windowHeight,
          v_wid: res.windowWidth - 40
        })
      }
    })
  },
  refresh: function(e) {
    var that = this
    var a = that.data
    // // 获取商品二维码图片\
    var siteroot = siteinfo.siteroot.slice(0, siteinfo.siteroot.length-14)
    console.log(siteroot)

    // 商品详情
    app.util.request({
      'url': 'entry/wxapp/GoodsInfo',
      'cachetime': '0',
      data: {
        goods_id: that.data.id,
      },
      success: res => {
        console.log('商品详情', res)
        for(let i in res.data.group){
          res.data.group[i].num = Number(res.data.group[i].kt_num) - Number(res.data.group[i].yg_num)
        }
        console.log(res.data.group)
        var goods_info = res.data.goods
        that.countdown(goods_info.end_time)
        goods_info.img = goods_info.img.split(",")
        goods_info.end_times = goods_info.end_time
        goods_info.xf_times = goods_info.xf_time
        goods_info.start_time = that.ormatDate(goods_info.start_time)
        goods_info.end_time = that.ormatDate(goods_info.end_time)
        goods_info.xf_time = that.ormatDate(goods_info.xf_time)
        var text_width = a.width - 110
        var title = goods_info.name
        // 商品名称
        var row = []
        for (var i = 0, len = title.length; i < len; i += text_width / 14) {
          row.push(title.slice(i, i + text_width / 14))
        }
        console.log(goods_info.store_logo)

        wx.downloadFile({
          url: goods_info.store_logo, //仅为示例，并非真实的资源
          success: function (res) {
            console.log(res.tempFilePath)
            that.setData({
              logo: res.tempFilePath,
            })
            that.img0()
          }
        })
        if (row.length != 0) {
          console.log('正在下载图片')
          wx.downloadFile({
            url: that.data.url+goods_info.img[0], //仅为示例，并非真实的资源
            success: function (res) {
              console.log(res.tempFilePath)
              that.setData({
                logo1: res.tempFilePath,
                title: title,
                row: row
              })
            }
          })
        }
        for(let i in res.data.group){
          if ( res.data.group[i].name != null && res.data.group[i].name.length >= 4){
            res.data.group[i].name = res.data.group[i].name.slice(0,4)+'...'
          }
          if (res.data.group[i].user_id==wx.getStorageSync('users').id){
            console.log('已经有开的团了')
            that.setData({
              already_group:true,
              already:res.data.group[i]
            })
          }
        }
        that.setData({
          goods_info: goods_info,
          group: res.data.group
        })
        // if(res.data.group.length>=2){
        //   that.setData({
        //     goods_info: goods_info,
        //     group: res.data.group.slice(0,2)
        //   })
        // }else{
        //   that.setData({
        //     goods_info: goods_info,
        //     group: res.data.group
        //   })
        // }
      }
    })
  },
  img0:function(e){
    var that = this
    var siteroot = siteinfo.siteroot.slice(0, siteinfo.siteroot.length - 14)
    app.util.request({
      'url': 'entry/wxapp/GoodsCode',
      'cachetime': '0',
      data: {
        goods_id: that.data.id
      },
      success: function (res) {
        var goods_code = res.data
        that.setData({
          goods_code: goods_code
        })
        console.log('下载的网址链接', siteroot + goods_code)
        wx.downloadFile({
          url: siteroot + goods_code + '', //仅为示例，并非真实的资源
          success: function (res) {
            console.log(res.tempFilePath)
            that.setData({
              shop_logo: res.tempFilePath,
            })
            that.ctx()
          }
        })

      },
    })
  },
  reload: function(e) {
    var that = this
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    let a = that.data
    let id = a.id
    // 获取拼团分类
    app.util.request({
      'url': 'entry/wxapp/GroupType',
      'cachetime': '0',
      success: res => {
        console.log('分类列表', res)
        that.setData({
          nav_array: res.data
        })
      }
    })
    // // 网址信息
    app.util.request({
      'url': 'entry/wxapp/Url',
      'cachetime': '0',
      success: function (res) {
        wx.setStorageSync('imglink', res.data)
        that.setData({
          url: res.data
        })
        // that.refresh()
      },
    }) 
  },
  // 裁剪图片合成
  ctx: function (e) {
    var that = this
    var a = that.data
    var width = a.width//屏幕宽度
    var height = a.height//屏幕高度
    var leiWid = (width - 150) / 2
    // 声明画布
    var ctx = wx.createCanvasContext('ctx')
    // 商品二维码
    ctx.drawImage(a.shop_logo, 0, 0, 150, 150)
    ctx.save()
    ctx.beginPath()
    ctx.arc(75, 75, 35, 0, 2 * Math.PI)
    ctx.clip()
    // 商家logo
    ctx.drawImage(a.logo, 35, 35, 75, 75)
    ctx.restore()
    ctx.draw()
    setTimeout(function (e) {
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: 150,
        height: 150,
        canvasId: 'ctx',
        success: function (res) {
          console.log(res.tempFilePath)
          wx.hideLoading()
          that.setData({
            logos: res.tempFilePath
          })
        }
      })
    }, 500)
  },
  // 生成商品海报
  canvas: function(e) {
    wx.showLoading({
      title: '正在生成海报',
    })
    var that = this
    var a = that.data
    var width = a.width //屏幕宽度
    var height = a.height //屏幕高度
    var leiWid = (width - 150) / 2
    var imgWid = width - 20
    var imgHei = width
    console.log(imgWid)
    console.log(imgHei)
    var row = a.row
    console.log('这是生成的标题数组')
    console.log(row)
    // 声明画布
    // console.log(a.logo1)
    var user_name = wx.getStorageSync('users').name
    console.log(a)
    var context = wx.createCanvasContext('firstCanvas')
    context.rect(0, 0, width, height)
    context.setFillStyle('#fff')
    context.fill()
    context.fillStyle = "red";
    context.setFontSize(16)
    context.fillText(wx.getStorageSync('users').name, 10, 30);
    context.fillStyle = "#222";
    context.setFontSize(16)
    context.fillText('邀请你一起来拼团', 10 + 4 * 17, 30);
    context.drawImage(a.logo1, 10, 50, imgWid, imgHei)
    context.drawImage(a.logos, width - 100, imgWid + 100, 80, 80)
    context.fillStyle = "#333";
    context.setFontSize(12)
    for (var b = 0; b < row.length; b++) {
      console.log(row[b])
      if (b <= 1) {
        context.fillText(row[b], 10, imgHei + 80 + 20 * b);
      }
    }
    // 商品价格
    context.fillStyle = "red";
    context.setFontSize(16)
    context.fillText('￥', 10, imgHei + 140);
    context.fillStyle = "red";
    context.setFontSize(22)
    context.fillText(that.data.goods_info.pt_price, 30, imgHei + 140);
    // 长按识别二维码
    context.fillStyle = "#ccc";
    context.setFontSize(14)
    context.fillText('长按识别小程序码访问', 10, imgHei + 160);
    context.draw()
    setTimeout(function() {
      that.genImage()
      that.close()
    }, 1000)
  },
  // 保存图片
  genImage: function(e) {
    var that = this
    var width = this.data.width
    var height = this.data.canvas_height
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: width,
      height: height,
      canvasId: 'firstCanvas',
      success: function(res) {
        console.log(res.tempFilePath)
        wx.hideLoading()
        that.setData({
          genImage: res.tempFilePath,
          friendsImage: false
        })
      }
    })
  },
  close: function(e) {
    this.setData({
      friendsImage: true,
      share: true
    })
  },
  // 保存图片
  toTemp: function(e) {
    var that = this
    wx.saveImageToPhotosAlbum({
      filePath: that.data.genImage,
      success: res => {
        console.log(res)
        wx.showToast({
          title: '保存成功',
        })
        that.setData({
          friendsImage: true,
          share: true
        })
      },
      fail: res => {
        //  console.log(res)
      },
      complete: res => {
        // console.log(res)
      }
    })
  },
  // 控制转发显示与隐藏
  share: function(e) {
    var that = this
    var share = that.data.share
    if (share == true) {
      share = false
    } else {
      share = true
    }
    that.setData({
      share: share
    })
  },
  // 跳转参团详情
  collageInfo: function(e) {
    var a = this.data
    console.log(a.goods_info)
    console.log(e)
    var data = e.currentTarget.dataset
    var goods = a.goods_info
    wx.navigateTo({
      url: 'collageInfo?id=' + data.id+ '&user_id=' + data.userid + '&goods_id=' + goods.id
    })
  },
  // 跳转提交订单页面   单独购买
  alone_pay:function(e){
    var that = this
    var a = that.data
    wx.navigateTo({
      url: 'qgform?store_id=' + a.goods_info.store_id + '&goods_id=' + a.goods_info.id + '&type=' + 1 + '&group_id=' + '' + '&end_time=' + a.goods_info.end_times + '&xf_time=' + a.goods_info.xf_times,
    })
  },
  // 跳转提交订单页面  开团购买
  group_pay: function (e) {
    var that = this
    var a = that.data
    if (a.already_group==true){
      wx.showModal({
        title: '温馨提示',
        content: '您已经开过团了，是否跳转至我发起的拼团',
        success:res=>{
          if (res.confirm) {
            wx.navigateTo({
              url: 'collageInfo?id=' + a.already.id + '&user_id=' + wx.getStorageSync('users').id + '&goods_id=' + a.goods_info.id,
            })
          }
        }
      })
    } else {
      wx.navigateTo({
        url: 'qgform?store_id=' + a.goods_info.store_id + '&goods_id=' + a.goods_info.id + '&type=' + 2 + '&kt_num=' + a.goods_info.people + '&group_id=' + '' + '&end_time=' + a.goods_info.end_times + '&xf_time=' + a.goods_info.xf_times,
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this
    app.getUserInfo(function (userInfo) {
      if (userInfo.img == '' || userInfo.name == '') {
        wx.navigateTo({
          url: '../smdc/getdl',
        })
      } else {
        that.setData({
          userInfo: userInfo
        })
        that.refresh()
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    this.setData({
      clock:false
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  // countdown(activity.start_time)
  countdown: function(time) {
    var that = this
    var EndTime = time || [];
    var NowTime = Math.round(new Date().getTime() / 1000)
    var total_micro_second = EndTime - NowTime || []
    if (total_micro_second <= 0) {
      app.util.request({
        url:'entry/wxapp/UpdateGroup',
        data:{
          store_id: that.data.store_id
        },
        success:res=>{
          console.log(res)
        }
      })
      that.setData({
        clock: false
      });
    } else if (total_micro_second > 0&&that.data.clock!=false) {
      that.dateformat(total_micro_second)
      setTimeout(function() {
        total_micro_second -= 1000;
        that.countdown(time);
      }, 1000)
    }

  },

  // 时间格式化输出，如11:03 25:19 每1s都会调用一次
  dateformat: function(micro_second) {
    var that = this
    // 总秒数
    var second = Math.floor(micro_second);
    // 天数
    var day = Math.floor(second / 3600 / 24);
    // 小时
    var hr = Math.floor(second / 3600 % 24);
    // 分钟
    var min = Math.floor(second / 60 % 60);
    // 秒
    var sec = Math.floor(second % 60);
    if (day < 10) {
      day = '0' + day
    }
    if (hr < 10) {
      hr = '0' + hr
    }
    if (sec < 10) {
      sec = '0' + sec
    }
    if (min < 10) {
      min = '0' + min
    }
    that.setData({
      day: day,
      hour: hr,
      min: min,
      sec: sec
    })
  },
  // -----------------------------时间戳转换日期时分秒--------------------------------
  ormatDate: function(dateNum) {
    var date = new Date(dateNum * 1000);
    return date.getFullYear() + "-" + fixZero(date.getMonth() + 1, 2) + "-" + fixZero(date.getDate(), 2) + " " + fixZero(date.getHours(), 2) + ":" + fixZero(date.getMinutes(), 2) + ":" + fixZero(date.getSeconds(), 2);

    function fixZero(num, length) {
      var str = "" + num;
      var len = str.length;
      var s = "";
      for (var i = length; i-- > len;) {
        s += "0";
      }
      return s + str;
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    var that = this
    that.setData({
      share: true
    })
    return {
      title: wx.getStorageSync('users').name + '邀请您一起来拼团',
      path: '/zh_cjdianc/pages/collage/index?store_id=' + that.data.store_id + '&id=' + that.data.id,
      // imageUrl: '../../img/collage/banner.png',
      success: res => {
        console.log(res)
      },
      complete: res => {
        console.log('执行')
      }
    }
  }
})