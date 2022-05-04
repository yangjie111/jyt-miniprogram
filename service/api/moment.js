import ARequest from '../index'
import {loginRequest} from '../index'

export function addMoment(data,token){
  return loginRequest.post('/moment/add',data,true,{token})
}

export function addTags(momentId,tagList,token){
  return loginRequest.post(`/moment/${momentId}/addTags`,{tagList},true,{token})
}

export function addFile(momentId,fileList,token){
  return loginRequest.post(`/moment/${momentId}/addFile`,{fileList},true,{token})
}

export function getMonentData(userId,offset,tagId){
  return ARequest.get('/moment',{userId,offset,tagId})
}

export function getMonentDataByUIdAndMomentStatus(userId,offset,momentStatus){
  return ARequest.get(`/moment/${userId}`,{offset,momentStatus})
}

export function getMonentDetailByMId(momentId,userId){
  return ARequest.get(`/moment/detail/${momentId}`,{userId})
}

export function deletemomentByMId(momentId){
  return ARequest.delete(`/moment/${momentId}`)
}

export function momentCollect(momentId,count,isDelete,token){
  return loginRequest.post(`/moment/${momentId}/${count}`,{isDelete},true,{token})
}

export function getCollectMomentByUId(userId,offset){
  return ARequest.get(`/moment/collect/${userId}`,{offset})
}