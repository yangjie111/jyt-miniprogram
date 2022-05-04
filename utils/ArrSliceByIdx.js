Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  const newArr = [...this]
  newArr.length = from < 0 ? this.length + from : from;
  newArr.push.apply(newArr,rest);
  return newArr
};