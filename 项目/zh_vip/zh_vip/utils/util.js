const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
function validTime(startTime, endTime) {
  var arr1 = startTime.split("-");
  var arr2 = endTime.split("-");
  var date1 = new Date(parseInt(arr1[0]), parseInt(arr1[1]) - 1, parseInt(arr1[2]), 0, 0, 0);
  var date2 = new Date(parseInt(arr2[0]), parseInt(arr2[1]) - 1, parseInt(arr2[2]), 0, 0, 0);
  if (date1.getTime() >= date2.getTime()) {
    console.log('结束日期不能小于开始日期', this);
    return false;
  } else {
    return true;
  }
  return false;
}
function validTime1(startTime, endTime) {
  var arr1 = startTime.split("-");
  var arr2 = endTime.split("-");
  var date1 = new Date(parseInt(arr1[0]), parseInt(arr1[1]) - 1, parseInt(arr1[2]), 0, 0, 0);
  var date2 = new Date(parseInt(arr2[0]), parseInt(arr2[1]) - 1, parseInt(arr2[2]), 0, 0, 0);
  if (date1.getTime() > date2.getTime()) {
    console.log('结束日期不能小于开始日期', this);
    return false;
  } else {
    return true;
  }
  return false;
}
function getRandomNum() {
  var randomNum = "" + Math.round(Math.random() * 1000000);
  while (randomNum.length < 6) { randomNum = "0" + randomNum; }
  console.info("randomNum is ========", randomNum);
  return randomNum;
}
function in_array(stringToSearch, arrayToSearch) {
  for (var s = 0; s < arrayToSearch.length; s++) {
    var thisEntry = arrayToSearch[s];
    if (thisEntry == stringToSearch) {
      return 1;
    }
  }
  return 2;
} 
function getDistance(lat1, lng1, lat2, lng2) {
  lat1 = lat1 || 0;
  lng1 = lng1 || 0;
  lat2 = lat2 || 0;
  lng2 = lng2 || 0;
  var rad1 = lat1 * Math.PI / 180.0;
  var rad2 = lat2 * Math.PI / 180.0;
  var a = rad1 - rad2;
  var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
  var r = 6378137;
  return r * 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(rad1) * Math.cos(rad2) * Math.pow(Math.sin(b / 2), 2)))
}  
function getNowFormatDate() {
  var date = new Date();
  var seperator1 = "/";
  var seperator2 = ":";
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
    + " " + date.getHours() + seperator2 + date.getMinutes()
    + seperator2 + date.getSeconds();
  return currentdate;
} 
function xctsfm(stime,etime){
  var startTime = stime;
  var s1 = new Date(startTime.replace(/-/g, "/")),
    s2 = new Date(etime),
    runTime = parseInt((s2.getTime() - s1.getTime()) / 1000);
  var year = Math.floor(runTime / 86400 / 365);
  runTime = runTime % (86400 * 365);
  var month = Math.floor(runTime / 86400 / 30);
  runTime = runTime % (86400 * 30);
  var day = Math.floor(runTime / 86400);
  runTime = runTime % 86400;
  var hour = Math.floor(runTime / 3600);
  runTime = runTime % 3600;
  var minute = Math.floor(runTime / 60);
  runTime = runTime % 60;
  var second = runTime;
  console.log(year, month, day, hour, minute, second);
  var obj={};
  obj.day=day;
  obj.hour=hour;
  obj.minute=minute;
  return obj;
}
function ormatDate(dateNum) {
  var date = new Date(dateNum * 1000);
  return date.getFullYear() + "-" + fixZero(date.getMonth() + 1, 2) + "-" + fixZero(date.getDate(), 2) + " " + fixZero(date.getHours(), 2) + ":" + fixZero(date.getMinutes(), 2) + ":" + fixZero(date.getSeconds(), 2);
  function fixZero(num, length) {
    var str = "" + num;
    var len = str.length;
    var s = "";
    for (var i = length; i-- > len;) {
      s += "0";
    }
    return s + str;
  }
}
module.exports = {
  formatTime: formatTime,
  getRandomNum: getRandomNum,
  in_array: in_array,
  getDistance: getDistance,
  validTime: validTime,
  validTime1: validTime1,
  getNowFormatDate: getNowFormatDate,
  xctsfm:xctsfm,
  ormatDate: ormatDate,
}
