// pages/fabu/fabuyewu.js
const app = getApp()
var fabu = require("../../utils/util.js");
var msg = require("../../../siteinfo.js");
var imgArray1 = []
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: '',
    time: '',
    activeIndex: 0,
    index: 0,
    money:0,
    num:0,
    showView: false,
    phoneNumber:"",
    hidden:false
  },

  onLoad: function (options) {
    var that = this;
    var now = that.today();
    console.log(now)
    this.setData({
      now: now,
      showView: (options.showView == "true" ? true : false)
    });
    console.log(msg)
    that.result()
    var that = this;

    // —————————————— 获取网址——————————
    app.util.request({
      url: 'entry/wxapp/Attachurl',
      success: function (res) {
        console.log(res)
        that.setData({
          url: res.data
        })
      }
    })

    // —————————————— 获取列表——————————
    app.util.request({
      'url': 'entry/wxapp/Category',
      'cachetime': '0',
      success: function (res) {
        console.log("产品分类数据")
        console.log(res.data)
        if (res.data.code==500){
          console.log("暂无数据")
        }else{
          that.setData({
            infortype: res.data,
            id: res.data[0].id,
            hidden: true
          })
        }
      },
    })
  },

  // ——————————日期选择事件——————————
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    console.log('当前时间', this.data.now)
    this.setData({
      date: e.detail.value
    })
  },

  bindTimeChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      time: e.detail.value
    })
  },

  onTap: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index;
    var id = e.currentTarget.dataset.id;
    console.log(id)
    that.setData({
      index: index,
      activeIndex: index,
      id: id
    })

  },
  result:function(e){
    var that = this
    var money = that.data.money
    var num = that.data.num
    var total = money*num
    console.log(num)
    console.log(money)   
    console.log(total)
    that.setData({
      total:total
    })
  },
  xs_cost:function(e){
    var num = this.data.num
    var money = e.detail.value
    console.log(num)
    console.log(money)
    if (num != 0) {
      this.setData({
        money: e.detail.value
      })
      this.result()
    } 
    this.setData({
      money: e.detail.value
    })
  },
  need_num:function(e){
    var money = this.data.money
    var num = e.detail.value
    console.log(num)
    console.log(money)
    if(money !=0){
      this.setData({
        num: e.detail.value
      })
      this.result()
    }
    this.setData({
      num: e.detail.value
    })
   
  },

  // ——————————点击拨打电话——————————
  getPhoneNumber: function (e) {
    var that = this;
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
    var code = e.detail.iv;
    var data = e.detail.encryptedData;
    var session_key = wx.getStorageSync("key")
    app.util.request({
      url: 'entry/wxapp/phone',
      data: {
        sessionKey: session_key,
        data: data,
        iv: code
      },
      success: res => {
        console.log(res)
        that.setData({
          phoneNumber: res.data.phoneNumber
        });
        wx.setStorageSync("phoneNumber", res.data)
      },
      fail:function(res){
        that.setData({
          phoneNumber: ""
        });
      }
    })

  },

  /**
   * 今天的时间:年,月,日
   */
  today: function () {
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
  },

  // —————————点击上传图片———————————
  upfile: function (e) {
    var that = this;
    wx.chooseImage({
      count: 5, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        console.log(res.tempFilePaths)
        var imgsrc = res.tempFilePaths;
        that.uploadimg({
          url: that.data.url + '?i=' + msg.uniacid + '&c=entry&a=wxapp&do=Upload&m=zh_wxc',
          // url: 'entry/wxapp/upload',
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
    console.log(data.path[i])
    console.log(data.url)
    wx.uploadFile({
      url: data.url,
      filePath: data.path[i],
      name: 'upfile',
      success: (resp) => {
        console.log(resp)
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
          console.log(i);
          data.i = i;
          data.success = success;
          data.fail = fail;
          that.uploadimg(data);
        }

      }
    });
  },

  // 删除图片
  deleteImg: function (e) {
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
  },

  // —————————表单验证,提交———————————
  formSubmit: function (e) {
    console.log(e)
    var that = this
    var detail = e.detail.value.detail;
    var title = e.detail.value.title;
    var money = e.detail.value.money;
    var num = e.detail.value.num;
    var date = that.data.date;
    var time = that.data.time;
    var id = that.data.id;

    console.log(e.detail.formId);

    
    var total = parseFloat(money) * parseFloat(num);
    console.log(total)
    that.setData({
      total: total
    })
    var tip = "";
    if (title == "") {
      tip = "请输入任务标题";
    } else if (!(/([1-9][0-9]*(\.5)?)|(0\.5)/).test(money)) {
      tip = "悬赏金额最小为0.5";
    } else if (!(/^\+?[1-9]\d*$/).test(num)) {
      tip = "所需人数最少为1";
    } else if (date == "") {
      tip = "日期不能为空";
    } else if (time == "") {
      tip = "时间不能为空";
    } else if (detail == "") {
      tip = "内容不能为空";
    }
    if (tip != '') {
      wx.showModal({
        title: '',
        content: tip
      })
    } else {
      var end_time = date + ' ' + time
      // var arr = split("imgArray1")
      var arr = imgArray1.join()
      var userid = wx.getStorageSync('users').id
      console.log(userid)
      app.util.request({
        'url': 'entry/wxapp/PublishOrder',
        'cachetime': '0',
        data: {
          title: title,
          c_id: id,
          content: detail,
          price: money,
          number: num,
          end_time: end_time,
          s_id: userid,
          thumb: arr,
          phone: that.data.phoneNumber,
          total: total
        },
        success: function (res) {
          console.log("提交成功")
          console.log(res)
          var order_id = res.data.row.id;
          var openid = wx.getStorageSync('users').openid
          app.util.request({
            'url': 'entry/wxapp/Pay',
            'cachetime': '0',
            data: { openid: openid, total: total, order_id: order_id },
            success: function (res) {
              console.log(res)
              wx.requestPayment({
                'timeStamp': res.data.timeStamp,
                'nonceStr': res.data.nonceStr,
                'package': res.data.package,
                'signType': res.data.signType,
                'paySign': res.data.paySign,
                'success': function (res) {
                  console.log('支付成功')
                  console.log(res)
                  wx.navigateBack({
                    delta: 1
                  })
                  wx.showToast({
                    title: '支付成功',
                    duration: 1000
                  })
                },

                'fail': function (res) {
                  console.log('支付失败')
                  console.log(res)
                  // wx.navigateBack({
                  //   delta: 1
                  // })
                  // wx.showToast({
                  //   title: '支付失败',
                  //   duration: 1000
                  // })
                },
              })
            },
          })
          wx.showToast({
            title: '提交成功',
            icon: 'success',
            duration: 1000
          })
          console.log(res)
        
        }

      })
    }
  },

  //收集formid
  // submitInfo:function(e){
  //   console.log('formId是')
  //   console.log(e.detail.formId);
  //   app.util.request({
  //     "url":"entry/wxapp/SaveFormid",
  //     "cachetime":"0",
  //     data:{
  //       user_id:wx.getStorageSync("users").id,
  //       form_id: e.detail.formId
  //     }
  //   })

  // },
  /*更多显示,隐藏 */
  more_con:function(e){
    console.log(this.data)
    var that = this;
    that.setData({
      showView: (!that.data.showView)
    })
  },

  // ——————————跳转到个人中心——————————
  wode: function (e) {
    wx: wx.redirectTo({
      url: '../logs/logs',
    })
  },

  // ——————————跳转到榜单——————————
  bangdan: function (e) {
    wx: wx.redirectTo({
      url: '../bangdan/bangdan',
    })
  },

  // ——————————跳转到首页——————————
  index: function (e) {
    wx: wx.redirectTo({
      url: '../index/index',
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
    //清空图片
    console.log(imgArray1)
    imgArray1.splice(0, imgArray1.length)
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
  onShareAppMessage: function () {

  }
})