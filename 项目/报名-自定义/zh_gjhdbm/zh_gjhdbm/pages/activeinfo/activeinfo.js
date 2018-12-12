// pages/activeinfo/activeinfo.js
var app = getApp()
var siteinfo = require('../../../siteinfo.js')
// var WxParse = require('../wxParse/wxParse.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lymessage: true,
    guanzhu: false,

    quxiaogz: true,
    ticket: false,
    show: false,
    share: false,
    Preservation: true,
    hide: false,
    index: 0,
    assess: [],
    page: 1,
    close: false
  },

  /** 
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    app.setNavigationBarColor(this);
    var url_length = siteinfo.siteroot.length - 14
    wx.showLoading({
      title: '正在加载中',
    })
    wx.getSystemInfo({
      success: res => {
        that.setData({
          width: res.windowWidth,
          height: 570
        })
      }
    })
    wx.hideShareMenu()
    if (options.scene == null) {
      var id = options.id
      that.setData({
        id: options.id,
        code_url: siteinfo.siteroot.slice(0, url_length)
      })
    } else {
      var id = options.scene
      that.setData({
        id: options.scene,
        code_url: siteinfo.siteroot.slice(0, url_length)
      })
    }

    // 获取报名列表
    app.util.request({
      'url': 'entry/wxapp/BmList',
      'cachetime': '0',
      data: {
        activity_id: id
      },
      success: function(res) {
        var bmlist = res.data
        if (bmlist.length > 0) {
          that.setData({
            bmlist: bmlist,
            bm_people: bmlist.length
          })
        } else {
          that.setData({
            bmlist: 1,
            bm_people: 0
          })
        }

      },
    })
    // 获取票券信息
    app.util.request({
      'url': 'entry/wxapp/GetTicket',
      'cachetime': '0',
      data: {
        activity_id: id
      },
      success: function(res) {
        var tickets = res.data
        var num = 0
        for (let i in tickets) {
          tickets[i].num = 0
          tickets[i].sy_num = Number(tickets[i].total_num) - Number(tickets[i].yg_num)
          num += tickets[i].num
        }
        that.setData({
          num: num,
          tickets: tickets,
        })
      },
    })
    var user_id = wx.getStorageSync('userInfo').id
    var img = wx.getStorageSync('userInfo').img
    var name = wx.getStorageSync('userInfo').name
    var rz_type = wx.getStorageSync('userInfo').rz_type
    that.setData({
      user_id: user_id,
      rz_type: rz_type,
      clear_time: false
    })
    that.assess()
    // 获取分类
    app.util.request({
      'url': 'entry/wxapp/typeList',
      'cachetime': '0',
      success: function(res) {
        var typeList = res.data
        that.setData({
          typeList: typeList
        })
        that.refresh()
      },
    })
  },
  assess: function(e) {
    var that = this
    var id = that.data.id
    var page = that.data.page
    var assess = that.data.assess
    // 获取该活动的留言 
    app.util.request({
      url: 'entry/wxapp/ActivityAssessList',
      data: {
        activity_id: id,
        page: page,
      },
      success: res => {
        if (res.data.length > 0) {
          assess = assess.concat(res.data)
          that.setData({
            assess: assess,
            page: page + 1
          })
        }
      }
    })
  },
  refresh: function(e) {
    var that = this
    var typeList = that.data.typeList
    var id = that.data.id
    // 获取网址
    app.util.request({
      'url': 'entry/wxapp/url',
      'cachetime': '0',
      success: function(res) {
        that.setData({
          url: res.data
        })
        var url = res.data
        var clear_time = that.data.clear_time
        var today = app.today_time()
        var typeList = that.data.typeList
        app.util.request({
          'url': 'entry/wxapp/ActivityDetails',
          'cachetime': '0',
          data: {
            activity_id: id
          },
          success: function(res) {
            console.log(res)
            var activity = res.data
            var article = res.data.content;
            // WxParse.wxParse('article', 'html', article, that, 5);
            // 获取活动主办方的认证状态
            app.util.request({
              'url': 'entry/wxapp/CheckAttestation',
              'cachetime': '0',
              data: {
                user_id: activity.user_id
              },
              success: function(res) {
                if (res.data != false) {
                  that.setData({
                    rz_type: res.data.type
                  })
                }
              },
            })
            for (let m in typeList) {
              if (activity.type_id == typeList[m].id) {
                activity.type_id = typeList[m].type_name
              }
            }
            countdown(activity.end_time)

            function countdown(time) {
              var EndTime = time || [];
              var NowTime = Math.round(new Date().getTime() / 1000);
              var total_micro_second = EndTime - NowTime || [];
              that.setData({
                clock: dateformat(total_micro_second)
              });
              if (total_micro_second <= 0) {
                that.setData({
                  clock: "已经截止"
                });
              } else if (total_micro_second > 0 && that.data.clear_time == false) {
                setTimeout(function() {
                  total_micro_second -= 1000;
                  countdown(time);
                }, 1000)
              }

            }

            // 时间格式化输出，如11:03 25:19 每1s都会调用一次
            function dateformat(micro_second) {
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
              var time = {
                day: day,
                hr: hr,
                min: min,
                sec: sec
              }
              return time
            }

            // 活动开始时间-----------时间戳转换为时间
            activity.start_time = app.ormatDate(activity.start_time).slice(0, 16)
            // 计算活动发布时间的前一天
            activity.yestoday = app.yestoday(activity.start_time)
            activity.end_time = app.ormatDate(activity.end_time).slice(0, 16)
            if (activity.is_close == 1) {
              if (today < activity.end_time) {
                activity.activity_over = 1

              } else {
                activity.activity_over = 2
              }
            } else {
              activity.activity_over = 2
            }

            if (activity.hd_imgs != '') {
              activity.hd_imgs = activity.hd_imgs.split(",");
            }
            var a = url + activity.logo
            console.log('活动主图片路径',a)
            wx.downloadFile({
              url: a, //仅为示例，并非真实的资源
              success: function(res) {
                console.log('下载活动主图成功信息', res)
                that.setData({
                  activity_img: res.tempFilePath,
                  activity_imgs: true
                })
                that.let_code(id)
              },
              fail:res=>{
                console.log('下载活动主图报错信息',res)
              }
            })
            // 活动金额
            if (activity.cost == 0) {
              activity.cost = '免费'
            } else {
              activity.cost = '￥' + activity.cost
            }
            var src = wx.getStorageSync('url') + activity.logo
            activity.end_time = activity.end_time.slice(5, 16)
            activity.start_time = activity.start_time.slice(5, 16)
            that.setData({
              activity: activity,
              logo: that.data.url + activity.logo
            })
          },
        })
      },
    })
    // 获取活动关注的状态
    app.util.request({
      'url': 'entry/wxapp/CheckGz',
      'cachetime': '0',
      data: {
        user_id: that.data.user_id,
        activity_id: id
      },
      success: function(res) {
        if (res.data == 1) {
          that.setData({
            guanzhu: true,
            quxiaogz: false
          })
        } else {
          that.setData({
            guanzhu: false,
            quxiaogz: true
          })
        }
      },
    })
  },
  // 获取二维码并下载
  let_code:function(id){
    var that = this
    // 获取活动二维码
    app.util.request({
      url: 'entry/wxapp/HdPoster',
      data: {
        id: id
      },
      success: res => {
        console.log(res)
        var a = res.data
        console.log('活动二维码路径信息',a)
        wx.downloadFile({
          url: a, //仅为示例，并非真实的资源
          success: function (res) {
            console.log('下载活动二维码成功信息', res)
            console.log(res)
            that.setData({
              poster: res.tempFilePath,
              hd_code: true
            })
            that.ctx()
          },
          fail: res => {
            console.log('下载活动二维码报错信息', res)
          }
        })
      }
    })
  },
  // 裁剪图片合成
  ctx: function(e) {
    var that = this
    var a = that.data
    console.log(a.activity_imgs,'这是验证活动主图下载完毕')
    console.log(a.hd_code, '这是验证活动二维码图片下载完毕')
    if (a.activity_imgs == true && a.hd_code == true) {
      console.log('执行裁剪操作')
      console.log(a.poster)
      console.log(a.activity_img)
      var width = a.width //屏幕宽度
      var height = a.height //屏幕高度
      var leiWid = (width - 150) / 2
      // 声明画布
      var ctx = wx.createCanvasContext('ctx')
      // 商品二维码
      ctx.drawImage(a.poster, 0, 0, 150, 150)
      ctx.save()
      ctx.beginPath()
      ctx.arc(75, 75, 35, 0, 2 * Math.PI)
      ctx.clip()
      // 商家logo
      ctx.drawImage(a.activity_img, 35, 35, 75, 75)
      ctx.restore()
      ctx.draw()
      setTimeout(function(e) {
        wx.canvasToTempFilePath({
          x: 0,
          y: 0,
          width: 150,
          height: 150,
          canvasId: 'ctx',
          success: function(res) {
            console.log(res.tempFilePath)
            that.setData({
              logos: res.tempFilePath
            })
            that.canvas()
          }
        })
      }, 500)
    } else {
      console.log('执行失败')
      setTimeout(function() {
        that.ctx()
      }, 1000)
    }

  },
  canvas: function(e) {
    var that = this
    var a = that.data
    var length = a.activity.title.length
    if (a.activity.title.length*18>=a.width*0.7){
      var title = a.activity.title.slice(0, a.width * 0.7/length)+'...'
    }else{
      var title = a.activity.title
    }
    var name = wx.getStorageSync('userInfo').name
    if (name.length>5){
      name = name.slice(0,5)+'...'
    }
    var l_h = a.width*(300/a.width)
    var context = wx.createCanvasContext('cb')
    console.log('执行了', a.width + ' ' + a.height+' '+a.logos)
    context.setFillStyle('#fff')
    context.rect(0, 0, a.width, a.height)
    context.fill()
    context.drawImage(a.activity_img, 0, 0, a.width, l_h)
    context.drawImage(a.logos, a.width - 90, l_h+180, 80, 80)
    context.fillStyle = "#333";
    context.setFontSize(18)
    context.fillText(title, 10, l_h+40);
    context.fillStyle = "red";
    context.setFontSize(14)
    context.fillText('￥' + a.activity.zd_money + '起', a.width * 0.8, l_h+40);
    context.setStrokeStyle('#f7f7f7')
    context.strokeRect(10, l_h+55, a.width - 20,0.5)
    context.drawImage('../img/biaoqian.png', 0, l_h+75)
    context.fillStyle = "#fff";
    context.fillText('活动信息', 10, l_h+95);
    context.fillStyle = "#666";
    context.fillText('活动时间：' + a.activity.start_time + '至' + a.activity.end_time, 10, l_h+130);
    context.fillText('活动地址：' + a.activity.address, 10, l_h+160);
    context.fillStyle = "red";
    context.setFontSize(14)
    context.fillText(name, 10, l_h+210);
    context.fillStyle = "#666";
    context.setFontSize(14)
    context.fillText('邀请你来参加这个活动', 15 +name.length * 14, l_h+210);
    context.fillStyle = "red";
    context.setFontSize(14)
    context.fillText('长按识别小程序码访问', 10, l_h+240);
    context.draw()
    setTimeout(function(e) {
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: a.width,
        height: a.height,
        canvasId: 'cb',
        success: function(res) {
          console.log('保存活动海报')
          console.log(res.tempFilePath)
          that.setData({
            acticity_poster: res.tempFilePath
          })

        }
      })
      // that.totemp()
    }, 500)
  },
  close_share:function(e){
    this.setData({
      Preservation:true
    })
  },
  // 保存图片
  totemp: function (e) {
    var that = this
    var width = this.data.width
    var height = this.data.height
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: width,
      height: 570,
      canvasId: 'cb',
      success: function (res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: res => {
            that.setData({
              share: false,
              close: false,
              Preservation: true
            })
          },
          fail: res => {
          },
          complete: res => {
          }
        })
      }
    })
  },
  // 动态获取图片的宽高比例
  image: function(e) {
    var that = this
    var img_height = e.detail.height
    var img_width = e.detail.width
    that.setData({
      proportion: img_height / img_width,
      img_height: img_height,
      img_width: img_width,
    })
  },
  // 转发
  share: function(e) {
    var that = this
    var share = that.data.share
    if (share == false) {
      that.setData({
        share: true
      })
    } else {
      that.setData({
        share: false
      })
    }
  },
  // 点击分享到朋友圈
  Preservation: function(e) {
    var that = this
    var Preservation = that.data.Preservation
    // that.canvas()
    that.setData({
      Preservation: false,
      share: false
    })
  },
  message: function() {
    this.setData({
      lymessage: false
    })
  },

  messagebox: function() {
    this.setData({
      lymessage: true
    })
  },

  messagequeding: function() {
    this.setData({
      lymessage: true
    })
    wx.showToast({
      title: '留言成功',
      icon: 'success',
      duration: 2000
    })
  },

  zhubanf: function(e) {
    var that = this;
    var rz_type = that.data.rz_type
    var activity = that.data.activity
    if (rz_type == 0 && activity.user_id != 0) {
      rz_type = '未认证'
    } else if (rz_type == 1 && activity.user_id != 0) {
      rz_type = '个人认证'
    } else if (rz_type == 2 && activity.user_id != 0) {
      rz_type = '企业认证'
    } else if (activity.user_id != 0) {
      rz_type = '官方发布'
    }
    var user_id = e.currentTarget.dataset.user_id
    var sponsor = e.currentTarget.dataset.sponsor
    if (activity.user_id != 0) {
      wx: wx.navigateTo({
        url: 'zhubanf?sponsor=' + sponsor + '&rz_type=' + rz_type
      })
    }
  },
  // 关闭票券弹框
  delete_ticket: function(e) {
    var that = this
    var link_name = wx.getStorageSync('userInfo').link_name
    if (link_name == '') {
      that.setData({
        per_info: true,
        close: false
      })
    } else {
      var ticket = that.data.ticket
      if (ticket == true) {
        that.setData({
          ticket: false,
          close: false
        })
      } else {
        that.setData({
          ticket: true,
          close: true
        })
      }
    }



  },
  link_name: function(e) {
    var that = this

    function isTelCode(str) {
      var reg = /^1[3|4|5|7|8|9][0-9]\d{4,8}$/;
      return reg.test(str);
    }
    var value = e.detail.value
    that.setData({
      link_name: value
    })
  },
  link_tel: function(e) {
    var that = this

    function isTelCode(str) {
      var reg = /^1[3|4|5|7|8|9][0-9]\d{4,8}$/;
      return reg.test(str);
    }
    var value = e.detail.value
    if (value.length == 11) {
      if (isTelCode(value) == false) {
        wx.showModal({
          content: '请输入正确的手机号',
        })
      } else {
        that.setData({
          link_tel: value
        })
      }
    }
  },
  // 控制填写个人信息是否显示隐藏
  per_info: function(e) {
    var that = this
    var per_info = that.data.per_info
    if (per_info == true) {
      that.setData({
        per_info: false,
        close: false
      })
    } else {
      that.setData({
        per_info: true,
        close: true
      })
    }
  },
  // 保存个人信息
  save_perinfo: function(e) {
    var that = this
    var link_tel = that.data.link_tel
    var link_name = that.data.link_name
    var title = ''
    if (link_name == '' || link_name == null) {
      title = '请输入姓名'
    } else if (link_tel == '' || link_tel == null) {
      title = '请输入您的联系方式'
    }
    if (title != '') {
      wx.showModal({
        title: '',
        content: title
      })
    } else {
      app.util.request({
        url: 'entry/wxapp/ModifyUserInfo',
        data: {
          user_id: wx.getStorageSync('userInfo').id,
          link_name: link_name,
          link_tel: link_tel
        },
        success: res => {
          if (res.data == 1) {
            app.getUserInfo(function(userInfo) {
              that.setData({
                userInfo: userInfo,
              })
            })
            that.setData({
              per_info: false,
              close: false
            })
          }
        }
      })
    }
  },
  // 跳转到报名列表
  bmlist: function(e) {
    wx.navigateTo({
      url: 'activity_list?id=' + this.data.id,
    })
  },
  // ————————————————关注部分————————————————————
  guanzhu: function() {
    var that = this
    var user_id = that.data.user_id
    var activity_id = that.data.id
    that.setData({
      guanzhu: true,
      quxiaogz: false
    })
    // 点击关注
    app.util.request({
      'url': 'entry/wxapp/savefollow',
      'cachetime': '0',
      data: {
        activity_id: activity_id,
        user_id: user_id
      },
      success: function(res) {
        if (res.data == 1) {
          wx.showToast({
            title: '已关注成功',
            icon: 'success',
            duration: 2000
          })
        }
      },
    })

  },
  quxiaogz: function() {
    var that = this
    var user_id = that.data.user_id
    var activity_id = that.data.id
    that.setData({
      quxiaogz: true,
      guanzhu: false
    })
    // 点击取消关注
    app.util.request({
      'url': 'entry/wxapp/CancelFollow',
      'cachetime': '0',
      data: {
        activity_id: activity_id,
        user_id: user_id
      },
      success: function(res) {
        if (res.data == 1) {
          wx.showToast({
            title: '已取消关注',
            icon: 'success',
            duration: 2000
          })
        }

      },
    })

  },
  openlocation: function(e) {
    var that = this
    var activity = that.data.activity
    var coordinates = that.data.activity.coordinates.split(",")
    wx.openLocation({
      latitude: Number(coordinates[0]),
      longitude: Number(coordinates[1]),
      scale: 28,
      name: activity.title,
      address: activity.address
    })
  },
  make_phone: function(e) {
    wx.makePhoneCall({
      phoneNumber: this.data.activity.link_tel,
    })
  },
  // 减少购买数量
  reduce: function(e) {
    var that = this
    var tickets = that.data.tickets
    var index = e.currentTarget.dataset.index
    tickets[index].num = tickets[index].num - 1
    if (tickets[index].num >= 0) {
      var num = 0
      for (let i in tickets) {
        num += tickets[i].num
      }
      that.setData({
        num: num,
        tickets: tickets
      })
    } else {
      tickets[index].num = 0
      var num = 0
      for (let i in tickets) {
        num += tickets[i].num
      }
      that.setData({
        num: num,
        tickets: tickets
      })
    }
  },
  // 增加购买数量
  plus: function(e) {
    var that = this
    var index = e.currentTarget.dataset.index
    var tickets = that.data.tickets
    if (tickets[index].limit_num <= 0) {
      // tickets[index].num = tickets[index].num + 1
      var num = 0
      for (let i in tickets) {
        num += tickets[i].num
      }
      that.setData({
        num: num,
        tickets: tickets
      })
    } else {
      if (tickets[index].num < Number(tickets[index].sy_num)) {
        if (tickets[index].num < Number(tickets[index].limit_num)) {
          tickets[index].num = tickets[index].num + 1
          var num = 0
          for (let i in tickets) {
            num += tickets[i].num
          }
          that.setData({
            num: num,
            tickets: tickets
          })
        }
      } else {
        wx.showToast({
          title: '余票不足',
        })
      }

    }

  },
  // 下一步 去 付款
  next_step: function(e) {
    var that = this
    var tickets = that.data.tickets
    var price = 0
    for (let i in tickets) {
      tickets[i].price = Number(tickets[i].num) * Number(tickets[i].money)
      price += tickets[i].price
    }
    price = price.toFixed(2)
    var activity_id = that.data.id
    var ticket_set = []
    for (let i in tickets) {
      if (tickets[i].num > 0) {
        ticket_set.push(tickets[i])
      }
    }
    wx.setStorageSync('tickets', ticket_set)
    wx.navigateTo({
      url: '../fill_info/fill_info?price=' + price + '&activity_id=' + activity_id + '&cus_name=' + that.data.activity.cus_name + '&upload=' + that.data.activity.upload,
    })

  },
  // 控制显示与隐藏
  show: function(e) {
    var that = this
    var show = that.data.show
    if (show === false) {
      that.setData({
        show: true,
        close: true,
      })
    } else {
      that.setData({
        show: false,
        close: false,
      })
    }
  },
  // 控制留言显示与隐藏
  hide: function(e) {
    var that = this
    var user_id = that.data.user_id
    var ly_num = wx.getStorageSync('platform').ly_num
    app.util.request({
      url: 'entry/wxapp/GetLyNum',
      data: {
        user_id: user_id
      },
      success: res => {
        if (res.data < ly_num) {
          var hide = that.data.hide
          if (hide === false) {
            that.setData({
              hide: true,
              close: true,
            })
          } else {
            that.setData({
              hide: false,
              close: false,
            })
          }
        } else {
          wx.showModal({
            content: '已达到留言次数上限',
          })
        }

      }
    })
  },
  index: function(e) {
    wx.reLaunch({
      url: '../index/index',
    })
  },
  fabu: function(e) {
    wx.reLaunch({
      url: '../fabu/fabu',
    })
  },
  // 查看大图
  previewImage: function(e) {
    var that = this
    var url = that.data.url
    var urls = []
    var inde = e.currentTarget.dataset.inde
    var pictures = that.data.activity.hd_imgs

    for (let i in pictures) {
      urls.push(url + pictures[i]);
    }
    wx.previewImage({
      current: url + pictures[inde],
      urls: urls
    })
  },
  hide1: function(e) {
    var that = this
    that.setData({
      index: 0
    })
  },
  hide2: function(e) {
    var that = this
    that.setData({
      index: 1
    })
  },
  // textarea
  textarea: function(e) {
    this.setData({
      textarea: e.detail.value
    })
  },
  // 保存评论
  saves: function(e) {
    var that = this
    var textarea = that.data.textarea
    var activity_id = that.data.id
    var user_id = that.data.user_id
    if (textarea == '' || textarea == null) {
      wx.showModal({
        title: '',
        content: '请输入留言',
      })
    } else {
      app.util.request({
        url: 'entry/wxapp/SaveAssess',
        data: {
          activity_id: activity_id,
          user_id: user_id,
          content: textarea,
        },
        success: res => {
          wx.showToast({
            title: '提交成功',
          })
          that.setData({
            hide: false,
            close: false,
            page: 1,
            assess: []
          })
          that.assess()
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.setData({
      xuanran: true
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
    var that = this
    that.setData({
      clear_time: true
    })
    that.refresh()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    var that = this
    that.setData({
      page: 1,
      assess: []
    })
    that.refresh()
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.assess()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    var that = this
    var activity = that.data.activity
    var url = that.data.url
    // if (res.from === 'button') {
    //   // 来自页面内转发按钮
    // }
    return {
      title: activity.title,
      path: 'zh_gjhdbm/pages/activeinfo/activeinfo?id=' + activity.id,
      imageUrl: url + activity.logo,
      success: function(res) {
        // 转发成功
      },
      fail: function(res) {
        // 转发失败
      }
    }
  }
})