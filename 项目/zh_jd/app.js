//app.js
App({
  onLaunch: function () {
    // function uploadimg(data) {
    //   var that = this,
    //     i = data.i ? data.i : 0,
    //     success = data.success ? data.success : 0,
    //     fail = data.fail ? data.fail : 0;
    
    //   wx.uploadFile({
    //     url: data.url,
    //     filePath: data.path[i],
    //     name: 'upfile',//这里根据自己的实际情况改
    //     formData: {},
    //     success: (res) => {
    //       success++;
    //       console.log(res)
    //       console.log(i);
    //       //这里可能有BUG，失败也会执行这里,所以这里应该是后台返回过来的状态码为成功时，这里的success才+1
    //     },
    //     fail: (res) => {
    //       fail++;
    //       console.log('fail:' + i + "fail:" + fail);
    //     },
    //     complete: () => {
    //       console.log(i);
    //       i++;
    //       if (i == data.path.length) {   //当图片传完时，停止调用          
    //         console.log('执行完毕');
    //         console.log('成功：' + success + " 失败：" + fail);
    //       } else {//若图片还没有传完，则继续调用函数
    //         console.log(i);
    //         data.i = i;
    //         data.success = success;
    //         data.fail = fail;
    //         that.uploadimg(data);
    //       }

    //     }
    //   })
    // }
  },
  onShow: function () {
    // console.log(getCurrentPages())

  },
  onHide: function () {
    // console.log(getCurrentPages())
  },
  onError: function (msg) {
    // console.log(msg)
  },

  util: require('we7/resource/js/util.js'),
  siteInfo: require('siteinfo.js'),
  tabBar: {
    "color": "#123",
    "selectedColor": "#1ba9ba",
    "borderStyle": "#1ba9ba",
    "backgroundColor": "#fff",
    "list": [
      {
        "pagePath": "/we7/pages/index/index",
        "iconPath": "/we7/resource/icon/home.png",
        "selectedIconPath": "/we7/resource/icon/homeselect.png",
        "text": "首页"
      },
      {
        "pagePath": "/we7/pages/user/index/index",
        "iconPath": "/we7/resource/icon/user.png",
        "selectedIconPath": "/we7/resource/icon/userselect.png",
        "text": "微擎我的"
      }
    ]
  },
  globalData: {
    userInfo: null,
  },
});