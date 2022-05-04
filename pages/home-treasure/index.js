// pages/home-music/index.js
import {getMonentData} from '../../service/api/moment'
import eventStore from '../../store/index'
import debounce from '../../utils/debounce'
import cache from '../../utils/localStorage'
import {USER_INFO} from '../../constant/user-const'

const getMomentDataDebounce = debounce(async function(userId,offset = 0,flag = true){
    if(!this.data.hasMore && flag) return
    if(offset) this.setData({isShowLoading:true})
    const tagId = this.data.tagList[this.data.tagIndex].id
    const result = await getMonentData(userId,offset,tagId)
    this.setData({isShowLoading:false,triggered:false})
    const hasMore = result.data.hasMore
    if(offset === 0){
        this.setData({
            momentData:result.data.result,
            hasMore
        })
    }else{
        const currentData = this.data.momentData
        this.setData({
            momentData:currentData.concat(result.data.result),
            hasMore
        })
    }
},300)

Page({

    /**
     * 页面的初始数据
     */
    data: {
        tagList:[{id:0,tname:"全部"}],
        momentData:[],
        offset:0,
        isShowLoading:false,
        hasMore:true,
        isShowPopup:false,
        tagIndex:0,
        triggered: false,
        userId:''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {
        // 1.获取用户id
        const {id:userId} = cache.getCache(USER_INFO)
        console.log(userId);
        this.setData({userId})
        // 2.获取标签数据
        this.getTagList()
        // 3.获取初始化数据
        await this.getMomentData(this.data.userId)
    },
    // 自定义上拉加载
    customReachBottom:async function (){
        // 上拉加载更多数据
        getMomentDataDebounce.apply(this,[this.data.userId,this.data.momentData.length])
        // await this.getMomentData(this.data.momentData.length)
    },
    // 自定义下拉刷新
    customPullDownRefresh:async function () {
        // 下拉刷新获取最新数据
        getMomentDataDebounce.apply(this,[this.data.userId,0,false])
        // await this.getMomentData(0,false)
    },
    onPullDownRefresh:async function(){
    },
    onReachBottom: async function (){
    },
    getMomentData:async function(userId,offset = 0,flag = true){
        if(!this.data.hasMore && flag) return
        if(offset) this.setData({isShowLoading:true})
        const tagId = this.data.tagList[this.data.tagIndex].id
        const result = await getMonentData(userId,offset,tagId)
        this.setData({isShowLoading:false,triggered:false})
        const hasMore = result.data.hasMore
        if(offset === 0){
            this.setData({
                momentData:result.data.result,
                hasMore
            })
        }else{
            const currentData = this.data.momentData
            this.setData({
                momentData:currentData.concat(result.data.result),
                hasMore
            })
        }
    },
    getTagList(){
        // 1.获取标签放入共享数据
        eventStore.dispatch('getTagListAction')
        // 2.将共享数据存入页面
        eventStore.onState('tagList',(res) => {
            if(!res.length) return
            this.setData({tagList:this.data.tagList.concat(res)})
        })
    },
    // 选择标签之后的处理函数
    handelTagItemClick: async function(e){
        const tagIndex = e.currentTarget.dataset.index
        this.setData({
            tagIndex,
            isShowPopup:false
        })
        await this.getMomentData(this.data.userId,0,false)
    },
    handelSelectClick(){
        this.setData({isShowPopup:!this.data.isShowPopup})
    },
    // 点击左侧菜单栏时的处理函数
    closePopup(){
        this.setData({isShowPopup:false})
    },
    // 没数据时的点击跳转
    handelToClick(){
        wx.switchTab({
          url: '/pages/home-release/index',
        })
    },
    // 点击item跳转到详情页
    handelMomentItemClick(e){
        const momentId = e.currentTarget.dataset.id
        wx.navigateTo({
          url: `/pages/moment-detail/index?id=${momentId}`,
        })
    }
})