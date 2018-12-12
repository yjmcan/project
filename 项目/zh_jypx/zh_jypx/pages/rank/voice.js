// zh_jypx/pages/rank/voice.js
const app = getApp()
const recorderManager = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext()
var tempFilePath;
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  //开始录音的时候
  start: function () {

    const options = {
      duration: 60000,//指定录音的时长，单位 ms
      sampleRate: 16000,//采样率
      numberOfChannels: 1,//录音通道数
      encodeBitRate: 96000,//编码码率
      format: 'mp3',//音频格式，有效值 aac/mp3
      frameSize: 50,//指定帧大小，单位 KB
    }
    //开始录音
    recorderManager.start(options);
    recorderManager.onStart(() => {
      console.log('recorder start')
    });
    //错误回调
    recorderManager.onError((res) => {
      console.log(res);
    })
  },
  //停止录音
  stop: function () {
    var that = this;
    recorderManager.stop();
    recorderManager.onStop((res) => {
      this.tempFilePath = res.tempFilePath;
      console.log('停止录音', res.tempFilePath)
      const { tempFilePath } = res
      that.setData({
        img: res.tempFilePath
      })
      // wx.saveFile({
      //   tempFilePath: res.tempFilePath,
      //   success: function (res) {
      //     console.log(res)
      //     var savedFilePath = res.savedFilePath
      //     console.log(savedFilePath)
      //     that.setData({
      //       src: savedFilePath
      //     })
      //     // wx.getSavedFileList({
      //     //   success: function (res) {
      //     //     console.log(res.fileList)
      //     //   }
      //     // })
      //   }
      // })
      wx.uploadFile({
        url: 'https://hl.zhycms.com/app/index.php' + '?i=' + 69 + '&c=entry&a=wxapp&do=UploadFiles&m=zh_jypx', //仅为示例，非真实的接口地址
        filePath: res.tempFilePath,
        name: 'upfile',
        formData: {},
        success: function (res) {
          var data = res.data
          console.log(res)
          that.setData({
            src:res.data
          })
        }
      })

    })
  },
  // //播放声音
  // play: function () {

  //   innerAudioContext.autoplay = true
  //   innerAudioContext.src = this.tempFilePath,
  //     innerAudioContext.onPlay(() => {
  //       console.log('开始播放')
  //     })
  //   innerAudioContext.onError((res) => {
  //     console.log(res.errMsg)
  //     console.log(res.errCode)
  //   })

  // },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    // —————————————— 获取网址——————————
    app.util.request({
      "url": "entry/wxapp/Attachurl",
      'cachetime': '0',
      success: function (res) {
        that.setData({
          url: res.data
        })
      }
    })
  },
  audioPlay: function (res) {
    console.log("开始播放")
    this.audioCtx.play()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.audioCtx = wx.createAudioContext('myAudio')
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