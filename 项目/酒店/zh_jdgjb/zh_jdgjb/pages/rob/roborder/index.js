// zh_jdgjb/pages/rob/roborder/index.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        orderList:[],
        page:1,
        tabs: [{
                name: "全部",
                status: ''
            },
            {
                name: "待核销",
                status: 3
            },
            {
                name: "已核销",
                status: 4
            }
        ],
        status: "",
        color: "#f66925",
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this
        app.getUrl(that)
        app.getSystem(that)
        if (options.status) {
            that.setData({
                status: options.status
            })
        }
        that.getInfo()
    },
    // 获取订单列表
    getInfo(e) {
        var that = this,
            id = that.data.id,
            orderList = that.data.orderList
        app.util.request({
            url: "entry/wxapp/myrob",
            data: {
                user_id: wx.getStorageSync('userInfo').id,
                page:that.data.page,
                state:that.data.status
            },
            success: res => {
                console.log('订单列表信息为', res)
                if(res.data.length<10){
                    that.setData({
                        isget:false
                    })
                }else{
                    that.setData({
                        isget: true,
                        page:that.data.page+1
                    })
                }
                orderList = orderList.concat(res.data)
                that.setData({
                    orderList: orderList
                })
            }
        })
    },
    lookInfo(e) {
        wx.navigateTo({
            url: 'info?id='+e.currentTarget.dataset.id,
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
        if (this.data.isget){
            this.getInfo()
        }
    },

})