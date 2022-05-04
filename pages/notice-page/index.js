// pages/notice-page/index.js
Page({
  data: {
    type:0
  },
  onLoad: function (options) {
    const type = options.type
    wx.setNavigationBarTitle({
      title: Number(type) ? '系统公告' : '加入我们'
    })
    this.setData({type:Number(type)})
  },
  copyWx(){
    wx.setClipboardData({
      data: 'AAA-YANG1'
    })
  },
  handelImgClick(){
    wx.previewImage({
      current:'http://jyxy-jyt.oss-cn-shenzhen.aliyuncs.com/20220424/a06993df7859c01c4acb7f2b1e8d2d7.jpg',
      urls:['http://jyxy-jyt.oss-cn-shenzhen.aliyuncs.com/20220424/a06993df7859c01c4acb7f2b1e8d2d7.jpg']
    })
  }
})