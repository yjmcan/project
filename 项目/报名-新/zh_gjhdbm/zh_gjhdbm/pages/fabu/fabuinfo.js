// pages/fabu/fabuinfo.js
var app = getApp()
var imgArray1 = []
var siteinfo = require('../../../siteinfo.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    addmuban: true,
    textarea: true,
    edit: false,
    textarea_info: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var that = this
    app.setNavigationBarColor(this);
    that.setData({
      events: options,
      url: wx.getStorageSync('url')
    })
    console.log(imgArray1)
    // 获取网址
    app.util.request({
      'url': 'entry/wxapp/url',
      'cachetime': '0',
      success: function (res) {
        console.log('这是网址')
        console.log(res)
        that.setData({
          url: res.data
        })
      },
    })
    app.getUserInfo(function (userInfo) {
      console.log(userInfo)
      that.setData({
        userInfo: userInfo,
      })
    })
    // 编辑活动
    if (options.imgs != '') {
      console.log('这是有图片')
      var imgs = options.imgs.split(",")
      for (let i in imgs) {
        imgArray1.push(imgs[i])
      }
      that.setData({
        textarea: true,
        edit: true,
        imgArray1: imgArray1
      })
    }
    if (options.content != '') {
      console.log('这是有内容')
      that.setData({
        textarea: false,
        edit: false,
        imgArray1: imgArray1,
        textarea_info: app.convertHtmlToText(options.content)
      })
    }
  },
  // 纯文本显示
  textarea: function (e) {
    var that = this
    that.setData({
      textarea: false,
      addmuban: true
    })
  },
  botxianshi: function () {
    var that = this;
    this.setData({
      addmuban: false,
    })
  },
  // 上传图片
  img_array: function (e) {
    var that = this
    that.setData({
      addmuban: true
    })
    var url = siteinfo.siteroot
    wx.chooseImage({
      count: 9,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        wx.showToast({
          icon: "loading",
          title: "正在上传"
        })
        var imgsrc = res.tempFilePaths;
        that.uploadimg({
          url: url + '?i=' + that.data.userInfo.uniacid + '&c=entry&a=wxapp&do=Upload&m=zh_gjhdbm',
          path: imgsrc
        });
      }
    })
  },
  uploadimg: function (data) {
    var that = this,
      i = data.i ? data.i : 0,
      success = data.success ? data.success : 0,
      fail = data.fail ? data.fail : 0;
    wx.uploadFile({
      url: data.url,
      filePath: data.path[i],
      name: 'upfile',
      formData: null,
      success: (resp) => {
        if (resp.data != '') {
          //console.log(resp)
          success++;
          imgArray1.push(resp.data)
          if (imgArray1.length > 0) {
            that.setData({
              imgArray1: imgArray1,
              edit: true
            })
          } else {
            that.setData({
              edit: false
            })
          }

          console.log('上传商家轮播图时候提交的图片数组', imgArray1)
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
        //console.log('fail:' + i + "fail:" + fail);
      },
      complete: () => {
        //console.log(i);
        i++;
        if (i == data.path.length) {
          that.setData({
            images: data.path
          });
          wx.hideToast();
          //console.log('执行完毕');
          // console.log('成功：' + success + " 失败：" + fail);
        } else {
          //console.log(i);
          data.i = i;
          data.success = success;
          data.fail = fail;
          that.uploadimg(data);
        }

      }
    });
  },
  // 删除文本框
  delete_text: function (e) {
    this.setData({
      textarea: true
    })
  },
  // 删除图片
  delete: function (e) {
    console.log(e)
    var that = this
    var index = e.currentTarget.dataset.index
    Array.prototype.indexOf = function (val) {
      for (var i = 0; i < this.length; i++) {
        if (this[i] == val) return i;
      }
      return -1;
    };
    Array.prototype.remove = function (val) {
      var index = this.indexOf(val);
      if (index > -1) {
        this.splice(index, 1);
      }
    };
    imgArray1.remove(imgArray1[index])
    that.setData({
      imgArray1: imgArray1
    })
    if (imgArray1.length == 0) {
      that.setData({
        edit: false
      })
    }
  },
  botcancel: function () {
    var that = this;
    this.setData({
      addmuban: true
    })
  },
  // 获取文本框输入的内容
  textarea_info: function (e) {
    console.log(e)
    this.setData({
      textarea_info: e.detail.value
    })
  },
  botnext: function () {
    var that = this;
    wx: wx.navigateTo({
      url: 'fabusuccess',
    })
  },
  formSubmit: function (e) {
    console.log(e)
    var that = this
    var formId = e.detail.formId
    var events = that.data.events
    imgArray1 = imgArray1
    var userInfo = that.data.userInfo
    var user_id = userInfo.id
    // 标题
    var title = events.title
    // logo
    var logo = events.uplogo
    // 开始时间
    var start_time = events.start_time
    // 结束时间
    var end_time = events.end_time
    // 活动参与方式
    if (events.mode == '在线报名') {
      var join_type = 1
    } else {
      var join_type = 3
    }
    // 活动场景
    var activity_type = events.array
    if (activity_type == '线上活动') {
      activity_type = 1
    } else {
      activity_type = 2
    }
    // 活动报名信息
    var bm_info = events.bminfo
    // 活动详情
    var content = that.data.textarea_info
    // 替换回车符
    content = content.replace("\n", "↵");
    // 活动分类
    var type_id = events.classification
    // 活动城市
    var cityname = wx.getStorageSync('city')
    // 活动地址
    var address = events.address
    // 活动地址经纬度
    var coordinates = events.coordinates
    // 活动图片
    var hd_imgs = imgArray1.join(",")
    // 票券信息
    var ticket = wx.getStorageSync('actype')
    // 联系电话
    var link_tel = events.link_tel
    // 主办方姓名
    var sponsor = events.sponsor
    // 活动所属城市
    if (wx.getStorageSync('platform').city_open == 1) {
      var city = events.city
    } else {
      var city = ''
    }
    // 最低价格
    var samll_price = events.samll_price
    // 核销码
    var hx_code = events.hx_code
    // 活动id
    var activity_id = events.activity_id
    console.log('用户id为' + user_id)
    console.log('标题为' + title)
    console.log('logo为' + logo)
    console.log('开始时间' + '为' + start_time)
    console.log('结束时间' + '为' + end_time)
    console.log('活动场景' + '为' + activity_type)
    console.log('报名信息' + '为' + bm_info)
    console.log('活动详情' + '为' + content)
    console.log('活动分类' + '为' + type_id)
    console.log('活动城市' + '为' + cityname)
    console.log('活动地址' + '为' + address)
    console.log('活动地址经纬度' + '为' + coordinates)
    console.log('活动图片' + '为' + hd_imgs)
    console.log('联系电话' + '为' + link_tel)
    console.log('票券信息' + '为')
    console.log(ticket)
    console.log('主办方姓名' + '为' + sponsor)
    console.log('所属城市' + '为' + city)
    console.log('核销码' + '为' + hx_code)
    console.log('活动id' + '为' + activity_id)
   
   if(activity_id!=null){
     app.util.request({
       'url': 'entry/wxapp/SaveActivity',
       'cachetime': '0',
       data: {
         activity_id: activity_id,
         user_id: user_id,
         title: title,
         logo: logo,
         start_time: start_time,
         end_time: end_time,
         bm_start: start_time,
         bm_end: end_time,
         join_type: join_type,
         activity_type: activity_type,
         content: content,
         type_id: type_id,
         cityname: city,
         address: address,
         bm_info: bm_info,
         coordinates: coordinates,
         hd_imgs: hd_imgs,
         link_tel: link_tel,
         sponsor: sponsor,
         sponser: userInfo.name,
         zd_money: events.zd_money,
         hx_code: hx_code
       },
       success: function (res) {
         console.log('这是提交报名结果')
         console.log(res)
         if (res.data == 1) {
           wx.showToast({
             title: '修改成功',
           })
           setTimeout(function () {
             wx.redirectTo({
               url: 'fabusuccess',
             })
           }, 1500)
         }
       },
     })
   }else{
 app.util.request({
      'url': 'entry/wxapp/SaveActivity',
      'cachetime': '0',
      data: {
        user_id: user_id,
        title: title,
        logo: logo,
        start_time: start_time,
        end_time: end_time,
        bm_start: start_time,
        bm_end: end_time,
        join_type: join_type,
        activity_type: activity_type,
        content: content,
        type_id: type_id,
        cityname: city,
        address: address,
        bm_info: bm_info,
        coordinates: coordinates,
        hd_imgs: hd_imgs,
        ticket: ticket,
        link_tel: link_tel,
        sponsor: sponsor,
        sponser: userInfo.name,
        zd_money: samll_price,
        hx_code: hx_code
      },
      success: function (res) {
        console.log('这是提交报名结果')
        console.log(res)
        var activity_id = res.data
        var openid = wx.getStorageSync('userInfo').openid
        app.util.request({
          'url': 'entry/wxapp/Message2',
          'cachetime': '0',
          data: {
            form_id: formId,
            openid: openid,
            activity_id: activity_id
          },
          success: function (res) {
            console.log('发送模板消息')
            console.log(res)
          },
        })
        wx.redirectTo({
          url: 'fabusuccess',
        })
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
    if (imgArray1.length > 0) {
      imgArray1.splice(0, imgArray1.length)
    }

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

  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})