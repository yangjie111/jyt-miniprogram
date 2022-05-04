// pages/home-profile/index.js
import {BASE_URL} from '../../service/index'
import cache from '../../utils/localStorage'
import {USER_INFO} from '../../constant/user-const'
const app = getApp()

Page({
  data: {
    avatarUrl:'',
    userName:'',
    userId:'',
    miniProgramVersion:''
  },
  onLoad: function (options) {
    const {aI,uN,id} = cache.getCache(USER_INFO)
    const avatarUrl = `${BASE_URL}/avatar/${aI}`
    this.setData({
      avatarUrl,
      userName:uN,
      userId:id,
      miniProgramVersion:app.globalData.miniProgramVersion
    })
  },
  handelToDetailClick(){
    wx.navigateTo({
      url:'/pages/moment-status-detail/index'
    })
  },
  handelToCollectClick(){

    wx.navigateTo({
      url: `/pages/collect-page/index?userId=${this.data.userId}`,
    })
  },
  handelOtherClick(e){
    const type = e.currentTarget.dataset.type
    wx.navigateTo({
      url: `/pages/notice-page/index?type=${type}`,
    })
  },
  handelAvatarClick(){
    wx.previewImage({
      current:this.data.avatarUrl,
      urls:[this.data.avatarUrl]
    })
  }
})