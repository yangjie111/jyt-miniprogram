// app.js
import {getCode,getToken,authToken} from './service/api/login'
import cache from './utils/localStorage'
import errorHandel from './utils/errorHandel'
import {TOKEN_KEY} from './constant/token-const'
import {USER_INFO} from './constant/user-const'
import './utils/ArrSliceByIdx'

App({
    globalData:{
        // 小程序版本号
        miniProgramVersion:wx.getAccountInfoSync().miniProgram.version,
        // 小程序环境
        envVersion:wx.getAccountInfoSync().miniProgram.envVersion
    },
    async onLaunch(){
        // 检查更新
        this.checkAppUpdata()
        // 获取token
        const token = cache.getCache(TOKEN_KEY)
        if(!token){
            this.loginAction()
        }else{
            // 验证token是否过期
            try {
                const res = await authToken()
            } catch (error) {
                /**
                 * 参数一：是否需要加入宏任务
                 * 参数二：调用该函数的上下文
                 * 参数三：错误信息
                 */
                errorHandel(true,this,error.data.errCode)
            }
        }
    },
    loginAction: async function (isUser = true){
        if(isUser){
            // 1.获取随机头像
            const avatarIndex = Math.floor(Math.random() * 10)
            // 2.获取用户名称
            const userName = `淘易${Date.now()}`
            // 3..获取code
            const loginResult = await getCode()
            // 4.获取token
            this.tokenAction(avatarIndex,userName,loginResult.code)
        }else{
            const userInfo = cache.getCache(USER_INFO)
            const loginResult = await getCode()
            this.tokenAction(userInfo.aI,userInfo.uN,loginResult.code)
        }
    },
    tokenAction:async function(aIndex,uName,code){
        try {
            const result = await getToken(aIndex,uName,code)
            const {id,avatarIndex:aI,userName:uN,token} = result.data
            cache.setCache({id,aI,uN},USER_INFO)
            cache.setCache(token,TOKEN_KEY)
        } catch (error) {
            console.log(error);
        }
    },
    showDialog(that,options){
        that.selectComponent("#dialog").showDialog(options)
    },
    onLoad(){

    },
    checkAppUpdata(){
        const updateManager = wx.getUpdateManager()
        updateManager.onCheckForUpdate()
        updateManager.onCheckForUpdate(function (res) {
            // 请求完新版本信息的回调
            console.log(res.hasUpdate)
        })
        updateManager.onUpdateReady(function () {
            wx.showModal({
                title: '更新提示',
                content: '新版本已经准备好，请重启应用',
                showCancel:false,
                success: function (res) {
                    if (res.confirm) {
                        // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                        updateManager.applyUpdate()
                    }
                }
            })
        })
        updateManager.onUpdateFailed(function () {
            // 新的版本下载失败
            wx.showModal({
                title: '更新提示~',
                content: '已上线新版本，为了不影响使用，请删除当前小程序，重新搜索打开~'
            })
        })
    }
})
