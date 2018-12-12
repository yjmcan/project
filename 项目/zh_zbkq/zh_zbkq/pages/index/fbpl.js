// pages/comment/comment.js
var app = getApp();
var count = 0;
var util = require('../../utils/util.js');
var imgArray = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    stars: [0, 1, 2, 3, 4],
    normalSrc: '../../img/no-star.png',
    selectedSrc: '../../img/full-star.png',
    key: 0,
    count: 0,
    url: '',
    images: [],
    zsnum:0,
  },
  chooseImage: function () {
    var that = this, images = this.data.images;
    imgArray = [];
    // 选择图片
    wx.chooseImage({
      count: 9 - images.length,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        wx.showToast({
          icon: "loading",
          title: "正在上传"
        })
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        console.log(tempFilePaths);
        var imgsrc = res.tempFilePaths;
        images = images.concat(imgsrc);
        console.log(images)
        // that.setData({
        //   images: images
        // });
        that.uploadimg({
          url: getApp().imglink + 'app/index.php?i=' + getApp().getuniacid + '&c=entry&a=wxapp&do=upload&m=zh_zbkq',
          path: images
        });
      }
    })
  },
  previewImage: function () {
    var that = this;
    // 预览图集
    wx.previewImage({
      urls: that.data.images
    });
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
          console.log(resp)
          success++;
          imgArray.push(resp.data)
          console.log(i);
          console.log('开通门店时候提交的图片数组', imgArray)
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
        console.log('fail:' + i + "fail:" + fail);
      },
      complete: () => {
        console.log(i);
        i++;
        if (i == data.path.length) {
          that.setData({
            images: data.path
          });
          wx.hideToast();
          console.log('执行完毕');
          console.log('成功：' + success + " 失败：" + fail);
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
  delete: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var images = that.data.images;
    images.splice(index, 1);
    imgArray.splice(index, 1)
    console.log('删除images里的图片后剩余的图片', imgArray)
    that.setData({
      images: images
    });
  },
  pl: function (e) {
    console.log(e.detail.value)
    var zsnum = parseInt(e.detail.value.length);
    this.setData({
      zsnum: zsnum
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options,imgArray)
    this.setData({
      mdlogo:options.sjlogo,
      sjid:options.sjid
    })
    imgArray=[];
    var that = this;
    console.log(getApp().imglink, getApp().getuniacid)
  },
  //点击左边,半颗星
  selectLeft: function (e) {
    console.log('111111');
    var key = e.currentTarget.dataset.key
    if (this.data.key == 1 && e.currentTarget.dataset.key == 1) {
      //只有一颗星的时候,再次点击,变为0颗
      key = 0;
    }
    count = key
    this.setData({
      key: key,
      count: count
    })

  },

  formSubmit: function (e) {
    // 评论的接口
    var that = this;
    console.log(that.data);
    console.log('form发生了submit事件，携带数据为：', e.detail.value);
    var content = e.detail.value.content;//评论的内容
    var uid = wx.getStorageSync('UserData').id;
    var sjid = that.data.sjid;
    console.log(count + '分' ,'内容是：' , content ,"用户uid是：" , uid ,"sjid是：" ,sjid , '图片' , imgArray);
    var warn = "";
    var flag = true;
    if (count == 0) {
      warn = "请选择评分！";
    } else if (content == '') {
      warn = "请填写您的评论内容"
    } else {
      flag = false;
      app.util.request({
        'url': 'entry/wxapp/SaveAssess',
        'cachetime': '0',
        data: { user_id: uid, md_id: sjid, score: count, content: content, img:imgArray},
        success: function (res) {
          console.log(res)
          if(res.data==1){
            wx.showToast({
              title: '评论成功',
              icon:'success',
              duration:1000
            })
            setTimeout(function(){
              wx.navigateBack({
                
              })
            },1000)
          }
          else if (res.data = '超过评论次数') {
            wx.showModal({
              title: '温馨提示',
              content: '对不起，您对此商家的评论次数超过限制',
            })
          }
          else{
            wx.showToast({
              title: '请重试',
              icon:'loading'
            })
          }
        },
      })
    }
    if (flag == true) {
      wx.showModal({
        title: '提示',
        content: warn
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
    var that = this
    // pageNum = 1;
    that.onLoad()
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
})