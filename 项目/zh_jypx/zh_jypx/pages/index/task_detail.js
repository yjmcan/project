// pages/index/task_detail.js
//获取应用实例
const app = getApp()
var select = []
const recorderManager = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext()
var tempFilePath;
var list = []
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isSpeaking: false,
    voices: [],
    hidden: false,
    my_answer: false,
    recording:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(select)
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

    //作业详情的id
    var task_id = options.task_id
    //课节id
    var unit_id = options.unit_id
    //所点击的下标
    var index = 0

    var page = parseFloat(index) + 1
    var that = this;
    // console.log(options)
    // console.log(that)
    // console.log(task_id)
    that.setData({
      task_id: task_id,
      index: index,
      page: page
    })
    app.util.request({
      "url": "entry/wxapp/Task",
      'cachetime': '0',
      data: {
        unit_id: unit_id
      },
      success: function (res) {
        // console.log(res)
        // //所有的题目
        var all = res.data.list
        //课题长度
        var all_length = (res.data.list).length
        // console.log(all_length)
        that.setData({
          all: all,
          all_length: all_length,
        })
      }
    })

    that.detail()
  },

  detail: function (e) {
    var that = this;
    // console.log(that)
    var task_id = that.data.task_id
    app.util.request({
      "url": "entry/wxapp/TaskDetali",
      'cachetime': '0',
      data: {
        task_id: task_id
      },
      success: function (res) {
        // console.log(res)
        if (res.data.code == 200) {
          that.setData({
            task: res.data.list[0],
            none: res.data
          })
        } else {
          that.setData({
            none: res.data
          })
        }

      }
    })
  },

  /*点击下一题 */
  onNext: function (e) {
    var that = this;
    var all_detail = that.data.all
    var tip = that.data.sourt
    // console.log(tip)
    console.log(select)
    var num = that.data.index;
    var next_num = parseFloat(num) + 1
    var voices = []
    var task_id = all_detail[next_num].id
    app.util.request({
      "url": "entry/wxapp/TaskDetali",
      'cachetime': '0',
      data: {
        task_id: task_id
      },
      success: function (res) {
        // console.log(res)
        if (res.data.code == 200) {
          that.setData({
            task: res.data.list[0],
            index: next_num,
            page: next_num + 1,
            voices: voices,
            my_answer: false,
            recording:true
          })
        }

      }
    })

  },

  //开始录音的时候
  start: function (e) {
    var that = this
    //当前题目的id
    var current_id = that.data.task.id
    // console.log("当前题目的id:" + current_id)
    var myDates = new Date()
    var start_min = myDates.getMinutes(); //获取当前分钟数(0-59)
    var start_miao = myDates.getSeconds(); //获取当前秒数(0-59)
    var start_time = start_min * 60 + start_miao
    // console.log("分钟:" + start_min + "" + "秒:" + start_miao)
    // console.log(start_time)
    // console.log(that)
    //显示话筒
    that.setData({
      isSpeaking: true,
      start_time: start_time
    })

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
    recorderManager.onStart((res) => {
      // console.log('recorder start')
      // console.log(res)
    });
    //错误回调
    recorderManager.onError((res) => {
      // console.log(res);
    })
  },
  //停止录音
  stop: function () {
    var that = this;
    // console.log(that)
    //当前题目的id
    var current_id = that.data.task.id
    console.log("当前题目的id:" + current_id)

    var start_times = that.data.start_time;
    var myDate = new Date()
    var end_min = myDate.getMinutes(); //获取当前分钟数(0-59)
    var end_miao = myDate.getSeconds(); //获取当前秒数(0-59)
    // console.log("分钟:" + end_min + "" + "秒:" + end_miao)
    var end_time = end_min * 60 + end_miao
    var min_time = end_time - start_times
    // console.log(end_time)
    //隐藏话筒
    that.setData({
      isSpeaking: false,
      min_time: min_time,
      my_answer: true
    }),

    recorderManager.stop();
    recorderManager.onStop((res) => {
      this.tempFilePath = res.tempFilePath;
      // console.log('停止录音', res.tempFilePath)
      const { tempFilePath } = res
      var data = res.tempFilePath
      // console.log(res.tempFilePath)
      //判断是否有重复的录音
      var sourt = {
        id: current_id,
        value: res.tempFilePath
      }
      var recording = that.data.recording
      console.log(recording)
      if (recording==true){
        select = select.concat(sourt)
        that.setData({
          select: select,
          recording: false
        })
      }else{
        for (let i in select) {
          console.log(current_id)
          if (select[i].id == current_id) {
            console.log('有重复的录音')
            select[i] = sourt
            console.log(select)
            that.setData({
              select: select,
              recording: false
            })
          } 
        }
      }
     
    })
  },
  upload: function (data) {
    console.log(data)
    var that = this,
      i = data.i ? data.i : 0,
      success = data.success ? data.success : 0,
      fail = data.fail ? data.fail : 0;
    console.log(data.path[i])
    wx.uploadFile({
      url: data.url,
      filePath: data.path[i].value,
      name: 'upfile',
      formData: null,
      success: (resp) => {
        if (resp.data != '') {
          success++;
          var arr = {
            id: data.path[i].id,
            value: resp.data
          }
          list.push(arr)
          console.log(list)
          if(list.length==select.length){
            that.submit()
          }
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
          that.upload(data);
        }

      }
    });
  },


  /*点击提交 */
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    var user_id = wx.getStorageSync('user_msg').id
    var that = this;
    console.log(that)
    console.log("点击提交")
    console.log(list)

    that.upload({
      url: 'https://hl.zhycms.com/app/index.php' + '?i=' + 69 + '&c=entry&a=wxapp&do=UploadFiles&m=zh_jypx',
      path: select
    });

  },
  submit:function(e){
    app.util.request({
      "url": "entry/wxapp/SubmitTask",
      'cachetime': '0',
      data: {
        select: list
      },
      success: function (res) {
        console.log(res)
        // wx: wx.redirectTo({
        //   url: "index",
        // })
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