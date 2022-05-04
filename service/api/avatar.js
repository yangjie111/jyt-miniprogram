import ARequest from '../index'

export function avatar(id){
  return ARequest.get(`/avatar/${id}`)
}