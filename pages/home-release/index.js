// pages/home-video/index.js
import Toast from '@vant/weapp/toast/toast';
import eventStore from '../../store/index'
import {addMoment,addTags,addFile} from '../../service/api/moment'
import errorHandel from '../../utils/errorHandel'
import {removeTrim} from '../../utils/removeTrim'
import {isDialog} from '../../utils/showDialog'
import cache from '../../utils/localStorage'
import {TOKEN_KEY} from '../../constant/token-const'
const token = cache.getCache(TOKEN_KEY)

const app = getApp()
Page({
    /**
     * 页面的初始数据
     */
    data: {
        describe:'', // 描述内容
        contactInfo:'', // 联系方式
        cost:'', // 价值
        switch1Checked:false, // 控制switch
        fileList:[], // 文件列表
        tagList:[],  // 标签列表
        selectedTags:{} // 选中的标签，key为标签id，value为标签内容
    },
    onLoad: async function (options) {
        // 获取共享数据
        eventStore.onState('tagList',(res) => {
            if(!res.length) return
            this.setData({tagList:res})
        })
    },
    onShow(){
    },
    handelInput(e){
        const name = e.currentTarget.dataset.name
        const value = e.detail
        this.setData({
            [name]:value
        })
    },
    handelSwitch(e){
        console.log(e.detail.value);
        const flag = e.detail.value
        this.setData({
            switch1Checked:flag,
            cost:'免费赠送'
        })
    },
    afterRead(e){
        const {file} = e.detail
        this.setData({fileList:[...this.data.fileList,...file]})
    },
    fileDelete(e){
        const fileList = this.data.fileList
        this.showDialog(() => {
            const sliceFileList = fileList.remove(e.detail.index)
            this.setData({
                fileList:sliceFileList
            })
        })
    },
    handeltagClick(e){
        const tagId = e.currentTarget.dataset.id
        const selectedTags = {...this.data.selectedTags}
        if(selectedTags[tagId]) return
        selectedTags[tagId] = this.data.tagList.filter(item => item.id === tagId)[0]
        this.setData({selectedTags})
    },
    cancelTag(e){
        const tagId = e.target.id
        const selectedTags = {...this.data.selectedTags}
        delete selectedTags[tagId]
        this.setData({ selectedTags })
    },
    async formSubmit(e){
        // 获取基本信息的内容
        const {describe,contactInfo,cost} = e.detail.value
        const fileList = this.data.fileList
        // 将内容传给处理函数，判断内容是否为空，如果为空，将会返回对应值的处理函数
        const fn = this.handelValue(describe,contactInfo,cost,fileList)
        // 如果有返回值，就说明某个值的内容是空，所以执行该处理函数
        if(fn) return fn()
        // 点击提交信息时弹窗消息订阅窗口，等待用户选择之后再执行下面的代码
        await this.SubscribeMessage()
        Toast.loading({
            type:'loading',
            message: '正在上传...',
            forbidClick: true,
            mask:true,
            duration:0
        });
        try {
            // 1.创建moment
            const momentRes = await addMoment({describe,contactInfo,cost},token)
            // 2.获取momentId
            const momentId = momentRes.data.momentId
            // 3.根据moment_id添加所属标签跟图片
            const tagList = Object.keys(this.data.selectedTags)
            // 3.1 有选标签才发送请求
            if(tagList.length) await addTags(momentId,tagList,token)
            // 3.2 将上传完毕的图片名字和url发送给数据库
            const uploadEndUrls = await this.handelFiles(fileList)
            console.log(uploadEndUrls);
            await addFile(momentId,uploadEndUrls,token)
            Toast.clear()
            Toast.loading({
                type:'success',
                message: '上传成功',
                forbidClick: true,
                mask:true,
                duration:1500
            });
        } catch (error) {
            Toast.clear()
            const app = getApp()
            errorHandel(false,app,error.data.errCode || error.statusCode)
        }
    },
    handelValue(describe,contactInfo,cost,fileList){
        if(!removeTrim(describe)) return () => this.showToast('请输入正确的描述内容')
        if(!removeTrim(contactInfo)) return () => this.showToast('请输入正确联系方式')
        if(!cost) return () => this.showToast('请输入宝物价值')
        if(!fileList.length) return () => this.showToast('需要您上传宝物图片')
    },
    /**
     * 
     * @param {Array} files 选中的文件数组 
     */
    handelFiles: async function(files){
        const handelFiles = files.map(item => {
            return new Promise((resolve,reject) => {
                wx.uploadFile({
                    url:'http://120.26.2.118:8884/upload/momentFile',
                    filePath:item.url,
                    name:'file',
                    success:resolve,
                    fail:reject
                })
            })
        })
        try {
            const fileUrl = await Promise.all(handelFiles)
            const formatUrls = fileUrl.map(item => JSON.parse(item.data))
            return formatUrls
        } catch (error) {
            console.log(error);
        }
    },
    SubscribeMessage(){
        return new Promise((resolve,jeject) => {
            wx.requestSubscribeMessage({
                tmplIds:['gW--skfc3AFfJQ0U1mhRFdshrhNwZjSFLt2dMTJGqnI'],
                complete:resolve
            })
        })
    },
    showToast(msg){
        Toast({
            message:msg,
            position:'middle'
        })
    },
    showDialog(fn){
        isDialog(app,{
            title:"提示",
            text:"是否删除这张图片？",
            btnS:["不了","确认删除"],
            success:fn
        })
    }
})