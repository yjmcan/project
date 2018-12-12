// pages/fabu/enrollset.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    luntext: ['在线报名'],
    activeIndex: 0,
    estyle: ['免费', '收费'],
    activeIndex2: 0,
    free_Admission_one: 'free_Admission',//免费
    charge_one: 'charge',//收费
    free_Admission_two: 'free_Admission',//免费
    charge_two: 'charge',//收费
    ticket_input_one: false,//票券名字输入
    ticket_input_two: false,//票券名字输入
    ticket_name_one: '票券',//默认票券名字
    ticket_name_two: '票券',//默认票券名字
    delete_ticket: false,//删除票券弹出删除提示框
    add_ticket_one: false,//第一个票券
    add_ticket_two: false,//第二个票券
    num: 0,
    add: true,
    set_up: [
      {
        id: 1,
        one: true,//确定是否显示
        free_Admission_one: 'free_Admission',//免费默认样式
        charge_one: 'charge',//收费默认样式
        ticket_name_one: '票券' + 1,//默认票券名字
        free_Admission: 'free_Admission',//免费点击事件
        charge: 'charge',//收费点击事件
        ticket_fixed_two: 'ticket_fixed',//票券名字和输入框切换
        ticket_input: false,//输入框是否显示
        bindblur: 'bindblur',//input输入事件
        price: '',//价格
        total: '',//总数
        limit: '',//限购
        ticket_price: 'ticket_price',//价格点击事件
        ticket_total: 'ticket_total',//总数点击事件
        ticket_limit: 'ticket_limit',//限购点击事件
        delete_ticket: 'delete_ticket',//删除票券
        to_examine: 'to_examine',//审核
        examine: false,//审核关闭
      },
      {
        id: 2,
        one: false,//确定是否显示
        free_Admission_one: 'free_Admission',//免费默认样式
        charge_one: 'charge',//收费默认样式
        ticket_name_one: '票券' + 2,//默认票券名字
        free_Admission: 'free_Admission',//免费点击事件
        charge: 'charge',//收费点击事件
        ticket_fixed_two: 'ticket_fixed',//票券名字和输入框切换
        ticket_input: false,//输入框是否显示
        bindblur: 'bindblur',//input输入事件
        price: '',//价格
        total: '',//总数
        limit: '',//限购
        ticket_price: 'ticket_price',//价格点击事件
        ticket_total: 'ticket_total',//总数点击事件
        ticket_limit: 'ticket_limit',//限购点击事件
        delete_ticket: 'delete_ticket',//删除票券
        to_examine: 'to_examine',//审核
        examine: false,//审核关闭
      },
      {
        id: 3,
        one: false,//确定是否显示
        free_Admission_one: 'free_Admission',//免费默认样式
        charge_one: 'charge',//收费默认样式
        ticket_name_one: '票券' + 3,//默认票券名字
        free_Admission: 'free_Admission',//免费点击事件
        charge: 'charge',//收费点击事件
        ticket_fixed_two: 'ticket_fixed',//票券名字和输入框切换
        ticket_input: false,//输入框是否显示
        bindblur: 'bindblur',//input输入事件
        price: '',//价格
        total: '',//总数
        limit: '',//限购
        ticket_price: 'ticket_price',//价格点击事件
        ticket_total: 'ticket_total',//总数点击事件
        ticket_limit: 'ticket_limit',//限购点击事件
        delete_ticket: 'delete_ticket',//删除票券
        to_examine: 'to_examine',//审核
        examine: false,//审核关闭
      },
    ],
    information: [],
    contact_informations: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    app.setNavigationBarColor(this);
    that.setData({
      options: options
    })
    wx.hideShareMenu()
    var luntext = that.data.luntext
    var mode = luntext[that.data.activeIndex]
    // 保存活动报名方式
    wx.setStorageSync('mode', mode)
    var set_up = that.data.set_up
    var list = []
    for (let i in set_up) {
      if (set_up[i].one == true) {
        list.push(set_up[i])
      }
    }
    that.setData({
      list: list
    })
    // 获取报名信息
    app.util.request({
      'url': 'entry/wxapp/GetBmInfo',
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        var bminfo = res.data
        for (let i in bminfo) {
          bminfo[i].class = 'none_select'
        }
        if (bminfo.length > 2) {
          bminfo[0].class = 'select'
          bminfo[1].class = 'select'
        }
        if(bminfo.length==0){
          bminfo=[
            {
              name:'姓名',
              class : 'select'
            },
            {
              name: '电话',
              class: 'select'
            }
          ]
        }
        wx.setStorageSync('bminfo', bminfo)
        that.setData({
          bminfo: bminfo
        })
      },
    })
  },
  // 切换免费
  free_Admission: function (e) {
    console.log('这是免费')
    console.log(e)
    var that = this
    var set_up = that.data.set_up
    console.log(set_up)
    var id = e.currentTarget.dataset.id
    for (let i in set_up) {
      if (id == set_up[i].id) {
        set_up[i].free_Admission_one = 'free_Admission'
        set_up[i].charge_one = 'charge'
      }
    }
    that.setData({
      set_up: set_up
    })
  },
  // 选中报名信息
  select_info: function (e) {
    var that = this
    console.log(e)
    var index = e.currentTarget.dataset.index
    var bminfo = that.data.bminfo
    if (bminfo[index].class == 'select') {
      bminfo[index].class = 'none_select'
    } else {
      bminfo[index].class = 'select'
    }
    wx.setStorageSync('bminfo', bminfo)
    that.setData({
      bminfo: bminfo
    })
  },
  // 切换收费
  charge: function (e) {
    console.log('这是收费')
    console.log(e)
    var that = this
    var set_up = that.data.set_up
    var id = e.currentTarget.dataset.id
    for (let i in set_up) {
      if (id == set_up[i].id) {
        set_up[i].free_Admission_one = 'charge'
        set_up[i].charge_one = 'free_Admission'
      }
    }
    var list = []
    for (let i in set_up) {
      if (set_up[i].one == true) {
        list.push(set_up[i])
      }
    }
    that.setData({
      set_up: set_up,
      list: list
    })
  },
  // 票券名字和输入框切换
  ticket_fixed: function (e) {
    var that = this
    var set_up = that.data.set_up
    var id = e.currentTarget.dataset.id
    for (let i in set_up) {
      if (id == set_up[i].id) {
        set_up[i].ticket_input = true
      }
    }
    var list = []
    for (let i in set_up) {
      if (set_up[i].one == true) {
        list.push(set_up[i])
      }
    }
    that.setData({
      set_up: set_up,
      list: list
    })
  },
  // 价格点击事件
  ticket_price: function (e) {
    var that = this
    var set_up = that.data.set_up
    var id = e.currentTarget.dataset.id
    for (let i in set_up) {
      if (id == set_up[i].id) {
        set_up[i].price = e.detail.value
      }
    }
    var list = []
    for (let i in set_up) {
      if (set_up[i].one == true) {
        list.push(set_up[i])
      }
    }
    that.setData({
      set_up: set_up,
      list: list
    })
  },
  // 总数点击事件
  ticket_total: function (e) {
    var that = this
    var set_up = that.data.set_up
    var id = e.currentTarget.dataset.id
    for (let i in set_up) {
      if (id == set_up[i].id) {
        set_up[i].total = e.detail.value
      }
    }
    var list = []
    for (let i in set_up) {
      if (set_up[i].one == true) {
        list.push(set_up[i])
      }
    }
    that.setData({
      set_up: set_up,
      list: list
    })
  },

  // 限购点击事件
  ticket_limit: function (e) {
    var that = this
    var set_up = that.data.set_up
    var id = e.currentTarget.dataset.id
    for (let i in set_up) {
      if (id == set_up[i].id) {
        set_up[i].limit = e.detail.value
      }
    }
    var list = []
    for (let i in set_up) {
      if (set_up[i].one == true) {
        list.push(set_up[i])
      }
    }
    that.setData({
      set_up: set_up,
      list: list
    })
  },
  // 票券名字修改
  bindblur: function (e) {
    var that = this
    var set_up = that.data.set_up
    var id = e.currentTarget.dataset.id
    if (e.detail.value != '') {
      for (let i in set_up) {
        if (id == set_up[i].id) {
          set_up[i].ticket_name_one = e.detail.value
          set_up[i].ticket_input = false
        }
      }
    }
    var list = []
    for (let i in set_up) {
      if (set_up[i].one == true) {
        list.push(set_up[i])
      }
    }
    that.setData({
      set_up: set_up,
      list: list
    })
  },
  // 删除提示框
  delete_ticket: function (e) {
    var that = this
    var set_up = that.data.set_up
    var id = e.currentTarget.dataset.id
    that.setData({
      delete_ticket_id: id,
      delete_ticket: true
    })
  },
  // 取消提示框
  cancel: function (e) {
    console.log(this.data.set_up)
    this.setData({
      delete_ticket: false
    })
  },
  // 点击确认
  confirm: function (e) {
    var that = this
    var set_up = that.data.set_up
    var id = that.data.delete_ticket_id
    for (let i in set_up) {
      if (id == set_up[i].id) {
        if (set_up[i].one == true) {
          set_up[i].one = false
        }
      }
    }
    that.setData({
      set_up: set_up,
      delete_ticket: false,
      add: true,
    })
  },
  // 添加票券
  add_ticket: function (e) {
    var that = this
    var set_up = that.data.set_up
    if (set_up[0].one == false) {
      set_up[0].one = true
    } else {
      if (set_up[1].one == false) {
        set_up[1].one = true
      } else {
        if (set_up[2].one == false) {
          set_up[2].one = true
          var add = false
        }
      }
    }
    var list = []
    for (let i in set_up) {
      if (set_up[i].one == true) {
        list.push(set_up[i])
      }
    }
    that.setData({
      add: add,
      set_up: set_up,
      list: list
    })
  },
  // 审核
  to_examine: function (e) {
    var that = this
    var set_up = that.data.set_up
    console.log(set_up)
    console.log(e)
    var id = e.currentTarget.dataset.id
    for (let i in set_up) {
      if (id == set_up[i].id) {
        set_up[i].examine = e.detail.value
      }
    }
    var list = []
    for (let i in set_up) {
      if (set_up[i].one == true) {
        list.push(set_up[i])
      }
    }
    that.setData({
      set_up: set_up,
      list: list
    })
  },
  // 切换报名方式
  tabClick: function (e) {
    var that = this
    var index = e.currentTarget.id
    var sign_up_info = that.data.luntext[index]
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id,
      sign_up_info: sign_up_info
    });
  },
  tabstyle: function (e) {
    this.setData({
      sliderOffset2: e.currentTarget.offsetLeft,
      activeIndex2: e.currentTarget.id
    });
  },
  // 添加联系方式
  contact_information: function (e) {
    var that = this
    var contact_information = that.data.contact_information
    var information = that.data.information
    that.setData({
      // information: that.data.information.concat(contact_information[0])
      contact_informations: true
    })
  },
  // 隐藏背景
  cancel_contacts: function (e) {
    var that = this
    that.setData({
      contact_informations: false
    })
  },
  // 点击添加联系方式
  add_click: function (e) {
    var that = this
    var id = e.currentTarget.dataset.id
    var contact_information = that.data.contact_information
    var information = that.data.information
    that.setData({
      information: that.data.information.concat(contact_information[id]),
      contact_informations: false
    })
  },
  // 点击删除联系方式
  delete_click: function (e) {
    console.log(e)
    var that = this
    console.log(that.data.information)
    var index = e.currentTarget.dataset.index
    console.log('对应的index为' + index)
    that.setData({
      information: that.data.information.splice(index, 1)
    })
    console.log(that.data.information)
  },
  // 跳转下一步
  next_step: function (e) {
    var that = this
    var options = that.data.options
    // 报名信息
    var bminfo = that.data.bminfo
    // 票券信息
    var list = that.data.list
    // 用户上传的活动海报
    var uplogo = options.uplogo
    // 用户设置的活动标题
    var title = options.title
    // 用户选择的活动方式  1线上或者2线下
    var array = options.array
    // 用户选择的活动分类
    var classification = options.classification
    // 用户选择的开始时间
    var start_time = options.start_time
    // 用户选择的结束时间
    var end_time = options.end_time
    // 用户选择的活动地址
    var address = options.address
    // 用户输入的活动联系方式
    var link_tel = options.link_tel
    // 用户所选择的地址经纬度
    var coordinates = options.coordinates
    // 主办方名字
    var sponsor = options.sponsor
    // 用户选择的城市
    var city = options.city
    // 核销码
    var hx_code = options.hx_code
    console.log('用户上传的活动海报' + '为' + ' ' + uplogo)
    console.log('用户设置的活动标题' + '为' + ' ' + title)
    console.log('用户选择的活动方式  线上或者线下' + '为' + ' ' + array)
    console.log('用户选择的活动分类' + '为' + ' ' + classification)
    console.log('用户选择的开始时间' + '为' + ' ' + start_time)
    console.log('用户选择的结束时间' + '为' + ' ' + end_time)
    console.log('用户选择的活动地址' + '为' + ' ' + address)
    console.log('用户所选择的地址经纬度' + '为' + ' ' + coordinates)
    console.log('用户输入的活动联系方式' + '为' + ' ' + link_tel)
    console.log('主办方名字' + '为' + ' ' + sponsor)
    console.log('用户选择的城市' + '为' + ' ' + city)
    if (bminfo == null || bminfo == '') {

    } else {
      var bm_info = []
      for (let i in bminfo) {
        if (bminfo[i].class == 'select') {
          bm_info.push(bminfo[i])
        }
      }
      var bminfo = []
      bm_info.map(function (item) {
        var obj = {};
        obj = item.id,
          bminfo.push(obj);
      })
      bm_info = bminfo.join(",")
      console.log(bm_info)
    }
    // 获取活动票券设置
    if (list == null || list == '') {

    } else {
      var actype = []
      list.map(function (item) {
        var obj = {};
        obj.type = item.free_Admission_one,
          obj.tk_name = item.ticket_name_one;
        if (item.price == '') {
          item.price = 0
        }
        obj.money = item.price,
          obj.total_num = item.total,
          obj.limit_num = item.limit,
          obj.bm_check = item.examine,
          actype.push(obj);
      })
      var lower_price = []
      list.map(function (item) {
        var price = {};
        price = item.price
        lower_price.push(price)
      })
      console.log(lower_price)
      // 获取到的最低价格
      var samll_price = Math.min.apply(null, lower_price)
    }
    for (let i in actype) {
      if (actype[i].type == 'free_Admission') {
        actype[i].type = 1
      } else {
        actype[i].type = 2
      }
      if (actype[i].bm_check == false) {
        actype[i].bm_check = 2
      } else {
        actype[i].bm_check = 1
      }
    }
    var Prompt = ''
    if (bminfo == '' || bminfo == null) {
      Prompt = '请选择报名信息'
    }
    else if (list == '' || list == null) {
      Prompt = '请设置票券'
    } else if (actype.length > 0) {
      for (let i in actype) {
        if (actype[i].type == 1) {
          actype[i].money = 0
          if (actype[i].total_num == '') {
            Prompt = '请设置票券总数'
          } else if (actype[i].limit_num == '') {
            Prompt = '请设置票券限购数量'
          }
        } else {
          if (actype[i].money == '') {
            Prompt = '请设置票券价格'
          } else if (actype[i].total_num == '') {
            Prompt = '请设置票券总数'
          } else if (actype[i].limit_num == '') {
            Prompt = '请设置票券限购数量'
          }
        }
      }
    }
    if (Prompt != '') {
      wx.showModal({
        title: '温馨提示',
        content: Prompt,
      })
    } else {
      console.log('获取到的票券信息为')
      console.log(actype)
      console.log('获取到的报名信息为')
      console.log(bm_info)
      wx.setStorageSync('actype', actype)
      wx.navigateTo({
        url: 'fabuinfo?uplogo=' + uplogo + '&title=' + title + '&array=' + array + '&classification=' + classification + '&start_time=' + start_time + '&end_time=' + end_time + '&bminfo=' + bminfo + '&actype=' + actype + '&address=' + address + '&link_tel=' + link_tel + '&coordinates=' + coordinates + '&link_tel=' + link_tel + '&sponsor=' + sponsor + '&city=' + city + '&bminfo=' + bminfo + '&samll_price=' + samll_price + '&hx_code=' + hx_code,
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
    this.setData({
      num: 0
    })
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

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})