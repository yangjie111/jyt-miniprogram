import ARequest from '../index'
import {loginRequest} from '../index'

export function getCode(){
  return new Promise((resolve,reject) => {
    wx.login({
      timeout:1000,
      success:resolve,
      fail:reject
    })
  })
}

export function getToken(avatarIndex,userName,code){
  return ARequest.post('/login',{avatarIndex,userName,code})
}

export function authToken(token){
  return loginRequest.post('/login/auth',{token},true)
}