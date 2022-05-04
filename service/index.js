// const BASE_URL = 'http://192.168.211.117:8888';
// export const BASE_URL = 'http://11.1.37.149:8888'
// export const BASE_URL = 'http://172.20.10.2:8888'
// export const BASE_URL = 'http://120.77.150.197:8884'
// export const BASE_URL = 'http://43.138.161.219:8884'
export const BASE_URL = 'http://120.26.2.118:8884'
// export const BASE_URL = 'https://dx.erpxcx.com/jyt'

import {TOKEN_KEY} from '../constant/token-const'
import cache from '../utils/localStorage'
const token = cache.getCache(TOKEN_KEY)

class ARequest {
  constructor(authHeader = {}){
    this.authHeader = authHeader
  }
  request(url,method,params,isAuth = false,header = {}){
    const finalHeader = isAuth ? {...this.authHeader,...header} : header
    return new Promise((resolve,reject) => {
      wx.request({
        url: BASE_URL + url,
        method,
        header:finalHeader,
        data:params,
        success:res => {
          if(res.statusCode >= 400){
            reject(res)
          }
          resolve(res)
        },
        fail:reject
      })
    })
  }

  get(url,params,isAuth = false,header){
    return this.request(url,'GET',params,isAuth,header)
  }

  post(url,params,isAuth = false,header){
    return this.request(url,'POST',params,isAuth,header)
  }

  delete(url,params,isAuth = false,header){
    return this.request(url,'DELETE',params,isAuth,header)
  }
}
const loginRequest = new ARequest({token})
export default new ARequest()
export {loginRequest}