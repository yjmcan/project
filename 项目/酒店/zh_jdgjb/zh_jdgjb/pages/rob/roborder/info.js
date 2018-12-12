// zh_jdgjb/pages/rob/roborder/info.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        today: app.today(),
        end: app.util.addDate(app.util.time(), 28)
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this
        app.getUrl(that)
        app.getSystem(that)
        that.setData({
            id: options.id
        })
        that.getInfo()
    },
    // 查看酒店地址
    sele_address: function (e) {
        var that = this
        var orderInfo = that.data.orderInfo
        var coordinates = orderInfo.coordinates.split(",")
        wx.getLocation({
            type: 'gcj02', //返回可以用于wx.openLocation的经纬度
            success: function (res) {
                var latitude = Number(coordinates[0])
                var longitude = Number(coordinates[1])
                wx.openLocation({
                    latitude: latitude,
                    longitude: longitude,
                    name: orderInfo.name,
                    address: orderInfo.address
                })
            }
        })
    },
    getInfo(e) {
        var that = this,
            id = that.data.id,
            orderList = that.data.orderList
        app.util.request({
            url: "entry/wxapp/robinfo",
            data: {
                order_id: id
            },
            success: res => {
                console.log('订单列表信息为', res)
                res.data.time = app.ormatDate(res.data.time)
                if (res.data.enter_time != '0') {
                    res.data.enter_time = app.ormatDate(res.data.enter_time).slice(0, 10)
                }
                console.log(res)
                that.setData({
                    orderInfo: res.data
                })
            }
        })
        app.util.request({
            url: "entry/wxapp/robCode",
            data: {
                order_id: id
            },
            success: res => {
                console.log('订单列', res)
                that.setData({
                    robCode: res.data
                })
            }
        })
    },
    makePhone(e) {
        wx.makePhoneCall({
            phoneNumber: e.currentTarget.dataset.tel,
        })
    },
    bindDateChange: function(e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        console.log(this.data.end)
        if (e.detail.value > this.data.end) {
            wx.showModal({
                title: '温馨提示',
                content: '当前只能预约'+this.data.end+'之前的房间哦',
            })
            this.setData({
                date: this.data.end
            })
        }else{
            this.setData({
                date: e.detail.value
            })
        }
    },
    // 提交预约时间
    formSubmit(e){
        console.log(e)
        var that = this,
            id = that.data.id,
            orderList = that.data.orderList,
            form_id = e.detail.formId
        app.util.request({
            url: "entry/wxapp/entertime",
            data: {
                order_id: id,
                enter_time:that.data.date,
                tzfrom_id: form_id
            },
            success: res => {
                console.log('提交预约时间', res)
                if(res.data==1){
                    wx.showToast({
                        title: '提交成功',
                    })
                    setTimeout(function () {
                        that.getInfo()
                    },1500)
                }else{
                    wx.showModal({
                        title: '温馨提示',
                        content: res.data,
                    })
                }
            }
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