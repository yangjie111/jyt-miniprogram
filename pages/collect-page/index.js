// pages/collect-page/index.js
import {getCollectMomentByUId} from '../../service/api/moment'
import debounce from '../../utils/debounce'

const debounceGetCollect = debounce(async function(offset = 0,flag = false){
  if(!this.data.hasMore && !flag) return
  if(offset){
    const result = await getCollectMomentByUId(this.data.userId,offset)
    this.setData({
      collectData:this.data.collectData.concat(result.data.result),
      hasMore:result.data.hasMore,
      triggered:false
    })
  }else{
    console.log(this.data.userId);
    const result = await getCollectMomentByUId(this.data.userId,offset)
    this.setData({
      collectData:result.data.result,
      hasMore:result.data.hasMore,
      triggered:false
    })
  }
},300)

Page({
  data: {
    userId:'',
    collectData:[],
    hasMore:true,
    triggered:false,
    isShowLoading:false
  },
  onLoad: function (options) {
    const {userId} = options
    this.setData({userId})
    this.getCollectData(0).then(res => {
      this.setData({
        collectData:res.data.result,
        hasMore:res.data.hasMore
      })
    }).catch(console.log)
  },
  // 自定义下拉刷新事件
  customPullDownRefresh(){
    debounceGetCollect.apply(this,[0,true])
  },
  // 自定义上拉加载事件
  customReachBottom(){
    debounceGetCollect.apply(this,[this.data.collectData.length])
  },
  getCollectData: async function(offset = 0,flag = false){
    if(!this.data.hasMore && !flag) return
    if(offset){
      const result = await getCollectMomentByUId(this.data.userId,offset)
      this.setData({
        collectData:this.data.collectData.concat(result.data.result),
        hasMore:result.data.hasMore,
        triggered:false
      })
    }else{
      console.log(this.data.userId);
      const result = await getCollectMomentByUId(this.data.userId,offset)
      this.setData({
        collectData:result.data.result,
        hasMore:result.data.hasMore,
        triggered:false
      })
    }
  },
  handelCollectClick(e){
    const momentId = e.currentTarget.dataset.id
    console.log(momentId);
    wx.navigateTo({
      url: `/pages/moment-detail/index?id=${momentId}`,
    })
  }
})