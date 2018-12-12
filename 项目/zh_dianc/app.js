//app.js
App({
	onLaunch: function () {
	},
	onShow: function () {
		console.log(getCurrentPages())
	},
	onHide: function () {
		console.log(getCurrentPages())
	},
	onError: function (msg) {
		console.log(msg)
	},
	util: require('we7/resource/js/util.js'),
  editTabBar: function () {
    var tabbar = this.globalData.tabbar,
      currentPages = getCurrentPages(),
      _this = currentPages[currentPages.length - 1],
      pagePath = _this.__route__;
    (pagePath.indexOf('/') != 0) && (pagePath = '/' + pagePath);
    for (var i in tabbar.list) {
      tabbar.list[i].selected = false;
      (tabbar.list[i].pagePath == pagePath) && (tabbar.list[i].selected = true);
    }
    _this.setData({
      tabbar: tabbar
    });
  },
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
	globalData:{
		userInfo : null,
    tabbar: {
      color: "#333",
      selectedColor: "#34AAFF",
      backgroundColor: "#ffffff",
      borderStyle: "#d5d5d5",
      list: [
        {
          pagePath: "/zh_dianc/pages/seller/gzt",
          text: "工作台",
          iconPath: "/zh_dianc/pages/images/gzt@3x.png",
          selectedIconPath: "/zh_dianc/pages/images/gztxz@3x.png",
          selected: true
        },
        {
          pagePath: "/zh_dianc/pages/seller/dd",
          text: "订单",
          iconPath: "/zh_dianc/pages/images/dd@3x.png",
          selectedIconPath: "/zh_dianc/pages/images/ddxz@3x.png",
          selected: false
        },
        {
          pagePath: "/zh_dianc/pages/seller/cp/cplb",
          text: "商品",
          iconPath: "/zh_dianc/pages/images/dbdc.png",
          selectedIconPath: "/zh_dianc/pages/images/dbdcxz.png",
          selected: false
        },
        {
          pagePath: "/zh_dianc/pages/seller/shezhi",
          text: "设置",
          iconPath: "/zh_dianc/pages/images/sz@3x.png",
          selectedIconPath: "/zh_dianc/pages/images/szxz@3x.png",
          selected: false
        }
      ],
      position: "bottom"
    }
	},
  siteInfo:require('siteinfo.js')
});