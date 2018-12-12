// zh_jypx/pages/task/mytask_detail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isSpeaking: false,
    voices: [],
    hidden: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    console.log(options)
    var taskid = options.taskid
    var status = options.status
    //课节id
    var unitid = options.unitid
    var userid = options.userid
    //所点击的下标
    var index = 0
    var page = parseFloat(index) + 1
    that.setData({
      index:index,
      page:page
    })

   //获取所有的课节
    app.util.request({
      'url': 'entry/wxapp/MyTaskList',
      'cachetime': '0',
      data: {
        status: status,
        unitid: unitid,
        userid: userid
      },
      success:function(res){
        console.log(res)
        console.log(res.data.list.length)
        if(res.data.code==200){
          that.setData({
            all_length: res.data.list.length,
            all: res.data.list,
          })
        }

      }
    })

    //获取作业详情
    app.util.request({
      'url': 'entry/wxapp/MyTaskDetails',
      'cachetime': '0',
      data: {
        taskid: taskid,
        status: status
      },
      success: function (res) {
        console.log("作业详情")
        console.log(res.data)
        if(res.data.code==200){
          that.setData({
            task_list: res.data.list[0],
            none:res.data
          })
        }else{
          that.setData({
            none: res.data
          })
        }

      },
    })
  },

  /*点击下一题 */
  onNext: function (e) {
    var that = this;
    console.log("that的值")
    console.log(that)
    var all_detail = that.data.all
    console.log("所有数据")
    console.log(all_detail)
    //所点击的下标
    var num = that.data.index;
    var next_num = parseFloat(num) + 1

    var voices = []
    console.log("当前的下标" + num)
    console.log("下一题的下标" + next_num)
    var next_id = all_detail[next_num].id
    console.log(next_id)

    app.util.request({
      "url": "entry/wxapp/TaskDetali",
      'cachetime': '0',
      data: {
        task_id: next_id
      },
      success: function (res) {
        console.log(res)
        if (res.data.code == 200) {
          that.setData({
            task_list: res.data.list[0],
            index: next_num,
            page: next_num + 1,
            voices: voices
          })
        } else {
          that.setData({
            none: res.data
          })
        }
      }
    })
  },

  /*点击录音 */
  touchdown: function (e) {
    var that = this;
    var myDates = new Date()
    var start_min = myDates.getMinutes(); //获取当前分钟数(0-59)
    var start_miao = myDates.getSeconds(); //获取当前秒数(0-59)
    var start_time = start_min * 60 + start_miao
    console.log("分钟:" + start_min + "" + "秒:" + start_miao)
    console.log(start_time)
    //显示话筒
    that.setData({
      isSpeaking: true,
      start_time: start_time
    })
    wx.startRecord({
      success(res) {
        //建立临时路径
        var tempFilePath = res.tempFilePath
        console.log("tempFilePath: " + tempFilePath)
        //保存录音
        wx.saveFile({
          tempFilePath: tempFilePath,
          success: function (res) {
            console.log(res)
            var saveFilePath = res.tempFilePath
          }
        })
        wx.showToast({
          title: '恭喜!录音成功',
          icon: 'success',
          duration: 1000
        })

        //获取录音音频
        wx.getSavedFileList({
          success: function (res) {
            console.log(res)
            //var voices = [];
            for (var i = 0; i < res.fileList.length; i++) {
              // var createTime = new Date((res.fileList[i].createTime) * 1000)
              var voice = { filePath: res.fileList[i] }
              // console.log(res.fileList[i])
            }
            console.log(voice)
            that.setData({
              voices: voice
            })
          }
        })

      },
      fail(res) {
        wx.showModal({
          title: '提示',
          content: '您的手势不正确!',
          success: function (res) {
            if (res.confirm) {
              console.log("用户点击了确定")
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      },
      complete: res => {
        console.log(res)
      }
    })


  },
  //点击播放录音  
  gotoPlay: function (e) {
    console.log(e)
    var filePath = e.currentTarget.dataset.key;
    //点击开始播放  
    wx.showToast({
      title: '开始播放',
      icon: 'success',
      duration: 1000
    })
    wx.playVoice({
      filePath: filePath,
      success: function () {
        wx.showToast({
          title: '播放结束',
          icon: 'success',
          duration: 1000
        })
      }
    })
  },

  //录音结束
  touchup: function (e) {
    var that = this;
    console.log(that)
    var start_times = that.data.start_time;
    var myDate = new Date()
    var end_min = myDate.getMinutes(); //获取当前分钟数(0-59)
    var end_miao = myDate.getSeconds(); //获取当前秒数(0-59)
    console.log("分钟:" + end_min + "" + "秒:" + end_miao)
    var end_time = end_min * 60 + end_miao
    var min_time = end_time - start_times
    console.log(end_time)
    //隐藏话筒
    that.setData({
      isSpeaking: false,
      min_time: min_time
    }),
      wx.stopRecord()
  },

  /*点击重新答题回到答题 */
  again: function (e) {
    var that = this;
    var voices = ""
    console.log(that.data)
    console.log(e)

    that.setData({
      hidden: true,
      voices: voices
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