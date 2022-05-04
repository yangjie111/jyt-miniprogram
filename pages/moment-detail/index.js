// pages/moment-detail/index.js
import {getMonentDetailByMId,momentCollect} from '../../service/api/moment'
import errorHandel from '../../utils/errorHandel'
import cache from '../../utils/localStorage'
import {USER_INFO} from '../../constant/user-const'
import {TOKEN_KEY} from '../../constant/token-const'
import {isDialog} from '../../utils/showDialog'
const app = getApp()

Page({
  data: {
    momentDetail:[],
    currentImageIndex:0,
    userId:'',
    token:''
  },
  onLoad: function (options) {
    const momentId = options.id
    const {id:userId} = cache.getCache(USER_INFO)
    const token = cache.getCache(TOKEN_KEY)
    this.setData({userId,token})
    getMonentDetailByMId(momentId,userId).then(res => {
      this.setData({
        momentDetail:res.data.result
      })
    }).catch(console.log)
  },
  handelSwiperChange(e){
    const currentImageIndex = e.detail.current
    this.setData({currentImageIndex})
  },
  handelImageClick(){
    const {imgurl:urls} = this.data.momentDetail[0]
    wx.previewImage({
      current:urls[this.data.currentImageIndex],
      urls
    })
  },
  handelAvatarClick(){
    wx.previewImage({
      current:this.data.momentDetail[0]?.user.avatar,
      urls:[this.data.momentDetail[0]?.user.avatar]
    })
  },
  handelCollectClick(e){
    const {iscollect,id:momentId,collectCount} = e.currentTarget.dataset
    const collect_count = this.data.momentDetail[0].collect_count
    const momentDetail = [...this.data.momentDetail]
    if(iscollect){
      this.showDialog(() => {
        momentCollect(momentId,-1,true,this.data.token).then(res => {
          momentDetail[0].collect_count = collect_count - 1
          momentDetail[0].isCollect = 0
          this.setData({ momentDetail })
        }).catch(error => {
          errorHandel(false,app,error.data.errCode || error.statusCode)
        })
      })
      return 
    }
    momentCollect(momentId,1,false,this.data.token).then(res => {
      momentDetail[0].collect_count = collect_count + 1
      momentDetail[0].isCollect = 1
      this.setData({ momentDetail })
      wx.showToast({
        title:'收藏成功',
        icon:'none',
        duration:1000
      })
    }).catch(error => {
      errorHandel(false,app,error.data.errCode || error.statusCode)
    })
  },
  handelCopyClick(){
    if(!this.data.momentDetail.length) return
    const contactInfo = this.data.momentDetail[0].contactInfo
    wx.setClipboardData({
      data: contactInfo
    })
  },
  showDialog(fn){
    isDialog(app,{
      title:"提示",
      text:"是否要取消收藏",
      btnS:["不了","取消收藏"],
      success:fn
    })
  }
})