import {
  NOT_SNO,
  NOT_USER,
  FREQUEST_REQ,
  BUSY_SERVICE,
  PARAMS_ERROR,
  SNO_OVERDUE,
  DELETE_ERR,
  USER_IS_EXIST_SNO,
  SNO_ALREADY_BOUND,
  SNO_MISMATCH
} from './errorOptions'

const errorHandel = (isdelay,contenxt,errCode) => {
  switch (errCode) {
    case 429:
      isDelay(isdelay,contenxt,FREQUEST_REQ)
      break;
    case 1201:
      isDelay(isdelay,contenxt,NOT_SNO)
      break;
    case 1202:
      isDelay(isdelay,contenxt,SNO_OVERDUE)
      break;
    case 1203:
      isDelay(isdelay,contenxt,USER_IS_EXIST_SNO)
      break;
    case 1204:
      isDelay(isdelay,contenxt,NOT_USER)
      break;
    case 1205:
      isDelay(isdelay,contenxt,SNO_ALREADY_BOUND)
      break;
    case 1206:
      isDelay(isdelay,contenxt,PARAMS_ERROR)
      break;
    case 1207:
      isDelay(isdelay,contenxt,SNO_MISMATCH)
      break;
    case 1301:
      isDelay(isdelay,contenxt,DELETE_ERR)
      break;
    case 1400:
      isDelay(isdelay,contenxt,BUSY_SERVICE)
      break;
    default:
      contenxt.loginAction(false)
  }
}

function isDelay(isdelay,contenxt,errData){
  if(isdelay) return setTimeout(() => dialog(contenxt,errData))
  return dialog(contenxt,errData)
}

function dialog(contenxt,options){
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  contenxt.showDialog(currentPage,options)
}

export default errorHandel