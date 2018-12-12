// zh_jdgjb/pages/rob/info/order.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        num: 1,
        price: "6200"
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this
        app.getUrl(that)
        app.getSystem(that)
        that.setData({
            money: Number(options.money),
            price: Number(options.money),
            max_num: options.num,
            title: options.title,
            mark_end: options.mark_end,
            mark_start: options.mark_start,
            seller_id: options.seller_id,
            rob_id: options.rob_id
        })
    },
    deletes(e) {
        if (this.data.num > 1) {
            this.setData({
                num: this.data.num - 1,
            })
            this.calculate()
        }
    },
    add(e) {
        if (this.data.num < this.data.max_num) {
            this.setData({
                num: this.data.num + 1
            })
            this.calculate()
        } else {
            wx.showModal({
                title: '温馨提示',
                content: '最大购买数量为' + this.data.max_num,
            })
        }
    },
    calculate(e) {
        this.setData({
            price: (Number(this.data.num) * Number(this.data.money)).toFixed(2)
        })
    },
    formSubmit(e) {
        console.log(e, this.data)
        var that = this,
            a = that.data,
            data = e.detail.value,
            name = data.name,
            tel = data.tel,
            price = a.price,
            num = a.num,
            title = a.title,
            rob_id = a.rob_id,
            seller_id = a.seller_id
        if (name == '') {
            wx.showModal({
                title: '温馨提示',
                content: '请输入您的姓名',
            })
        } else if (tel == '') {
            wx.showModal({
                title: '温馨提示',
                content: '请输入您的手机号',
            })
        } else {
            wx.showLoading({
                title: '正在提交订单',
                mark:!0
            })
            app.util.request({
                url: "entry/wxapp/saveroborder",
                data: {
                    user_id: wx.getStorageSync('userInfo').id,
                    name: name,
                    tel: tel,
                    title: title,
                    money: price,
                    num: num,
                    rob_id: rob_id,
                    seller_id: seller_id
                },
                method: "POST",
                success: res => {
                    console.log('提交的订单信息为', res)
                    var order_id = res.data
                    app.util.request({
                        url: "entry/wxapp/robPay",
                        data: {
                            order_id: order_id,
                            openid: wx.getStorageSync('userInfo').openid,
                            money: price
                        },
                        method:"POST",
                        success: res => {
                            console.log(res)
                            wx.requestPayment({
                                'timeStamp': res.data.timeStamp,
                                'nonceStr': res.data.nonceStr,
                                'package': res.data.package,
                                'signType': res.data.signType,
                                'paySign': res.data.paySign,
                                'success': function(res) {
                                    console.log('支付成功', res)
                                    wx.showToast({
                                        title: '提交成功',
                                    })
                                    setTimeout(function(){
                                        wx.redirectTo({
                                            url: '../roborder/index',
                                        })
                                    },1500)
                                    wx.hideLoading()
                                },

                                'fail': function(res) {
                                    app.util.request({
                                        url: "entry/wxapp/delroborder",
                                        data: {
                                            order_id: order_id,
                                        },
                                        method: "POST",
                                        success: res => {
                                            console.log('删除成功',res)
                                            wx.hideLoading()
                                            wx.navigateBack({
                                                delta:1
                                            })
                                        }
                                    })  

                                },
                            })
                        }
                    })
                }
            })
        }
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

})