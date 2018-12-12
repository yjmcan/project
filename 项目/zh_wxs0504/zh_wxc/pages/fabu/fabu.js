// pages/fabu/fabu.js
const app = getApp()
var imgArray1=[]
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: '2018-03-01',
    time: '12:01',
  },
 
  // ——————————日期选择事件——————————
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    var now = that.today()
    var id=options.id;
    console.log(id);
    that.setData({
      id: id,
      now: now
    }); 
    // —————————————— 获取网址——————————
    app.util.request({
      url: 'entry/wxapp/Attachurl',
      'cachetime': '0',
      success: function (res) {
        // —————————— 异步保存网址前缀————————
        wx.setStorageSync('url', res.data)
        that.setData({
          url: res.data
        })
      },
    })

    //获取发布的信息
    app.util.request({
      url: 'entry/wxapp/EditOrder',
      data: {
        id: id
      },
      success: res => {
        console.log(res)
        var list=res.data
        var imgs = list.thumb;
        var imgArray1 = imgs.split(",")
        console.log(imgs)
        console.log(imgArray1)
        if (imgs != '') {
          var imgArray1 = imgs.split(',')
        } else {
          var imgArray1 = []
        }
        var times = list.end_time
        var date = times.substring(0,10)
        var time = times.substring(times.length, 11)
        console.log(times)
        console.log(date)
        console.log(time)
        
        that.setData({
          list: list,
          imgArray1: imgArray1,
          date: date,
          time: time
        });
       
      }
    })
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
          url: 'entry/wxapp/upload',
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
    var date = that.data.date;
    var time = that.data.time;
    var id = that.data.id;
    var phone = e.detail.value.phone;
    console.log(id)
    var weixin = e.detail.value.weixin;

    var tip = "";
    if (title == "") {
      tip = "请输入任务标题";
    }else if (date == "") {
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

      app.util.request({
        url: 'entry/wxapp/UpdateOrder',
        'cachetime': '0',
        data: {
          title: title,
          id:id,
          content: detail,
          end_time: end_time,
          thumb: arr,
          phone: phone,
          weixin:weixin,
        },
        success: function (res) {
          console.log("提交成功")
          console.log(res)
          var that=this;
          if (res.data.code == "501"){
            wx.showToast({
              title: '该悬赏订单已有用户提交，不能编辑',
              icon: 'none',
              duration: 1000
            }) 
            setTimeout(
              function () {
                wx.reLaunch({
                  url: '../index/index',
                })
              }, 1000)
            
          }else{
            wx.reLaunch({
              url: '../index/index',
            })
            wx.showToast({
              title: '修改成功',
              icon: 'success',
              duration: 1000
            })
          }
        }
      })
    }
  },
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

  /*删除订单 */
  oncancel:function(e){
    var that=this;
    var id = that.data.id;
    console.log(id)
    app.util.request({
      'url': 'entry/wxapp/DelOrder',
      'cachetime': '0',
      data: {
        id: id,
      },
      success: function (res) {
        console.log("删除成功")
        console.log(res)
        if (res.data.code=="501"){
          wx.showToast({
            title: '该悬赏订单已有用户提交，暂时无法删除',
            icon: 'none',
            duration: 2000
          }) 
          setTimeout(
            function () {
              wx.reLaunch({
                url: '../index/index',
              })
            }, 1000)
        }else{
          wx.reLaunch({
            url: '../index/index',
          })
          wx.showToast({
            title: '删除成功',
            icon: 'success',
            duration: 1000
          }) 
        }   
      }
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