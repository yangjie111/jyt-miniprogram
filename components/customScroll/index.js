// components/customReach/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    triggered:{
      type:Boolean,
      value:false
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
    // 下拉刷新事件
    onPullDownRefresh(){
      console.log('触发了下拉');
      this.triggerEvent('PullDownRefresh')
    },
    // 上拉加载事件
    onReachBottom(){
      console.log('触发了上拉');
      this.triggerEvent('ReachBottom')
    }
  }
})
