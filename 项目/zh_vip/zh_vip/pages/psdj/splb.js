var app = getApp();
var searchTitle = ""; // 搜索关键字 
Page({
  data: {
    isFilterShow: !1,
    listmode: "block",
    listsort: "",
    page: 1,
    loaded: !1,
    loading: !0,
    opencategory: !1,
    category: {},
    category_child: [],
    filterBtns: {},
    isfilter: 0,
    category_child_selected:'',
    list: [],
    params: {},
    total: 0,
    fromsearch: !1,
    searchRecords: []
  },
  onLoad: function (t) {
    console.log(t)
    var that = this;
    var xtxx = wx.getStorageSync('xtxx')
    var url = getApp().imgurl;
    console.log(xtxx,url)
    this.setData({
      xtxx: xtxx,
      url: url,
      searchLogList: wx.getStorageSync('searchLog') || [],
    })
    console.log(wx.getStorageSync('searchLog'))
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: xtxx.link_color,
    })
    if (t.fromsearch){
      that.setData({
        fromsearch: t.fromsearch || !1
      })
    }
    else{
      that.setData({
        params: t,
        fromsearch: t.fromsearch || !1
      })
    }
    this.initCategory();
    t.fromsearch || this.getList();
    //   this.getRecord()
  },
  onShow: function () {
    searchTitle=''
    this.data.fromsearch && this.setFocus()
  },
  onReachBottom: function () {
    this.data.loaded || this.getList()
  },
  initCategory: function () {
    var t = this, mdid = wx.getStorageSync('mdid')
    console.log(mdid)
    //Type
    app.util.request({
      'url': 'entry/wxapp/Type',
      'cachetime': '0',
      data: { store_id: mdid },
      success: function (res) {
        console.log(res)
        var a = res.data;
        t.setData({
          category_parent: a,
          category_child: [],
        })
      }
    })
  },
  getList: function () {
    var that = this;
    that.setData({
      loading: !0
    }),
      that.data.params.page = that.data.page, that.data.params.pagesize = 10;
    console.log(that.data.params)
    //Goods
    app.util.request({
      'url': 'entry/wxapp/Goods',
      'cachetime': '0',
      data: that.data.params,
      success: function (res) {
        console.log(res.data)
        var a = res.data;
        var e = {
          loading: !1,
          total: a.length
        };
        a || (a = []),
          a.length > 0 && (e.page = that.data.page + 1, e.list = that.data.list.concat(a), a.length < that.data.params.pagesize && (e.loaded = !0)),
          that.setData(e)
      }
    });
  },
  changeMode: function () {
    "block" == this.data.listmode ? this.setData({
      listmode: ""
    }) : this.setData({
      listmode: "block"
    })
  },
  bindSort: function (t) {
    var a = t.currentTarget.dataset.order,
      e = this.data.params;
    if ("" == a) {
      if (e.order == a) return;
      e.order = "",
        this.setData({
          listorder: ""
        })
    } else if ("minprice" == a) this.setData({
      listorder: ""
    }),
      e.order == a ? "desc" == e.by ? e.by = "asc" : e.by = "desc" : e.by = "asc",
      e.order = a,
      this.setData({
        listorder: e.by
      });
    else if ("sales" == a) {
      if (e.order == a) return;
      this.setData({
        listorder: ""
      }),
        e.order = "sales",
        e.by = "desc"
    }
    this.setData({
      params: e,
      page: 1,
      list: [],
      loading: !0,
      loaded: !1,
      sort_selected: a
    }),
      this.getList()
  },
  showFilter: function () {
    this.setData({
      isFilterShow: !this.data.isFilterShow
    })
  },
  bindFilterCancel: function () {
    this.setData({
      isFilterShow: !1,
      cateogry_parent_selected: "",
      category_child_selected: "",
      category_child: [],
      filterBtns: {},
      // loading: !0,
      loaded: !1,
      listorder: "",
    })
  },
  bindFilterSubmit: function () {
    var t = this.data.params, category_child_selected = this.data.category_child_selected;
      console.log(t,category_child_selected)
      if(category_child_selected==''){
        wx.showModal({
          title: '提示',
          content: '请选择子分类',
        })
        return
      }
      t.type_id = category_child_selected, t.name = ''
      this.setData({
        page: 1,
        params: t,
        isFilterShow: !1,
        list: [],
        loading: !0,
        loaded: !1
      }),
      this.getList()
  },
  bindCategoryEvents: function (t) {
    var a = t.target.dataset.index, id = t.target.dataset.id, p = this.data.params;
    console.log(a,id,p)
    var e = t.target.dataset.level;
    1 == e ? (this.setData({
      category_child: [],
    }), this.setData({
      category_parent_selected: id,
      category_child_selected: '',
      category_child: this.data.category_parent[a].type2
    })) : 2 == e ? (this.setData({
      category_child_selected: id,
      // category_third: this.data.allcategory.children[a]
    })) : this.setData({
      // category_third_selected: a
    })
  },
  bindSearch: function (t) {
    var that=this;
    console.log(searchTitle)
    //  
    if ("" != searchTitle) {
      var searchLogData = that.data.searchLogList;
      if (searchLogData.indexOf(searchTitle) === -1) {
        searchLogData.unshift(searchTitle);
        wx.setStorageSync('searchLog', searchLogData);
        that.setData({
          searchLogList: wx.getStorageSync('searchLog')
        })
      }
      var p = this.data.params;
      p.name = searchTitle, p.type_id='';
      console.log(p)
      var that = this;
      that.setData({
        list: [],
        page: 1,
        params: p,
        listorder: "",
        fromsearch: !1,
        loading: !0,
        loaded: !1
      });
      that.getList()
    }
    else {
      wx.showToast({
        title: '搜索内容为空',
        icon: 'loading',
        duration: 1000,
      })
    }
  },
  bindInput: function (e) {
    console.log(e)
    var that = this;
    // 如果不做这个if判断，会导致 searchLogList 的数据类型由 list 变为 字符串  
    if ("" != wx.getStorageSync('searchLog')) {
      that.setData({
        inputVal: e.detail.value,
        searchLogList: wx.getStorageSync('searchLog'),
        fromsearch: !0
      });
    } else {
      that.setData({
        inputVal: e.detail.value,
        fromsearch: !0
      });
    }
    searchTitle = e.detail.value;
  },
  bindFocus: function (t) {
    "" == t.detail.value && this.setData({
      fromsearch: !0
    })
  },
  bindback: function () {
    wx.navigateBack()
  },
  searchDataByLog: function (e) {
    searchTitle = e.target.dataset.text;
    console.log(searchTitle)
    this.bindSearch()
  },
  delRecord: function () {
    wx.removeStorageSync("searchLog");
    this.setData({
      searchLogList: []
    });
      this.setData({
        fromsearch: !0
      })
  },
  setFocus: function () {
    var t = this;
    setTimeout(function () {
      t.setData({
        focusin: !0
      })
    },
      1e3)
  }
})