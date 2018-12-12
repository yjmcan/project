const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        roblist:[],
        page:1
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this
        app.getUrl(that)
        app.getSystem(that)
        that.getList()
        that.setData({
            seller_id:options.id
        })
    },
    robinfo(e) {
        wx.navigateTo({
            url: 'info/index?id='+e.currentTarget.dataset.id,
        })
    },
    getList(e){
        var that = this, roblist = that.data.roblist
        app.util.request({
            url:"entry/wxapp/roblist",
            data:{
                seller_id: wx.getStorageSync('platform').seller_id,
                page:that.data.page,
            },
            success:res=>{
                console.log('抢购的列表信息为',res)
                if (res.data.length < 10) {
                    that.setData({
                        isget: false
                    })
                } else {
                    console.log("可以上拉加载了")
                    that.setData({
                        isget: true,
                        page: that.data.page + 1
                    })
                }
                for(let i in res.data){
                    res.data[i].rob_start = app.ormatDate(res.data[i].rob_start)
                }
                roblist = roblist.concat(res.data)
                that.setData({
                    roblist: roblist
                })
            }
        })
    },
    // —————————————跳转到个人中心页面———————————————
    wode: function (e) {
        wx.reLaunch({
            url: '../logs/logs',
        })
    },
    index: function (e) {
        wx.reLaunch({
            url: '../index/index',
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
    onReachBottom: function () {
        if(this.data.isget){
            this.getList()
        }
    },
})