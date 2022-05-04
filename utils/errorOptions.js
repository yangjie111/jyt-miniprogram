const NOT_SNO = {
  title:"提示",
  text:"您当前暂未绑定学号，是否前往绑定",
  btnS:["我再看看","前往绑定"],
  success:() => {
      wx.navigateTo({
          url:'/pages/binding-page/index'
      })
  },
  close:() => {
      console.log('点击了再看看');
  }
}

const NOT_USER = {
  title:"提示",
  text:"该账号已过期，您暂时无法对该小程序内容进行操作",
  btnS:["我知道了"]
}

const FREQUEST_REQ = {
  title:"提示",
  text:"请勿频繁提交内容",
  btnS:["我知道了"]
}

const BUSY_SERVICE = {
  title:"提示",
  text:"服务繁忙，请稍后重试",
  btnS:["我知道了"]
}

const PARAMS_ERROR = {
  title:"提示",
  text:"内容错误，请检查是否正确",
  btnS:["我知道了"]
}

const DELETE_ERR = {
  title:"提示",
  text:"删除失败",
  btnS:["我知道了"]
}

const SNO_OVERDUE = {
  title:"提示",
  text:"该学号已过期，无法使用",
  btnS:["我知道了"]
}

const SNO_MISMATCH = {
  title:"提示",
  text:"手机号与学号不匹配",
  btnS:["我知道了"]
}

const SNO_ALREADY_BOUND = {
  title:"提示",
  text:"该学号已经被其他用户绑定",
  btnS:["我知道了"]
}

const USER_IS_EXIST_SNO = {
  title:"提示",
  text:"该账号已经绑定学号",
  btnS:["我知道了"]
}


export {
  NOT_SNO,
  NOT_USER,
  FREQUEST_REQ,
  BUSY_SERVICE,
  PARAMS_ERROR,
  SNO_OVERDUE,
  DELETE_ERR,
  SNO_MISMATCH,
  SNO_ALREADY_BOUND,
  USER_IS_EXIST_SNO
}