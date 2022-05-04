// pages/moment-detail/index.js
import Toast from '@vant/weapp/toast/toast';
import {getMonentDataByUIdAndMomentStatus} from '../../service/api/moment'
import cache from '../../utils/localStorage'
import debounce from '../../utils/debounce'
import {USER_INFO} from '../../constant/user-const'
import {deletemomentByMId} from '../../service/api/moment'
import {isDialog} from '../../utils/showDialog'
import errorHandel from '../../utils/errorHandel'
const app = getApp()
const debounceGetMomentByStatus = debounce(async function(initReq = false,offset = 0){
  const {userId,currentTabIndex,currentTabTitle} = this.data
  const currentMomentData = this.data.momentStatusList
  if(!currentMomentData[currentTabTitle].hasMore && !initReq) return
  this.setData({isShowLoading:true})
  try {
    const result = await getMonentDataByUIdAndMomentStatus(userId,offset,currentTabIndex)
    currentMomentData[currentTabTitle].hasMore = result.data.hasMore
    this.setData({isShowLoading:false,triggered:false})
    if(offset){
      currentMomentData[currentTabTitle].data = currentMomentData[currentTabTitle].data.concat(result.data.result)
      this.setData({ momentStatusList:currentMomentData })
    }else{
      currentMomentData[currentTabTitle].data = result.data.result
      this.setData({ momentStatusList:currentMomentData })
    }
  } catch (error) {
    console.log(error);
  }
},500)

Page({
  data: {
    debounceGetMomentData:null,
    statusMap:{0:'审核中',1:'已通过',2:'未通过'},
    momentStatusList:{
      "审核中":{
        hasMore:true,
        data:[]
      },
      "已通过":{
        hasMore:true,
        data:[]
      },
      "未通过":{
        hasMore:true,
        data:[]
      }
    },
    currentTabIndex:0,
    currentTabTitle:'审核中',
    // 自定义下拉刷新状态
    triggered:false,
    userId:'',
    isShowLoading:false,
    timer:0
  },
  onLoad: function (options) {
    const {id} = cache.getCache(USER_INFO)
    this.setData({userId:id})
    // 1.初始化动态数据
    this.initMomentData(id)
  },
  // 自定义下拉刷新事件
  customPullDownRefresh(){
    debounceGetMomentByStatus.apply(this,[true])
  },
  // 自定义上拉加载事件
  customReachBottom(){
    const offset = this.data.momentStatusList[this.data.currentTabTitle].data.length
    debounceGetMomentByStatus.apply(this,[false,offset])
  },
  // 网络请求
  initMomentData:async function(id,offset = 0){
    for(let i = 0; i < 3; i++){
      getMonentDataByUIdAndMomentStatus(id,offset,i)
      .then(res => {
        const momentName = this.data.statusMap[i]
        const momentStatusList = this.data.momentStatusList
        momentStatusList[momentName].data = res.data.result
        momentStatusList[momentName].hasMore = res.data.hasMore
        this.setData({ momentStatusList })
      })
      .catch(console.log)
    }
  },
  getMomentByStatus:async function(initReq = false,offset = 0){
    const {userId,currentTabIndex,currentTabTitle} = this.data
    const currentMomentData = this.data.momentStatusList
    if(!currentMomentData[currentTabTitle].hasMore && !initReq) return
    this.setData({isShowLoading:true})
    try {
      const result = await getMonentDataByUIdAndMomentStatus(userId,offset,currentTabIndex)
      currentMomentData[currentTabTitle].hasMore = result.data.hasMore
      this.setData({isShowLoading:false,triggered:false})
      if(offset){
        currentMomentData[currentTabTitle].data = currentMomentData[currentTabTitle].data.concat(result.data.result)
        this.setData({ momentStatusList:currentMomentData })
      }else{
        currentMomentData[currentTabTitle].data = result.data.result
        this.setData({ momentStatusList:currentMomentData })
      }
    } catch (error) {
      console.log(error);
    }
  },
  // 事件处理
  handelTabsClick(e){
    const {index:currentTabIndex,title:currentTabTitle} = e.detail
    this.setData({
      currentTabIndex,
      currentTabTitle
    })
  },
  handelCloseClick:async function(e){
    const currentTitle = this.data.currentTabTitle
    const momentStatusList = this.data.momentStatusList
    const data = momentStatusList[currentTitle].data
    // 获取点击删除的id和index
    const {id:momentId,index} = e.currentTarget.dataset;
    try {
      // 显示弹窗询问
      await this.showDialog()
      // 点击确认删除之后显示loading
      this.showToast()
      // 发送网络请求
      await deletemomentByMId(momentId)
      // 删除成功关闭loading
      this.closeToast()
      // 将该条动态从当前数据中删除，并且返回删除后的数据
      const newData = data.remove(index)
      // 将新数据赋值给页面数据，起到刷新的效果
      momentStatusList[currentTitle].data = newData
      this.setData({momentStatusList})
      this.showToast(1)
    } catch (error) {
      errorHandel(false,app,error.data.errCode)
    }
  },
  showDialog(){
    return new Promise((resolve,reject) => {
      isDialog(app,{
        title:"提示",
        text:"确定删除这条宝物动态？",
        btnS:["不了","确认删除"],
        success:resolve
      })
    })
  },
  showToast(status = 0){
    if(!status) {
      Toast.loading({
        type:'loading',
        message: '正在删除...',
        forbidClick: true,
        mask:true,
        duration:0
      });
      return
    }
    Toast.loading({
      type:'success',
      message: '删除成功',
      forbidClick: true,
      mask:true,
      duration:1500
    });
  },
  closeToast(){
    Toast.clear()
  },
  handelItemClick(e){
    const momentId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/moment-detail/index?id=${momentId}`,
    })
  }
})