// components/dialog/index.js
Component({
  /**
   * 组件的属性列表
   */
  options:{
    addGlobalClass:true
  },
  properties: {
    _show:{
      type:Boolean,
      value:false
    },
    title:{
      type:String,
      value:"默认标题"
    },
    text:{
      type:String,
      value:"默认文字"
    },
    btnS:{
      type:Array,
      value:["取消","确定"]
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showDialog: function (params) {
      const that = this
      that.setData({
      _show: !this.data._show,
      title: params.title,
      text:params.text,
      btnS:params.btnS || ["取消","确定"],
      success: params.success || function () { },
      close: params.close || function () { },
      })
    },
    selectClick(e){
      const {index} = e.currentTarget.dataset
      this.triggerEvent('onClick',index)
      if (index == 0) {
        this.setData({
            _show: false
        }, () => {
            this.data.close()
        })
        } else {
        this.setData({
            _show: false
        }, () => {
            this.data.success()
        })
        }
    }
  }
})
