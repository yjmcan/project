// pages/xuanshang/xsinfo.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bomb: true,
    place_order:false,
    conon: true,
    list: [
      { id: "0", title: "我是王五", time: "2018 - 02 - 12 12: 00", con: "还不错还不错还不错还不错还不错还不错", name: "张三", text: "真的呢" },
      { id: "1", title: "我是王撒", time: "2018 - 03 - 12 12: 00", con: "真的真的真的还不错还不错", name: "张起", text: "真的呢" },
      { id: "2", title: "我是王溜", time: "2018 - 05 - 12 12: 00", con: "可以可以还不错还不错还不错", name: "张思", text: "真的呢" }
    ],
    imgs: [
      { src: "../img/zanwei@2x.png" },
      { src: "../img/money.png" },
      { src: "../img/zanwei@2x.png" },
      { src: "../img/laba.png" },
      { src: "../img/zanwei@2x.png" }
    ]
  },
  // 查看大图
  previewImage: function (e) {
    var that = this
    var url = that.data.url
    var urls = []
    var inde = e.currentTarget.dataset.index
    var pictures = that.data.listimg

    for (let i in pictures) {
      urls.push(url + pictures[i]);
    }
    wx.previewImage({
      current: url + pictures[inde],
      urls: urls
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(options)
    var myid = wx.getStorageSync('users').id

    that.setData({
      id: options.id,
      myid: myid
    })
    var id = options.id;

    // —————————————— 获取评论详情——————————
    app.util.request({
      url: 'entry/wxapp/Comment',
      'cachetime': '0',
      data:{
        order_id:id
      },
      success: function (res) {
        console.log(res)
        console.log(res.data)
        var conlist=res.data
        that.setData({
          conlist: conlist
        })
      },
    })
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

    // ———————————————————————————产品详情————————————————————————————
    app.util.request({
      url: 'entry/wxapp/seeorder',
      'cachetime': '0',
      data: { id: id },
      success: function (res) {
        console.log("产品详情")
        console.log(res.data)
        console.log(res.data.length)

        // 判断用户是否已经提交了任务
        app.util.request({
          url: 'entry/wxapp/Once',
          'cachetime': '0',
          data:{
            id: res.data[0].id,
            u_id:wx.getStorageSync('users').id
          },
          success: function (res) {
            console.log(res)
           if(res.data!=''){
             that.setData({
               place_order:true
             })
           }
          console.log(res)
          },
        })
        var imgs=[];
        var order_list = res.data
        var order_info = order_list[0]
        var order_people = []
        var listimgs = order_list[0].thumb;
        /*将用户发表的图片转化成数组 */
        if (listimgs!=''){
          var listimg = listimgs.split(',')
        }else{
          var listimg = []
        }
       
        console.log(listimg)
        /*去掉除参与人数的其它数组 */
        for(var i =0;i<res.data.length;i++){
          if(i!=0&&i!=res.data.length-1){
            order_people.push(res.data[i])
          }
        };
        /*将参与人数的头像转成数组 */
        for (var j = 0; j < order_people.length; j++) {
          imgs.push(order_people[j].simg)
          console.log(order_people[j].simg)
        }

        console.log(imgs)
        console.log(order_people)
        console.log(res.data[0].phone)
        that.setData({
          proinfo: res.data,
          phone: res.data[0].phone,
          id: res.data[0].id,
          imgs:imgs,
          listimg: listimg
        })
      },
    });
  },
  
  // ——————————点击拨打电话——————————
  onCall: function (e) {
    var that = this;
    console.log(that.data.phone)
    var phoneNumber = that.data.phone
    wx.makePhoneCall({
      phoneNumber: phoneNumber
    })
  },

  // ——————————点击出现弹框——————————
  bombox: function (e) {
    this.setData({
      bomb: false,
    })
  },

  // ——————————点击关闭弹框——————————
  guanbi: function (e) {
    this.setData({
      bomb: true,
    })
  },

  // ——————————点击出现评论弹框——————————
  onComment: function (e) {
    this.setData({
      conon: false,
    })
  },

  // ——————————点击取消评论弹框消失——————————
  onCanel: function (e) {
    var that = this;
    var concantel = that.data.val;
    concantel:""
    console.log(concantel)
    that.setData({
      conon: true,
      concantel :"none"
    })
  },
  // ——————————点击确定评论弹框消失——————————
  onTrue: function (e) {
    var that = this;
    var text = that.data.val;
    console.log(text)
    that.setData({
      conon: true
    })
  },
  onblur: function (e) {
    var that = this;
    var val = e.detail.value;
    //console.log(val)
    that.setData({
      val: val
    })
  },

  /*跳转编辑页面 */
  bianji: function () {
    var that = this;
    console.log(that.data)
    var id = that.data.id
    wx: wx.navigateTo({
      url: '../fabu/fabu?id=' + id,
    })
  },

  /*跳转任务页面 */
  renwu: function (e) {
    var that = this;
    console.log(that.data)
    var id = that.data.id
    var place_order = that.data.place_order
    if(place_order==true){
      wx.showModal({
        title: '',
        content: '您已经接了任务了',
      })
    } else {
      wx: wx.navigateTo({
        url: '../fabu/fankui?id=' + id,
      })
    }
  },

  /*跳转查看反馈页面 */
  onfankui: function (e) {
    var that = this;
    console.log(that.data)
    var id = that.data.id
    wx: wx.navigateTo({
      url: '../fabu/check?id=' + id,
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
    // if (res.from === 'button') {
    //   // 来自页面内转发按钮
    //   console.log(res.target)
    // }
    // return {
    //   title: '自定义转发标题',
    //   path: '/page/index/index',
    //   imageUrl:"../img/zan@2x.png",
    //   success: function (res) {
    //     // 转发成功
    //   },
    //   fail: function (res) {
    //     // 转发失败
    //   }
    // }
      return {
        title: '微信小程序联盟',
        desc: '最具人气的小程序开发联盟!',
        path: '/page/user?id=123',
        imageUrl: "../img/zan@2x.png",
      }
  }
})