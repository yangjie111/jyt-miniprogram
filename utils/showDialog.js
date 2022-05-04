function isDialog(contenxt,options){
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  console.log(contenxt);
  contenxt.showDialog(currentPage,options)
}

export {
  isDialog
}