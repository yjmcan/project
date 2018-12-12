// zh_hdbm/pages/cash/cash.js
var app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        hidden3: false,
        hidden4: true,
        button: true,
        cash_zhi2: false,
        cash_zhi: false,
        tx_cost: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this
        app.setNavigationBarColor(this);
        wx.hideShareMenu()
        // 获取系统设置
        app.util.request({
            'url': 'entry/wxapp/getSystem',
            'cachetime': '0',
            success: function(res) {
                that.setData({
                    system: res.data
                })
            },
        })
        that.reload()
    },
    reload: function(e) {
        var that = this
        //获取用户信息
        app.getUserInfo(function(userInfo) {
            that.setData({
                user_id: userInfo.id,
                money: userInfo.money
            })
            // app.util.request({
            //     url: 'entry/wxapp/MyIncome',
            //     data: {
            //         user_id: userInfo.id
            //     },
            //     success: res => {
            //         that.setData({
            //             money: res.data.money
            //         })
            //     }
            // })
            if (userInfo.rz_type == 0) {
                wx.showModal({
                    title: '温馨提示',
                    content: '您还没有进行认证，无法提现，点击确定进行认证',
                    success: res => {
                        if (res.confirm) {
                            wx.redirectTo({
                                url: '../authentication/authentication',
                            })
                        } else if (res.cancel) {
                            wx.navigateBack({
                                delta: 1
                            })
                        }
                    }
                })

            }
        })
    },
    bindblur: function(e) {
        var that = this
        var tx_sxf = that.data.system.tx_sxf
        var money = e.detail.value
        var sxf = money * (tx_sxf / 100)
        var sj_cost = money - sxf
        sj_cost = sj_cost.toFixed(2)
        sxf = sxf.toFixed(2)
        that.setData({
            tx_cost: money,
            sxf: sxf,
            sj_cost: sj_cost
        })
    },
    formSubmit: function(e) {
        var that = this
        var zd_money = Number(that.data.system.zd_money)
        // 实际金额
        var sj_cost = that.data.sj_cost
        var sxf = that.data.sxf
        var moneys = Number(that.data.money)
        //   var moneys = 5
        // 用户名字
        var name = e.detail.value.name
        // 提现金额
        var tx_cost = that.data.tx_cost
        // 用户账号
        var account_number = e.detail.value.account_number
        // 确认用户账号
        var account_number_two = e.detail.value.account_number_two
        // 用户id
        var user_id = that.data.user_id
        console.log(moneys)
        var title = ''
        if (tx_cost == '' || tx_cost <= 0) {
            title = '请输入提现金额'
        } else if (Number(tx_cost) > Number(moneys)) {
            title = '不能超过可提现金额'
        } else if (tx_cost < zd_money) {
            title = '没有到提现门槛'
        } else if (tx_cost < 0) {
            title = '最低提现金额为1元'
        } else if (name == '') {
            title = '请输入姓名'
        } else if (account_number == '') {
            title = '请输入微信账号'
        } else if (account_number_two == '') {
            title = '请再次输入微信账号'
        } else if (account_number != account_number_two) {
            title = '账号输入有误，请重述'
        }
        if (title != '') {
            wx.showModal({
                title: '温馨提示',
                content: title,
            })
        } else {
            app.util.request({
                url: 'entry/wxapp/savetx',
                data: {
                    name: name,
                    user_id: user_id,
                    tx_cost: tx_cost,
                    sj_cost: sj_cost,
                    account: account_number_two
                },
                success: res => {
                    if (res.data == 1) {
                        wx.showToast({
                            title: '成功发起提现',
                        })
                        setTimeout(function() {
                            wx.navigateBack({
                                delta: 1
                            })
                        }, 1500)
                    }
                }
            })
        }
    },
    inform: function(e) {
        wx.navigateTo({
            url: 'inform?status=' + 2,
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
        var that = this
        console.log(that.data)

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
    // onShareAppMessage: function () {

    // }
})