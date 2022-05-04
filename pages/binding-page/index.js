// pages/binding-page/index.js
import {authSno} from '../../service/api/auth'
import {addSno} from '../../service/api/add'
import Notify from '@vant/weapp/notify/notify';
import Toast from '@vant/weapp/toast/toast';
import cache from '../../utils/localStorage'
import errorHandel from '../../utils/errorHandel'
import {TOKEN_KEY} from '../../constant/token-const'
import debounce from '../../utils/debounce'
const app = getApp()
const token = cache.getCache(TOKEN_KEY)
// 添加防抖
const debounceBindingSno = debounce(async function (phoneValue,snoValue){
  this.showLoading(this.closeAction)
   try {
    const result = await addSno(snoValue,phoneValue,token)
    Toast.success({
      message:result.data.message,
      forbidClick: true,
      mask:true,
      onClose:() => {
        wx.navigateBack({
          delta:-1
        })
      }
    });
   } catch (error) {
    Toast.clear()
    errorHandel(false,app,error.data.errCode || error.statusCode)
   }
},300)

Page({
  data: {
    phoneValue:'',
    snoValue:'',
    isLoading:false,
    isDisabled:false,
    isEmptyDisabled:false,
    bindingIsD:true
  },
  onLoad: function (options) {

  },
  handeInput(e){
    const name = e.target.id
    const value = e.detail.value
    this.setData({[name]:value})
  },
  authSno:async function(){
    const trimValue = String(this.data.snoValue).replace (/\s+/g,"")
    if(!trimValue.length || trimValue.length < 6){
      return Notify({ type: 'warning', message: '请输入正确的学号！',background:'#e6a23c' });
    }
    this.setData({
      isLoading:true,
      isEmptyDisabled:true
    })
    try {
      const result = await authSno(this.data.snoValue)
      if(result.data.stuName){
        this.setData({
          isLoading:false,
          isDisabled:true,
          isEmptyDisabled:false,
          bindingIsD:false
        })
        Notify({ type: 'success', message: `验证通过，你好${result.data.stuName}！` });
      }
    } catch (error) {
      if(error.data.errCode === 1202){
        this.setData({
          isLoading:false,
          isEmptyDisabled:false
        })
        Notify({ type: 'danger', message: `验证失败，${error.data.message}！` });
      }
    }
  },
  empty:function(){
    this.setData({
      phoneValue:'',
      snoValue:'',
    })
  },
  bindingSno:async function (){
    const {phoneValue,snoValue} = this.data
    if(!phoneValue) return Notify({ type: 'warning', message: '请输入手机号！',background:'#e6a23c' });
    if(!snoValue) return Notify({ type: 'warning', message: '请输入学号！',background:'#e6a23c' });
    debounceBindingSno.apply(this,[phoneValue,snoValue])
  },
  showLoading(closeFn,result){
    Toast.loading({
      message: '绑定中...',
      forbidClick: true,
      mask:true,
      duration:0,
      onClose:closeFn
    });
  },
  closeAction(result){
    console.log(result);
    console.log('执行了关闭');
  }
})