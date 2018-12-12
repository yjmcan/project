// zh_gjhdbm/pages/fill_info/fill_info.js
var app = getApp()
var siteinfo = require('../../../siteinfo.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sign_up:[
      {
        name:'姓名'
      },
      {
        name: '手机号'
      }
    ],
    upload_img:[],
    select:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    app.setNavigationBarColor(this);
    console.log(options)
    that.setData({
      price: options.price,
      activity_id: options.activity_id,
      upload: options.upload
    })
    console.log(options.activity_id)
    // 获取报名信息
    app.util.request({
      'url': 'entry/wxapp/Gethdbm',
      'cachetime': '0',
      data: {
        activity_id: options.activity_id
      },
      success: function (res) {
        console.log('获取报名信息')
        console.log(res)
        if(res.data.length==0){
          var sign_up = that.data.sign_up
          if(options.cus_name!=''){
            var obj = {}
            obj.name = options.cus_name
            sign_up.push(obj)
          }
          that.setData({
            sign_up: sign_up
          })
        } else {
          var sign_up = res.data
          if (options.cus_name != '') {
            var obj = {}
            obj.name = options.cus_name
            sign_up.push(obj)
          }
          that.setData({
            sign_up: sign_up
          })
        }
        
      },
    })
    app.getUserInfo(function (userInfo) {
      console.log(userInfo)
      that.setData({
        user_id: userInfo.id,
        openid: userInfo.openid,
        uniacid: userInfo.uniacid
      })
    })
    that.refresh()
  },
  // 选择是否勾选已阅读
  select:function(e){
    this.setData({
      select: !this.data.select
    })
  },
  notice:function(e){
    wx.navigateTo({
      url: 'notice',
    })
  },
  refresh: function (e) {
    var that = this
    var tickets = wx.getStorageSync('tickets')
    var ticket = []
    tickets.map(function (item) {
      var obj = {}
      obj.gm_num = item.num
      obj.money = item.money
      obj.bm_check = item.bm_check
      obj.tk_name = item.tk_name
      obj.ticket_id = item.id
      ticket.push(obj)
    })
    console.log(ticket)
    that.setData({
      tickets: tickets,
      ticket: ticket
    })
    console.log(tickets)
  },
  // 上传图片
  uploadImg: function (e) {
    var that = this
    var upload_img = that.data.upload_img
    wx.chooseImage({
      count: 9 - upload_img.length,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        console.log(res)
        var imgsrc = res.tempFilePaths;
        
        that.setData({
          upload_img: upload_img.concat(imgsrc)
        })
      
      }
    })
  },
  uploadimg: function (data) {
    var that = this,
      upload_img = that.data.upload_img,
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
          upload_img[i] = resp.data
          console.log('上传商家轮播图时候提交的图片数组', upload_img)
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
         wx.showToast({
           icon: "none",
            title: "上传失败"
          })
        //console.log('fail:' + i + "fail:" + fail);
      },
      complete: () => {
        //console.log(i);
        i++;
        if (i == data.path.length) {
          var sign_up = that.data.sign_up
          upload_img = upload_img.join(",")
          var obj = {}
          obj.name = '上传图片'
          obj.value = upload_img
          sign_up = sign_up.push(obj)
          console.log('可以提交了')
          console.log(sign_up)
          that.place_order()
          console.log(typeof (ticket))
          wx.hideToast();
          wx.hideLoading()
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
  cancel_img:function(e){
    var that = this
    var upload_img = that.data.upload_img
    var index = e.currentTarget.dataset.index
    upload_img.splice(index, 1)
    that.setData({
      upload_img: upload_img
    })
  },
  /*
      提交表单
  */
  formSubmit: function (e) {
    var that = this
    var formId = e.detail.formId
    var sign_up = that.data.sign_up
    var value = e.detail.value
    var title = ''
    that.setData({
      formId: formId
    })
    for (var i = 0; i < sign_up.length; i++) {
      sign_up[i].value = value['name' + i]
      if (sign_up[i].value == '') {
        title = '请输入您的' + sign_up[i].name
      }
    }
    if (title != '') {
      wx.showModal({
        title: '温馨提示',
        content: title
      })
    } else {
      console.log('输入完全了')
      that.setData({
        sign_up: sign_up
      })
      var ticket = that.data.ticket
      var user_id = that.data.user_id
      var activity_id = that.data.activity_id
      var price = that.data.price
      var openid = that.data.openid
      console.log('活动id' + '为' + activity_id)
      console.log('用户id' + '为' + user_id)
      console.log('需要支付的金额' + '为' + price)
      console.log('用户的openid' + '为' + openid)
      console.log('这是报名信息')
      console.log(sign_up)
      console.log(typeof (sign_up))
      console.log('这是票券信息')
      var url = siteinfo.siteroot
      if (that.data.upload == 1) {
        that.uploadimg({
          url: url + '?i=' + that.data.uniacid + '&c=entry&a=wxapp&do=Upload&m=zh_gjhdbm',
          path: that.data.upload_img,
        });
        wx.showLoading({
          title: '开始上传',
        })
      }else{
        that.place_order()
      }
    }
  },
  place_order:function(e){
    var that = this
    var formId = that.data.formId
    var ticket = that.data.ticket
    var user_id = that.data.user_id
    var activity_id = that.data.activity_id
    var price = that.data.price
    var openid = that.data.openid
    var sign_up = that.data.sign_up
    if (price <= 0) {
      app.util.request({
        'url': 'entry/wxapp/savebm',
        'cachetime': '0',
        data: {
          activity_id: activity_id,
          user_id: user_id,
          ticket: ticket,
          bm: sign_up,
        },
        success: function (res) {
          console.log('提交报名')
          console.log(res)
          var bm_id = res.data
          var openid = wx.getStorageSync('userInfo').openid
          app.util.request({
            'url': 'entry/wxapp/Message1',
            'cachetime': '0',
            data: {
              form_id: formId,
              openid: openid,
              bm_id: bm_id
            },
            success: function (res) {
              console.log('发送模板消息')
              console.log(res)
            },
          })

          wx.redirectTo({
            url: 'fill_success?price=' + that.data.price,
          })

        },
      })
    } else {
      // 先下单后支付
      app.util.request({
        'url': 'entry/wxapp/savebm',
        'cachetime': '0',
        data: {
          activity_id: activity_id,
          user_id: user_id,
          ticket: ticket,
          bm: sign_up,
        },
        success: res => {
          console.log('保存报名')
          console.log(res)
          var bm_id = res.data
          app.util.request({
            'url': 'entry/wxapp/Pay',
            'cachetime': '0',
            data: { openid: openid, money: price, bm_id: bm_id },
            success: function (res) {
              wx.requestPayment({
                'timeStamp': res.data.timeStamp,
                'nonceStr': res.data.nonceStr,
                'package': res.data.package,
                'signType': res.data.signType,
                'paySign': res.data.paySign,
                'success': function (res) {
                  console.log('支付成功')
                  console.log(res)
                  var openid = wx.getStorageSync('userInfo').openid
                  app.util.request({
                    'url': 'entry/wxapp/Message1',
                    'cachetime': '0',
                    data: {
                      form_id: formId,
                      openid: openid,
                      bm_id: bm_id
                    },
                    success: function (res) {
                      console.log('发送模板消息')
                      console.log(res)
                    },
                  })
                  wx.redirectTo({
                    url: 'fill_success?price=' + that.data.price,
                  })
                },

                'fail': function (res) {
                  console.log('支付失败')
                  console.log(res)
                  wx.showToast({
                    title: '支付失败',
                    duration: 1000
                  })
                },
              })
            },
          })
          // if (res.data == 1) {

          // }else{
          //   wx.showToast({
          //     title: '下单失败',
          //     duration: 1000
          //   })
          // }
        }
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