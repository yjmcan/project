  //logs.js
  const util = require('../../utils/util.js')
  const app = getApp()
  Page({
    data: {
      logs: [],
      imgUrls: [
        'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
        'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
        'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
      ],
      indicatorDots: false,
      autoplay: false,
      interval: 5000,
      duration: 1000
    },
    onLoad: function() {
      var that = this
      wx.hideShareMenu()
      var menu = app.bottom_menu('/zh_cjpt/pages/logs/logs')
      app.util.request({
        url: 'entry/wxapp/Url',
        success: res => {
          console.log(res)
          that.setData({
            url: res.data
          })
        }
      })
      // app.request({
      //   url:'https://hl.zhycms.com/app/index.php?i=92&t=0&v=1.0&from=wxapp&c=entry&a=wxapp&do=Attachurl&&m=zh_cjpt&sign=22b14012f0fd2039ae4a3ececb7dbdef',
      //   data:{},
      //   method:'Post',
      //   success:res=>{
      //     console.log('返回的结果为',res)
      //   }
      // })
      app.util.request({
        url: 'entry/wxapp/GetNotice',
        success: res => {
          console.log('公告列表为',res)
          that.setData({
            GetNotice: res.data
          })
        }
      })
      that.setData({
        menu: menu,
        qs: wx.getStorageSync('qs')
      })
      //====================================获取系统设置=============================================//
      app.getSystem(function(getSystem) {
        console.log(getSystem)
        that.setData({
          getSystem: getSystem,
          color: getSystem.color
        })
        wx.setNavigationBarColor({
          frontColor: '#ffffff',
          backgroundColor: getSystem.color,
        })
      })
      that.setData({
        logs: (wx.getStorageSync('logs') || []).map(log => {
          return util.formatTime(new Date(log))
        })
      })
    },
    // 底部导航跳转
    route_page: function(e) {
      wx.reLaunch({
        url: e.currentTarget.dataset.url,
      })
    },
    abnormal:function(e){
      wx.navigateTo({
        url: 'abnormal',
      })
    },
    tj: function(e) {
      wx.navigateTo({
        url: 'tab',
      })
    },
    xx: function(e) {
      wx.navigateTo({
        url: 'xx',
      })
    },
    zj: function(e) {
      wx.navigateTo({
        url: 'zj',
      })
    },
    help: function(e) {
      wx.navigateTo({
        url: 'capital',
      })
    },
    bill: function(e) {
      wx.navigateTo({
        url: 'bill?id=' + e.currentTarget.dataset.id,
      })
    },
    platform:function(e){
      wx.navigateTo({
        url: 'reward',
      })
    },
    custom:function(e){
      wx.navigateTo({
        url: 'xx',
      })
    },
    remove: function(e) {
      wx.showModal({
        title: '',
        content: '是否退出当前账号',
        success: res => {
          if (res.confirm) {
            wx.clearStorage()
            wx.reLaunch({
              url: '../mine/zhuce',
            })
          }
        }
      })
    },
    sz: function(e) {
      var qs_id = wx.getStorageSync('qs').id
      var status = e.currentTarget.dataset.id
      if (wx.getStorageSync('qs').status == status) {
        if (status == 1) {
          app.succ_m('当前正处于上班状态')
        } else {
          app.succ_m('当前正处于休息状态')
        }
      } else {
        wx.showModal({
          title: '温馨提示',
          content: '是否切换当前状态',
          success: res => {
            if (res.confirm) {
              app.util.request({
                url: 'entry/wxapp/Work',
                data: {
                  qs_id: qs_id,
                  status: status
                },
                success: res => {
                  console.log(res)
                  app.succ_t('设置成功', true)
                  setTimeout(function() {
                    wx.reLaunch({
                      url: '../mine/zhuce'
                    })
                  }, 1500)
                }
              })
            }
          }
        })
      }
    },
  })