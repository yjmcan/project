// pages/index/curriculum.js
const innerAudioContext = wx.createInnerAudioContext()
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    src: '',
    list:[
      {

      },
      {

      },
      {}

    ],
    play: true,
    total_time:"00:00",
    control_time: "00:00",
    video:false,
    Auditions:true,//是否支持试听
    buy:true,//查看是否购买课程
    comment:false,//发表评论
    buy_title:false,//提示购买
    nodes: "01 你为什么不敢主动说话2842人次播放2018- 06 - 22 16: 52一般而言，开启交谈有两种方式：要么等待别人接近，要么主动接近别人。有的人对“主动开口”这件事，心理上存在一些固有的偏见。只有先克服这些偏见，才能更加自然、更加愉快地开启交谈。第1种偏见：我性格内向，天生不会说话。人有内向、外向之分。大家往往会简单地把“内向”等同于“说话困难户”，把“外向”等同于“口才达人”。其实，事实并非如此。内向的人，是指喜欢通过独处获取能量的人，他们不一定害羞，只是更愿意在内心深思熟虑之后，再来说。所以，他们的最终结论一般比较可靠。 而外向型，是指喜欢通过群体交流获取能量的人，他们或许是“人来疯”，一边说一边思考，人越多越活跃。不管是内向，还是外向，都各有优缺点。内向型让交谈更有深度，有一语惊人的效果；外向型则更喜欢马上表达自己，并且希望与不同类型的人交谈，尽管这不代表他们总会交谈成功。所以，不要过度羡慕别人、模仿别人。越是放弃自己本来的样子，越容易感到沮丧。第2种偏见：对方可能不喜欢我，我怕冒犯他。 你不能要求每个人都先喜欢你，再去开口。更何况，开口之后，最初的第一印象往往会发生改变。比如，你可能觉得对方很冷漠，甚至眼神中透露出鄙夷，但是一和他说话，他马上就变得笑容可掬了。这就像和朋友混熟之后，他可能会告诉你：“以前我跟你说话，你总是翻白眼，交往久了才发现，你这个人其实还不错。”而你可能完全没有印象自己翻过白眼！人的表情，无意之中会造成误会，但当事人可能并没有这个意思。 至于说冒犯对方，不妨换位思考一下：当别人接近你时，你会感觉被冒犯吗？多数时候，你可能会感激对方的示好，让你免于无话可说的尴尬。因此，我们要破除这种心理偏见，先预设：对方也希望和我交流。这么做，最坏的结果，无非是对方跟你“不来电”，那你再结束交谈也不迟，反正也没什么损失。 第3种偏见：如果谈得不愉快，我会感觉很挫败。你没必要自己扛起交谈的全部责任。并不是每次交谈都多么了不起，不是每次交谈都可以影响彼此的人生走向。所以，请放下自己的心理包袱，以随缘的态度去面对每一次聊天。你会发现，有些人只能泛泛而谈，有些人则可以深入讨论，这些都是正常现象。我们交谈，不是为了向对方炫耀自己有多聪明、多厉害，而是要建立起联系，通过对话，加深自己的思考，或者，仅仅是表达一下我们的善意而已。——————本课总结——————有3种常见的心理偏见，会妨碍我们主动开口说话：第1种偏见：我性格内向，天生不会说话。【破解】不要羡慕和模仿别人。越是放弃自己本来的样子，越容易感到沮丧。 第2种偏见：对方可能不喜欢我，我怕冒犯他。【破解】你不能要求每个人都先喜欢你，再去开口。交谈之后，第一印象往往会发生改变。第3种偏见：如果谈得不愉快，我会感觉很挫败【破解】你没必要自己扛起交谈的全部责任。放下心理包袱，以随缘的态度去面对每一次聊天。 ——————大家都来吐吐槽——————每次想搭讪的时候，是什么顾虑让你开不了口？ "
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  

  },
  video:function(e){
    var that = this
    var a = that.data
    var videoContext = wx.createVideoContext('myVideo')
    videoContext.play()
    if (a.buy == false && a.video == true) {
      setTimeout(function (e) {
        videoContext.pause()
        that.setData({
          buy_title: true
        })
      }, 4000)
    } else {
      videoContext.play()
    }
  },
  // 获取视频播放事件
  bindplay: function (e) {
    var that = this
    var a = that.data
    console.log(e)
    if (a.buy) {
      console.log('已经购买课程')
     
    }else{
      var videoContext = wx.createVideoContext('myVideo')
      videoContext.pause()
      that.setData({
        buy_title:true
      })
      console.log('还没有购买课程')
    }
  },
  // 音频的时长
  MusicStart: function(e) {
    var progress = e.detail.currentTime / e.detail.duration * 100
    progress = progress.toFixed(3)
    var that = this
    that.setData({
      progress: progress
    })
    // console.log(progress)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    innerAudioContext.autoplay = false
    innerAudioContext.startTime = 0
    innerAudioContext.src = 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E061FF02C31F716658E5C81F5594D561F2E88B854E81CAAB7806D5E4F103E55D33C16F3FAC506D1AB172DE8600B37E43FAD&fromtag=46'
    // innerAudioContext.play()
    innerAudioContext.onPlay((res1) => {
      console.log(res1)
      innerAudioContext.onTimeUpdate((res) => {
        console.log(innerAudioContext.duration)
        var total_time = Number(innerAudioContext.duration)
        var current_time = Number(innerAudioContext.currentTime)
        // console.log(innerAudioContext.currentTime)
        var progress = current_time / total_time*100
        progress = progress.toFixed(3)
        var time = total_time/60
        var that = this
        that.setData({
          progress: progress,
          total_time: app.formatSeconds(total_time),
          control_time: app.formatSeconds(current_time)
        })
      })
    }) 
  },
  // 播放上一题
  top_curriculum:function(e){

  },
  // 主动触发播放
  play:function(e){
    var that = this
    var a = that.data
    innerAudioContext.play()
    that.setData({
      play:false
    })
    if(a.buy==false){
      setTimeout(function () {
        innerAudioContext.stop()
        that.setData({
          buy_title: true
        })
        that.setData({
          play: true
        })
      }, 10000)
    }
  },
  // 切换视频音频 仅供测试
  switch_video:function(e){
    var that = this
    var a = that.data
    if(a.video==false){
      that.setData({
        video:true
      })
      wx.showToast({
        title: '切换视频',
      })
      innerAudioContext.stop()
      that.video()
    }else{
      that.setData({
        video:false
      })
      wx.showToast({
        title: '切换音频',
      })
    }
  },
  // 播放下一题
  bottom_curriculum:function(e){

  },
  // 主动触发暂停
  pause:function(e){
    innerAudioContext.pause()
    this.setData({
      play: true
    })
  },
  // 发表评论
  Comment:function(e){
    var that = this
    var a = that.data
    // buy==false即为没有购买课程
    if (a.buy==false){
      that.setData({
        buy_title:true
      })
    }else{
      that.setData({
        comment: true
      })
    }
  },
  // 关闭购买提示
  close_buy:function(e){
    var that = this
    var a = that.data
    that.setData({
      buy_title: false
    })
  },
  // 关闭发表评论
  close_comment:function(e){
    var that = this
    var a = that.data
    that.setData({
      comment: false
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})