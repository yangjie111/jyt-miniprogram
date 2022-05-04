import {loginRequest} from '../index'

export function addSno(sno,phone,token){
  return loginRequest.post('/add/sno',{sno,phone},true,{token})
}