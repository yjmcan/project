var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    luntext: ['新入', '附近', '热门'],
    activeIndex: 0,
    refresh_top: false,
    storelist: [],
    page: 1,
    typeid:'',
    infortype: [{ id: 0, name: "全部" }],
    scactiveIndex: 0,
    districtList: [],
    sortingList: ['新入', '附近', '热门'],
    typeList: [{ id: 0, name: "全部" }],
    districtChioceIcon: "../image/icon-go-black.png",
    sortingChioceIcon: "../image/icon-go-black.png",
    chioceDistrict: false,
    chioceSorting: false,
    chioceFilter: false,
    activeDistrictParentIndex: -1,
    activeDistrictChildrenIndex: -1,
    scrollTop: 0,
    scrollIntoView: 0,
    activeTypeIndex: 0,
    activeSortingIndex: 0,
    activeTypeIndexname:'选择分类',
    activeSortingIndexname:'选择排序',
    borbtm:2,
  },
  hideAllChioce: function () {
    this.setData({
      districtChioceIcon: "../image/icon-go-black.png",
      sortingChioceIcon: "../image/icon-go-black.png",
      chioceDistrict: false,
      chioceSorting: false,
      chioceFilter: false,
    });
  },
  choiceItem: function (e) {
    this.setData({
      borbtm: e.currentTarget.dataset.item
    })
    switch (e.currentTarget.dataset.item) {
      case "1":
        if (this.data.chioceDistrict) {
          this.setData({
            districtChioceIcon: "../image/icon-go-black.png",
            sortingChioceIcon: "../image/icon-go-black.png",
            chioceDistrict: false,
            chioceSorting: false,
            chioceFilter: false,
          });
        }
        else {
          this.setData({
            districtChioceIcon: "../image/icon-down-black.png",
            sortingChioceIcon: "../image/icon-go-black.png",
            chioceDistrict: true,
            chioceSorting: false,
            chioceFilter: false,
          });
        }
        break;
      case "2":
        if (this.data.chioceSorting) {
          this.setData({
            districtChioceIcon: "../image/icon-go-black.png",
            sortingChioceIcon: "../image/icon-go-black.png",
            chioceDistrict: false,
            chioceSorting: false,
            chioceFilter: false,
          });
        }
        else {
          this.setData({
            districtChioceIcon: "../image/icon-go-black.png",
            sortingChioceIcon: "../image/icon-down-black.png",
            chioceDistrict: false,
            chioceSorting: true,
            chioceFilter: false,
          });
        }
        break;
      case "3":
        if (this.data.chioceFilter) {
          this.setData({
            districtChioceIcon: "../image/icon-go-black.png",
            sortingChioceIcon: "/images/icon-go-black.png",
            chioceDistrict: false,
            chioceSorting: false,
            chioceFilter: false,
          });
        }
        else {
          this.setData({
            districtChioceIcon: "../image/icon-go-black.png",
            sortingChioceIcon: "../image/icon-go-black.png",
            chioceDistrict: false,
            chioceSorting: false,
            chioceFilter: true,
          });
        }
        break;
    }
  },
  selectDistrictParent: function (e) {
    this.setData({
      activeDistrictParentIndex: e.currentTarget.dataset.index,
      activeDistrictName: this.data.districtList[e.currentTarget.dataset.index].district_name,
      activeDistrictChildrenIndex: 0,
      scrollTop: 0,
      scrollIntoView: 0
    })
  },
  selectDistrictChildren: function (e) {
    var index = e.currentTarget.dataset.index;
    var parentIndex = this.data.activeDistrictParentIndex == -1 ? 0 : this.data.activeDistrictParentIndex;
    if (index == 0) {
      this.setData({
        activeDistrictName: this.data.districtList[parentIndex].district_name
      })
    } else {
      this.setData({
        activeDistrictName: this.data.districtList[parentIndex].district_children_list[index].district_name
      })
    }
    this.setData({
      districtChioceIcon: "../image/icon-go-black.png",
      chioceDistrict: false,
      activeDistrictChildrenIndex: index,
      productList: [],
      pageIndex: 1,
      loadOver: false,
      isLoading: true
    })
  },
  //综合排序
  selectType: function (e) {
    var that = this;
    console.log(e.currentTarget.id, e.currentTarget.dataset.index)
    if (e.currentTarget.dataset.index == 0) {
      var typeid = '';
    }
    else {
      var typeid = e.currentTarget.id;
    }
    var index = e.currentTarget.dataset.index;
    this.setData({
      page: 1,
      refresh_top: false,
      storelist: [],
      fjstorelist: [],
      typeid: typeid,
      sortingChioceIcon: "../image/icon-go-black.png",
      chioceSorting: false,
      activeTypeIndex: index,
      activeSortingIndex:0,
      activeTypeIndexname: that.data.typeList[index].name,
    });
    setTimeout(() => {
      this.refresh()
    }, 100)
  },
  //综合排序
  selectSorting: function (e) {
    var that=this;
    console.log(e.currentTarget.dataset.index)
    var index = e.currentTarget.dataset.index;
    console.log(this.data, index)
    var store = this.data.fjstorelist;
    var compare = function (a, b) {
      var a = Number(a.distance);
      var b = Number(b.distance);
      if (a < b) {
        return -1
      } else if (a > b) {
        return 1
      } else {
        return 0
      }
    }
    var compare1 = function (a, b) {
      var a = Number(a.views);
      var b = Number(b.views);
      if (a > b) {
        return -1
      } else if (a < b) {
        return 1
      } else {
        return 0
      }
    }
    if (index == 0) {
      // this.setData({
      //   store: store
      // })
      //this.refresh()
    } else if (index == 1) {
      var store1 = store.sort(compare)
      console.log(store1)
      this.setData({
        store1: store1
      })
    } else if (index == 2) {
      var store2 = store.sort(compare1)
      console.log(store2)
      // for (let i in store) {
      //   if (store[i].score >= 4) {
      //     store2.push(store[i])
      //   }
      // }
      this.setData({
        store2: store2
      })
    }
    this.setData({
      sortingChioceIcon: "../image/icon-go-black.png",
      chioceDistrict: false,
      activeSortingIndex: index,
      activeSortingIndexname: that.data.sortingList[index]
    })
  },
  ///////
  // sctabClick: function (e) {
  //   console.log(e.currentTarget.id, e.currentTarget.dataset.index)
  //   if (e.currentTarget.dataset.index == 0) {
  //     var typeid = '';
  //   }
  //   else {
  //     var typeid = e.currentTarget.id;
  //   }
  //   this.setData({
  //     page: 1,
  //     refresh_top: false,
  //     storelist: [],
  //     fjstorelist:[],
  //     activeIndex: 0,
  //     scactiveIndex: e.currentTarget.dataset.index,
  //     typeid: typeid,
  //   });
  //   setTimeout(() => {
  //     this.refresh()
  //   }, 300)
  // },
  tabClick: function (e) {
    var index = e.currentTarget.id
    console.log(this.data, index)
    var store = this.data.fjstorelist;
    var compare = function (a, b) {
      var a = Number(a.distance);
      var b = Number(b.distance);
      if (a < b) {
        return -1
      } else if (a > b) {
        return 1
      } else {
        return 0
      }
    }
    var compare1 = function (a, b) {
      var a = Number(a.views);
      var b = Number(b.views);
      if (a > b) {
        return -1
      } else if (a < b) {
        return 1
      } else {
        return 0
      }
    }
    if (index == 0) {
      // this.setData({
      //   store: store
      // })
      //this.refresh()
    } else if (index == 1) {
      var store1 = store.sort(compare)
      console.log(store1)
      this.setData({
        store1: store1
      })
    } else if (index == 2) {
      var store2 = store.sort(compare1)
      console.log(store2)
      // for (let i in store) {
      //   if (store[i].score >= 4) {
      //     store2.push(store[i])
      //   }
      // }
      this.setData({
        store2: store2
      })
    }
    this.setData({
      activeIndex: e.currentTarget.id
    });
  },
  yellow_info: function (e) {
    var id = e.currentTarget.dataset.id
    var user_id = e.currentTarget.dataset.user_id
    console.log(user_id)
    wx: wx.navigateTo({
      url: 'yellowinfo?id=' + id,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if (options.typename) {
      wx.setNavigationBarTitle({
        title: options.typename,
      })
    }
    var that = this
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: wx.getStorageSync('color'),
    })
    var url = wx.getStorageSync('url')
    that.setData({
      url: url,
      id: options.id,
      System: wx.getStorageSync('System')
    })
    app.util.request({
      'url': 'entry/wxapp/yellowType2',
      'cachetime': '0',
      data: { type_id: options.id },
      success: function (res) {
        console.log(res, that.data.infortype)
        var vdarr = that.data.typeList.concat(res.data)
        console.log(vdarr)
        that.setData({
          typeList: vdarr,
        })
      },
    })
    that.refresh()
  },
  refresh: function (e) {
    var that = this
    var storetype_id = that.data.id, storetype2_id = that.data.typeid, page = that.data.page, storelist = that.data.storelist, city = wx.getStorageSync('city')
    console.log('城市为' + city);
    console.log(storetype_id,storetype2_id,storelist,page)
    app.util.request({
      'url': 'entry/wxapp/YellowPageList',
      'cachetime': '0',
      data: { type_id: storetype_id, type2_id: storetype2_id, page: page, pagesize: 10, cityname: city},
      success: function (res) {
        that.setData({
          page: page + 1,
        })
        console.log(res)
        if (res.data.length <10) {
          that.setData({
            refresh_top: true
          })
        } else {
          that.setData({
            refresh_top: false
          })
        }
        for (let i in res.data) {
          // 获取商家的经纬度
          var lat = res.data[i].coordinates
          var ss = lat.split(",")
          res.data[i].lat2 = Number(wx.getStorageSync('Location').latitude)
          res.data[i].lng2 = Number(wx.getStorageSync('Location').longitude)
          // 获取两者之间的距离
          var lat1 = Number(wx.getStorageSync('Location').latitude)
          var lng1 = Number(wx.getStorageSync('Location').longitude)
          var lat2 = ss[0]
          var lng2 = ss[1]
          var radLat1 = lat1 * Math.PI / 180.0;
          var radLat2 = lat2 * Math.PI / 180.0;
          var a = radLat1 - radLat2;
          var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
          var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
          s = s * 6378.137;
          s = Math.round(s * 10000) / 10000;
          var s = s.toFixed(2)
          res.data[i].distance = s
        }
        storelist = storelist.concat(res.data)
        that.setData({
          store: storelist,
          storelist: storelist,
          fjstorelist: storelist,
        })
      },
    })
  },
  // -----------------------------------跳转商家详情界面-------------------------------
  store: function (e) {
    var that = this
    console.log(e)
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../sellerinfo/sellerinfo?id=' + id,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  // ----------------------------------拨打电话----------------------------------
  phone: function (e) {
    console.log(e)
    var tel = e.currentTarget.dataset.tel
    wx.makePhoneCall({
      phoneNumber: tel
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
     this.setData({
       activeIndex: 0,
       refresh_top: false,
       storelist: [],
       page: 1,
     })
     this.refresh()
     wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('上拉加载', this.data.page)
    if (this.data.refresh_top == false) {
      this.refresh()
    } else {

    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})