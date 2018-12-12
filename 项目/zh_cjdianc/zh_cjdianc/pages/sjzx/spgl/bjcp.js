// zh_dianc/pages/seller/cp/bjcp.js
var app = getApp();
var util = require('../../../utils/util.js');
var siteinfo = require('../../../../siteinfo.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isbj: false,
    url1: '',
    logo: '../../../img/splogo.png',
    spfl:[],
    spflIndex:0,
    spxx: ['外卖菜品','店内菜品','店内+外卖'],
    checkboxItems: [
      { name: '热销', value: '0' },
      { name: '推荐', value: '1' }, { name: '新品', value: '2' }, { name: '招牌', value: '3' }
    ],
    spxxIndex:0,
    sjxj:['上架','下架'],
    sjxjIndex:0,
    disabled:false,
    sppx:'',
    spmc:'',
    cpkc:'',
    yxsl:'',
    dnjg:'',
    wmjg:'',
    bzfy:'',
    cpid:'',
  },
  spflChange: function (e) {
    var that = this;
    console.log('spflChange 发生选择改变，携带值为', e.detail.value, that.data.spfl[e.detail.value].id);
    this.setData({
      spflIndex: e.detail.value,
    })
  },
  spxxChange: function (e) {
    var that = this;
    console.log('spxxChange 发生选择改变，携带值为', e.detail.value, that.data.spxx[e.detail.value]);
    this.setData({
      spxxIndex: e.detail.value,
    })
  },
  switchChange: function (e) {
    var that = this;
    console.log('switchChange 发生选择改变，携带值为', e.detail.value);
    this.setData({
      sjxjIndex: e.detail.value?0:1,
    })
  },
  checkboxChange: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value);

    var checkboxItems = this.data.checkboxItems, values = e.detail.value;
    for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
      checkboxItems[i].checked = false;

      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (checkboxItems[i].value == values[j]) {
          checkboxItems[i].checked = true;
          break;
        }
      }
    }
    this.setData({
      checkboxItems: checkboxItems
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.setNavigationBarColor(this);
    console.log(options,this.data.cpid)
    if(options.cpid!=null){
      this.setData({
        cpid: options.cpid,
        isbj:true,
      })
      //AppDishesInfo 
      app.util.request({
        'url': 'entry/wxapp/StoreDishesInfo',
        'cachetime': '0',
        data: { id: options.cpid },
        success: function (res) {
          console.log('菜品信息',res)
          var checkboxItems = that.data.checkboxItems;
          if (res.data.is_hot == '1') { checkboxItems[0].checked = true }
          if (res.data.is_tj == '1') { checkboxItems[1].checked = true }
          if (res.data.is_new == '1') { checkboxItems[2].checked = true }
          if (res.data.is_zp == '1') { checkboxItems[3].checked = true }
          var sjdsjid = wx.getStorageSync('sjdsjid')
          //AppDishesType
          app.util.request({
            'url': 'entry/wxapp/GoodsType',
            'cachetime': '0',
            data: { store_id: sjdsjid },
            success: function (res1) {
              console.log(res1)
              var spfl=res1.data;
              for(let i=0;i<res1.data.length;i++){
                if (res1.data[i].id == res.data.type_id){
                  that.setData({
                    spflIndex:i
                  })
                }
              }
            },
          })
          that.setData({
            logo: res.data.logo,
            splogo: res.data.logo,
            sppx: res.data.num,
            spmc: res.data.name,
            cpkc: res.data.inventory,
            yxsl: res.data.sales,
            dnjg: res.data.dn_money,
            wmjg: res.data.money,
            yj: res.data.money2,
            bzfy: res.data.box_money,
            xgfs: res.data.restrict_num,
            qsfs: res.data.start_num,
            spjj: res.data.content,
            sjxjIndex: Number(res.data.is_show)-1,
            spxxIndex: Number(res.data.type) - 1,
            checkboxItems: checkboxItems,
          })
        },
      })
    }
    var sjdsjid = wx.getStorageSync('sjdsjid')
    console.log(sjdsjid)
    var that = this;
    //AppDishesType
    app.util.request({
      'url': 'entry/wxapp/GoodsType',
      'cachetime': '0',
      data: { store_id: sjdsjid },
      success: function (res) {
        console.log(res)
        that.setData({
          spfl: res.data,
        })
      },
    })
  },
  // 点击选择图片
  choose: function (e) {
    var that = this
    console.log(siteinfo)
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        console.log(res.tempFilePaths)
        var path = res.tempFilePaths
        wx.showToast({
          icon: "loading",
          title: "正在上传"
        })
        wx.uploadFile({
          url: siteinfo.siteroot + '?i=' + siteinfo.uniacid + '&c=entry&a=wxapp&do=upload&m=zh_cjdianc',
          filePath: res.tempFilePaths[0],
          name: 'upfile',
          success: function (res) {
            console.log(res);
            that.setData({
              splogo: res.data
            })
            if (res.statusCode != 200) {
              wx.showModal({
                title: '提示',
                content: '上传失败',
                showCancel: false
              })
              return;
            }
            that.setData({
              url1: '',
              logo: path,
            });
          },
          fail: function (e) {
            console.log(e);
            wx.showModal({
              title: '提示',
              content: '上传失败',
              showCancel: false
            })
          },
          complete: function () {
            wx.hideToast();  //隐藏Toast
          }
        })
      }
    })
  },
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    var that = this;
    var cpid = this.data.cpid, checkboxItems = this.data.checkboxItems;
    var is_hot = checkboxItems[0].checked ? 1 : 2, is_tj = checkboxItems[1].checked ? 1 : 2, is_new = checkboxItems[2].checked ? 1 : 2, is_zp = checkboxItems[3].checked ? 1 : 2;
    var sjdsjid = wx.getStorageSync('sjdsjid'), sppx = e.detail.value.sppx, spmc = e.detail.value.spmc, cpkc = e.detail.value.cpkc, yxsl = e.detail.value.yxsl, dnjg = e.detail.value.dnjg, yj = e.detail.value.yj, wmjg = e.detail.value.wmjg, bzfy = e.detail.value.bzfy, xgfs = e.detail.value.xgfs, qsfs = e.detail.value.qsfs, spjj = e.detail.value.spjj;
    var splogo = this.data.splogo, spflid = this.data.spfl[this.data.spflIndex].id, spxxid = Number(this.data.spxxIndex) + 1, sjxjid = Number(this.data.sjxjIndex) + 1;
    console.log(cpid, sjdsjid, sppx, spmc, cpkc, yxsl, dnjg, yj, wmjg, bzfy, xgfs, qsfs, spjj, splogo, spflid, spxxid, sjxjid, is_hot, is_tj, is_new, is_zp)
    var warn = "";
    var flag = true;
    if (splogo == null) {
      warn = "请上传商品图片！";
    } else if (spmc == "") {
      warn = "请填写商品名称！";
    } else if (cpkc=="") {
      warn = "请填写商品库存！";
    } else if (dnjg == '') {
      warn = "请填写商品店内价格！";
    } else if (wmjg == '') {
      warn = "请填写商品外卖价格！";
    } else {
      that.setData({
        disabled: true,
      })
      flag = false;//若必要信息都填写，则不用弹框
      app.util.request({
        'url': 'entry/wxapp/AddStoreDishes',
        'cachetime': '0',
        data: { store_id: sjdsjid,id: cpid, num: sppx, name: spmc, type_id: spflid, type: spxxid, inventory: cpkc, sales: yxsl, money: wmjg, money2: yj, dn_money: dnjg, box_money: bzfy, restrict_num: xgfs, start_num: qsfs, content: spjj, logo: splogo, is_show: sjxjid, is_hot: is_hot, is_tj: is_tj, is_new: is_new, is_zp: is_zp, },
        success: function (res) {
          console.log(res)
          if (res.data == 1) {
            wx.showToast({
              title: '提交成功',
            })
            setTimeout(function () {
              wx.navigateBack({

              })
            }, 1000)
          }
          else {
            that.setData({
              disabled: false,
            })
            wx.showToast({
              title: '请修改后提交！',
              icon: 'loading'
            })
          }
        }
      })
    }
    if (flag == true) {
      wx.showModal({
        title: '提示',
        content: warn
      })
    }
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
  
  }
})