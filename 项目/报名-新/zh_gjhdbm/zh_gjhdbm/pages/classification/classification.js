// pages/fenlei/fenlei.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        menu2: ["线上活动", "线下活动"],
        menu3: ["今天", "明天", "后天"],
        luntext: ['分类', '类型', '日期'],
        navs: ['分类', '类型', '日期'],
        activeIndex: 7,
        zheceng: true,
        page: 1,
        activity_list: [],
        type_id: '',
        activity_type: '',
        start_time: '',
        route: '../classification/classification'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        console.log(options)
        app.setNavigationBarColor(this);
        var that = this
        var db_tab = wx.getStorageSync('db_tab')
        var route = that.data.route
        var yes = app.contains(db_tab, '../classification/classification')
        console.log(yes)
        if (yes != false) {
            db_tab[yes].color = 'selsects'
            db_tab[yes].img = db_tab[yes].icon1
            console.log(db_tab)
        }
        if (options.type_id != null) {
            that.setData({
                type_id: options.type_id
            })
        }
        if (options.activity_type != null) {
            that.setData({
                activity_type: options.activity_type
            })
        }
        if (options.start_time != null) {
            that.setData({
                start_time: options.start_time
            })
            that.start_time()
        }
        that.setData({
            yes: yes,
            db_tab: db_tab
        })
        // 获取网址
        app.util.request({
            'url': 'entry/wxapp/url',
            'cachetime': '0',
            success: function(res) {
                console.log('这是网址')
                console.log(res)
                wx.setStorageSync('url', res.data)
                that.setData({
                    url: res.data
                })
            },
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
        console.log('当前的页数为' + page)
        var list = that.data.activity_list
        var activity = []
        // 分类id
        var type_id = that.data.type_id
        // 活动类型
        var activity_type = that.data.activity_type
        // 开始时间
        var start_time = that.data.start_time
        console.log('分类id' + type_id)
        console.log('活动类型' + activity_type)
        console.log('开始时间' + start_time)
        if (wx.getStorageSync('city') == '' || wx.getStorageSync('city') == null) {
            var city = that.data.city
        } else {
            var city = wx.getStorageSync('city')
        }
        // console.log('当前选择的城市为' + that.data.city)
        console.log('当前选择的城市为' + city)
        var today = app.today_time()
        // 获取活动列表
        app.util.request({
            'url': 'entry/wxapp/ActivityList',
            'cachetime': '0',
            data: {
                page: page,
                cityname: city,
                start_time: start_time,
                activity_type: activity_type,
                type_id: type_id
            },
            success: function(res) {
                console.log('这是活动列表')
                console.log(res)
                if (res.data.length > 0) {
                    list = list.concat(res.data)
                    activity = res.data
                    for (let i in activity) {
                        activity[i].end_time = app.ormatDate(activity[i].end_time)
                        activity[i].start_time = app.ormatDate(activity[i].start_time).slice(0, 16)
                        if (activity[i].is_close == 1) {
                            if (today < activity[i].end_time) {
                                // 活动未结束
                                if (today >= activity[i].start_time) {
                                    activity[i].activity_over = 3
                                } else {
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
                        // activity[i].start_time = app.ormatDate(activity[i].start_time).slice
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
    tabClick: function(e) {
        var that = this
        var index = e.currentTarget.id
        var activeIndex = that.data.activeIndex
        if (activeIndex == index) {
            that.setData({
                activeIndex: 5,
                zheceng: true
            });
        } else {
            that.setData({
                activeIndex: index,
                zheceng: false
            });
        }

    },
    zcxiao: function(e) {
        var that = this
        var index = e.currentTarget.id
        var activeIndex = that.data.activeIndex
        that.setData({
            activeIndex: 6,
            zheceng: true
        });
    },


    // ————————第四个跳转——————————
    wode: function() {
        var that = this
        var db_tab = that.data.db_tab
        if (that.data.route == db_tab[3].src) {

        } else {
            wx: wx.reLaunch({
                url: db_tab[3].src,
            })
        }
    },

    // ————————跳转到发布活动——————————
    fabu: function() {
        wx: wx.reLaunch({
            url: '../fabu/fabu',
        })
    },
    // ————————跳转到首页——————————
    index: function() {
        var that = this
        var db_tab = that.data.db_tab
        if (that.data.route == db_tab[0].src) {

        } else {
            wx: wx.reLaunch({
                url: db_tab[0].src,
            })
        }

    },
    // ————————第二个跳转——————————
    classifination: function(e) {
        var that = this
        var db_tab = that.data.db_tab
        if (that.data.route == db_tab[1].src) {

        } else {
            wx: wx.reLaunch({
                url: db_tab[1].src,
            })
        }
    },
    // ————————第三个跳转——————————
    mine_activity: function(e) {
        var that = this
        var db_tab = that.data.db_tab
        if (that.data.route == db_tab[2].src) {

        } else {
            wx: wx.reLaunch({
                url: db_tab[2].src,
            })
        }
    },
    // 选择分类
    type_name: function(e) {
        var that = this
        var type_id = e.currentTarget.dataset.id,
            luntext = that.data.luntext
        luntext[0] = e.currentTarget.dataset.name
        console.log(type_id)
        that.setData({
            type_id: type_id,
            page: 1,
            luntext: luntext,
            activity_list: [],
            activeIndex: 6,
            zheceng: true,
        })
        that.activity()
    },
    // 选择线上线下
    avtivity_type: function(e) {
        var that = this
        var activity_type = e.currentTarget.dataset.type,
            luntext = that.data.luntext
        luntext[1] = e.currentTarget.dataset.name
        console.log(activity_type)
        if (activity_type == '线上活动') {
            activity_type = 1
        } else {
            activity_type = 2
        }
        that.setData({
            activity_type: activity_type,
            page: 1,
            luntext: luntext,
            activity_list: [],
            activeIndex: 6,
            zheceng: true,
        })
        that.activity()
    },
    // 选择时间
    start_time: function(e) {
        var that = this,
            luntext = that.data.luntext
        luntext[2] = e.currentTarget.dataset.name
        if (e == null) {
            var start_time = that.data.start_time
        } else {

            var start_time = e.currentTarget.dataset.type
        }

        console.log(start_time)

        function getDateStr(AddDayCount) {
            var dd = new Date();
            dd.setDate(dd.getDate() + AddDayCount); //获取AddDayCount天后的日期
            var year = dd.getFullYear();
            var mon = dd.getMonth() + 1;
            if (mon < 10) {
                mon = '0' + mon
            } //获取当前月份的日期
            var day = dd.getDate();
            if (day < 10) {
                day = '0' + day
            }
            return year + "-" + mon + "-" + day;
        }
        console.log(getDateStr(1))
        if (start_time == '今天') {
            start_time = getDateStr(0)
        } else if (start_time == '明天') {
            start_time = getDateStr(1)
        } else {
            start_time = getDateStr(2)
        }
        that.setData({
            start_time: start_time,
            page: 1,
            activity_list: [],
            activeIndex: 6,
            zheceng: true,
            luntext: luntext,
        })
        that.activity()
    },
    info: function(e) {
        console.log(e)
        var id = e.currentTarget.id
        var type_name = e.currentTarget.dataset.type_name
        wx.navigateTo({
            url: '../activeinfo/activeinfo?id=' + id + '&type_name=' + type_name
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

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
        this.setData({
            start_time: '',
            activity_type: '',
            type_id: '',
            page: 1,
            activity_list: []
        })
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {
        var that = this
        that.setData({
            start_time: this.data.start_time,
            activity_type: this.data.activity_type,
            type_id: this.data.type_id,
            page: 1,
            activity_list: []
        })
        that.activity()
        wx.stopPullDownRefresh()
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
        console.log('上拉触底')
        this.activity()
        console.log(this.data.page)
    },

    /**
     * 用户点击右上角分享
     */
    // onShareAppMessage: function () {

    // }
})