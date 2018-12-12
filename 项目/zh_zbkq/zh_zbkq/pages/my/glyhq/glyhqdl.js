// zh_zbkq/pages/my/glyhq/glyhqdl.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bjsl: true,
    tabs: ['领取列表','核销列表'],
    activeIndex: 0,
    mygd: false,
    jzgd: true,
    pagenum:1,
    lqlist:[],
  },
  tel: function (e) {
    var that = this;
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.tel,
    })
  },
  tabClick: function (e) {
    this.setData({
      activeIndex: e.currentTarget.id
    });
  },
  ffsl: function (e) {
    console.log(e.detail.value)
    this.setData({
      ffsl: e.detail.value,
    })
  },
  wanc: function () {
    var yhqid = this.data.yhq.id, ffsl = this.data.ffsl;
    console.log(yhqid, ffsl)
    if(ffsl==''){
      wx.showModal({
        title: '提示',
        content: '修改数量不能为空',
      })
      return false
    }
    if (Number(ffsl) < Number(this.data.yhq.lq_num)){
      wx.showModal({
        title: '提示',
        content: '发放数量不能少于已领取数量',
      })
      return false
    }
    wx.showModal({
      title: '提示',
      content: '确定修改此券的发放数量为' + ffsl + '张？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          //UpdKqNum;
          app.util.request({
            'url': 'entry/wxapp/UpdKqNum',
            'cachetime': '0',
            data: { coupons_id: yhqid, number: ffsl },
            success: function (res) {
              console.log(res.data)
              if(res.data==1){
                wx.showToast({
                  title: '编辑成功',
                })
                setTimeout(function(){
                  wx.navigateBack({

                  })
                },1000)
              }
            }
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    this.setData({
      bjsl: true,
    })
  },
  bj: function () {
    this.setData({
      bjsl: false,
    })
  },
  chakan: function () {
    var that = this
    wx.navigateTo({
      url: '../../index/sjdl?sjid=' + that.data.sjid,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(options)
    this.setData({
      sjid: options.sjid,
      yhqid:options.yhqid,
    })
    //取优惠券详情;
    app.util.request({
      'url': 'entry/wxapp/CouponsInfo',
      'cachetime': '0',
      data: { coupons_id: options.yhqid },
      success: function (res) {
        console.log(res.data)
        wx.setNavigationBarTitle({
          title: '管理' + res.data.md_name + res.data.name,
        })
        that.setData({
          yhq: res.data,
          sysl: Number(res.data.number) - Number(res.data.lq_num),
          ffsl: res.data.number,
        })
      }
    });
    this.lqlb();
  },
  lqlb:function(){
    var yhqid=this.data.yhqid,that=this;
    console.log(yhqid, that.data.pagenum, that.data.lqlist)
    //取优惠券详情;
    app.util.request({
      'url': 'entry/wxapp/Lqlb',
      'cachetime': '0',
      data: { id: yhqid, page: that.data.pagenum },
      success: function (res) {
        console.log('分页返回的门店列表数据', res.data)
        if (res.data.length < 10) {
          that.setData({
            mygd: true,
            jzgd: true,
          })
        }
        else {
          that.setData({
            jzgd: true,
            pagenum: that.data.pagenum + 1,
          })
        }
        var lqlist = that.data.lqlist;
        lqlist = lqlist.concat(res.data)
        var yhx=[],ylq=[];
        for(let i=0;i<lqlist.length;i++){
          if (lqlist[i].state=='2'){
             yhx.push(lqlist[i])
          }
          else{
            ylq.push(lqlist[i])
          }
        }
        console.log(lqlist,yhx,ylq)
        that.setData({
          lqlist: lqlist,
          yhx:yhx,
          ylq:ylq,
        })
      }
    });
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
    console.log('上拉加载', this.data.pagenum)
    var that = this;
    if (!this.data.mygd && this.data.jzgd) {
      this.setData({
        jzgd: false
      })
      this.lqlb();
    }
    else {
      // wx.showToast({
      //   title: '没有更多了',
      //   icon: 'loading',
      //   duration: 1000,
      // })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})