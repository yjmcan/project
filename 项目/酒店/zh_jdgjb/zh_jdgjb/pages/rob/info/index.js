const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        group:"抢购开始",
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this
        app.getUrl(that)
        app.getSystem(that)
        that.setData({
            id:options.id
        })
        that.getInfo()
    },
    getInfo(e){
        var that = this,id = that.data.id
        app.util.request({
            url: "entry/wxapp/robdetails",
            data: {
                rob_id: id
            },
            success: res => {
                console.log('抢购的列表信息为', res)
                that.getCountDown(res.data.rob_end)
                res.data.rob_start = app.ormatDate(res.data.rob_start)
                res.data.rob_end = app.ormatDate(res.data.rob_end)
                res.data.mark_start = app.ormatDate(res.data.mark_start).slice(0, 10)
                res.data.mark_end = app.ormatDate(res.data.mark_end).slice(0,10)
                that.setData({
                    robInfo:res.data
                })
            }
        })
    },
    getCountDown:function(mss){
        var that = this
        var days = parseInt(mss / (1000 * 60 * 60 * 24));
        var hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = (mss % (1000 * 60)) / 1000;
        that.setData({
            day: days,
            hour: hours,
            min: minutes,
            sec: seconds,
        })
        return days + " 天 " + hours + " 小时 " + minutes + " 分钟 ";
    },
    getCountDown: function (timestamp) {
        var that = this
        var group = that.data.group
        if (group == '抢购开始') {
            setInterval(function () {
                var nowTime = new Date();
                var endTime = new Date(timestamp * 1000);
                var t = endTime.getTime() - nowTime.getTime();
                var day = parseInt(t / 1000 / 60 / 60/24) + ''
                var hour = parseInt((t % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
                var min = parseInt((t % (1000 * 60 * 60)) / (1000 * 60))
                var sec = Math.floor(t / 1000 % 60) + ''
                if (t > 0) {
                    if(day<10){
                        day = '0'+ day
                    }
                    if (hour < 10) {
                        hour = "0" + hour;
                    }
                    if (min < 10) {
                        min = "0" + min;
                    }
                    if (sec < 10) {
                        sec = "0" + sec;
                    }
                    that.setData({
                        day: day,
                        hour: hour,
                        min: min,
                        sec: sec,
                    })
                } else {
                    that.setData({
                        group: '已结束'
                    })
                }
            }, 1000)
        }
    },
    rush(e){
        let robInfo = this.data.robInfo
        wx.navigateTo({
            url: 'order?money=' + robInfo.rob_money + '&num=' + robInfo.num + '&seller_id=' + robInfo.seller_id + '&title=' + robInfo.title + '&mark_start=' + robInfo.mark_start + '&mark_end=' + robInfo.mark_end + '&rob_id=' + this.data.id,
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

})