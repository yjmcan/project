// zh_wzp/pages/resume/set_up.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    region: ['广东省', '广州市', '海珠区'],
    index3: 0,
    multiIndex: [0, 0],
    cancel: false,
    skill: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.route(this)
    var that = this
    if (options.type == 0) {
      // 点击编辑进来 调用编辑的方法
      var user_id = wx.getStorageSync('userinfo').id
      app.util.request({
        url: 'entry/wxapp/ResumeDetails',
        data: {
          id: options.id,
          user_id: user_id
        },
        success: res => {
          var job = []
          res.data[0].work.map(function (item) {
            var obj = {}
            obj.work_company = item.work_company
            obj.work_content = item.work_content
            obj.work_position = item.work_position
            obj.work_time1 = item.work_time1
            obj.work_time2 = item.work_time2
            job.push(obj)
          })
          console.log(job)
          var project = []
          res.data[0].project.map(function (item) {
            var obj = {}
            obj.project_name = item.project_name
            obj.project_introducation = item.project_introducation
            obj.project_role = item.project_role
            obj.project_time1 = item.project_time1
            obj.project_time2 = item.project_time2
            obj.project_url = item.project_url
            project.push(obj)
          })
          console.log(project)
          var education = []
          res.data[0].education.map(function (item) {
            var obj = {}
            obj.education_school = item.education_school
            obj.education_experience = item.education_experience
            obj.education_major = item.education_major
            obj.education_time1 = item.education_time1
            obj.education_time2 = item.education_time2
            obj.education_qualification = item.education_qualification
            education.push(obj)
          })
         var  skill = res.data[0].skill.split(",")
          that.setData({
            region: res.data[0].area.split(","),
            add: true,
            resume: res.data[0],
            job: job,
            project: project,
            skill: skill,
            education: education,
          })
          that.edit()
          that.marry(0)
        }
      })
    } else {
      that.setData({
        add: false,
        job: [],
        project: [],
        education: [],
      })
      that.edit()
      that.marry(0)
    }
    that.setData({
      color: wx.getStorageSync("color")
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: wx.getStorageSync("color"),
    })

    app.util.request({
      url: 'entry/wxapp/Attachurl',
      success: res => {
        that.setData({
          url: res.data
        })
      }
    })
    that.setData({
      color: wx.getStorageSync("color")
    })
  },
  edit: function (e) {
    var that = this
    var add = that.data.add
    app.util.request({
      url: "entry/wxapp/Industry",
      success: res => {
        var c_l_c = []
        for (let i in res.data) {
          c_l_c.push(res.data[i].name)
          if (add == true) {
            if (that.data.resume.industry_id == res.data[i].id) {
              console.log(i)
              that.setData({
                index2: i,
                industry_id: res.data[i].id
              })
            }
          } else {
            that.setData({
              industry_id: res.data[0].id,
              index2: 0
            })
          }
        }
        that.setData({
          c_l_c: c_l_c,
          c_l_c_t: res.data,
        })
      }
    })
    app.util.request({
      url: "entry/wxapp/Jobstatus",
      success: res => {
        var array = []
        for (let i in res.data) {
          array.push(res.data[i].name)
          if (add == true) {
            if (that.data.resume.job_status == res.data[i].id) {
              that.setData({
                index: i,
                job_status: res.data[i].id
              })
            }
          } else {
            that.setData({
              job_status: res.data[0].id,
              index: 0
            })
          }
        }
        that.setData({
          array: array,
          arrays: res.data
        })
      }
    })
    // 薪资
    app.util.request({
      url: 'entry/wxapp/Salary',
      success: res => {
        var degree = res.data
        var price = []
        for (let i in degree) {
          price.push(degree[i].name)
          if (add == true) {
            if (that.data.resume.salary == res.data[i].id) {
              that.setData({
                index1: i,
                salary_id: res.data[i].id
              })
            }
          } else {
            that.setData({
              salary_id: res.data[0].id,
              index1: 0
            })
          }
        }
        that.setData({
          price: price,
          price_t: res.data
        })
      }
    })
  },
  marry: function (index) {
    var that = this
    app.util.request({
      url: "entry/wxapp/type",
      success: res => {
        var multiArray = res.data
        var job_W = []
        var marry = []
        for (let i in multiArray) {
          marry.push(multiArray[i].name)
        }
        var children = []
        for (let i in multiArray[index].children) {
          children.push(multiArray[index].children[i].name)
        }
        job_W.push(marry)
        job_W.push(children)
        that.setData({
          job_W: job_W,
          types: res.data
        })
      }
    })
  },
  // 选择工作状态
  bindPickerChange1: function (e) {
    var that = this
    var index = e.detail.value
    var arrays = that.data.arrays
    var array = that.data.array
    for (let i in arrays) {
      if (arrays[i].name == array[index]) {
        that.setData({
          job_status: arrays[i].id
        })
      }
    }
    that.setData({
      index: e.detail.value
    })
  },
  // 选择薪资
  bindPickerChange2: function (e) {
    var that = this
    var index1 = e.detail.value
    var price = that.data.price_t
    that.setData({
      index1: e.detail.value,
      salary_id: price[index1].id
    })
  },
  // 选择城市
  bindPickerChange3: function (e) {
    this.setData({
      region: e.detail.value
    })
  },
  // 选择行业
  bindPickerChange4: function (e) {
    var that = this
    var index2 = e.detail.value
    var c_l_c_t = that.data.c_l_c_t
    that.setData({
      index2: e.detail.value,
      industry_id: c_l_c_t[index2].id
    })
  },
  bindMultiPickerChange: function (e) {
    this.setData({
      multiIndex: e.detail.value,
      milt_status: true
    })
  },
  bindMultiPickerColumnChange: function (e) {
    var that = this
    var multiIndex = that.data.multiIndex
    multiIndex[e.detail.column] = e.detail.value;
    var index = multiIndex[0]
    var index1 = multiIndex[1]
    if (e.detail.column == 0) {
      that.marry(index)
    }

  },
  bindcolumnchange: function (e) {
    var that = this
  },
  // 添加工作经历
  add_job: function (e) {
    wx.setStorageSync('job', this.data.job)
    var index = e.currentTarget.dataset.index
    if (index != null) {
      var type = 1
    } else {
      var type = 0
    }
    wx.navigateTo({
      url: 'add_job?type=' + type + '&index=' + index,
    })
  },
  // 添加项目经历
  add_project: function (e) {
    wx.setStorageSync('project', this.data.project)
    var index = e.currentTarget.dataset.index
    if (index != null) {
      var type = 1
    } else {
      var type = 0
    }
    wx.navigateTo({
      url: 'add_project?type=' + type + '&index=' + index,
    })
  },
  // 添加教育经历
  add_education: function (e) {
    wx.setStorageSync('education', this.data.education)
    var index = e.currentTarget.dataset.index
    if (index != null) {
      var type = 1
    } else {
      var type = 0
    }
    wx.navigateTo({
      url: 'add_education?type=' + type + '&index=' + index,
    })
  },
  // 添加技能标签
  add_skill: function (e) {
    var that = this
    var skill = that.data.skill
    if (skill.length < 10) {
      that.setData({
        cancel: true
      })
    }else{
      wx.showModal({
        title: '',
        content: '最多添加10个标签',
      })
    }
  },
  inputs_skill: function (e) {
    var that = this
    var value = e.detail.value
    that.setData({
      value: value
    })
  },
  confal: function (e) {
    var that = this
    var value = that.data.value
    var skill = that.data.skill
    if (value != '' && value != null) {
      skill.push(value)
      console.log(skill)
      that.setData({
        skill: skill,
        cancel: false,
        value:''
      })
    }else{
      wx.showModal({
        title: '',
        content: '请输入技能标签',
      })
    }
  },
  cancel: function (e) {
    var that = this
    var cancel = that.data.cancel
    if (cancel == false) {
      that.setData({
        cancel: true
      })
    } else {
      that.setData({
        cancel: false
      })
    }
  },
  // 删除技能标签
  delete: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index
    console.log(index)
    var skill = that.data.skill
    console.log(skill)
    skill.splice(index, 1)
    console.log(skill)
    that.setData({
      skill: skill
    })
  },
  formSubmit: function (e) {
    var that = this
    var multiIndex = that.data.multiIndex
    var user_id = wx.getStorageSync('userinfo').id
    // var array = that.data.array
    var price = that.data.price
    var job_W = that.data.job_W
    var c_l_c = that.data.c_l_c
    var types = that.data.types
    // var job_status = array[that.data.index]
    var salary = price[that.data.index1]
    var industry = c_l_c[that.data.index2]
    var place = job_W[0][multiIndex[0]] + job_W[1][multiIndex[1]]
    var region = that.data.region
    region = region.join(",")
    var job_0 = types[multiIndex[0]].id
    var job_1 = types[multiIndex[0]].children[multiIndex[1]].id
    var title = e.detail.value.title
    var text = e.detail.value.text
    var job_status = that.data.job_status
    var skill = that.data.skill
    console.log('用户id' + '         ' + user_id)
    console.log('简历标题' + '         ' + title)
    console.log('自我评价' + '         ' + text)
    console.log('工作状态' + '         ' + job_status)
    console.log('薪资要求' + '         ' + salary + '         ' + that.data.salary_id)
    console.log('期望行业' + '         ' + industry + '         ' + that.data.industry_id)
    console.log('期望职位' + '         ' + place)
    console.log('工作地点' + '         ' + region)
    console.log('简历标题' + '         ' + title)
    console.log('自我评价' + '         ' + text)
    console.log('职位id' + '         ' + job_0)
    console.log('具体职位id' + '         ' + job_1)
    console.log()
    var work = that.data.job
    var project = that.data.project
    var education = that.data.education
    console.log(work)
    console.log(project)
    console.log(education)
    var titles = ''
    if (title == '') {
      titles = '请输入简历标题'
    } else if (text == '') {
      titles = '请输入自我评价'
    } else if (work.length <=0) {
      titles = '请添加工作经历'
    } else if (project.length <= 0) {
      titles = '请添加项目经历'
    } else if (education.length <= 0) {
      titles = '请添加教育经历'
    } else if (skill.length <= 0) {
      titles = '请添加个人技能标签'
    }
    if (app.title(titles) == true) {
      if (that.data.add == true) {
        console.log(skill.join(","))
        app.util.request({
          url: 'entry/wxapp/UpdateResume',
          data: {
            id: that.data.resume.id,
            user_id: user_id,
            job_status: job_status,
            title: title,
            type_id: job_1,
            industry_id: that.data.industry_id,
            area: region,
            salary: that.data.salary_id,
            self_evaluation: text,//
            work: work,//工作经历
            project: project,//项目经验
            education: education,//教育经历
            p_id: job_0,
            skill:skill.join(",")
          },
          success: res => {
            console.log(res)
            if (res.data.code == "200") {
              wx.showToast({
                title: '修改成功',
              })
              setTimeout(function () {
                wx.navigateBack({
                  delta: 1
                })
              }, 1500)
            }
          }
        })
      } else {
        app.util.request({
          url: 'entry/wxapp/PublishResume',
          data: {
            user_id: user_id,
            job_status: job_status,
            title: title,
            type_id: job_1,
            industry_id: that.data.industry_id,
            area: region,
            salary: that.data.salary_id,
            self_evaluation: text,//
            work: work,//工作经历
            project: project,//项目经验
            education: education,//教育经历
            p_id: job_0,
            skill: skill.join(",")
          },
          success: res => {
            console.log(res)
            if (res.data.code == "200") {
              wx.showToast({
                title: '提交成功',
              })
              setTimeout(function () {
                wx.navigateBack({
                  delta: 1
                })
              }, 1500)
            }
          }
        })
      }

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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})