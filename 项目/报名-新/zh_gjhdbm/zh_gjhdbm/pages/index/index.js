//index.js
//获取应用实例
const app = getApp()
var QQMapWX = require('../utils/qqmap-wx-jssdk.js'),
    qqmapsdk;
Page({
    data: {
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        swiperCurrent: 0,
        indicatorDots: false,
        autoplay: true,
        interval: 5000,
        duration: 1000,
        bomb: false,
        page: 1,
        Speed: 50,
        orderby: 1,
        activity_list: [],
        list: [
            '距离最近', '价格最低', '热门活动', '综合排序'
        ]
    },
    onLoad: function(options) {
        var that = this
        app.getUserInfo(function(a) {
            console.log(a)
            var location = wx.getStorageSync('location')
            let op = location.latitude + ',' + location.longitude
            // 加载城市
            that.citys()
            // 用户通过扫描分销二维码进来的
            var scene = decodeURIComponent(options.scene)
            if (scene != null) {
                var partner_lower = scene
            }
            if (options.upper_partner != null) {
                var partner_lower = options.upper_partner
            }
            that.setData({
                partner_lower: partner_lower,
                userInfo: a
            })
            // 查看分销
            that.fenxiao()
        })
        that.setData({
            today: app.util.time()
        })
        // 获取分类
        app.util.request({
            'url': 'entry/wxapp/typeList',
            'cachetime': '0',
            success: function(res) {
                console.log('这是分类')
                console.log(res)
                that.setData({
                    typeList: res.data
                })
            },
        })

    },
    // 分销商
    fenxiao: function(e) {
        var that = this
        var userInfo = that.data.userInfo
        var user_id = userInfo.id
        var partner_lower = that.data.partner_lower
        // 查看用户上线
        app.util.request({
            url: 'entry/wxapp/MySx',
            data: {
                user_id: user_id,
            },
            success: res => {
                console.log(res)
                if (res.data == false) {
                    if (partner_lower != 'undefined') {
                        // 绑定分销商
                        app.util.request({
                            'url': 'entry/wxapp/Binding',
                            'cachetime': '0',
                            data: {
                                fx_user: userInfo.id,
                                user_id: partner_lower
                            },
                            success: function(res) {
                                console.log('这是成为下级分销商' + partner_lower)
                                console.log(res)
                            },
                        })
                    }
                }
            }
        })
    },
    // 获取用户地址位置
    citys: function(e) {
        var that = this
        if (that.data.system == null) {
            that.citys()
        } else {
            wx.setStorageSync('platform', that.data.system)
            wx.setNavigationBarTitle({
                title: that.data.system.pt_name
            })
            var map_key = that.data.system.map_key
            if (that.data.system.city_open == 1) {
                // wx.showModal({
                //   title: '',
                //   content: '开启了多城市',
                // })
                if (app.globalData.sele_city == 1) {
                    // wx.showModal({
                    //   title: '',
                    //   content: '需要进行定位',
                    // })
                    //---------------------------------- 获取用户的地理位置----------------------------------
                    wx.getLocation({
                        type: 'wgs84',
                        success: function(res) {
                            wx.setStorageSync('Location', res)
                            let latitude = res.latitude
                            let longitude = res.longitude
                            // that.setData({
                            //     distance: res.latitude + ',' + res.longitude
                            // })
                            app.globalData.distance = res.latitude + ',' + res.longitude
                            var demo = new QQMapWX({
                                key: map_key // 必填
                            });
                            demo.reverseGeocoder({
                                location: {
                                    latitude: latitude,
                                    longitude: longitude
                                },
                                success: function(res) {
                                    console.log(res);
                                    var city = res.result.ad_info.city
                                    var citys = [
                                        res.result.ad_info.province, res.result.ad_info.city, res.result.ad_info.district,
                                    ]
                                    console.log(city)
                                    wx.setStorageSync('location_city', citys)
                                    wx.setStorageSync('city', city)
                                    // 传城市
                                    app.util.request({
                                        'url': 'entry/wxapp/SaveCity',
                                        'cachetime': '0',
                                        data: {
                                            cityname: city
                                        },
                                        success: function(res) {
                                            console.log('这是保存城市')

                                        },
                                    })
                                    that.setData({
                                        city: city,
                                        Speed: 70
                                    })
                                    that.advert()
                                },
                                fail: function(res) {
                                    console.log(res);
                                },
                                complete: function(res) {
                                    console.log(res);
                                    if (res.message == 'request:fail url not in domain list') {
                                        wx.showModal({
                                            title: '',
                                            content: '检测到没有配置map域名',
                                        })
                                    }
                                }
                            });
                        },
                        fail: function(res) {
                            wx.getSetting({
                                success: (res) => {
                                    var authSetting = res.authSetting
                                    if (authSetting['scope.userLocation'] == false) {
                                        wx.openSetting({
                                            success: function success(res) {}
                                        });
                                    }
                                }
                            })
                        }
                    })
                } else {
                    console.log('检测到不是空的')
                    that.setData({
                        city: wx.getStorageSync('city'),
                        Speed: 70
                    })
                    that.advert()
                }
            } else {
                wx.setStorageSync('city', '')
                that.setData({
                    city: '',
                    Speed: 70
                })

                that.advert()
            }
        }


    },
    berak: function(e) {
        this.activity()
        this.setData({
            city: wx.getStorageSync('city')
        })
    },
    // 获取轮播图以及专题精选
    advert: function(e) {
        var that = this
        if (wx.getStorageSync('city') == '' || wx.getStorageSync('city') == null) {
            var city = that.data.city
        } else {
            var city = wx.getStorageSync('city')
        }
        // 获取首页的轮播图
        app.util.request({
            'url': 'entry/wxapp/ad',
            'cachetime': '0',
            data: {
                type: 1,
                cityname: city
            },
            success: function(res) {
                console.log('这是首页轮播图')
                that.setData({
                    home_carousel_figure: res.data
                })
            },
        })
        // 获取专题精选
        app.util.request({
            'url': 'entry/wxapp/ad',
            'cachetime': '0',
            data: {
                type: 2,
                cityname: city
            },
            success: function(res) {
                console.log('这是专题精选')
                console.log(res)
                that.setData({
                    Thematic_selection: res.data
                })
            },
        })
        that.setData({
            Speed: 80
        })
        that.refresh()
    },
    // 获取网址以及拼团商品
    refresh: function(e) {
        var that = this
        var city = wx.getStorageSync('city')
        that.setData({
            city: city
        })
        that.db_tab()
        // 拼团商品列表
        app.util.request({
            'url': 'entry/wxapp/GroupGoods',
            'cachetime': '0',
            data: {
                type_id: '',
                page: 1,
            },
            success: res => {
                console.log('商品列表', res)
                that.setData({
                    group_list: res.data,
                })
            }
        })
        // 获取分类
        app.util.request({
            'url': 'entry/wxapp/getnav',
            'cachetime': '0',
            success: function(res) {
                console.log('这是首页导航')
                console.log(res)
                if (res.data.length <= 5) {
                    that.setData({
                        height: 150
                    })
                } else if (res.data.length > 5) {
                    that.setData({
                        height: 300
                    })
                }
                // ----------------------------------把分类以10个位一组分隔开----------------------------------
                var nav = []
                for (var i = 0, len = res.data.length; i < len; i += 10) {
                    nav.push(res.data.slice(i, i + 10))
                }
                console.log(nav)
                that.setData({
                    nav: nav,
                    navs: res.data
                })
                that.setData({
                    Speed: 90
                })
                that.activity()
            },
        })

    },
    activity: function(e) {
        var that = this
        console.log(that.data)
        var typeList = that.data.typeList
        var today = that.data.today
        var page = that.data.page
        var orderby = that.data.orderby
        console.log('当前的页数为' + page)
        var list = that.data.activity_list
        var activity = []

        if (wx.getStorageSync('city') == '' || wx.getStorageSync('city') == null) {
            var city = that.data.city
        } else {
            var city = wx.getStorageSync('city')
        }
        console.log('当前选择的城市为' + city)
        var today = app.today_time()
        // 获取活动列表
        app.util.request({
            'url': 'entry/wxapp/ActivityList',
            'cachetime': '0',
            data: {
                page: page,
                cityname: city,
                orderby: orderby,
                lat: app.globalData.distance.split(",")[0],
                lng: app.globalData.distance.split(",")[1]
            },
            success: function(res) {
                console.log('这是活动列表')
                console.log(res)
                that.setData({
                    Speed: 100
                })
                if (res.data.length > 0) {
                    list = list.concat(res.data)
                    activity = res.data
                    for (let i in activity) {
                        activity[i].end_time = app.ormatDate(activity[i].end_time)
                        activity[i].start_time = app.ormatDate(activity[i].start_time)
                        if (activity[i].is_close == 1) {
                            if (today < activity[i].end_time) {
                                if (today >= activity[i].start_time) {
                                    // 活动已开始
                                    activity[i].activity_over = 3
                                } else {
                                    // 活动未结束
                                    activity[i].activity_over = 1
                                }
                            } else {
                                activity[i].activity_over = 2
                            }
                        } else {
                            activity[i].activity_over = 2
                        }
                        for (let m in typeList) {
                            if (activity[i].type_id == typeList[m].id) {
                                activity[i].type_id = typeList[m].type_name
                            }
                        }
                        // 活动金额
                        if (activity[i].cost == 0) {
                            activity[i].cost = '免费'
                        } else {
                            activity[i].cost = '￥' + activity[i].cost
                        }
                        // 活动开始时间-----------时间戳转换为时间
                        activity[i].start_time = activity[i].start_time.slice(0, 16)
                        // 计算活动发布时间的前一天
                        activity[i].yestoday = app.yestoday(activity[i].start_time)
                    }
                    console.log(activity)
                    that.setData({
                        activity_list: list,
                        page: page + 1
                    })
                } else {
                    // wx.showModal({
                    //   title: '没有了',
                    //   content: '',
                    // })
                }

            },
        })

    },
    db_tab: function(e) {
        var that = this
        var db_tab = [{
                icon1: '../img/shouye@2x.png',
                icon2: '../img/shouyee@2x.png',
                name: '首页',
                src: '../index/index',
                img: '../img/shouyee@2x.png'
            },
            {
                icon1: '../img/fennei2x.png',
                icon2: '../img/fenlei@2x.png',
                name: '分类',
                src: '../classification/classification',
                img: '../img/fenlei@2x.png'
            },
            {
                icon1: '../img/huodong@2x.png',
                icon2: '../img/huodongz@2x.png',
                name: '我的票券',
                src: '../piaoquan/piaoquan',
                img: '../img/huodongz@2x.png'
            },
            {
                icon1: '../img/geren@2x.png',
                icon2: '../img/gerenq@2x.png',
                name: '我的',
                src: '../logs/logs',
                img: '../img/gerenq@2x.png'
            },
            {
                img: '../img/jia@2x.png'
            }
        ]
        console.log(db_tab)
        var url = wx.getStorageSync('url')
        console.log(url)
        // 获取底部菜单栏
        app.util.request({
            'url': 'entry/wxapp/DbMenu',
            'cachetime': '0',
            success: function(res) {
                console.log('这是底部菜单栏')
                console.log(res)
                for (let i in res.data) {
                    res.data[i].icon1 = url + res.data[i].icon1
                    res.data[i].icon2 = url + res.data[i].icon2
                }
                if (res.data.length == 1) {
                    db_tab[1].icon1 = res.data[0].icon1
                    db_tab[1].icon2 = res.data[0].icon2
                    db_tab[1].src = res.data[0].src
                    db_tab[1].name = res.data[0].name
                    db_tab[1].img = res.data[0].icon2
                } else if (res.data.length >= 2) {
                    db_tab[1].icon1 = res.data[0].icon1
                    db_tab[1].icon2 = res.data[0].icon2
                    db_tab[1].src = res.data[0].src
                    db_tab[1].name = res.data[0].name
                    db_tab[1].img = res.data[0].icon2
                    db_tab[2].icon1 = res.data[1].icon1
                    db_tab[2].icon2 = res.data[1].icon2
                    db_tab[2].src = res.data[1].src
                    db_tab[2].name = res.data[1].name
                    db_tab[2].img = res.data[1].icon2
                }
                wx.setStorageSync('db_tab', db_tab)
                var yes = app.contains(db_tab, '../index/index')
                db_tab[yes].img = db_tab[yes].icon1
                that.setData({
                    db_tab: db_tab
                })
            },
        })
    },
    // 搜索
    search: function(e) {
        console.log(e)
        var that = this
        wx.navigateTo({
            url: 'search',
        })
        // 输入的搜索字符
        // var details = e.detail.value
        // if (details != '') {
        //   app.util.request({
        //     url: 'entry/wxapp/ActivityList',
        //     data: {
        //       keywords: details
        //     },
        //     success: res => {
        //       console.log(res)
        //       if (res.data.length > 0) {
        //         that.setData({
        //           search: true,
        //           search_list: res.data
        //         })
        //       } else {
        //         that.setData({
        //           search: false
        //         })
        //       }
        //     }
        //   })
        // } else {
        //   that.setData({
        //     search: false
        //   })
        // }
    },
    // 导航跳转
    skip: function(e) {
        console.log(e)
        // wx.chooseAddress({
        //   success: function (res) {
        //     console.log(res)
        //   }
        // })
        var that = this
        var index = e.currentTarget.dataset.index
        var navs = that.data.navs
        var nav = navs[index]
        console.log(nav)
        if (nav.src != '') {
            var src = nav.src.replace(/(\d+|\s+)/g, "");
            var id = nav.src.replace(/[^0-9]/ig, "");
            console.log(src + id)
            console.log(id)
            wx.navigateTo({
                url: String(src) + String(id)
            })
        } else if (nav.appid != '') {
            wx.navigateToMiniProgram({
                appId: nav.appid,
                success(res) {
                    // 打开成功\
                    console.log(res)
                }
            })
        } else if (nav.wb_src != '') {
            wx.navigateTo({
                url: 'link?link=' + nav.wb_src
            })
        }
    },
    // ――――――――验票二维码――――――――――
    myyanpiao: function() {
        // 允许从相机和相册扫码
        wx.scanCode({
            success: (res) => {
                console.log(res)
                var path = res.path
                var arr = path.slice(42)
                console.log(arr)
                wx.navigateTo({
                    url: '../logs/inspect_ticket?arr=' + arr,
                })
            }
        })
    },
    group: function(e) {
        wx.navigateTo({
            url: '../collage/info?id=' + e.currentTarget.dataset.id,
        })
    },
    // 
    swiper_skip: function(e) {
        var that = this
        var index = e.currentTarget.dataset.index
        var home_carousel_figure = that.data.home_carousel_figure
        var nav = home_carousel_figure[index]
        console.log(nav)
        if (nav.src != '') {
            var src = nav.src.replace(/(\d+|\s+)/g, "");
            var id = nav.src.replace(/[^0-9]/ig, "");
            console.log(src + id)
            console.log(id)
            wx.navigateTo({
                url: String(src) + String(id)
            })
        } else if (nav.appid != '') {
            wx.navigateToMiniProgram({
                appId: nav.appid,
                success(res) {
                    // 打开成功\
                    console.log(res)
                }
            })
        } else if (nav.wb_src != '') {
            wx.navigateTo({
                url: 'link?link=' + nav.wb_src
            })
        }
    },
    selection_skip: function(e) {
        var that = this
        var index = e.currentTarget.dataset.index
        var home_carousel_figure = that.data.Thematic_selection
        var nav = home_carousel_figure[index]
        console.log(nav)
        if (nav.src != '') {
            var src = nav.src.replace(/(\d+|\s+)/g, "");
            var id = nav.src.replace(/[^0-9]/ig, "");
            console.log(src + id)
            console.log(id)
            wx.navigateTo({
                url: String(src) + String(id)
            })
        } else if (nav.appid != '') {
            wx.navigateToMiniProgram({
                appId: nav.appid,
                success(res) {
                    // 打开成功\
                    console.log(res)
                }
            })
        } else if (nav.wb_src != '') {
            wx.navigateTo({
                url: 'link?link=' + nav.wb_src
            })
        }
    },
    //事件处理函数
    bindViewTap: function() {
        wx.navigateTo({
            url: '../logs/logs'
        })
    },
    info: function(e) {
        console.log(e)
        var id = e.currentTarget.id
        var type_name = e.currentTarget.dataset.type_name
        wx.navigateTo({
            url: '../activeinfo/activeinfo?id=' + id + '&type_name=' + type_name
        })
    },

    // ―――――――――――――关闭开屏广告―――――――――――――――
    guanbi: function(e) {
        this.setData({
            bomb: true
        })
    },
    // ――――――――第四个跳转――――――――――
    wode: function() {
        var that = this
        var db_tab = that.data.db_tab
        wx: wx.reLaunch({
            url: db_tab[3].src,
        })
    },

    // ――――――――跳转到发布活动――――――――――
    fabu: function() {
        wx: wx.reLaunch({
            url: '../fabu/fabu',
        })
    },
    // ――――――――跳转到首页――――――――――
    index: function() {
        var that = this
        var db_tab = that.data.db_tab
        wx: wx.reLaunch({
            url: db_tab[0].src,
        })
    },
    // ――――――――第二个跳转――――――――――
    classifination: function(e) {
        var that = this
        var db_tab = that.data.db_tab
        wx: wx.reLaunch({
            url: db_tab[1].src,
        })
    },
    // ――――――――第三个跳转――――――――――
    mine_activity: function(e) {
        var that = this
        var db_tab = that.data.db_tab
        wx: wx.reLaunch({
            url: db_tab[2].src,
        })
    },

    // ―――――――――――轮播滑动事件―――――――――――
    swiperChange: function(e) {
        this.setData({
            swiperCurrent: e.detail.current
        })
    },
    address: function(e) {
        var that = this
        var city_open = that.data.system.city_open
        console.log(city_open)
        if (city_open == 1) {
            this.setData({
                page: 1,
                activity_list: []
            })
            wx.redirectTo({
                url: '../city/city',
            })
        }

    },
    getUserInfo: function(e) {
        app.globalData.userInfo = e.detail.userInfo
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        })
    },
    bindgetuserinfo: function(e) {
        console.log(e)
        var that = this
        if (e.detail.errMsg == "getUserInfo:fail auth deny") {
            console.log('用户拒绝授权')
            app.getUserInfo(function(userInfo) {
                that.setData({
                    userInfo: userInfo,
                    bind_user: false
                })
            })
        } else {
            console.log('用户允许授权')
            app.getUserInfo(function(userInfo) {
                that.setData({
                    userInfo: userInfo,
                    bind_user: true
                })
            })
        }
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {
        this.setData({
            xuanran: false
        })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        var that = this
        app.setNavigationBarColor(this);
        app.getSystem(that)
        app.getUrl(that)
        that.setData({
            xuanran: true
        })
        // that.citys()
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {
        var that = this
        that.setData({
            page: 1,
            activity_list: []
        })
        that.advert()
        wx.stopPullDownRefresh()
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
        // this.setData({
        //   page: 1,
        //   activity_list: []
        // })
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    sele_orderby(e){
        var index = e.currentTarget.dataset.index
        var orderby = Number(index)+1
        this.setData({
            orderby: orderby,
            page: 1,
            activity_list: []
        })
        this.activity()
    },
    onReachBottom: function() {
        console.log('上拉触底')
        this.activity()
        console.log(this.data.page)
    },
    onShareAppMessage: function() {

    }
})