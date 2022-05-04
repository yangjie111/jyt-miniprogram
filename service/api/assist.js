import ARequest from '../index'

export function getTagList(){
  return ARequest.get('/tagList')
}