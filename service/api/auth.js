import ARequest from '../index'

export function authSno(sno){
  return ARequest.post('/auth/sno',{sno})
}