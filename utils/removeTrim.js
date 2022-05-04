const removeTrim = (str) => {
  if(typeof str !== 'string') throw new Error('请传入字符串类型')
  return str.replace(/\s/g,"");
}

export {
  removeTrim
}