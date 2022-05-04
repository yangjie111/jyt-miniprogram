class LocalCache {
  getCache(key){
    const data = wx.getStorageSync(key)
    if(data){
      return JSON.parse(data)
    }
  }
  setCache(data,key){
    wx.setStorageSync(key,JSON.stringify(data))
  }
  removeCache(data){
    wx.removeStorageSync(key)
  }
  clearCache(){
    wx.clearStorageSync()
  }
}

export default new LocalCache()